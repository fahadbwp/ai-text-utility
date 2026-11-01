import { jsPDF } from "jspdf";
import JSZip from "jszip";

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
 * Architectural limitations of browser-based client-side DOCX-to-PDF conversion.
 * Documented explicitly to maintain transparency and fidelity expectations.
 */
export const DOCX_TO_PDF_LIMITATIONS = [
  "Client-side execution only: dynamic Word fields (e.g. computed PAGE/NUMPAGES formula fields or macros) are not evaluated by browser engines.",
  "Complex multi-column newspaper layouts are flattened sequentially to preserve chronological reading order.",
  "Embedded legacy OLE binary objects (e.g. embedded Excel spreadsheets inside Word) cannot be dynamically unpacked in-browser; standard fallback preview images are rendered when present.",
  "Vector SmartArt and 3D shapes are rendered using their document-embedded raster fallbacks if available.",
] as const;

/**
 * Normalizes a DOCX ArrayBuffer by inspecting word/document.xml to ensure paragraph-level
 * pageBreakBefore properties are represented as standard run-level page breaks (<w:br w:type="page"/>).
 */
async function normalizeDocxArrayBuffer(input: ArrayBuffer | Uint8Array): Promise<ArrayBuffer> {
  try {
    const zip = await JSZip.loadAsync(input);
    const docXmlFile = zip.file("word/document.xml");
    if (docXmlFile) {
      let xml = await docXmlFile.async("string");
      if (xml.includes("pageBreakBefore")) {
        xml = xml.replace(
          /(<w:pPr\b[^>]*>[\s\S]*?<w:pageBreakBefore\b[^>]*\/?>[\s\S]*?<\/w:pPr>)/gi,
          '$1<w:r><w:br w:type="page"/></w:r>'
        );
        zip.file("word/document.xml", xml);
        return await zip.generateAsync({ type: "arraybuffer" });
      }
    }
  } catch {
    // If ZIP inspection fails, fallback to raw buffer
  }
  return input instanceof ArrayBuffer ? input : ((input as Uint8Array).buffer as ArrayBuffer);
}

/**
 * Parses a DOCX ArrayBuffer into structured semantic HTML (preserving headings, tables,
 * inline bold/italic text runs, bullet/numbered lists, and embedded base64 images) and raw text.
 */
async function parseDocxStructure(input: ArrayBuffer | Uint8Array) {
  const normalizedBuffer = await normalizeDocxArrayBuffer(input);
  const mammoth = await import("mammoth");
  const isBufferEnv = typeof Buffer !== "undefined";
  const options = isBufferEnv
    ? { buffer: Buffer.isBuffer(normalizedBuffer) ? normalizedBuffer : Buffer.from(normalizedBuffer) }
    : { arrayBuffer: normalizedBuffer };

  // Map real Word page breaks <w:br w:type="page"/> directly to <hr class="page-break" />
  const styleMap = ["br[type='page'] => hr.page-break:fresh"];

  const result = await mammoth.convertToHtml(options as never, { styleMap });
  const html = result.value || "";

  const rawTextResult = await mammoth.extractRawText(options as never);
  const rawText = rawTextResult.value || "";

  return { html, rawText };
}

/**
 * Parses HTML string into a DOM Document using standard browser DOMParser.
 * Avoids any eval() or new Function() calls. In test environments (Node.js),
 * globalThis.DOMParser is initialized by the test runner setup.
 */
export function parseHtmlToDocument(html: string): Document {
  const Parser =
    typeof DOMParser !== "undefined"
      ? DOMParser
      : (globalThis as unknown as { DOMParser?: typeof DOMParser }).DOMParser;

  if (!Parser) {
    throw new Error(
      "DOMParser is not available in the current environment. Ensure a browser environment or test DOM setup is initialized."
    );
  }

  const parser = new Parser();
  return parser.parseFromString(html, "text/html");
}

/* =========================================================================
   INLINE STYLING & TEXT WRAPPING ENGINE
   ========================================================================= */

interface StyledToken {
  text: string;
  isBold: boolean;
  isItalic: boolean;
  isCode?: boolean;
}

interface StyledWord {
  text: string;
  isBold: boolean;
  isItalic: boolean;
  isCode?: boolean;
  isSpace?: boolean;
}

/**
 * Recursively traverses DOM nodes to extract text runs while preserving exact
 * inline bold, italic, and code styling at the individual word/run level.
 */
function extractInlineTokens(
  node: Node,
  bold = false,
  italic = false,
  code = false
): StyledToken[] {
  const tokens: StyledToken[] = [];

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === 3 /* Node.TEXT_NODE */) {
      const val = child.nodeValue || "";
      if (val) {
        tokens.push({
          text: val,
          isBold: bold,
          isItalic: italic,
          isCode: code,
        });
      }
    } else if (child.nodeType === 1 /* Node.ELEMENT_NODE */) {
      const el = child as HTMLElement;
      const tag = el.tagName.toLowerCase();

      const isBold =
        bold ||
        tag === "strong" ||
        tag === "b" ||
        el.style?.fontWeight === "bold" ||
        parseInt(el.style?.fontWeight || "0", 10) >= 600;

      const isItalic =
        italic ||
        tag === "em" ||
        tag === "i" ||
        el.style?.fontStyle === "italic";

      const isCode = code || tag === "code";

      if (tag === "br") {
        tokens.push({ text: "\n", isBold, isItalic, isCode });
        continue;
      }

      if (tag === "img") {
        continue;
      }

      const isBlock = tag === "p" || tag === "div";
      tokens.push(...extractInlineTokens(el, isBold, isItalic, isCode));
      if (isBlock) {
        tokens.push({ text: "\n", isBold, isItalic, isCode });
      }
    }
  }

  return tokens;
}

/**
 * Tokenizes text runs into discrete words and whitespace delimiters for accurate wrapping.
 */
function tokenizeInlineWords(tokens: StyledToken[]): StyledWord[] {
  const words: StyledWord[] = [];
  let pendingSpace = false;

  for (const token of tokens) {
    if (token.text === "\n") {
      words.push({
        text: "\n",
        isBold: token.isBold,
        isItalic: token.isItalic,
        isCode: token.isCode,
      });
      pendingSpace = false;
      continue;
    }

    const parts = token.text.split(/(\s+)/);

    for (const part of parts) {
      if (!part) continue;

      if (/^\s+$/.test(part)) {
        if (words.length > 0) {
          pendingSpace = true;
        }
      } else {
        if (pendingSpace) {
          words.push({
            text: " ",
            isBold: token.isBold,
            isItalic: token.isItalic,
            isCode: token.isCode,
            isSpace: true,
          });
          pendingSpace = false;
        }

        words.push({
          text: part,
          isBold: token.isBold,
          isItalic: token.isItalic,
          isCode: token.isCode,
          isSpace: false,
        });
      }
    }

    if (token.text.endsWith(" ") || token.text.endsWith("\t")) {
      pendingSpace = true;
    }
  }

  return words;
}

function getFontStyle(word: StyledWord): "normal" | "bold" | "italic" | "bolditalic" {
  if (word.isBold && word.isItalic) return "bolditalic";
  if (word.isBold) return "bold";
  if (word.isItalic) return "italic";
  return "normal";
}

function getWordWidth(pdf: jsPDF, word: StyledWord, fontSize: number): number {
  const style = getFontStyle(word);
  pdf.setFont(word.isCode ? "courier" : "helvetica", style);
  pdf.setFontSize(fontSize);
  return pdf.getTextWidth(word.text);
}

/**
 * Wraps styled words into lines constrained by maxWidth.
 */
function wrapStyledWordsIntoLines(
  pdf: jsPDF,
  words: StyledWord[],
  maxWidth: number,
  fontSize: number
): StyledWord[][] {
  const lines: StyledWord[][] = [];
  let currentLine: StyledWord[] = [];
  let currentWidth = 0;

  for (const word of words) {
    if (word.text === "\n") {
      lines.push(currentLine);
      currentLine = [];
      currentWidth = 0;
      continue;
    }

    const width = getWordWidth(pdf, word, fontSize);

    if (word.isSpace) {
      if (currentLine.length === 0) continue;
      if (currentWidth + width <= maxWidth) {
        currentLine.push(word);
        currentWidth += width;
      }
      continue;
    }

    if (currentWidth + width <= maxWidth) {
      currentLine.push(word);
      currentWidth += width;
    } else {
      if (currentLine.length > 0) {
        while (currentLine.length > 0 && currentLine[currentLine.length - 1].isSpace) {
          currentLine.pop();
        }
        lines.push(currentLine);
        currentLine = [];
        currentWidth = 0;
      }

      if (width > maxWidth) {
        for (const char of word.text) {
          const charWord: StyledWord = { ...word, text: char, isSpace: false };
          const charW = getWordWidth(pdf, charWord, fontSize);
          if (currentWidth + charW > maxWidth && currentLine.length > 0) {
            lines.push(currentLine);
            currentLine = [];
            currentWidth = 0;
          }
          currentLine.push(charWord);
          currentWidth += charW;
        }
      } else {
        currentLine.push(word);
        currentWidth += width;
      }
    }
  }

  if (currentLine.length > 0) {
    while (currentLine.length > 0 && currentLine[currentLine.length - 1].isSpace) {
      currentLine.pop();
    }
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }
  }

  return lines;
}

/**
 * Renders lines of styled words to the PDF document while updating cursorY and handling page breaks.
 */
function renderStyledLines(
  pdf: jsPDF,
  lines: StyledWord[][],
  startX: number,
  startCursorY: number,
  lineHeight: number,
  fontSize: number,
  textColor: [number, number, number],
  checkPageBreak: (requiredHeight: number) => void
): number {
  let y = startCursorY;

  for (const line of lines) {
    checkPageBreak(lineHeight);
    let x = startX;

    for (const word of line) {
      const font = word.isCode ? "courier" : "helvetica";
      const style = getFontStyle(word);
      pdf.setFont(font, style);
      pdf.setFontSize(fontSize);
      pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

      pdf.text(word.text, x, y);
      x += getWordWidth(pdf, word, fontSize);
    }

    y += lineHeight;
  }

  return y;
}

/* =========================================================================
   TABLE RENDERING WITH DYNAMIC ROW HEIGHTS & CELL WRAPPING
   ========================================================================= */

function renderTable(
  pdf: jsPDF,
  tableEl: HTMLElement,
  margin: number,
  contentWidth: number,
  startCursorY: number,
  checkPageBreak: (requiredHeight: number) => void
): number {
  const rows = Array.from(tableEl.querySelectorAll("tr"));
  if (rows.length === 0) return startCursorY;

  let cursorY = startCursorY;
  const colCount = Math.max(...rows.map((r) => r.querySelectorAll("td, th").length), 1);
  const colWidth = contentWidth / colCount;
  const cellPaddingH = 6;
  const cellPaddingV = 5;
  const cellContentWidth = Math.max(colWidth - cellPaddingH * 2, 10);
  const fontSize = 9;
  const cellLineHeight = 12.5;

  for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
    const tr = rows[rowIdx];
    const isHeaderRow = rowIdx === 0 && tr.querySelector("th") !== null;
    const cells = Array.from(tr.querySelectorAll("td, th"));

    // Pre-calculate wrapped lines for every cell in this row to determine true dynamic row height
    const cellLayouts = cells.map((cell) => {
      const isHeaderCell = isHeaderRow || cell.tagName.toLowerCase() === "th";
      const tokens = extractInlineTokens(cell, isHeaderCell);
      const words = tokenizeInlineWords(tokens);
      const lines = wrapStyledWordsIntoLines(pdf, words, cellContentWidth, fontSize);
      while (lines.length > 0 && lines[lines.length - 1].length === 0) {
        lines.pop();
      }
      return { lines, isHeaderCell };
    });

    const maxLines = Math.max(1, ...cellLayouts.map((c) => c.lines.length));
    const rowHeight = maxLines * cellLineHeight + cellPaddingV * 2 + 3;

    checkPageBreak(rowHeight);

    const rowY = cursorY;

    // Header background fill
    if (isHeaderRow) {
      pdf.setFillColor(241, 245, 249); // slate-100
      pdf.rect(margin, rowY, contentWidth, rowHeight, "F");
    }

    // Outer row border
    pdf.setDrawColor(203, 213, 225); // slate-300
    pdf.setLineWidth(0.75);
    pdf.rect(margin, rowY, contentWidth, rowHeight, "S");

    // Render cells without truncation
    cells.forEach((_, colIdx) => {
      const cellX = margin + colIdx * colWidth;

      // Vertical column divider
      if (colIdx > 0) {
        pdf.setDrawColor(203, 213, 225);
        pdf.line(cellX, rowY, cellX, rowY + rowHeight);
      }

      const layout = cellLayouts[colIdx];
      if (!layout) return;

      const textColor: [number, number, number] = layout.isHeaderCell
        ? [15, 23, 42]
        : [51, 65, 85];

      let cellY = rowY + cellPaddingV + 9;

      for (const line of layout.lines) {
        let x = cellX + cellPaddingH;
        for (const word of line) {
          const font = word.isCode ? "courier" : "helvetica";
          const style = getFontStyle(word);
          pdf.setFont(font, style);
          pdf.setFontSize(fontSize);
          pdf.setTextColor(textColor[0], textColor[1], textColor[2]);

          pdf.text(word.text, x, cellY);
          x += getWordWidth(pdf, word, fontSize);
        }
        cellY += cellLineHeight;
      }
    });

    cursorY += rowHeight;
  }

  cursorY += 10;
  return cursorY;
}

/* =========================================================================
   IMAGE RENDERING WITH ASPECT RATIO PRESERVATION & VISIBLE FAILURES
   ========================================================================= */

function renderImage(
  pdf: jsPDF,
  imgEl: HTMLImageElement,
  margin: number,
  contentWidth: number,
  startCursorY: number,
  checkPageBreak: (requiredHeight: number) => void
): number {
  const src = imgEl.getAttribute("src") || "";
  if (!src) return startCursorY;

  let cursorY = startCursorY;

  try {
    const props = pdf.getImageProperties(src);
    const naturalWidth = props.width || 100;
    const naturalHeight = props.height || 100;
    const aspect = naturalWidth / naturalHeight;

    const maxW = Math.min(contentWidth, 420);
    const maxH = 320;

    let renderW = Math.min(naturalWidth, maxW);
    let renderH = renderW / aspect;

    if (renderH > maxH) {
      renderH = maxH;
      renderW = renderH * aspect;
    }

    if (renderW < 20 || renderH < 20) {
      const minDim = 40;
      if (aspect >= 1) {
        renderW = minDim;
        renderH = minDim / aspect;
      } else {
        renderH = minDim;
        renderW = minDim * aspect;
      }
    }

    checkPageBreak(renderH + 14);

    const format = props.fileType || (src.includes("image/jpeg") ? "JPEG" : "PNG");
    pdf.addImage(src, format, margin, cursorY, renderW, renderH);
    cursorY += renderH + 12;
  } catch (err) {
    // Visible failure placeholder instead of silent dropping
    const errMsg = err instanceof Error ? err.message : String(err);
    const boxHeight = 32;
    checkPageBreak(boxHeight + 10);

    pdf.setDrawColor(239, 68, 68); // red-500
    pdf.setFillColor(254, 242, 242); // red-50
    pdf.rect(margin, cursorY, contentWidth, boxHeight, "FD");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(185, 28, 28); // red-700
    const failLabel = `[Embedded Image could not be rendered: ${errMsg}]`;
    pdf.text(failLabel, margin + 8, cursorY + 19);

    cursorY += boxHeight + 10;
  }

  return cursorY;
}

/* =========================================================================
   MAIN CONVERTER PIPELINE
   ========================================================================= */

/**
 * Converts a Word (.docx) document into a structured, high-fidelity PDF in the browser
 * with zero server uploads, faithfully preserving headings, text-run bold/italic styling,
 * dynamic tables, image aspect ratios, and genuine page breaks.
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

  const doc = parseHtmlToDocument(html);

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

  // Recursive element renderer supporting all common document structures
  function renderElement(el: Element) {
    const tag = el.tagName.toLowerCase();

    // 0. Page break markers (from mammoth br[type='page'] style map or inline CSS)
    if (
      (tag === "hr" && el.classList.contains("page-break")) ||
      el.getAttribute("data-page-break") === "true" ||
      el.getAttribute("style")?.includes("page-break-before") ||
      el.getAttribute("style")?.includes("break-before")
    ) {
      pdf.addPage();
      pageCount++;
      cursorY = margin + 15;
      return;
    }

    // Horizontal line
    if (tag === "hr") {
      checkPageBreak(15);
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(0.75);
      pdf.line(margin, cursorY, margin + contentWidth, cursorY);
      cursorY += 12;
      return;
    }

    // 1. Headings (h1 - h6)
    if (/^h[1-6]$/.test(tag)) {
      const level = parseInt(tag[1], 10);
      const fontSize = Math.max(18 - (level - 1) * 2, 11);
      const lineHeight = fontSize + 5;

      checkPageBreak(lineHeight + 10);

      const tokens = extractInlineTokens(el, true);
      const styledWords = tokenizeInlineWords(tokens);
      const lines = wrapStyledWordsIntoLines(pdf, styledWords, contentWidth, fontSize);

      cursorY = renderStyledLines(
        pdf,
        lines,
        margin,
        cursorY,
        lineHeight,
        fontSize,
        [15, 23, 42],
        checkPageBreak
      );

      cursorY += 6;
      return;
    }

    // 2. Standalone image
    if (tag === "img") {
      cursorY = renderImage(pdf, el as HTMLImageElement, margin, contentWidth, cursorY, checkPageBreak);
      return;
    }

    // 3. Paragraphs
    if (tag === "p") {
      // Check if paragraph contains embedded images
      const images = Array.from(el.querySelectorAll("img"));
      if (images.length > 0) {
        images.forEach((img) => {
          cursorY = renderImage(pdf, img, margin, contentWidth, cursorY, checkPageBreak);
        });
      }

      const tokens = extractInlineTokens(el);
      if (tokens.length === 0) return;

      const styledWords = tokenizeInlineWords(tokens);
      if (styledWords.length === 0) return;

      const fontSize = 10;
      const lineHeight = 14.5;
      const lines = wrapStyledWordsIntoLines(pdf, styledWords, contentWidth, fontSize);

      cursorY = renderStyledLines(
        pdf,
        lines,
        margin,
        cursorY,
        lineHeight,
        fontSize,
        [51, 65, 85],
        checkPageBreak
      );

      cursorY += 5;
      return;
    }

    // 4. Blockquotes
    if (tag === "blockquote") {
      const tokens = extractInlineTokens(el, false, true); // italic by default
      const styledWords = tokenizeInlineWords(tokens);
      const fontSize = 9.5;
      const lineHeight = 14;
      const quoteMargin = margin + 14;
      const quoteWidth = contentWidth - 14;
      const lines = wrapStyledWordsIntoLines(pdf, styledWords, quoteWidth, fontSize);

      checkPageBreak(lines.length * lineHeight + 8);
      const quoteStartY = cursorY;

      cursorY = renderStyledLines(
        pdf,
        lines,
        quoteMargin,
        cursorY,
        lineHeight,
        fontSize,
        [71, 85, 105],
        checkPageBreak
      );

      // Draw left quote accent bar
      pdf.setDrawColor(203, 213, 225);
      pdf.setLineWidth(2.5);
      pdf.line(margin + 2, quoteStartY - 2, margin + 2, cursorY - 4);

      cursorY += 6;
      return;
    }

    // 5. Code / Preformatted Blocks
    if (tag === "pre") {
      const codeText = el.textContent || "";
      const rawLines = codeText.split("\n");
      const fontSize = 8.5;
      const lineHeight = 12;

      checkPageBreak(rawLines.length * lineHeight + 12);
      const boxY = cursorY;
      const boxH = rawLines.length * lineHeight + 10;

      pdf.setFillColor(248, 250, 252); // slate-50
      pdf.rect(margin, boxY, contentWidth, boxH, "F");
      pdf.setDrawColor(226, 232, 240); // slate-200
      pdf.setLineWidth(0.5);
      pdf.rect(margin, boxY, contentWidth, boxH, "S");

      let codeY = boxY + 10;
      pdf.setFont("courier", "normal");
      pdf.setFontSize(fontSize);
      pdf.setTextColor(30, 41, 59);

      for (const line of rawLines) {
        const clipped = pdf.splitTextToSize(line, contentWidth - 16)[0] || "";
        pdf.text(clipped, margin + 8, codeY);
        codeY += lineHeight;
      }

      cursorY = boxY + boxH + 8;
      return;
    }

    // 6. Lists (ul, ol)
    if (tag === "ul" || tag === "ol") {
      const listItems = Array.from(el.querySelectorAll("li"));
      const isOrdered = tag === "ol";
      const fontSize = 9.5;
      const lineHeight = 14;

      listItems.forEach((li, liIdx) => {
        const bulletText = isOrdered ? `${liIdx + 1}. ` : "• ";
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(fontSize);
        pdf.setTextColor(51, 65, 85);
        const bulletWidth = pdf.getTextWidth(bulletText) + 4;

        const tokens = extractInlineTokens(li);
        const styledWords = tokenizeInlineWords(tokens);
        const lines = wrapStyledWordsIntoLines(
          pdf,
          styledWords,
          contentWidth - bulletWidth,
          fontSize
        );

        checkPageBreak(Math.max(lines.length, 1) * lineHeight);

        // Draw bullet at item start
        pdf.setFont("helvetica", "bold");
        pdf.text(bulletText, margin + 4, cursorY);

        cursorY = renderStyledLines(
          pdf,
          lines,
          margin + bulletWidth + 4,
          cursorY,
          lineHeight,
          fontSize,
          [51, 65, 85],
          checkPageBreak
        );

        cursorY += 2;
      });

      cursorY += 4;
      return;
    }

    // 7. Tables
    if (tag === "table") {
      cursorY = renderTable(pdf, el as HTMLElement, margin, contentWidth, cursorY, checkPageBreak);
      return;
    }

    // 8. Container elements (div, section, article, main, etc.)
    if (el.children.length > 0) {
      Array.from(el.children).forEach(renderElement);
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

    renderElement(elements[idx]);
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
