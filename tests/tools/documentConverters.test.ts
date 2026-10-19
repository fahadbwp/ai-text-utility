import test from "node:test";
import assert from "node:assert/strict";
import sitemap from "../../app/sitemap.ts";
import { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, Packer } from "docx";
import { jsPDF } from "jspdf";
import { convertDocxToPdf, ConversionCancelledError } from "../../lib/converter/docxToPdf.ts";
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

test("DOCX to PDF - Normal Document with Headings and Paragraphs", async () => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: "Standard Article Title",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Introduction paragraph with " }),
              new TextRun({ text: "bold keyword", bold: true }),
              new TextRun({ text: " and regular text." }),
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
  assert.ok(result.wordCount > 5, "Word count must be calculated");

  const pdfArrayBuffer = await result.blob.arrayBuffer();
  const magic = Buffer.from(pdfArrayBuffer.slice(0, 5)).toString("ascii");
  assert.equal(magic, "%PDF-", "Generated blob must be a valid PDF");
});

test("DOCX to PDF - Multi-page Document with Tables", async () => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({ text: "Executive Summary", heading: HeadingLevel.HEADING_1 }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Metric" })] }),
                  new TableCell({ children: [new Paragraph({ text: "Value" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Revenue" })] }),
                  new TableCell({ children: [new Paragraph({ text: "$100,000" })] }),
                ],
              }),
            ],
          }),
          new Paragraph({
            text: "Page 2 Content after break",
            pageBreakBefore: true,
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const result = await convertDocxToPdf(buffer);

  assert.ok(result.blob);
  assert.ok(result.wordCount >= 7);
  assert.ok(result.pageCount >= 1);
});

test("PDF to DOCX - Digital Selectable PDF Extraction", async () => {
  // Create a genuine digital PDF with jsPDF
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
  // Create an image-only PDF without text glyphs
  const pdf = new jsPDF();
  pdf.setFillColor(220, 220, 220);
  pdf.rect(10, 10, 190, 270, "F"); // Simulates scanned raster image

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
