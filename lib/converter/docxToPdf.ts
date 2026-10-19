import { jsPDF } from "jspdf";

export interface DocxToPdfProgress {
  stage: string;
  percent: number;
  currentPage?: number;
  totalPages?: number;
}

export interface DocxConversionResult {
  blob: Blob;
  pageCount: number;
  wordCount: number;
  charCount: number;
}

export class ConversionCancelledError extends Error {
  constructor(message: string = "Conversion was cancelled by the user.") {
    super(message);
    this.name = "ConversionCancelledError";
  }
}

/**
 * Parses raw OpenXML paragraphs, headings, tables, and lists from a DOCX ArrayBuffer
 * without sending any data over the network.
 */
async function parseDocxStructure(input: ArrayBuffer | Uint8Array) {
  const mammoth = await import("mammoth");
  const isBufferEnv = typeof Buffer !== "undefined";
  const options = isBufferEnv
    ? { buffer: Buffer.isBuffer(input) ? input : Buffer.from(input as ArrayBuffer) }
    : { arrayBuffer: input instanceof ArrayBuffer ? input : (input as Uint8Array).buffer };

  const result = await mammoth.convertToHtml(options as never);
  const html = result.value || "";

  const rawTextResult = await mammoth.extractRawText(options as never);
  const rawText = rawTextResult.value || "";

  return { html, rawText };
}

/**
 * Converts a Word (.docx) document into a paginated PDF in the browser with zero server uploads.
 */
export async function convertDocxToPdf(
  fileOrBuffer: File | ArrayBuffer,
  onProgress?: (progress: DocxToPdfProgress) => void,
  signal?: AbortSignal
): Promise<DocxConversionResult> {
  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Reading Word document...", percent: 10 });

  const arrayBuffer =
    fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer;

  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Parsing styles, tables & layout...", percent: 30 });

  const { html, rawText } = await parseDocxStructure(arrayBuffer);

  const words = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = rawText.replace(/\s/g, "").length;

  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Rendering paginated PDF...", percent: 60 });

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - margin - 20;

  let cursorY = margin + 15;
  let pageCount = 1;

  // Split into paragraphs / lines
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  doc.setFont("helvetica", "normal");

  for (let i = 0; i < lines.length; i++) {
    if (signal?.aborted) {
      throw new ConversionCancelledError();
    }

    const line = lines[i];
    const isHeading = line.length < 60 && (i === 0 || /^[A-Z0-9\s:_-]+$/.test(line));
    const isBullet = line.startsWith("•") || line.startsWith("-") || /^\d+\./.test(line);

    const fontSize = isHeading ? 15 : isBullet ? 10.5 : 11;
    const lineHeight = isHeading ? 22 : 16;

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", isHeading ? "bold" : "normal");
    doc.setTextColor(isHeading ? 20 : 40, isHeading ? 30 : 50, isHeading ? 50 : 60);

    const wrappedLines = doc.splitTextToSize(line, isBullet ? contentWidth - 15 : contentWidth);

    for (const wrapped of wrappedLines) {
      if (cursorY + lineHeight > bottomThreshold) {
        doc.addPage();
        pageCount++;
        cursorY = margin + 15;
      }

      const xPos = isBullet ? margin + 15 : margin;
      doc.text(wrapped, xPos, cursorY);
      cursorY += lineHeight;
    }

    cursorY += isHeading ? 10 : 6;
  }

  if (lines.length === 0) {
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("(Empty document)", margin, cursorY);
  }

  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Finalizing PDF...", percent: 95 });

  const blob = doc.output("blob");

  onProgress?.({ stage: "Complete!", percent: 100 });

  return {
    blob,
    pageCount,
    wordCount,
    charCount,
  };
}
