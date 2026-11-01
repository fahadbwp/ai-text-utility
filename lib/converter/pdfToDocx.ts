import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { Document, Paragraph, TextRun, Packer } from "docx";

// Set worker path to local self-hosted worker in public/
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export interface PdfToDocxProgress {
  stage: string;
  percent: number;
  currentPage?: number;
  totalPages?: number;
}

export interface PdfConversionResult {
  blob: Blob;
  pageCount: number;
  wordCount: number;
  charCount: number;
}

export class ScannedPdfError extends Error {
  constructor(message: string = "This PDF appears to be a scanned image without a digital text layer. Browser-based conversion requires selectable digital text.") {
    super(message);
    this.name = "ScannedPdfError";
  }
}

export class ConversionCancelledError extends Error {
  constructor(message: string = "Conversion was cancelled by the user.") {
    super(message);
    this.name = "ConversionCancelledError";
  }
}

/**
 * Converts a digital, selectable-text PDF File or ArrayBuffer into an editable Word (.docx) document
 * completely inside the user's browser with zero server uploads.
 */
export async function convertPdfToDocx(
  fileOrBuffer: File | ArrayBuffer,
  onProgress?: (progress: PdfToDocxProgress) => void,
  signal?: AbortSignal
): Promise<PdfConversionResult> {
  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Reading PDF document...", percent: 5 });

  const arrayBuffer =
    fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;

  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  if (numPages === 0) {
    throw new Error("The PDF document contains no pages.");
  }

  let totalTextItemsCount = 0;
  let totalWords = 0;
  let totalChars = 0;
  const docParagraphs: Paragraph[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    if (signal?.aborted) {
      throw new ConversionCancelledError();
    }

    const currentPercent = 10 + Math.round((pageNum / numPages) * 70);
    onProgress?.({
      stage: `Extracting page ${pageNum} of ${numPages}...`,
      percent: currentPercent,
      currentPage: pageNum,
      totalPages: numPages,
    });

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Filter valid text items
    const items = textContent.items.filter(
      (item): item is import("pdfjs-dist/types/src/display/api").TextItem => "str" in item
    );

    totalTextItemsCount += items.filter((item) => item.str.trim().length > 0).length;

    // Group items into lines using vertical Y coordinate
    // transform[4] is X, transform[5] is Y
    const lineBuckets = new Map<number, { text: string; isBold: boolean; fontSize: number }[]>();

    for (const item of items) {
      const trimmed = item.str.trim();
      if (!trimmed) continue;

      totalChars += trimmed.length;
      totalWords += trimmed.split(/\s+/).filter(Boolean).length;

      // Bucket Y coordinate to group items on roughly the same baseline
      const yBucket = Math.round(item.transform[5] / 4) * 4;
      const bucket = lineBuckets.get(yBucket) || [];

      const height = Math.abs(item.transform[0]) || 10;
      const isBold = item.fontName?.toLowerCase().includes("bold") || false;

      bucket.push({
        text: item.str,
        isBold,
        fontSize: height,
      });

      lineBuckets.set(yBucket, bucket);
    }

    // Sort descending by Y (PDF Y=0 is bottom of page)
    const sortedY = Array.from(lineBuckets.keys()).sort((a, b) => b - a);

    sortedY.forEach((y, lineIdx) => {
      const itemsInLine = lineBuckets.get(y) || [];
      const lineText = itemsInLine.map((i) => i.text).join(" ").trim();
      if (!lineText) return;

      const maxFontSize = Math.max(...itemsInLine.map((i) => i.fontSize));
      const hasBold = itemsInLine.some((i) => i.isBold);
      const isHeading = maxFontSize > 13 || (lineText.length < 60 && hasBold);

      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: lineText,
              bold: isHeading || hasBold,
              size: isHeading ? 28 : 22, // 14pt or 11pt
              font: "Arial",
            }),
          ],
          spacing: { after: 120, before: isHeading ? 200 : 0 },
          pageBreakBefore: pageNum > 1 && lineIdx === 0,
        })
      );
    });

    // If page had no extractable text lines
    if (sortedY.length === 0) {
      docParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[Page ${pageNum} - No selectable text detected]`,
              italics: true,
              size: 20,
            }),
          ],
          pageBreakBefore: pageNum > 1,
        })
      );
    }
  }

  // Scanned PDF detection: if the document yielded 0 text items across all pages
  if (totalTextItemsCount === 0) {
    throw new ScannedPdfError();
  }

  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Packaging Word document...", percent: 90 });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docParagraphs.length > 0 ? docParagraphs : [
          new Paragraph({
            children: [new TextRun({ text: "Empty document", italics: true })],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Complete!", percent: 100 });

  return {
    blob,
    pageCount: numPages,
    wordCount: totalWords,
    charCount: totalChars,
  };
}
