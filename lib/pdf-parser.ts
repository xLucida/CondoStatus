import pdf from 'pdf-parse';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { createCanvas, Canvas, CanvasRenderingContext2D } from 'canvas';
import Tesseract from 'tesseract.js';

// Disable worker for Node.js environment
if (typeof window === 'undefined') {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = '';
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

    console.log('Text extraction insufficient, falling back to OCR...');
    return await parsePDFWithOCR(buffer);
  } catch (error) {
    console.error('PDF parsing error:', error);
    console.log('Falling back to OCR due to parse error...');
    try {
      return await parsePDFWithOCR(buffer);
    } catch (ocrError) {
      console.error('OCR also failed:', ocrError);
      throw new Error(`Failed to parse PDF: ${error}`);
    }
  }
}

const MAX_OCR_PAGES = 50;

async function parsePDFWithOCR(buffer: Buffer): Promise<PDFParseResult> {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    useSystemFonts: true,
    disableWorker: true,
  } as any);
  
  let pdfDoc;
  let worker;
  
  try {
    pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const pagesToProcess = Math.min(numPages, MAX_OCR_PAGES);

    const pages: string[] = [];
    worker = await Tesseract.createWorker('eng');

    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      console.log(`OCR processing page ${pageNum}/${pagesToProcess}...`);
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: OCR_SCALE });

      const canvasFactory = new NodeCanvasFactory();
      const { canvas, context } = canvasFactory.create(
        Math.floor(viewport.width),
        Math.floor(viewport.height)
      );

      const renderContext = {
        canvasContext: context,
        viewport,
      };
      await page.render(renderContext as any).promise;

      const imageBuffer = canvas.toBuffer('image/png');
      const { data: { text } } = await worker.recognize(imageBuffer);
      pages.push(text.trim());
      
      page.cleanup();
    }

    const fullText = pages.join('\n\n');

    return {
      text: fullText,
      pageCount: numPages,
      pages,
      metadata: {},
      usedOCR: true,
    };
  } finally {
    if (worker) {
      await worker.terminate();
    }
    if (pdfDoc) {
      pdfDoc.cleanup();
    }
    loadingTask.destroy();
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

export function findPageForQuote(pages: string[], quote: string): number | null {
  if (!quote) return null;
  
  const normalizedQuote = quote.toLowerCase().trim();
  
  for (let i = 0; i < pages.length; i++) {
    const normalizedPage = pages[i].toLowerCase();
    if (normalizedPage.includes(normalizedQuote)) {
      return i + 1;
    }
  }
  
  const words = normalizedQuote.split(' ').filter(w => w.length > 4);
  if (words.length >= 3) {
    for (let i = 0; i < pages.length; i++) {
      const normalizedPage = pages[i].toLowerCase();
      const matchCount = words.filter(w => normalizedPage.includes(w)).length;
      if (matchCount >= words.length * 0.7) {
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
