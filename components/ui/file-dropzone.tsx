"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn, formatFileSize } from "@/lib/utils";

interface FileDropzoneProps {
  accept: string;
  maxSize?: number;
  onFile: (file: File) => void;
  label?: string;
}

export function FileDropzone({
  accept,
  maxSize = 10 * 1024 * 1024,
  onFile,
  label = "Drop your file here or click to browse",
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (f: File) => {
      setError(null);
      if (f.size > maxSize) {
        setError(`File too large. Maximum size is ${formatFileSize(maxSize)}.`);
        return;
      }
      setFile(f);
      onFile(f);
    },
    [maxSize, onFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const clear = useCallback(() => {
    setFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 transition-colors",
          dragging
            ? "border-brand-400 bg-brand-500/5"
            : "border-surface-800 hover:border-surface-700",
          file && "border-brand-500/30 bg-brand-500/5"
        )}
      >
        <Upload
          size={32}
          className={cn(
            "text-gray-500 transition-colors",
            dragging && "text-brand-400"
          )}
        />
        {file ? (
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span>
              {file.name} ({formatFileSize(file.size)})
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clear();
              }}
              className="rounded-lg p-1 text-gray-500 hover:bg-surface-800 hover:text-gray-300"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500">{label}</p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
