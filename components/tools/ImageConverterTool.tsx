"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolShell } from "@/components/layouts/ToolShell";
import {
  Upload,
  Download,
  RefreshCw,
  FileCheck2,
  CheckCircle2,
  ImageIcon,
} from "lucide-react";

interface ImageConverterToolProps {
  tool: ToolDefinition;
}

type SupportedFormat = "png" | "jpeg" | "webp" | "svg";

export const ImageConverterTool: React.FC<ImageConverterToolProps> = ({ tool }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [targetFormat, setTargetFormat] = useState<SupportedFormat>("webp");
  const [quality, setQuality] = useState<number>(90);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const convertImage = useCallback(
    async (imgFile: File, format: SupportedFormat, q: number) => {
      setIsProcessing(true);
      try {
        const objectUrl = URL.createObjectURL(imgFile);
        const img = new Image();
        img.src = objectUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context failed");

        // If target is JPEG, draw solid white background to prevent black transparent areas
        if (format === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(objectUrl);

        if (format === "svg") {
          // Render SVG image wrapper with base64 data
          const pngDataUrl = canvas.toDataURL("image/png");
          const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}"><image href="${pngDataUrl}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
          const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
          setConvertedBlob(blob);
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
        } else {
          const mime = `image/${format}`;
          const qualityFactor = format === "png" ? undefined : Math.max(0.1, q / 100);
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, mime, qualityFactor)
          );
          if (blob) {
            setConvertedBlob(blob);
            if (convertedUrl) URL.revokeObjectURL(convertedUrl);
            setConvertedUrl(URL.createObjectURL(blob));
          }
        }
      } catch (err) {
        console.error("Format conversion failed:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [convertedUrl]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (previewOriginal) URL.revokeObjectURL(previewOriginal);
      setPreviewOriginal(URL.createObjectURL(selected));
      convertImage(selected, targetFormat, quality);
    }
  };

  const handleFormatChange = (fmt: SupportedFormat) => {
    setTargetFormat(fmt);
    if (file) {
      convertImage(file, fmt, quality);
    }
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;
    const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const ext = targetFormat === "jpeg" ? "jpg" : targetFormat;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(convertedBlob);
    a.download = `${originalName}-converted.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolShell tool={tool}>
      <div className="w-full space-y-6">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Target Conversion Format
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Select output format below. 100% in-browser processing with zero server uploads.
            </p>
          </div>

          {/* Format Selector Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-zinc-800 self-start sm:self-auto">
          {(["webp", "png", "jpeg", "svg"] as SupportedFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => handleFormatChange(fmt)}
              aria-label={`Convert to ${fmt.toUpperCase()}`}
              className={`px-3 py-1 text-xs font-semibold rounded-md uppercase transition-colors cursor-pointer ${
                targetFormat === fmt
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
              }`}
            >
              {fmt === "jpeg" ? "JPG" : fmt}
            </button>
          ))}
        </div>
      </div>

      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              const selected = e.dataTransfer.files[0];
              if (selected.type.startsWith("image/")) {
                setFile(selected);
                if (previewOriginal) URL.revokeObjectURL(previewOriginal);
                setPreviewOriginal(URL.createObjectURL(selected));
                convertImage(selected, targetFormat, quality);
              }
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
              : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-400 dark:hover:border-zinc-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Upload image to convert"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-base font-semibold text-slate-900 dark:text-zinc-100 text-center">
            Upload Image to Convert Format
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 text-center">
            Supports PNG ↔ JPG ↔ WebP ↔ SVG. Processed locally in your browser with zero data leakage.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                Target Format: <span className="uppercase text-blue-600 font-bold">{targetFormat === "jpeg" ? "JPG" : targetFormat}</span>
              </span>
              {(targetFormat === "jpeg" || targetFormat === "webp") && (
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-xs text-slate-500 dark:text-zinc-400">Quality: {quality}%</span>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={quality}
                    aria-label="Target format quality slider"
                    onChange={(e) => {
                      const q = parseInt(e.target.value, 10);
                      setQuality(q);
                      if (file) convertImage(file, targetFormat, q);
                    }}
                    className="w-32 accent-blue-600 cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreviewOriginal(null);
                  setConvertedBlob(null);
                  setConvertedUrl(null);
                }}
                aria-label="Convert another image"
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                Change Image
              </button>
              <button
                type="button"
                disabled={!convertedBlob || isProcessing}
                onClick={handleDownload}
                aria-label="Download converted image"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download {targetFormat.toUpperCase()}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Original ({file.name.split(".").pop()?.toUpperCase()})
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <div className="w-full h-64 rounded-lg bg-slate-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-zinc-800/60">
                {previewOriginal && (
                  <img
                    src={previewOriginal}
                    alt="Original Upload"
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  Converted ({targetFormat.toUpperCase()})
                </span>
                <span className="text-xs text-blue-600 font-bold">
                  {convertedBlob ? `${(convertedBlob.size / 1024).toFixed(1)} KB` : ""}
                </span>
              </div>
              <div className="w-full h-64 rounded-lg bg-slate-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-zinc-800/60">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Converting...</span>
                  </div>
                ) : convertedUrl ? (
                  <img
                    src={convertedUrl}
                    alt="Converted Result Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </ToolShell>
  );
};
