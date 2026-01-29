"use client";

import { useCallback } from "react";

type DropzoneProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
};

export function Dropzone({ onFileSelect, disabled }: DropzoneProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        onFileSelect(file);
      }
    },
    [onFileSelect, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        disabled
          ? "border-gray-200 bg-gray-50 cursor-not-allowed"
          : "border-gray-300 hover:border-gray-400 cursor-pointer"
      }`}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        id="file-input"
        disabled={disabled}
      />
      <label
        htmlFor="file-input"
        className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
      >
        <div className="space-y-2">
          <div className="text-4xl">📁</div>
          <p className="text-gray-600">
            {disabled ? "Processing..." : "Drop a logo here or click to upload"}
          </p>
          <p className="text-sm text-gray-400">PNG, JPG, SVG supported</p>
        </div>
      </label>
    </div>
  );
}
