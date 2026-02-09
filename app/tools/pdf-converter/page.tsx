"use client";

import { useState, useCallback } from "react";
import { Download, FileText, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/ui/file-dropzone";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/toast";
import { convertPdfToWord, convertWordToPdf } from "@/lib/api/pdf-convert";
import { cn } from "@/lib/utils";

type Mode = "pdf-to-word" | "word-to-pdf";

export default function PdfConverterPage() {
  const [mode, setMode] = useState<Mode>("pdf-to-word");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(
    null
  );
  const { toast } = useToast();

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const blob =
        mode === "pdf-to-word"
          ? await convertPdfToWord(file)
          : await convertWordToPdf(file);

      const ext = mode === "pdf-to-word" ? ".docx" : ".pdf";
      const name = file.name.replace(/\.[^.]+$/, ext);

      setResult({ blob, name });
      toast("success", "Conversion complete!");
    } catch (err) {
      toast(
        "error",
        err instanceof Error ? err.message : "Conversion failed"
      );
    } finally {
      setLoading(false);
    }
  }, [file, mode, toast]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = result.name;
    a.click();
    URL.revokeObjectURL(url);
  }, [result]);

  const switchMode = useCallback(() => {
    setMode((prev) =>
      prev === "pdf-to-word" ? "word-to-pdf" : "pdf-to-word"
    );
    setFile(null);
    setResult(null);
  }, []);

  const isPdf = mode === "pdf-to-word";

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-50">PDF Converter</h1>
        <p className="mt-2 text-gray-400">
          Convert between PDF and Word documents
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setMode("pdf-to-word");
            setFile(null);
            setResult(null);
          }}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
            isPdf
              ? "bg-brand-500 text-white"
              : "bg-surface-800 text-gray-400 hover:text-gray-200"
          )}
        >
          PDF to Word
        </button>
        <button
          onClick={switchMode}
          className="rounded-xl p-2 text-gray-500 hover:bg-surface-800 hover:text-gray-300"
        >
          <ArrowRightLeft size={16} />
        </button>
        <button
          onClick={() => {
            setMode("word-to-pdf");
            setFile(null);
            setResult(null);
          }}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
            !isPdf
              ? "bg-brand-500 text-white"
              : "bg-surface-800 text-gray-400 hover:text-gray-200"
          )}
        >
          Word to PDF
        </button>
      </div>

      {/* Upload */}
      <FileDropzone
        accept={isPdf ? ".pdf" : ".doc,.docx"}
        onFile={handleFile}
        label={`Drop your ${isPdf ? "PDF" : "Word"} file here or click to browse`}
      />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleConvert}
          disabled={!file}
          loading={loading}
          size="lg"
        >
          <FileText size={18} />
          Convert to {isPdf ? "Word" : "PDF"}
        </Button>

        {result && (
          <Button onClick={handleDownload} variant="secondary" size="lg">
            <Download size={18} />
            Download {result.name}
          </Button>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <LoadingSpinner size={20} />
          Converting your file...
        </div>
      )}
    </div>
  );
}
