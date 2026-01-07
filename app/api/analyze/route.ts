import { NextRequest, NextResponse } from 'next/server';
import { analyzeStatusCertificate } from '@/lib/claude-analyzer';
import { parsePDF } from '@/lib/pdf-parser';

export const maxDuration = 60; // Allow up to 60 seconds for analysis
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const MIN_EXTRACTED_TEXT_LENGTH = 100;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

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
    const { file, fileName, fileType } = body;
    const maxFileBytes = 20 * 1024 * 1024;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing file metadata' },
        { status: 400 }
      );
    }

    if (fileType && fileType !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Please upload a PDF file.' },
        { status: 400 }
      );
    }

    if (!fileName.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file extension. Please upload a PDF file.' },
        { status: 400 }
      );
    }

    const padding = file.endsWith('==') ? 2 : file.endsWith('=') ? 1 : 0;
    const estimatedBytes = Math.floor((file.length * 3) / 4) - padding;
    if (estimatedBytes > maxFileBytes) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 20MB)' },
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

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(file, 'base64');

    // Extract text from PDF
    const pdfData = await parsePDF(pdfBuffer);
    const extractedText = pdfData.text;

    if (!extractedText || extractedText.length < MIN_EXTRACTED_TEXT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error:
            'This PDF appears to be scanned or image-based. We could not extract readable text. Please run OCR or rescan/export a text-based PDF and try again.',
          errorCode: 'low_text',
        },
        { status: 422 }
      );
    }

    // Analyze with Claude via Venice
    const analysis = await analyzeStatusCertificate(extractedText, pdfData.pages);

    // Generate a simple report ID (no database, just for URL)
    const reportId = `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      reportId,
      analysis,
      fileName,
      extractedTextLength: extractedText.length,
      pageCount: pdfData.pageCount,
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Analysis error:', message);
    
    // Provide helpful error messages
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
