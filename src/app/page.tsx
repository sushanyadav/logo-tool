"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Dropzone } from "@/components/dropzone";
import { Preview } from "@/components/preview";

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [targetHeight, setTargetHeight] = useState(80);
  const [padding, setPadding] = useState(2);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const currentFile = useRef<File | null>(null);

  const processImage = useCallback(
    async (file: File, height: number, pad: number) => {
      setIsProcessing(true);
      setProcessedUrl(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("height", height.toString());
      formData.append("padding", pad.toString());

      try {
        const response = await fetch("/api/process", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Processing failed");

        const data = await response.json();
        setProcessedUrl(data.image);
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to process image");
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Store file for re-processing
      currentFile.current = file;

      // Create preview URL for original
      const url = URL.createObjectURL(file);
      setOriginalUrl(url);
      setFileName(file.name.replace(/\.[^/.]+$/, "") + "_cropped.png");

      // Process image
      await processImage(file, targetHeight, padding);
    },
    [targetHeight, padding, processImage]
  );

  // Re-process when settings change (with debounce)
  useEffect(() => {
    if (!currentFile.current) return;

    const timeout = setTimeout(() => {
      processImage(currentFile.current!, targetHeight, padding);
    }, 300);

    return () => clearTimeout(timeout);
  }, [targetHeight, padding, processImage]);

  const handleDownload = useCallback(() => {
    if (!processedUrl) return;

    const link = document.createElement("a");
    link.href = processedUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [processedUrl, fileName]);

  const handleReset = useCallback(() => {
    if (originalUrl) {
      URL.revokeObjectURL(originalUrl);
    }
    currentFile.current = null;
    setOriginalUrl(null);
    setProcessedUrl(null);
    setFileName("");
  }, [originalUrl]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Logo Tool</h1>
          <p className="text-gray-500">
            Crop whitespace and resize logos for case studies
          </p>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
          {/* Height Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Target Height
              </label>
              <span className="text-sm text-gray-500">{targetHeight}px</span>
            </div>
            <input
              type="range"
              min="60"
              max="100"
              value={targetHeight}
              onChange={(e) => setTargetHeight(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>60px</span>
              <span>100px</span>
            </div>
          </div>

          {/* Padding Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Padding
              </label>
              <span className="text-sm text-gray-500">{padding}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={padding}
              onChange={(e) => setPadding(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0px</span>
              <span>10px</span>
            </div>
          </div>
        </div>

        {/* Dropzone */}
        {!originalUrl && (
          <Dropzone onFileSelect={handleFileSelect} disabled={isProcessing} />
        )}

        {/* Preview */}
        <Preview
          originalUrl={originalUrl}
          processedUrl={processedUrl}
          onDownload={handleDownload}
          onReset={handleReset}
          isProcessing={isProcessing}
        />

        {/* Info */}
        <div className="text-center text-sm text-gray-400">
          <p>
            Tip: For best results, upload logos with transparent backgrounds
            (PNG)
          </p>
        </div>
      </div>
    </div>
  );
}
