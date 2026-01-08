import { NextRequest, NextResponse } from 'next/server';
import { analyzeStatusCertificate } from '@/lib/claude-analyzer';
import { parsePDF } from '@/lib/pdf-parser';

export const maxDuration = 120; // Allow up to 120 seconds for multi-document analysis

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const MIN_EXTRACTED_TEXT_LENGTH = 100;
const MAX_TOTAL_SIZE = 75 * 1024 * 1024; // 75MB total
const MAX_FILES = 20;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

interface FileInput {
  fileName: string;
  fileType?: string;
  docType: string;
  file: string; // base64
}

interface ParsedDocument {
  fileName: string;
  docType: string;
  text: string;
  pageCount: number;
  pageOffset: number;
  usedOCR: boolean;
}

interface FailedDocument {
  fileName: string;
  docType: string;
  error: string;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }
  return request.ip ?? 'unknown';
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  const resetAt = entry && entry.resetAt > now ? entry.resetAt : now + RATE_LIMIT_WINDOW_MS;
  const count = entry && entry.resetAt > now ? entry.count : 0;

  if (count >= RATE_LIMIT_MAX) {
    const retryAfterSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000));
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': retryAfterSeconds.toString() } }
    );
  }

  rateLimitStore.set(ip, { count: count + 1, resetAt });

  try {
    const body = await request.json();
    
    // Support both legacy single-file and new multi-file format
    const isLegacy = body.file && !body.files;
    
    let files: FileInput[];
    let propertyId: string;
    let propertyAddress: string;
    let propertyUnit: string | undefined;
    let propertyCity: string | undefined;
    
    if (isLegacy) {
      // Legacy single-file format
      const { file, fileName, fileType } = body;
      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }
      files = [{ fileName, fileType, docType: 'status_certificate', file }];
      propertyId = `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      propertyAddress = 'Unknown';
    } else {
      // New multi-file format
      files = body.files || [];
      propertyId = body.propertyId;
      propertyAddress = body.propertyAddress;
      propertyUnit = body.propertyUnit;
      propertyCity = body.propertyCity;
      
      if (!propertyAddress) {
        return NextResponse.json(
          { success: false, error: 'Property address is required' },
          { status: 400 }
        );
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        { success: false, error: `Too many files (max ${MAX_FILES})` },
        { status: 400 }
      );
    }

    // Check for Venice API key
    if (!process.env.VENICE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API not configured. Please set VENICE_API_KEY.' },
        { status: 500 }
      );
    }

    // Validate and calculate total size
    let totalBytes = 0;
    for (const f of files) {
      if (!f.fileName || typeof f.fileName !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Missing file metadata' },
          { status: 400 }
        );
      }

      if (f.fileType && f.fileType !== 'application/pdf') {
        return NextResponse.json(
          { success: false, error: `Invalid file type for ${f.fileName}. Please upload PDF files only.` },
          { status: 400 }
        );
      }

      if (!f.fileName.toLowerCase().endsWith('.pdf')) {
        return NextResponse.json(
          { success: false, error: `Invalid file extension for ${f.fileName}. Please upload PDF files only.` },
          { status: 400 }
        );
      }

      const padding = f.file.endsWith('==') ? 2 : f.file.endsWith('=') ? 1 : 0;
      const estimatedBytes = Math.floor((f.file.length * 3) / 4) - padding;
      totalBytes += estimatedBytes;
    }

    if (totalBytes > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { success: false, error: `Total file size exceeds 75MB limit (current: ${(totalBytes / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    // Parse all PDFs - continue even if some fail
    const parsedDocs: ParsedDocument[] = [];
    const failedDocs: FailedDocument[] = [];
    let totalPageCount = 0;
    let anyUsedOCR = false;

    for (const f of files) {
      try {
        const pdfBuffer = Buffer.from(f.file, 'base64');
        const pdfData = await parsePDF(pdfBuffer);
        
        parsedDocs.push({
          fileName: f.fileName,
          docType: f.docType || 'other',
          text: pdfData.text,
          pageCount: pdfData.pageCount,
          pageOffset: totalPageCount,
          usedOCR: pdfData.usedOCR || false,
        });
        
        totalPageCount += pdfData.pageCount;
        if (pdfData.usedOCR) anyUsedOCR = true;
        
      } catch (parseError) {
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown error';
        console.error(`Error parsing ${f.fileName}:`, errorMessage);
        failedDocs.push({
          fileName: f.fileName,
          docType: f.docType || 'other',
          error: `Could not extract text from this PDF: ${errorMessage}`,
        });
      }
    }

    // If ALL files failed to parse, return error
    if (parsedDocs.length === 0) {
      const failedNames = failedDocs.map(d => d.fileName).join(', ');
      return NextResponse.json(
        { success: false, error: `Failed to parse any documents. Could not extract text from: ${failedNames}` },
        { status: 422 }
      );
    }

    // Combine all text with document markers
    const combinedText = parsedDocs.map((doc, index) => {
      const docTypeLabel = doc.docType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      return `\n\n=== DOCUMENT ${index + 1}: ${doc.fileName} (${docTypeLabel}) ===\n[Pages ${doc.pageOffset + 1}-${doc.pageOffset + doc.pageCount}]\n\n${doc.text}`;
    }).join('\n');

    if (!combinedText || combinedText.length < MIN_EXTRACTED_TEXT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: 'The uploaded PDFs appear to be scanned or image-based. We could not extract readable text. Please ensure at least one document has extractable text.',
          errorCode: 'low_text',
        },
        { status: 422 }
      );
    }

    // Build page map for citations
    const pageMap = parsedDocs.map(doc => ({
      fileName: doc.fileName,
      docType: doc.docType,
      startPage: doc.pageOffset + 1,
      endPage: doc.pageOffset + doc.pageCount,
    }));

    // For multi-document, we pass combined text but empty pages array
    // The page references in the analysis will be relative to the combined document
    const analysis = await analyzeStatusCertificate(combinedText, []);

    // Generate report ID
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Build documents summary
    const documentsSummary = {
      count: files.length,
      successfulCount: parsedDocs.length,
      failedCount: failedDocs.length,
      totalPages: totalPageCount,
      totalSize: totalBytes,
      files: parsedDocs.map(doc => ({
        fileName: doc.fileName,
        docType: doc.docType,
        pageCount: doc.pageCount,
        pageOffset: doc.pageOffset,
      })),
      failedFiles: failedDocs,
    };

    return NextResponse.json({
      success: true,
      reportId,
      propertyId,
      property: {
        address: propertyAddress,
        unit: propertyUnit,
        city: propertyCity,
      },
      analysis,
      documentsSummary,
      pageMap,
      extractedTextLength: combinedText.length,
      pageCount: totalPageCount,
      usedOCR: anyUsedOCR,
      warnings: failedDocs.length > 0 
        ? [`${failedDocs.length} document(s) could not be parsed and were excluded from analysis: ${failedDocs.map(d => d.fileName).join(', ')}`]
        : [],
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Analysis error:', message);
    
    if (message.includes('API key')) {
      return NextResponse.json(
        { success: false, error: 'API configuration error. Please check VENICE_API_KEY.' },
        { status: 500 }
      );
    }
    
    if (message.includes('rate limit')) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again in a few minutes.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
