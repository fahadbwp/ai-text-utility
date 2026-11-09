"use client";

import React, { useState, useRef } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolShell } from "@/components/layouts/ToolShell";
import { PDFDocument } from "pdf-lib";
import {
  Upload,
  Download,
  FileText,
  FileCheck,
  ArrowUp,
  ArrowDown,
  Trash2,
  RefreshCw,
  Scissors,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface PdfMergerToolProps {
  tool: ToolDefinition;
}

interface UploadedPdf {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  arrayBuffer: ArrayBuffer;
}

export const PdfMergerTool: React.FC<PdfMergerToolProps> = ({ tool }) => {
  const [mode, setMode] = useState<"merge" | "split">("merge");

  // Merge state
  const [pdfList, setPdfList] = useState<UploadedPdf[]>([]);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [isMerging, setIsMerging] = useState<boolean>(false);

  // Split state
  const [splitPdf, setSplitPdf] = useState<UploadedPdf | null>(null);
  const [pageRange, setPageRange] = useState<string>("1-2");
  const [splitBlob, setSplitBlob] = useState<Blob | null>(null);
  const [isSplitting, setIsSplitting] = useState<boolean>(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const splitInputRef = useRef<HTMLInputElement>(null);

  const handleMergeFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setErrorMessage(null);
    const files = Array.from(e.target.files).filter((f) => f.type === "application/pdf" || f.name.endsWith(".pdf"));

    const newItems: UploadedPdf[] = [];
    for (const f of files) {
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer);
        newItems.push({
          id: Math.random().toString(36).substring(2, 9),
          file: f,
          name: f.name,
          size: f.size,
          pageCount: doc.getPageCount(),
          arrayBuffer: buffer,
        });
      } catch (err) {
        console.error("Failed to parse PDF:", f.name, err);
        setErrorMessage(`Could not read ${f.name}. File might be password-protected.`);
      }
    }

    setPdfList((prev) => [...prev, ...newItems]);
    setMergedBlob(null);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPdfList((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedBlob(null);
  };

  const moveDown = (index: number) => {
    if (index >= pdfList.length - 1) return;
    setPdfList((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedBlob(null);
  };

  const removeFile = (id: string) => {
    setPdfList((prev) => prev.filter((p) => p.id !== id));
    setMergedBlob(null);
  };

  const executeMerge = async () => {
    if (pdfList.length < 2) {
      setErrorMessage("Please upload at least 2 PDF documents to merge.");
      return;
    }

    setIsMerging(true);
    setErrorMessage(null);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfList) {
        const srcDoc = await PDFDocument.load(item.arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      setMergedBlob(blob);
    } catch (err) {
      console.error("Merge error:", err);
      setErrorMessage("An error occurred while merging your PDF files.");
    } finally {
      setIsMerging(false);
    }
  };

  const handleSplitFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    setErrorMessage(null);
    const f = e.target.files[0];
    try {
      const buffer = await f.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const count = doc.getPageCount();
      setSplitPdf({
        id: "split-doc",
        file: f,
        name: f.name,
        size: f.size,
        pageCount: count,
        arrayBuffer: buffer,
      });
      setPageRange(count > 1 ? `1-${Math.min(count, 3)}` : "1");
      setSplitBlob(null);
    } catch (err) {
      console.error("Failed to load PDF for split:", err);
      setErrorMessage("Could not load PDF file. It might be password-protected.");
    }
  };

  const executeSplit = async () => {
    if (!splitPdf) return;
    setIsSplitting(true);
    setErrorMessage(null);

    try {
      const srcDoc = await PDFDocument.load(splitPdf.arrayBuffer);
      const totalPages = srcDoc.getPageCount();

      // Parse range e.g. "1-3, 5, 8-10"
      const pagesToExtract = new Set<number>();
      const parts = pageRange.split(",").map((s) => s.trim()).filter(Boolean);

      for (const part of parts) {
        if (part.includes("-")) {
          const [startStr, endStr] = part.split("-").map((s) => s.trim());
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
              if (i >= 1 && i <= totalPages) pagesToExtract.add(i - 1);
            }
          }
        } else {
          const p = parseInt(part, 10);
          if (!isNaN(p) && p >= 1 && p <= totalPages) {
            pagesToExtract.add(p - 1);
          }
        }
      }

      if (pagesToExtract.size === 0) {
        setErrorMessage(`Invalid page range. Please specify pages between 1 and ${totalPages}.`);
        setIsSplitting(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      const sortedIndices = Array.from(pagesToExtract).sort((a, b) => a - b);
      const copiedPages = await newPdf.copyPages(srcDoc, sortedIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes as Uint8Array<ArrayBuffer>], { type: "application/pdf" });
      setSplitBlob(blob);
    } catch (err) {
      console.error("Split error:", err);
      setErrorMessage("Could not extract selected pages from this PDF.");
    } finally {
      setIsSplitting(false);
    }
  };

  const downloadFile = (blob: Blob, defaultFilename: string) => {
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = defaultFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const totalPagesInMerge = pdfList.reduce((acc, p) => acc + p.pageCount, 0);

  return (
    <ToolShell tool={tool}>
      <div className="w-full space-y-6">
        {/* Top Mode Toggle */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Document Processing Mode
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              100% Client-side in-browser PDF manipulation. Choose operation mode:
            </p>
          </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMode("merge")}
            aria-label="Merge PDF Files Mode"
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              mode === "merge"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Merge PDFs</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("split")}
            aria-label="Split PDF Pages Mode"
            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              mode === "split"
                ? "bg-rose-600 text-white shadow-xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Split / Extract</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {/* MERGE MODE WORKSPACE */}
      {mode === "merge" && (
        <div className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf"
            className="hidden"
            aria-label="Upload PDF files to merge"
            onChange={handleMergeFilesUpload}
          />

          {pdfList.length === 0 ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl cursor-pointer hover:border-rose-400 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-xs">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-zinc-100 text-center">
                Click to select 2 or more PDF documents
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 text-center">
                Combine contracts, forms, and pages in any order. 100% private in-browser compute.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                    {pdfList.length} Files Selected
                  </span>
                  <span className="text-xs text-slate-500 dark:text-zinc-400">
                    ({totalPagesInMerge} Total Pages)
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Add more PDF documents"
                    className="px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
                  >
                    + Add More PDFs
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isMerging}
                    onClick={executeMerge}
                    aria-label="Merge uploaded PDF files"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isMerging ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Merging...</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5" />
                        <span>Merge All PDFs</span>
                      </>
                    )}
                  </button>

                  {mergedBlob && (
                    <button
                      type="button"
                      onClick={() => downloadFile(mergedBlob, "merged-document.pdf")}
                      aria-label="Download merged PDF document"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Merged PDF</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Uploaded File List with re-order */}
              <div className="space-y-2">
                {pdfList.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100 truncate">
                          {idx + 1}. {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                          {item.pageCount} pages • {(item.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-4">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        aria-label={`Move ${item.name} up`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === pdfList.length - 1}
                        aria-label={`Move ${item.name} down`}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SPLIT MODE WORKSPACE */}
      {mode === "split" && (
        <div className="space-y-6">
          <input
            ref={splitInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            aria-label="Upload PDF file to split"
            onChange={handleSplitFileUpload}
          />

          {!splitPdf ? (
            <div
              onClick={() => splitInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl cursor-pointer hover:border-rose-400 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4 shadow-xs">
                <Scissors className="w-8 h-8" />
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-zinc-100 text-center">
                Select a PDF Document to Split
              </p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 text-center">
                Extract individual pages or custom page ranges (e.g. 1-3, 5).
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">
                      {splitPdf.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      Total: {splitPdf.pageCount} pages • {(splitPdf.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setSplitPdf(null);
                    setSplitBlob(null);
                  }}
                  aria-label="Change PDF document to split"
                  className="px-3 py-1 text-xs font-medium rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <div className="space-y-2">
                <label htmlFor="split-page-range" className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
                  Page Range to Extract (1 to {splitPdf.pageCount}):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="split-page-range"
                    type="text"
                    value={pageRange}
                    aria-label="Pages to extract, for example 1-3, 5"
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3, 5"
                    className="flex-1 max-w-xs px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 font-mono"
                  />
                  <button
                    type="button"
                    disabled={isSplitting}
                    onClick={executeSplit}
                    aria-label="Extract pages from PDF"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSplitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Extracting...</span>
                      </>
                    ) : (
                      <>
                        <Scissors className="w-3.5 h-3.5" />
                        <span>Extract Pages</span>
                      </>
                    )}
                  </button>

                  {splitBlob && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadFile(
                          splitBlob,
                          `${splitPdf.name.replace(".pdf", "")}-extracted.pdf`
                        )
                      }
                      aria-label="Download extracted PDF pages"
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Extracted PDF</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                  Tip: Use hyphens for ranges (e.g. 1-5) and commas for discrete pages (e.g. 1, 3, 7).
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </ToolShell>
  );
};
