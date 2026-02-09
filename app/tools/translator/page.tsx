"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowRightLeft, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/toast";
import { useDebounce } from "@/hooks/use-debounce";
import { useClipboard } from "@/hooks/use-clipboard";
import {
  fetchLanguages,
  translateText,
  Language,
} from "@/lib/api/translate";

export default function TranslatorPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [source, setSource] = useState("auto");
  const [target, setTarget] = useState("es");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { copied, copy } = useClipboard();

  const debouncedInput = useDebounce(inputText, 500);

  useEffect(() => {
    fetchLanguages()
      .then(setLanguages)
      .catch(() => toast("error", "Failed to load languages"));
  }, [toast]);

  useEffect(() => {
    if (!debouncedInput.trim()) {
      setTranslatedText("");
      return;
    }

    let cancelled = false;

    async function doTranslate() {
      setLoading(true);
      try {
        const result = await translateText(debouncedInput, source, target);
        if (!cancelled) {
          setTranslatedText(result.translatedText);
        }
      } catch {
        if (!cancelled) {
          toast("error", "Translation failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    doTranslate();

    return () => {
      cancelled = true;
    };
  }, [debouncedInput, source, target, toast]);

  const swap = useCallback(() => {
    if (source === "auto") return;
    setSource(target);
    setTarget(source);
    setInputText(translatedText);
    setTranslatedText("");
  }, [source, target, translatedText]);

  const LanguageSelect = ({
    value,
    onChange,
    label,
    showAuto = false,
  }: {
    value: string;
    onChange: (v: string) => void;
    label: string;
    showAuto?: boolean;
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-surface-800 bg-surface-900 px-3 text-sm text-gray-100 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
      >
        {showAuto && <option value="auto">Auto Detect</option>}
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-50">Translator</h1>
        <p className="mt-2 text-gray-400">
          Translate text between multiple languages
        </p>
      </div>

      {/* Language Selectors */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <LanguageSelect
            label="From"
            value={source}
            onChange={setSource}
            showAuto
          />
        </div>
        <button
          onClick={swap}
          disabled={source === "auto"}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-surface-800 hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowRightLeft size={18} />
        </button>
        <div className="flex-1">
          <LanguageSelect label="To" value={target} onChange={setTarget} />
        </div>
      </div>

      {/* Text Areas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Textarea
            placeholder="Enter text to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
          />
          <p className="text-xs text-gray-600">
            {inputText.length} characters
          </p>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <Textarea
              placeholder="Translation will appear here..."
              value={translatedText}
              readOnly
              rows={8}
              className="pr-10"
            />
            {loading && (
              <div className="absolute right-3 top-3">
                <LoadingSpinner size={16} />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
              {translatedText.length} characters
            </p>
            {translatedText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copy(translatedText)}
              >
                {copied ? (
                  <Check size={14} className="text-green-400" />
                ) : (
                  <Copy size={14} />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
