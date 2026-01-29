"use client";

type PreviewProps = {
  originalUrl: string | null;
  processedUrl: string | null;
  onDownload: () => void;
  onReset: () => void;
  isProcessing?: boolean;
};

export function Preview({
  originalUrl,
  processedUrl,
  onDownload,
  onReset,
  isProcessing,
}: PreviewProps) {
  if (!originalUrl) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Original */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Original</h3>
          <div className="border rounded-lg p-4 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] min-h-[120px] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalUrl}
              alt="Original logo"
              className="max-h-[100px] max-w-full object-contain"
            />
          </div>
        </div>

        {/* Processed */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-500">Processed</h3>
          <div className="border rounded-lg p-4 bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)] bg-[length:20px_20px] min-h-[120px] flex items-center justify-center relative">
            {processedUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={processedUrl}
                alt="Processed logo"
                className={`max-h-[100px] max-w-full object-contain transition-opacity ${isProcessing ? "opacity-30" : ""}`}
              />
            )}
            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-500 text-sm">Processing...</div>
              </div>
            )}
            {!processedUrl && !isProcessing && (
              <div className="text-gray-400">Waiting...</div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      {processedUrl && (
        <div className="flex gap-3 justify-center">
          <button
            onClick={onDownload}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Download PNG
          </button>
          <button
            onClick={onReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Process Another
          </button>
        </div>
      )}
    </div>
  );
}
