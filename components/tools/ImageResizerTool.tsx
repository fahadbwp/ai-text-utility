"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { ToolDefinition } from "@/data/toolsRegistry";
import { ToolShell } from "@/components/layouts/ToolShell";
import {
  Upload,
  Download,
  Crop,
  Lock,
  Unlock,
  RefreshCw,
  ImageIcon,
} from "lucide-react";

interface ImageResizerToolProps {
  tool: ToolDefinition;
}

export const ImageResizerTool: React.FC<ImageResizerToolProps> = ({ tool }) => {
  const [file, setFile] = useState<File | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [previewOriginal, setPreviewOriginal] = useState<string | null>(null);

  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);

  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderResized = useCallback(
    async (img: HTMLImageElement, targetW: number, targetH: number) => {
      if (targetW <= 0 || targetH <= 0) return;
      setIsProcessing(true);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const isPng = file?.type === "image/png";
        const outputMime = isPng ? "image/png" : "image/jpeg";
        if (!isPng) {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, targetW, targetH);
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, outputMime, 0.92)
        );
        if (blob) {
          setResizedBlob(blob);
          if (resizedUrl) URL.revokeObjectURL(resizedUrl);
          setResizedUrl(URL.createObjectURL(blob));
        }
      } catch (err) {
        console.error("Resize render failed:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [file, resizedUrl]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      const url = URL.createObjectURL(selected);
      setPreviewOriginal(url);

      const img = new Image();
      img.src = url;
      img.onload = () => {
        setImgElement(img);
        setOrigWidth(img.naturalWidth);
        setOrigHeight(img.naturalHeight);
        setWidth(img.naturalWidth);
        setHeight(img.naturalHeight);
        renderResized(img, img.naturalWidth, img.naturalHeight);
      };
    }
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    let newH = height;
    if (lockAspect && origWidth > 0) {
      newH = Math.round((val / origWidth) * origHeight);
      setHeight(newH);
    }
    if (imgElement) renderResized(imgElement, val, newH);
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    let newW = width;
    if (lockAspect && origHeight > 0) {
      newW = Math.round((val / origHeight) * origWidth);
      setWidth(newW);
    }
    if (imgElement) renderResized(imgElement, newW, val);
  };

  const handlePreset = (aspectW: number, aspectH: number, presetName: string) => {
    if (!imgElement || origWidth <= 0) return;
    setLockAspect(false);

    let targetW = origWidth;
    let targetH = Math.round((origWidth * aspectH) / aspectW);

    if (presetName === "passport") {
      targetW = 600;
      targetH = 600;
    } else if (presetName === "passport-rect") {
      targetW = 413;
      targetH = 531; // 35mm x 45mm at 300dpi
    }

    setWidth(targetW);
    setHeight(targetH);
    renderResized(imgElement, targetW, targetH);
  };

  const handleDownload = () => {
    if (!resizedBlob || !file) return;
    const isPng = file.type === "image/png";
    const originalName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
    const ext = isPng ? "png" : "jpg";
    const a = document.createElement("a");
    const url = URL.createObjectURL(resizedBlob);
    a.href = url;
    a.download = `${originalName}-resized.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <ToolShell tool={tool}>
      <div className="w-full space-y-6">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Crop className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Resize & Crop Dimensions
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Set target pixel dimensions or choose aspect ratio presets below.
            </p>
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
                const url = URL.createObjectURL(selected);
                setPreviewOriginal(url);
                const img = new Image();
                img.src = url;
                img.onload = () => {
                  setImgElement(img);
                  setOrigWidth(img.naturalWidth);
                  setOrigHeight(img.naturalHeight);
                  setWidth(img.naturalWidth);
                  setHeight(img.naturalHeight);
                  renderResized(img, img.naturalWidth, img.naturalHeight);
                };
              }
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            isDragging
              ? "border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20"
              : "border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-slate-400 dark:hover:border-zinc-600"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            aria-label="Upload image to resize"
            onChange={handleFileChange}
          />
          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-xs">
            <Upload className="w-8 h-8" />
          </div>
          <p className="text-base font-semibold text-slate-900 dark:text-zinc-100 text-center">
            Upload Image to Resize & Crop
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1.5 text-center">
            Set exact pixel width & height or pick instant presets for Instagram, YouTube, and Passports.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Dimension Controls & Aspect Presets */}
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Width & Height inputs */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="resize-width" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Width:
                  </label>
                  <input
                    id="resize-width"
                    type="number"
                    min="10"
                    max="10000"
                    value={width}
                    aria-label="Target image width in pixels"
                    onChange={(e) => handleWidthChange(parseInt(e.target.value, 10) || 10)}
                    className="w-24 px-2 py-1 text-xs rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                  />
                  <span className="text-xs text-slate-500 dark:text-zinc-400">px</span>
                </div>

                <button
                  type="button"
                  onClick={() => setLockAspect(!lockAspect)}
                  aria-label={lockAspect ? "Unlock aspect ratio" : "Lock aspect ratio"}
                  className={`p-1.5 rounded-lg border cursor-pointer transition-colors ${
                    lockAspect
                      ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-400"
                      : "border-slate-200 dark:border-zinc-700 text-slate-400"
                  }`}
                  title={lockAspect ? "Aspect Ratio Locked" : "Aspect Ratio Unlocked"}
                >
                  {lockAspect ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>

                <div className="flex items-center gap-1.5">
                  <label htmlFor="resize-height" className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Height:
                  </label>
                  <input
                    id="resize-height"
                    type="number"
                    min="10"
                    max="10000"
                    value={height}
                    aria-label="Target image height in pixels"
                    onChange={(e) => handleHeightChange(parseInt(e.target.value, 10) || 10)}
                    className="w-24 px-2 py-1 text-xs rounded border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                  />
                  <span className="text-xs text-slate-500 dark:text-zinc-400">px</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setImgElement(null);
                    setResizedBlob(null);
                    setResizedUrl(null);
                  }}
                  aria-label="Upload another image"
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 cursor-pointer"
                >
                  Change Image
                </button>
                <button
                  type="button"
                  disabled={!resizedBlob || isProcessing}
                  onClick={handleDownload}
                  aria-label="Download resized image"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>
              </div>
            </div>

            {/* Presets bar */}
            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">Presets:</span>
              <button
                type="button"
                onClick={() => handlePreset(1, 1, "square")}
                aria-label="1:1 Square Instagram preset"
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                1:1 Square (Instagram)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(16, 9, "landscape")}
                aria-label="16:9 Landscape YouTube preset"
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                16:9 Landscape (YouTube)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(4, 5, "portrait")}
                aria-label="4:5 Portrait Instagram preset"
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                4:5 Portrait (Feed)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(9, 16, "story")}
                aria-label="9:16 Vertical Story TikTok preset"
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                9:16 Story / TikTok
              </button>
              <button
                type="button"
                onClick={() => handlePreset(1, 1, "passport")}
                aria-label="2x2 inch Passport Photo preset"
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                Passport 2x2 in (600×600)
              </button>
              <button
                type="button"
                onClick={() => handlePreset(35, 45, "passport-rect")}
                aria-label="35x45 mm Passport Photo preset"
                className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 cursor-pointer"
              >
                Passport 35×45 mm
              </button>
            </div>
          </div>

          {/* Visual Side-by-Side Previews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                  Original Image
                </span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">
                  {origWidth} × {origHeight} px
                </span>
              </div>
              <div className="w-full h-72 rounded-lg bg-slate-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-zinc-800/60">
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
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  Resized Result
                </span>
                <span className="text-xs text-indigo-600 font-bold">
                  {width} × {height} px {resizedBlob ? `(${(resizedBlob.size / 1024).toFixed(1)} KB)` : ""}
                </span>
              </div>
              <div className="w-full h-72 rounded-lg bg-slate-50 dark:bg-zinc-950 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-zinc-800/60">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-7 h-7 text-indigo-500 animate-spin" />
                    <span className="text-xs text-slate-500 dark:text-zinc-400">Resizing...</span>
                  </div>
                ) : resizedUrl ? (
                  <img
                    src={resizedUrl}
                    alt="Resized Result Preview"
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
