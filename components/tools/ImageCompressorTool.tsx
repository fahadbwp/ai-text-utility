"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolShell } from "@/components/layouts/ToolShell";
import {
  Upload,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  FileImage,
  ArrowRight,
  Sliders,
} from "lucide-react";

interface ImageCompressorToolProps {
  tool: ToolDefinition;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export const ImageCompressorTool: React.FC<ImageCompressorToolProps> = ({ tool }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [compressedDimensions, setCompressedDimensions] = useState<{ width: number; height: number } | null>(null);

  const [mode, setMode] = useState<"target" | "quality">("target");
  const [targetKb, setTargetKb] = useState<number>(50);
  const [quality, setQuality] = useState<number>(80);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const TARGET_PRESETS = [20, 50, 100, 200];

  const processCompression = useCallback(
    async (
      imgFile: File,
      compressionMode: "target" | "quality",
      targetSizeKb: number,
      manualQuality: number
    ) => {
      setIsProcessing(true);
      try {
        const objectUrl = URL.createObjectURL(imgFile);
        const img = new Image();
        img.src = objectUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        URL.revokeObjectURL(objectUrl);

        let currentWidth = img.naturalWidth;
        let currentHeight = img.naturalHeight;
        setOriginalDimensions({ width: currentWidth, height: currentHeight });

        const canvas = document.createElement("canvas");
        canvas.width = currentWidth;
        canvas.height = currentHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not create canvas context");

        // Fill white background so transparent images don't convert with black background
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, currentWidth, currentHeight);
        ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

        const targetBytes = targetSizeKb * 1024;

        if (compressionMode === "quality") {
          const qFactor = Math.max(0.05, Math.min(1.0, manualQuality / 100));
          const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/jpeg", qFactor)
          );
          if (blob) {
            setCompressedBlob(blob);
            setCompressedDimensions({ width: currentWidth, height: currentHeight });
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            setCompressedUrl(URL.createObjectURL(blob));
          }
        } else {
          // Target Size Mode: Binary Search on quality + gradual dimension scaling if needed
          let bestBlob: Blob | null = null;
          let low = 0.05;
          let high = 0.98;
          let iterations = 0;

          // Attempt quality binary search on current dimensions
          while (iterations < 7) {
            iterations++;
            const mid = (low + high) / 2;
            const testBlob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, "image/jpeg", mid)
            );
            if (!testBlob) break;

            if (testBlob.size <= targetBytes) {
              bestBlob = testBlob;
              low = mid; // try for higher quality while staying under target
            } else {
              high = mid; // too large, reduce quality
            }
          }

          // If still over target, scale down canvas dimensions until under target
          let scale = 0.9;
          while ((!bestBlob || bestBlob.size > targetBytes) && scale >= 0.2) {
            currentWidth = Math.round(img.naturalWidth * scale);
            currentHeight = Math.round(img.naturalHeight * scale);
            canvas.width = currentWidth;
            canvas.height = currentHeight;
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, currentWidth, currentHeight);
            ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

            const testBlob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, "image/jpeg", 0.6)
            );
            if (testBlob && testBlob.size <= targetBytes) {
              bestBlob = testBlob;
              break;
            }
            scale -= 0.15;
          }

          // Fallback if extreme constraint
          if (!bestBlob) {
            bestBlob = await new Promise<Blob | null>((resolve) =>
              canvas.toBlob(resolve, "image/jpeg", 0.1)
            );
          }

          if (bestBlob) {
            setCompressedBlob(bestBlob);
            setCompressedDimensions({ width: currentWidth, height: currentHeight });
            if (compressedUrl) URL.revokeObjectURL(compressedUrl);
            setCompressedUrl(URL.createObjectURL(bestBlob));
          }
        }
      } catch (err) {
        console.error("Compression failed:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [compressedUrl]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const originalUrl = URL.createObjectURL(selected);
      setPreviewOriginal(originalUrl);
      processCompression(selected, mode, targetKb, quality);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type.startsWith("image/")) {
        setFile(selected);
        const originalUrl = URL.createObjectURL(selected);
        setPreviewOriginal(originalUrl);
        processCompression(selected, mode, targetKb, quality);
      }
    }
  };

  const handleTargetPreset = (kb: number) => {
    setMode("target");
    setTargetKb(kb);
    if (file) {
      processCompression(file, "target", kb, quality);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file && mode === "quality") {
      processCompression(file, "quality", targetKb, newQ);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !file) return;
    const a = document.createElement("a");
    const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const url = URL.createObjectURL(compressedBlob);
    a.href = url;
    a.download = `${originalName}-compressed.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const savingsPercent =
    file && compressedBlob && file.size > 0
      ? Math.max(0, Math.round(((file.size - compressedBlob.size) / file.size) * 100))
      : 0;

  return (
    <ToolShell tool={tool}>
      <div className="w-full space-y-6">
        {/* Tool Settings Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <FileImage className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Compression Mode Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              100% Client-side processing. Select target KB size or adjust quality slider.
            </p>
          </div>

        {/* Compression Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-zinc-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setMode("target");
              if (file) processCompression(file, "target", targetKb, quality);
            }}
            aria-label="Target Size Mode"
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mode === "target"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            }`}
          >
            Target KB Preset
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("quality");
              if (file) processCompression(file, "quality", targetKb, quality);
            }}
            aria-label="Quality Slider Mode"
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mode === "quality"
                ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 shadow-xs"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
            }`}
          >
            Quality Slider
          </button>
        </div>
      </div>

      {/* Main Upload / Settings Container */}
      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
              : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-400 dark:hover:border-zinc-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            aria-label="Upload image to compress"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-base font-semibold text-slate-900 dark:text-zinc-100 text-center">
            Click to upload or drag & drop image here
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 text-center">
            Supports JPG, PNG, and WebP (Up to 50MB). Processed 100% locally in your browser.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              ⚡ Under 20 KB
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              🎯 Under 50 KB
            </span>
            <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
              📦 Under 100 KB
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {mode === "target" ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 mr-1">
                  Target Size Presets:
                </span>
                {TARGET_PRESETS.map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => handleTargetPreset(kb)}
                    aria-label={`Compress image to under ${kb} kilobytes`}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      targetKb === kb
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    Under {kb} KB
                  </button>
                ))}
                <div className="flex items-center gap-1.5 ml-2">
                  <input
                    type="number"
                    min="5"
                    max="5000"
                    value={targetKb}
                    aria-label="Custom target size in kilobytes"
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val > 0) {
                        setTargetKb(val);
                        if (file) processCompression(file, "target", val, quality);
                      }
                    }}
                    className="w-20 px-2 py-1 text-xs rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                  />
                  <span className="text-xs text-slate-500 dark:text-zinc-400">KB</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 whitespace-nowrap">
                  Quality: {quality}%
                </span>
                <input
                  type="range"
                  min="5"
                  max="95"
                  value={quality}
                  aria-label="Image compression quality slider"
                  onChange={(e) => handleQualityChange(parseInt(e.target.value, 10))}
                  className="w-48 accent-emerald-600 cursor-pointer"
                />
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setPreviewOriginal(null);
                  setCompressedBlob(null);
                  setCompressedUrl(null);
                }}
                aria-label="Upload a different image"
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                Change Image
              </button>
              <button
                type="button"
                disabled={!compressedBlob || isProcessing}
                onClick={handleDownload}
                aria-label="Download compressed image"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Result</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Original Size</p>
              <p className="text-base font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                {file ? formatBytes(file.size) : "-"}
              </p>
              {originalDimensions && (
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                  {originalDimensions.width} × {originalDimensions.height} px
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Compressed Size</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1.5">
                {isProcessing ? (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Optimizing...
                  </span>
                ) : compressedBlob ? (
                  formatBytes(compressedBlob.size)
                ) : (
                  "-"
                )}
              </p>
              {compressedDimensions && !isProcessing && (
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
                  {compressedDimensions.width} × {compressedDimensions.height} px
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Total Savings</p>
              <p className="text-base font-bold text-slate-900 dark:text-zinc-100 mt-0.5">
                {isProcessing ? "-" : `${savingsPercent}% Reduced`}
              </p>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                {savingsPercent > 0 ? "Fast page loading" : "Optimal quality"}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
              <p className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Privacy Status</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% In-Browser
              </p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">0 KB transmitted</p>
            </div>
          </div>

          {/* Visual Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Preview */}
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Original Image
                </span>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  {file ? formatBytes(file.size) : ""}
                </span>
              </div>
              <div className="w-full h-64 rounded-lg bg-slate-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-zinc-800/60">
                {previewOriginal ? (
                  <img
                    src={previewOriginal}
                    alt="Original Uploaded Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="w-8 h-8 text-slate-300" />
                )}
              </div>
            </div>

            {/* Compressed Preview */}
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  Compressed Result
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  {compressedBlob ? formatBytes(compressedBlob.size) : ""}
                </span>
              </div>
              <div className="w-full h-64 rounded-lg bg-slate-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-zinc-800/60 relative">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-7 h-7 text-emerald-500 animate-spin" />
                    <span className="text-xs text-slate-500 dark:text-zinc-400">
                      Compressing image locally...
                    </span>
                  </div>
                ) : compressedUrl ? (
                  <img
                    src={compressedUrl}
                    alt="Compressed Output Preview"
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
