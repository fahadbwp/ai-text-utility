"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Upload,
  Download,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  X,
  FileCode,
  ArrowRight,
  RefreshCw,
  StopCircle,
} from "lucide-react";

export type ConverterMode = "pdf-to-word" | "word-to-pdf";

interface DocumentConverterToolProps {
  mode: ConverterMode;
}

interface ConversionState {
  status: "idle" | "selected" | "converting" | "success" | "error";
  file: File | null;
  progressPercent: number;
  progressStage: string;
  currentPage?: number;
  totalPages?: number;
  error: string | null;
  resultBlob: Blob | null;
  resultFileName: string;
  resultMetrics?: {
    pageCount: number;
    wordCount: number;
    charCount: number;
    sizeFormatted: string;
  };
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

export const DocumentConverterTool: React.FC<DocumentConverterToolProps> = ({ mode }) => {
  const isPdfToWord = mode === "pdf-to-word";
  const expectedExt = isPdfToWord ? ".pdf" : ".docx";
  const expectedMime = isPdfToWord
    ? "application/pdf"
    : ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const [state, setState] = useState<ConversionState>({
    status: "idle",
    file: null,
    progressPercent: 0,
    progressStage: "",
    error: null,
    resultBlob: null,
    resultFileName: "",
  });

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleFile = (file: File) => {
    const isPdf = file.name.toLowerCase().endsWith(".pdf");
    const isDocx = file.name.toLowerCase().endsWith(".docx");

    if (isPdfToWord && !isPdf) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Invalid file type. Please upload a standard PDF file (.pdf).",
      }));
      return;
    }

    if (!isPdfToWord && !isDocx) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: "Invalid file type. Please upload a standard Microsoft Word document (.docx).",
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setState((prev) => ({
        ...prev,
        status: "error",
        error: `File size exceeds the 25 MB browser limit (${formatBytes(file.size)}).`,
      }));
      return;
    }

    setState({
      status: "selected",
      file,
      progressPercent: 0,
      progressStage: "",
      error: null,
      resultBlob: null,
      resultFileName: "",
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleConvert = async () => {
    if (!state.file) return;

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setState((prev) => ({
      ...prev,
      status: "converting",
      progressPercent: 5,
      progressStage: "Initializing browser conversion engine...",
      error: null,
    }));

    try {
      if (isPdfToWord) {
        // Dynamic import to lazy-load engine
        const { convertPdfToDocx, ScannedPdfError, ConversionCancelledError } = await import(
          "@/lib/converter/pdfToDocx"
        );

        const result = await convertPdfToDocx(
          state.file,
          (prog) => {
            setState((prev) => ({
              ...prev,
              progressPercent: prog.percent,
              progressStage: prog.stage,
              currentPage: prog.currentPage,
              totalPages: prog.totalPages,
            }));
          },
          signal
        );

        const outputName = state.file.name.replace(/\.[^/.]+$/, "") + ".docx";

        setState({
          status: "success",
          file: state.file,
          progressPercent: 100,
          progressStage: "Complete!",
          error: null,
          resultBlob: result.blob,
          resultFileName: outputName,
          resultMetrics: {
            pageCount: result.pageCount,
            wordCount: result.wordCount,
            charCount: result.charCount,
            sizeFormatted: formatBytes(result.blob.size),
          },
        });
      } else {
        const { convertDocxToPdf, ConversionCancelledError } = await import(
          "@/lib/converter/docxToPdf"
        );

        const result = await convertDocxToPdf(
          state.file,
          (prog) => {
            setState((prev) => ({
              ...prev,
              progressPercent: prog.percent,
              progressStage: prog.stage,
              currentPage: prog.currentPage,
              totalPages: prog.totalPages,
            }));
          },
          signal
        );

        const outputName = state.file.name.replace(/\.[^/.]+$/, "") + ".pdf";

        setState({
          status: "success",
          file: state.file,
          progressPercent: 100,
          progressStage: "Complete!",
          error: null,
          resultBlob: result.blob,
          resultFileName: outputName,
          resultMetrics: {
            pageCount: result.pageCount,
            wordCount: result.wordCount,
            charCount: result.charCount,
            sizeFormatted: formatBytes(result.blob.size),
          },
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "ConversionCancelledError") {
        setState((prev) => ({
          ...prev,
          status: "selected",
          progressPercent: 0,
          progressStage: "",
          error: "Conversion was cancelled.",
        }));
        return;
      }

      if (err instanceof Error && err.name === "ScannedPdfError") {
        setState((prev) => ({
          ...prev,
          status: "error",
          error:
            "Scanned document detected: This PDF contains image-only pages without selectable text. In-browser conversion requires a digital text layer without server-side OCR.",
        }));
        return;
      }

      const msg = err instanceof Error ? err.message : "An unexpected conversion error occurred.";
      setState((prev) => ({
        ...prev,
        status: "error",
        error: `Conversion failed: ${msg}`,
      }));
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleDownload = () => {
    if (!state.resultBlob) return;
    const url = URL.createObjectURL(state.resultBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = state.resultFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setState({
      status: "idle",
      file: null,
      progressPercent: 0,
      progressStage: "",
      error: null,
      resultBlob: null,
      resultFileName: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Mode Switcher Nav */}
      <div className="flex items-center justify-center p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 max-w-md mx-auto">
        <Link
          href="/tools/pdf-to-word"
          className={`flex-1 py-2 px-4 text-center rounded-lg text-sm font-semibold transition-all ${
            isPdfToWord
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          PDF to Word (.docx)
        </Link>
        <Link
          href="/tools/word-to-pdf"
          className={`flex-1 py-2 px-4 text-center rounded-lg text-sm font-semibold transition-all ${
            !isPdfToWord
              ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
          }`}
        >
          Word (.docx) to PDF
        </Link>
      </div>

      {/* Main Glass Workspace Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <input
          type="file"
          ref={fileInputRef}
          accept={expectedMime}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {/* State: Idle / Dropzone */}
        {state.status === "idle" && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
              isDragging
                ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[0.99]"
                : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50/50 dark:bg-slate-800/30"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-sm">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
              {isPdfToWord
                ? "Drop your PDF file here, or click to browse"
                : "Drop your Word document (.docx) here, or click to browse"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4 max-w-md">
              Files up to 25 MB supported • 100% in-browser client conversion • Never uploaded to any server
            </p>
            <button
              type="button"
              className="py-2.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
            >
              Select {isPdfToWord ? "PDF" : "Word"} File
            </button>
          </div>
        )}

        {/* State: Selected File / Ready to Convert */}
        {(state.status === "selected" || state.status === "converting") && state.file && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 font-bold text-xs uppercase">
                  {isPdfToWord ? "PDF" : "DOCX"}
                </div>
                <div className="truncate">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {state.file.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {formatBytes(state.file.size)}
                  </div>
                </div>
              </div>

              {state.status !== "converting" && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {state.status === "converting" ? (
              <div className="space-y-3 p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/50">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-600 dark:text-indigo-400" />
                    {state.progressStage}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {state.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${state.progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                  >
                    <StopCircle className="w-3.5 h-3.5" /> Cancel Conversion
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleConvert}
                className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Convert to {isPdfToWord ? "Word (.docx)" : "PDF"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* State: Success Output */}
        {state.status === "success" && state.resultMetrics && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                Conversion Successful!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your converted document is ready for download.
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
              <div className="p-2">
                <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {state.resultMetrics.pageCount}
                </div>
                <div className="text-[11px] font-semibold uppercase text-slate-400">Pages</div>
              </div>
              <div className="p-2">
                <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {state.resultMetrics.wordCount}
                </div>
                <div className="text-[11px] font-semibold uppercase text-slate-400">Words</div>
              </div>
              <div className="p-2">
                <div className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {state.resultMetrics.sizeFormatted}
                </div>
                <div className="text-[11px] font-semibold uppercase text-slate-400">Size</div>
              </div>
            </div>

            {/* Download CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="w-full sm:w-auto py-3 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download {state.resultFileName}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-all"
              >
                Convert Another Document
              </button>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {state.error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="text-sm text-rose-800 dark:text-rose-200 flex-1">
              {state.error}
            </div>
            {state.status === "error" && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold text-rose-700 dark:text-rose-300 underline hover:no-underline"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Honest Scope & Technical Limitations Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200/90 leading-relaxed space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Honest Document Conversion Disclaimer:</span>
        </div>
        {isPdfToWord ? (
          <p>
            This tool converts <strong>selectable digital PDFs</strong> into editable Microsoft Word (.docx) documents directly in your browser. While headings, paragraphs, and text order are carefully extracted, complex multi-column magazine layouts, tables, and custom fonts may require minor reformatting. <strong>Scanned image-only PDFs are rejected</strong> because client-side conversion requires embedded digital text.
          </p>
        ) : (
          <p>
            This tool converts Microsoft Word (.docx) text, headings, lists, tables, and page breaks into a standard PDF. Advanced Word vector shapes (SmartArt, WordArt), embedded Excel charts, macros (.docm), and password-encrypted documents are not supported by in-browser renderers.
          </p>
        )}
      </div>

      {/* 100% Client-Side Privacy Guarantee */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            100% Client-Side Privacy Guarantee
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            Your document is never uploaded to any remote server, cloud API, or third-party service. All file reading, styling extraction, and document generation occur exclusively inside your web browser’s memory.
          </p>
        </div>
      </div>
    </div>
  );
};
