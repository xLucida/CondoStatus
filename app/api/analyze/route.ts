import { NextRequest, NextResponse } from 'next/server';
import { analyzeStatusCertificate } from '@/lib/claude-analyzer';
import { parsePDF } from '@/lib/pdf-parser';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  sanitizePropertyAddress,
  validatePropertyAddress,
  sanitizeFileName,
  sanitizePropertyUnit,
  sanitizePropertyCity,
  validateBase64,
  validateDocType,
  validateFileSize,
} from '@/lib/validation';

export const maxDuration = 300; // Allow up to 5 minutes for multi-document analysis with OCR

const DOC_PARSE_CONCURRENCY = 3; // Parse up to 3 documents in parallel
const MIN_EXTRACTED_TEXT_LENGTH = 100;
const MAX_TOTAL_SIZE = 75 * 1024 * 1024; // 75MB total
const MAX_FILES = 20;

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
  pages: string[];
}

interface PageInfo {
  text: string;
  documentIndex: number;
  documentName: string;
  docType: string;
  pageInDocument: number;
  globalPage: number;
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
  
  // Check rate limit
  const rateLimit = await checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Rate limit exceeded. Please try again shortly.' },
      {
        status: 429,
        headers: {
          'Retry-After': (rateLimit.retryAfter || 60).toString(),
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
        },
      }
    );
  }

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
      propertyId = `prop-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
      propertyAddress = 'Unknown';
    } else {
      // New multi-file format
      files = body.files || [];
      propertyId = body.propertyId;
      
      // Sanitize and validate property address
      const rawAddress = body.propertyAddress;
      if (!rawAddress || typeof rawAddress !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Property address is required' },
          { status: 400 }
        );
      }
      
      propertyAddress = sanitizePropertyAddress(rawAddress);
      const addressValidation = validatePropertyAddress(propertyAddress);
      if (!addressValidation.valid) {
        return NextResponse.json(
          { success: false, error: addressValidation.error || 'Invalid property address' },
          { status: 400 }
        );
      }
      
      propertyUnit = sanitizePropertyUnit(body.propertyUnit);
      propertyCity = sanitizePropertyCity(body.propertyCity);
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
    const apiKey = process.env.VENICE_API_KEY?.trim();
    if (!apiKey || apiKey.length === 0) {
      return NextResponse.json(
        { success: false, error: 'API not configured. Please set VENICE_API_KEY.' },
        { status: 500 }
      );
    }

    // Validate and sanitize files
    let totalBytes = 0;
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      
      // Validate file metadata
      if (!f.fileName || typeof f.fileName !== 'string') {
        return NextResponse.json(
          { success: false, error: 'Missing file metadata' },
          { status: 400 }
        );
      }

      // Sanitize file name
      f.fileName = sanitizeFileName(f.fileName);

      // Validate file type
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

      // Validate document type
      if (!validateDocType(f.docType || 'other')) {
        return NextResponse.json(
          { success: false, error: `Invalid document type: ${f.docType}` },
          { status: 400 }
        );
      }

      // Validate base64
      const base64Validation = validateBase64(f.file);
      if (!base64Validation.valid) {
        return NextResponse.json(
          { success: false, error: `Invalid file data for ${f.fileName}: ${base64Validation.error}` },
          { status: 400 }
        );
      }

      // Calculate file size
      const padding = f.file.endsWith('==') ? 2 : f.file.endsWith('=') ? 1 : 0;
      const estimatedBytes = Math.floor((f.file.length * 3) / 4) - padding;
      
      // Validate individual file size
      const fileSizeValidation = validateFileSize(estimatedBytes, MAX_TOTAL_SIZE);
      if (!fileSizeValidation.valid) {
        return NextResponse.json(
          { success: false, error: fileSizeValidation.error },
          { status: 400 }
        );
      }
      
      totalBytes += estimatedBytes;
    }

    if (totalBytes > MAX_TOTAL_SIZE) {
      return NextResponse.json(
        { success: false, error: `Total file size exceeds 75MB limit (current: ${(totalBytes / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    // Parse all PDFs in parallel - continue even if some fail
    const parsedDocs: ParsedDocument[] = [];
    const failedDocs: FailedDocument[] = [];
    let anyUsedOCR = false;

    console.log(`Parsing ${files.length} documents with concurrency ${DOC_PARSE_CONCURRENCY}...`);
    const parseStartTime = Date.now();

    // Process documents in parallel batches
    for (let batchStart = 0; batchStart < files.length; batchStart += DOC_PARSE_CONCURRENCY) {
      const batchEnd = Math.min(batchStart + DOC_PARSE_CONCURRENCY, files.length);
      const batch = files.slice(batchStart, batchEnd);
      
      const batchResults = await Promise.allSettled(
        batch.map(async (f) => {
          const pdfBuffer = Buffer.from(f.file, 'base64');
          const pdfData = await parsePDF(pdfBuffer);
          return {
            fileName: f.fileName,
            docType: f.docType || 'other',
            text: pdfData.text,
            pageCount: pdfData.pageCount,
            usedOCR: pdfData.usedOCR || false,
            pages: pdfData.pages || [],
          };
        })
      );

      // Collect results from this batch
      for (let i = 0; i < batchResults.length; i++) {
        const result = batchResults[i];
        const f = batch[i];
        
        if (result.status === 'fulfilled') {
          parsedDocs.push({
            ...result.value,
            pageOffset: 0, // Will be calculated after all docs are parsed
          });
          if (result.value.usedOCR) anyUsedOCR = true;
        } else {
          const errorMessage = result.reason instanceof Error ? result.reason.message : 'Unknown error';
          console.error(`Error parsing ${f.fileName}:`, errorMessage);
          failedDocs.push({
            fileName: f.fileName,
            docType: f.docType || 'other',
            error: `Could not extract text from this PDF: ${errorMessage}`,
          });
        }
      }
    }

    // Calculate page offsets after parallel parsing
    let totalPageCount = 0;
    for (const doc of parsedDocs) {
      doc.pageOffset = totalPageCount;
      totalPageCount += doc.pageCount;
    }

    const parseElapsed = ((Date.now() - parseStartTime) / 1000).toFixed(1);
    console.log(`Document parsing complete: ${parsedDocs.length} docs, ${totalPageCount} pages in ${parseElapsed}s`);

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

    // Build combined pages array with document info for each page
    const allPagesInfo: PageInfo[] = [];
    const allPagesText: string[] = [];
    
    for (let docIndex = 0; docIndex < parsedDocs.length; docIndex++) {
      const doc = parsedDocs[docIndex];
      for (let pageIndex = 0; pageIndex < doc.pages.length; pageIndex++) {
        const globalPageNum = allPagesText.length + 1;
        allPagesText.push(doc.pages[pageIndex]);
        allPagesInfo.push({
          text: doc.pages[pageIndex],
          documentIndex: docIndex,
          documentName: doc.fileName,
          docType: doc.docType,
          pageInDocument: pageIndex + 1,
          globalPage: globalPageNum,
        });
      }
    }

    // Pass combined pages to analyzer for quote matching
    const analysis = await analyzeStatusCertificate(combinedText, allPagesText);

    // Helper to get document info for a global page number
    const getDocumentInfoForPage = (globalPage: number | null | undefined): { documentName: string | null; pageInDocument: number | null } => {
      if (!globalPage || globalPage < 1 || globalPage > allPagesInfo.length) {
        return { documentName: null, pageInDocument: null };
      }
      const pageInfo = allPagesInfo[globalPage - 1];
      return {
        documentName: pageInfo?.documentName || null,
        pageInDocument: pageInfo?.pageInDocument || null,
      };
    };

    // Add document info to all extracted items
    if (analysis.sections) {
      for (const sectionKey of Object.keys(analysis.sections)) {
        const section = analysis.sections[sectionKey];
        for (const item of section.items) {
          const docInfo = getDocumentInfoForPage(item.page);
          item.documentName = docInfo.documentName;
          item.pageInDocument = docInfo.pageInDocument;
        }
      }
    }

    // Add document info to all issues
    if (analysis.issues) {
      for (const issue of analysis.issues) {
        const docInfo = getDocumentInfoForPage(issue.page);
        issue.documentName = docInfo.documentName;
        issue.pageInDocument = docInfo.pageInDocument;
      }
    }

    // Generate report ID
    const reportId = `report-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

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

    return NextResponse.json(
      {
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
        pagesInfo: allPagesInfo,
        extractedTextLength: combinedText.length,
        pageCount: totalPageCount,
        usedOCR: anyUsedOCR,
        warnings: failedDocs.length > 0 
          ? [`${failedDocs.length} document(s) could not be parsed and were excluded from analysis: ${failedDocs.map(d => d.fileName).join(', ')}`]
          : [],
      },
      {
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
        },
      }
    );

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
