// Polyfill for Node < 22 (Promise.withResolvers support)
import "@ungap/with-resolvers";

// Polyfill DOMMatrix for Node.js (required by pdfjs-dist for rendering)
// Must be imported BEFORE pdfjs-dist
import DOMMatrixPolyfill from 'dommatrix';

if (typeof globalThis.DOMMatrix === 'undefined') {
  (globalThis as any).DOMMatrix = DOMMatrixPolyfill;
}

import pdf from 'pdf-parse';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

// Use dynamic require to bypass webpack bundling for native canvas module
// This ensures the native bindings are loaded at runtime, not bundled
let canvasModule: any = null;
function getCanvas() {
  if (!canvasModule) {
    console.log('Loading canvas module via dynamic require...');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    canvasModule = require('canvas');
    console.log('Canvas module loaded, createCanvas type:', typeof canvasModule.createCanvas);
  }
  return canvasModule;
}

type Canvas = any;
type CanvasRenderingContext2D = any;

// Dynamic import for pdfjs-dist to avoid webpack bundling issues
async function getPdfjs() {
  // @ts-ignore - dynamic import for server compatibility
  // Use legacy build for better Node.js compatibility
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
  return pdfjsLib;
}

export interface PDFParseResult {
  text: string;
  pageCount: number;
  pages: string[];
  metadata: {
    title?: string;
    author?: string;
    creator?: string;
  };
  usedOCR?: boolean;
}

const MIN_TEXT_LENGTH = 100;
const OCR_SCALE = 2.0;

class NodeCanvasFactory {
  create(width: number, height: number) {
    const { createCanvas } = getCanvas();
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  }

  reset(canvasAndContext: { canvas: Canvas; context: CanvasRenderingContext2D }, width: number, height: number) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext: { canvas: Canvas; context: CanvasRenderingContext2D }) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
  }
}

export async function parsePDF(buffer: Buffer): Promise<PDFParseResult> {
  // Check if buffer looks like a valid PDF (should start with %PDF-)
  const header = buffer.slice(0, 8).toString('utf-8');
  if (!header.startsWith('%PDF-')) {
    throw new Error(`Invalid PDF: File does not appear to be a PDF (header: ${header.substring(0, 5)})`);
  }
  
  console.log(`Parsing PDF: ${buffer.length} bytes, header: ${header.trim()}`);
  
  let primaryError: string | null = null;
  
  try {
    const data = await pdf(buffer, {
      pagerender: renderPage,
    });

    const pages = data.text
      .split('---PAGE_BREAK---')
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0);

    const cleanedText = data.text.replace(/---PAGE_BREAK---/g, '\n\n').trim();

    if (cleanedText.length >= MIN_TEXT_LENGTH) {
      return {
        text: cleanedText,
        pageCount: data.numpages,
        pages,
        metadata: {
          title: data.info?.Title,
          author: data.info?.Author,
          creator: data.info?.Creator,
        },
        usedOCR: false,
      };
    }

    console.log(`Text extraction insufficient (${cleanedText.length} chars), falling back to OCR...`);
    primaryError = `Text extraction only found ${cleanedText.length} characters`;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('PDF parsing error:', errorMsg);
    primaryError = errorMsg;
    
    // Check for specific error types
    if (errorMsg.includes('password') || errorMsg.includes('encrypted')) {
      throw new Error('PDF is password-protected or encrypted. Please remove the password and try again.');
    }
  }
  
  // Fall back to OCR
  console.log('Falling back to OCR...');
  try {
    return await parsePDFWithOCR(buffer);
  } catch (ocrError) {
    const ocrErrorMsg = ocrError instanceof Error ? ocrError.message : String(ocrError);
    console.error('OCR also failed:', ocrErrorMsg);
    
    // Check for specific OCR error types
    if (ocrErrorMsg.includes('password') || ocrErrorMsg.includes('PasswordException')) {
      throw new Error('PDF is password-protected or encrypted. Please remove the password and try again.');
    }
    
    if (ocrErrorMsg.includes('Invalid PDF') || ocrErrorMsg.includes('InvalidPDFException')) {
      throw new Error('PDF appears to be corrupted or malformed. Please try re-exporting the document.');
    }
    
    // Combine both errors for better diagnostics
    throw new Error(`PDF parsing failed. Primary: ${primaryError}. OCR fallback: ${ocrErrorMsg}`);
  }
}

const MAX_OCR_PAGES = 30; // Limit pages to keep processing fast
const OCR_CONCURRENCY = 5; // Process 5 pages in parallel for speed

// OCR a single page using native tesseract CLI (faster than WASM)
async function ocrPageWithCLI(imagePath: string): Promise<string> {
  try {
    // tesseract outputs to stdout with - as output file
    const { stdout } = await execAsync(`tesseract "${imagePath}" stdout -l eng --psm 3 2>/dev/null`);
    return stdout.trim();
  } catch (error) {
    console.error(`OCR failed for ${imagePath}:`, error);
    return ''; // Return empty on error, don't fail entire document
  }
}

async function parsePDFWithOCR(buffer: Buffer): Promise<PDFParseResult> {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pdf-ocr-'));
  const tempPdfPath = path.join(tempDir, 'input.pdf');
  
  try {
    fs.writeFileSync(tempPdfPath, buffer);
    console.log(`Written PDF to ${tempPdfPath}, size: ${buffer.length} bytes`);
    
    let numPages = 1;
    try {
      const { stdout } = await execAsync(`pdfinfo "${tempPdfPath}" | grep Pages | awk '{print $2}'`);
      numPages = parseInt(stdout.trim()) || 1;
    } catch {
      console.log('Could not get page count, defaulting to 1');
    }
    
    console.log(`PDF has ${numPages} pages`);
    const pagesToProcess = Math.min(numPages, MAX_OCR_PAGES);
    
    const imagePrefix = path.join(tempDir, 'page');
    console.log(`Converting PDF to images with pdftoppm...`);
    
    // Use 150 DPI for faster processing (good balance of speed vs quality)
    await execAsync(`pdftoppm -png -r 150 -l ${pagesToProcess} "${tempPdfPath}" "${imagePrefix}"`);
    
    const imageFiles = fs.readdirSync(tempDir)
      .filter(f => f.startsWith('page') && f.endsWith('.png'))
      .sort();
    
    console.log(`Generated ${imageFiles.length} page images, using native tesseract CLI`);
    
    if (imageFiles.length === 0) {
      throw new Error('pdftoppm did not generate any images');
    }
    
    // Process pages in parallel batches using native tesseract CLI
    const pages: string[] = new Array(imageFiles.length).fill('');
    const startTime = Date.now();
    
    for (let batchStart = 0; batchStart < imageFiles.length; batchStart += OCR_CONCURRENCY) {
      const batchEnd = Math.min(batchStart + OCR_CONCURRENCY, imageFiles.length);
      const batchPromises: Promise<void>[] = [];
      
      for (let i = batchStart; i < batchEnd; i++) {
        const imagePath = path.join(tempDir, imageFiles[i]);
        const pageIndex = i;
        
        batchPromises.push(
          ocrPageWithCLI(imagePath).then(text => {
            pages[pageIndex] = text;
            console.log(`OCR page ${pageIndex + 1}/${imageFiles.length}: ${text.length} chars`);
          })
        );
      }
      
      await Promise.all(batchPromises);
    }
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`OCR completed: ${imageFiles.length} pages in ${elapsed}s`);
    
    const fullText = pages.join('\n\n');
    
    return {
      text: fullText,
      pageCount: numPages,
      pages,
      metadata: {},
      usedOCR: true,
    };
  } finally {
    // Clean up temp files
    try {
      const files = fs.readdirSync(tempDir);
      for (const file of files) {
        fs.unlinkSync(path.join(tempDir, file));
      }
      fs.rmdirSync(tempDir);
    } catch (e) {
      console.error('Error cleaning up temp files:', e);
    }
  }
}

function renderPage(pageData: any): Promise<string> {
  return pageData.getTextContent().then((textContent: any) => {
    let lastY: number | null = null;
    let text = '';

    for (const item of textContent.items) {
      if (lastY !== null && Math.abs(lastY - item.transform[5]) > 5) {
        text += '\n';
      }
      text += item.str;
      lastY = item.transform[5];
    }

    return text + '\n---PAGE_BREAK---';
  });
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(text1: string, text2: string): number {
  const words1 = text1.split(' ').filter(w => w.length > 2);
  const words2 = new Set(text2.split(' ').filter(w => w.length > 2));
  if (words1.length === 0) return 0;
  const matchCount = words1.filter(w => words2.has(w)).length;
  return matchCount / words1.length;
}

export function findPageForQuote(pages: string[], quote: string): number | null {
  if (!quote || !pages || pages.length === 0) return null;
  
  const normalizedQuote = normalizeText(quote);
  if (normalizedQuote.length < 5) return null;
  
  // Stage 1: Exact substring match (most reliable)
  for (let i = 0; i < pages.length; i++) {
    const normalizedPage = pages[i].toLowerCase();
    if (normalizedPage.includes(quote.toLowerCase().trim())) {
      return i + 1;
    }
  }
  
  // Stage 2: Normalized substring match (handles punctuation differences)
  for (let i = 0; i < pages.length; i++) {
    const normalizedPage = normalizeText(pages[i]);
    if (normalizedPage.includes(normalizedQuote)) {
      return i + 1;
    }
  }
  
  // Stage 3: Word-based fuzzy match (handles OCR errors)
  const words = normalizedQuote.split(' ').filter(w => w.length > 3);
  if (words.length >= 2) {
    let bestPage = -1;
    let bestScore = 0;
    
    for (let i = 0; i < pages.length; i++) {
      const normalizedPage = normalizeText(pages[i]);
      const similarity = calculateSimilarity(normalizedQuote, normalizedPage);
      
      // Also check if key words appear close together
      const pageWords = normalizedPage.split(' ');
      const keyWordsInPage = words.filter(w => normalizedPage.includes(w));
      
      if (keyWordsInPage.length >= Math.min(3, words.length * 0.5)) {
        const score = similarity + (keyWordsInPage.length / words.length) * 0.5;
        if (score > bestScore && score > 0.4) {
          bestScore = score;
          bestPage = i + 1;
        }
      }
    }
    
    if (bestPage > 0) return bestPage;
  }
  
  // Stage 4: First few significant words match (for partial quotes)
  const firstWords = words.slice(0, 4).join(' ');
  if (firstWords.length >= 10) {
    for (let i = 0; i < pages.length; i++) {
      const normalizedPage = normalizeText(pages[i]);
      if (normalizedPage.includes(firstWords)) {
        return i + 1;
      }
    }
  }
  
  return null;
}

export function extractContext(text: string, searchTerm: string, contextLength: number = 200): string | null {
  const lowerText = text.toLowerCase();
  const lowerSearch = searchTerm.toLowerCase();
  
  const index = lowerText.indexOf(lowerSearch);
  if (index === -1) return null;
  
  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + searchTerm.length + contextLength);
  
  let context = text.substring(start, end);
  
  if (start > 0) context = '...' + context;
  if (end < text.length) context = context + '...';
  
  return context;
}
