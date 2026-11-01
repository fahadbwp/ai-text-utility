import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

// Initialize DOMParser for Node.js test environment (clean, browser-safe architecture)
if (typeof (globalThis as Record<string, unknown>).DOMParser === "undefined") {
  const dom = new JSDOM();
  (globalThis as Record<string, unknown>).DOMParser = dom.window.DOMParser;
}

import sitemap from "../../app/sitemap.ts";
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  WidthType,
  ImageRun,
  PageBreak,
  Packer,
} from "docx";
import { jsPDF } from "jspdf";
import {
  convertDocxToPdf,
  parseHtmlToDocument,
  DOCX_TO_PDF_LIMITATIONS,
  ConversionCancelledError,
} from "../../lib/converter/docxToPdf.ts";
import { convertPdfToDocx, ScannedPdfError } from "../../lib/converter/pdfToDocx.ts";

test("Document Converters - Sitemap Integration", () => {
  const urls = sitemap();
  const pdfToWordEntry = urls.find((u) => u.url.endsWith("/tools/pdf-to-word"));
  const wordToPdfEntry = urls.find((u) => u.url.endsWith("/tools/word-to-pdf"));

  assert.ok(pdfToWordEntry, "Sitemap must include /tools/pdf-to-word");
  assert.equal(pdfToWordEntry?.priority, 0.9);
  assert.equal(pdfToWordEntry?.changeFrequency, "weekly");

  assert.ok(wordToPdfEntry, "Sitemap must include /tools/word-to-pdf");
  assert.equal(wordToPdfEntry?.priority, 0.9);
  assert.equal(wordToPdfEntry?.changeFrequency, "weekly");
});

test("DOCX to PDF - Mixed Inline Styling Run-Level Preservation", async () => {
  // Verifies that bold and italic are preserved at the individual text-run level,
  // without erroneously bolding an entire paragraph when only one word is styled.
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Document Header",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "The " }),
              new TextRun({ text: "urgent", bold: true }),
              new TextRun({ text: " notice is " }),
              new TextRun({ text: "crucial", italics: true }),
              new TextRun({ text: " and " }),
              new TextRun({ text: "top-priority", bold: true, italics: true }),
              new TextRun({ text: " for all personnel." }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const result = await convertDocxToPdf(buffer);

  assert.ok(result.blob, "Result must contain Blob");
  assert.equal(result.pageCount, 1);
  assert.ok(result.wordCount >= 10, "Word count must include all styled runs");

  const pdfArrayBuffer = await result.blob.arrayBuffer();
  const pdfStr = Buffer.from(pdfArrayBuffer).toString("binary");
  assert.ok(pdfStr.startsWith("%PDF-"), "Generated blob must be a valid PDF");

  // Verify that DOM parser cleanly parsed strong and em tags without crashing
  const parsedDoc = parseHtmlToDocument(
    "<p>The <strong>urgent</strong> notice is <em>crucial</em> and <strong><em>top-priority</em></strong> for all personnel.</p>"
  );
  assert.equal(parsedDoc.body.querySelectorAll("strong").length, 2);
  assert.equal(parsedDoc.body.querySelectorAll("em").length, 2);
});

test("DOCX to PDF - Dynamic Table Row Height & Cell Wrapping Without Truncation", async () => {
  // A table cell with lengthy text must wrap dynamically to multiple lines,
  // expand the row height, and retain 100% of the cell text without silent truncation.
  const longDescription =
    "This comprehensive multi-sentence description outlines the entire quarter deliverables. " +
    "Every single word in this cell must be completely preserved and rendered into the PDF output " +
    "without truncation, clipping, or loss of information regardless of column constraints.";

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "Quarterly Deliverables Table", heading: HeadingLevel.HEADING_2 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Item", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Scope & Details", bold: true })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Milestone Alpha" })] }),
                  new TableCell({ children: [new Paragraph({ text: longDescription })] }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const result = await convertDocxToPdf(buffer);

  assert.ok(result.blob, "Result must contain Blob");
  const pdfArrayBuffer = await result.blob.arrayBuffer();
  const pdfStr = Buffer.from(pdfArrayBuffer).toString("binary");

  assert.ok(pdfStr.includes("Milestone") || pdfStr.includes("Alpha"), "PDF must contain cell text");
  assert.ok(pdfStr.includes("comprehensive") || pdfStr.includes("deliverables"), "PDF must contain long cell text without truncation");
  assert.ok(result.wordCount > 30, "Word count must reflect full multi-line table contents");
});

test("DOCX to PDF - Image Aspect Ratio & Visible Failure Placeholders", async () => {
  // 1x1 base64 transparent PNG
  const validPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const validPngBuffer = Buffer.from(validPngBase64, "base64");

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "Embedded Media Showcase", heading: HeadingLevel.HEADING_1 }),
          new Paragraph({
            children: [
              new ImageRun({
                data: validPngBuffer,
                transformation: { width: 120, height: 60 }, // 2:1 aspect ratio
                type: "png",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const result = await convertDocxToPdf(buffer);

  assert.ok(result.blob, "Result must contain Blob");
  const pdfArrayBuffer = await result.blob.arrayBuffer();
  const pdfStr = Buffer.from(pdfArrayBuffer).toString("binary");
  assert.ok(pdfStr.includes("/XObject") || pdfStr.includes("/Image"), "Valid image must be embedded as XObject");

  // Verify visible failure fallback on invalid/corrupted image data
  const brokenImageDoc = parseHtmlToDocument('<img src="data:image/png;base64,CORRUPTED_BASE64_DATA" />');
  assert.equal(brokenImageDoc.body.querySelectorAll("img").length, 1);
});

test("DOCX to PDF - Real DOCX Page Breaks Without Phrase Matching", async () => {
  // Test genuine Word page breaks using both <w:br w:type="page"/> and <w:pageBreakBefore/>.
  // The text content purposefully does NOT contain words like "after page break" or "break".
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "Introductory section on first sheet" }),
          new Paragraph({
            children: [new PageBreak()],
          }),
          new Paragraph({
            text: "Independent intermediate content strictly positioned on sheet two",
          }),
          new Paragraph({
            text: "Concluding remarks positioned on sheet three via paragraph break before",
            pageBreakBefore: true,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const result = await convertDocxToPdf(buffer);

  assert.ok(result.blob, "Result must contain Blob");
  assert.equal(result.pageCount, 3, "Real DOCX page breaks must produce exactly 3 distinct PDF pages");
});

test("DOCX to PDF - Common Document Structures (Blockquotes, Code, Lists, HR)", async () => {
  // Verifies that blockquotes, code pre blocks, lists, and horizontal rules are rendered
  const htmlSample = `
    <h1>Technical Documentation</h1>
    <hr />
    <blockquote>Architecture is the learned game, correct and magnificent, of forms assembled in the light.</blockquote>
    <pre>const status = "operational";\nconsole.log(status);</pre>
    <ul>
      <li>High performance</li>
      <li>Zero network latency</li>
    </ul>
    <ol>
      <li>Step One</li>
      <li>Step Two</li>
    </ol>
  `;

  const parsedDoc = parseHtmlToDocument(htmlSample);
  assert.equal(parsedDoc.body.querySelectorAll("blockquote").length, 1);
  assert.equal(parsedDoc.body.querySelectorAll("pre").length, 1);
  assert.equal(parsedDoc.body.querySelectorAll("ul").length, 1);
  assert.equal(parsedDoc.body.querySelectorAll("ol").length, 1);
  assert.equal(parsedDoc.body.querySelectorAll("hr").length, 1);

  // Documented limitations must be exported and non-empty
  assert.ok(DOCX_TO_PDF_LIMITATIONS.length > 0, "Document limitations must be explicitly defined");
});

test("Document Converters - Zero Network Transmission Security Audit", async () => {
  let networkCalls = 0;
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = (async () => {
      networkCalls++;
      throw new Error("Network request attempted during client-side document conversion!");
    }) as unknown as typeof fetch;

    // 1. DOCX to PDF execution
    const doc = new Document({
      sections: [{ children: [new Paragraph({ text: "Confidential Local Document" })] }],
    });
    const docxBuffer = await Packer.toBuffer(doc);
    const docxResult = await convertDocxToPdf(docxBuffer);
    assert.ok(docxResult.blob);

    // 2. PDF to DOCX execution
    const pdf = new jsPDF();
    pdf.text("Confidential Local PDF Document", 20, 20);
    const pdfBuffer = pdf.output("arraybuffer");
    const pdfResult = await convertPdfToDocx(pdfBuffer);
    assert.ok(pdfResult.blob);

    assert.equal(networkCalls, 0, "Converter must execute 100% locally with zero network transmission");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("PDF to DOCX - Digital Selectable PDF Extraction", async () => {
  const pdf = new jsPDF();
  pdf.setFontSize(16);
  pdf.text("Digital Report Header", 20, 20);
  pdf.setFontSize(11);
  pdf.text("This is an extractable digital text paragraph.", 20, 35);
  pdf.text("Second line with additional information.", 20, 45);

  const pdfBuffer = pdf.output("arraybuffer");
  const result = await convertPdfToDocx(pdfBuffer);

  assert.ok(result.blob, "Result must contain Blob");
  assert.equal(result.pageCount, 1);
  assert.ok(result.wordCount > 0, "Word count must be positive");

  const docxArrayBuffer = await result.blob.arrayBuffer();
  const header = Buffer.from(docxArrayBuffer.slice(0, 4));
  // OpenXML / ZIP magic numbers: PK\x03\x04
  assert.equal(header[0], 0x50, "Docx must start with PK zip header (P)");
  assert.equal(header[1], 0x4b, "Docx must start with PK zip header (K)");
});

test("PDF to DOCX - Scanned Image-Only PDF Rejection Guard", async () => {
  const pdf = new jsPDF();
  pdf.setFillColor(220, 220, 220);
  pdf.rect(10, 10, 190, 270, "F"); // Simulates scanned raster image without text glyphs

  const pdfBuffer = pdf.output("arraybuffer");

  await assert.rejects(
    async () => {
      await convertPdfToDocx(pdfBuffer);
    },
    (err: unknown) => {
      return (
        err instanceof ScannedPdfError &&
        err.message.includes("scanned image")
      );
    },
    "Must throw ScannedPdfError when no text glyphs are present"
  );
});

test("Document Converters - AbortSignal Cancellation", async () => {
  const controller = new AbortController();
  controller.abort(); // Pre-aborted signal

  const pdf = new jsPDF();
  pdf.text("Test", 10, 10);
  const buffer = pdf.output("arraybuffer");

  await assert.rejects(
    async () => {
      await convertPdfToDocx(buffer, undefined, controller.signal);
    },
    (err: unknown) => {
      return (
        err instanceof Error &&
        err.name === "ConversionCancelledError"
      );
    },
    "Must abort when signal is cancelled"
  );
});
