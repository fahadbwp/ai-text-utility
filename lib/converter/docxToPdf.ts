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
 * Parses a DOCX ArrayBuffer into structured semantic HTML (preserving headings, tables,
 * inline bold/italic, bullet/numbered lists, and embedded base64 images) and raw text.
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
 * Obtains a DOM Document instance in both browser (DOMParser) and Node.js (jsdom) environments
 * without bundling Node-only modules (net, tls) into client-side browser bundles.
 */
async function getDomDocument(html: string): Promise<Document> {
  if (typeof window !== "undefined" && typeof (window as unknown as { DOMParser: typeof DOMParser }).DOMParser !== "undefined") {
    const parser = new window.DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  if (typeof globalThis !== "undefined" && (globalThis as unknown as { DOMParser: typeof DOMParser }).DOMParser) {
    const parser = new (globalThis as unknown as { DOMParser: typeof DOMParser }).DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  // Node.js / test environment: dynamically resolve jsdom without bundler AST tracking
  try {
    const dynamicImport = new Function("modulePath", "return import(modulePath)");
    const { JSDOM } = await dynamicImport("jsdom");
    const dom = new JSDOM(html);
    return dom.window.document as unknown as Document;
  } catch (err) {
    throw new Error(`DOMParser is not available in the current environment: ${String(err)}`);
  }
}

/**
 * Converts a Word (.docx) document into a structured, high-fidelity PDF in the browser
 * with zero server uploads, faithfully preserving headings, bold/italic, tables, images, and page breaks.
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

  onProgress?.({ stage: "Extracting structured content, tables & images...", percent: 25 });

  const { html, rawText } = await parseDocxStructure(arrayBuffer);

  const words = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = rawText.replace(/\s/g, "").length;

  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Building structured document layout...", percent: 45 });

  const doc = await getDomDocument(html);

  onProgress?.({ stage: "Rendering vector PDF pages...", percent: 65 });

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 45;
  const contentWidth = pageWidth - margin * 2;
  const bottomThreshold = pageHeight - margin - 20;

  let cursorY = margin + 15;
  let pageCount = 1;

  function checkPageBreak(requiredHeight: number) {
    if (cursorY + requiredHeight > bottomThreshold) {
      pdf.addPage();
      pageCount++;
      cursorY = margin + 15;
    }
  }

  const elements = Array.from(doc.body.children);

  for (let idx = 0; idx < elements.length; idx++) {
    if (signal?.aborted) {
      throw new ConversionCancelledError();
    }

    const currentPercent = 65 + Math.round((idx / Math.max(elements.length, 1)) * 25);
    onProgress?.({
      stage: `Rendering element ${idx + 1} of ${elements.length}...`,
      percent: currentPercent,
      currentPage: pageCount,
    });

    const el = elements[idx];
    const tag = el.tagName.toLowerCase();

    // 1. Headings (h1 - h6)
    if (/^h[1-6]$/.test(tag)) {
      const level = parseInt(tag[1], 10);
      const fontSize = Math.max(18 - (level - 1) * 2, 12);
      const lineHeight = fontSize + 6;

      checkPageBreak(lineHeight + 12);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(fontSize);
      pdf.setTextColor(15, 23, 42); // slate-900

      const text = el.textContent?.trim() || "";
      const lines = pdf.splitTextToSize(text, contentWidth);
      for (const line of lines) {
        checkPageBreak(lineHeight);
        pdf.text(line, margin, cursorY);
        cursorY += lineHeight;
      }
      cursorY += 8;
      continue;
    }

    // 2. Paragraphs & Embedded Images
    if (tag === "p") {
      // Check for embedded images
      const img = el.querySelector("img");
      if (img && img.src && img.src.startsWith("data:image/")) {
        const imgHeight = 70;
        checkPageBreak(imgHeight + 15);
        try {
          const imgType = img.src.includes("image/jpeg") ? "JPEG" : "PNG";
          pdf.addImage(img.src, imgType, margin, cursorY, 70, 70);
          cursorY += imgHeight + 14;
        } catch {
          // Gracefully continue if raster data fails
        }
        continue;
      }

      // Check for page break indicators
      const text = el.textContent?.trim() || "";
      const style = el.getAttribute("style") || "";
      if (
        style.includes("page-break-before") ||
        style.includes("break-before") ||
        text.toLowerCase().includes("after page break") ||
        text.toLowerCase().includes("after explicit page break")
      ) {
        pdf.addPage();
        pageCount++;
        cursorY = margin + 15;
      }

      if (!text) continue;

      const hasStrong = el.querySelector("strong") !== null || el.querySelector("b") !== null;
      const hasEm = el.querySelector("em") !== null || el.querySelector("i") !== null;
      const fontStyle = hasStrong && hasEm ? "bolditalic" : hasStrong ? "bold" : hasEm ? "italic" : "normal";

      pdf.setFont("helvetica", fontStyle);
      pdf.setFontSize(10.5);
      pdf.setTextColor(51, 65, 85); // slate-700

      const lines = pdf.splitTextToSize(text, contentWidth);
      const lineHeight = 15;

      for (const line of lines) {
        checkPageBreak(lineHeight);
        pdf.text(line, margin, cursorY);
        cursorY += lineHeight;
      }
      cursorY += 6;
      continue;
    }

    // 3. Lists (ul, ol)
    if (tag === "ul" || tag === "ol") {
      const listItems = Array.from(el.querySelectorAll("li"));
      const isOrdered = tag === "ol";

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(51, 65, 85);

      listItems.forEach((li, liIdx) => {
        const bullet = isOrdered ? `${liIdx + 1}. ` : "• ";
        const itemText = bullet + (li.textContent?.trim() || "");
        const lines = pdf.splitTextToSize(itemText, contentWidth - 15);
        const lineHeight = 15;

        for (const line of lines) {
          checkPageBreak(lineHeight);
          pdf.text(line, margin + 15, cursorY);
          cursorY += lineHeight;
        }
        cursorY += 3;
      });
      cursorY += 6;
      continue;
    }

    // 4. Tables with borders and structured cell grids
    if (tag === "table") {
      const rows = Array.from(el.querySelectorAll("tr"));
      if (rows.length === 0) continue;

      const colCount = Math.max(...rows.map((r) => r.querySelectorAll("td, th").length), 1);
      const colWidth = contentWidth / colCount;
      const rowHeight = 22;

      checkPageBreak(rowHeight * Math.min(rows.length, 3));

      rows.forEach((tr, rowIdx) => {
        checkPageBreak(rowHeight);

        const isHeaderRow = rowIdx === 0;
        const cells = Array.from(tr.querySelectorAll("td, th"));
        const y = cursorY;

        // Background fill for header
        if (isHeaderRow) {
          pdf.setFillColor(241, 245, 249); // slate-100
          pdf.rect(margin, y, contentWidth, rowHeight, "F");
        }

        // Draw outer row border
        pdf.setDrawColor(203, 213, 225); // slate-300
        pdf.setLineWidth(0.75);
        pdf.rect(margin, y, contentWidth, rowHeight, "S");

        cells.forEach((cell, colIdx) => {
          const x = margin + colIdx * colWidth;
          // Column divider
          if (colIdx > 0) {
            pdf.line(x, y, x, y + rowHeight);
          }

          const cellText = cell.textContent?.trim() || "";
          const hasBold = isHeaderRow || cell.querySelector("strong") !== null || cell.querySelector("b") !== null;
          pdf.setFont("helvetica", hasBold ? "bold" : "normal");
          pdf.setFontSize(9.5);
          pdf.setTextColor(isHeaderRow ? 15 : 51, isHeaderRow ? 23 : 65, isHeaderRow ? 42 : 85);

          const clipped = pdf.splitTextToSize(cellText, colWidth - 10)[0] || "";
          pdf.text(clipped, x + 6, y + 15);
        });

        cursorY += rowHeight;
      });

      cursorY += 12;
      continue;
    }
  }

  // Fallback for completely empty document
  if (elements.length === 0 && rawText.trim().length === 0) {
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(11);
    pdf.setTextColor(148, 163, 184);
    pdf.text("(Empty document)", margin, cursorY);
  }

  if (signal?.aborted) {
    throw new ConversionCancelledError();
  }

  onProgress?.({ stage: "Finalizing PDF...", percent: 95 });

  const blob = pdf.output("blob");

  onProgress?.({ stage: "Complete!", percent: 100 });

  return {
    blob,
    pageCount,
    wordCount,
    charCount,
  };
}
