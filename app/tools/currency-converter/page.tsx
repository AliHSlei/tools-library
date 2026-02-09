"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowRightLeft, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/toast";
import { fetchRates, CurrencyRates } from "@/lib/api/currency";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

const POPULAR_CURRENCIES = [
  "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY",
  "INR", "MXN", "BRL", "KRW", "SGD", "HKD", "NOK", "SEK",
  "TRY", "RUB", "ZAR", "AED", "SAR", "NZD", "THB", "PLN",
];

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState("1");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [rates, setRates] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const debouncedAmount = useDebounce(amount, 300);

  const loadRates = useCallback(
    async (base: string) => {
      setLoading(true);
      try {
        const data = await fetchRates(base);
        setRates(data);
        if (data._stale) {
          toast("info", "Showing cached rates — refresh failed");
        }
      } catch {
        toast("error", "Failed to load exchange rates");
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    loadRates(fromCurrency);
  }, [fromCurrency, loadRates]);

  const allCurrencies = useMemo(() => {
    if (!rates?.rates) return POPULAR_CURRENCIES;
    return Object.keys(rates.rates).sort();
  }, [rates]);

  const filteredCurrencies = useMemo(() => {
    if (!search) return allCurrencies;
    const q = search.toUpperCase();
    return allCurrencies.filter((c) => c.includes(q));
  }, [allCurrencies, search]);

  const result = useMemo(() => {
    if (!rates?.rates || !debouncedAmount) return null;
    const num = parseFloat(debouncedAmount);
    if (isNaN(num)) return null;
    const rate = rates.rates[toCurrency];
    if (!rate) return null;
    return (num * rate).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }, [debouncedAmount, rates, toCurrency]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const CurrencySelect = ({
    value,
    onChange,
    label,
  }: {
    value: string;
    onChange: (v: string) => void;
    label: string;
  }) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-surface-800 bg-surface-900 px-3 text-sm text-gray-100 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
      >
        {filteredCurrencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-50">Currency Converter</h1>
        <p className="mt-2 text-gray-400">
          Real-time currency exchange rates and conversion
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Search currencies"
          placeholder="Search by code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="space-y-3">
            <CurrencySelect
              label="From"
              value={fromCurrency}
              onChange={setFromCurrency}
            />
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <button
            onClick={swap}
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-surface-800 hover:text-gray-300"
          >
            <ArrowRightLeft size={18} />
          </button>

          <div className="space-y-3">
            <CurrencySelect
              label="To"
              value={toCurrency}
              onChange={setToCurrency}
            />
            <div className="flex h-10 items-center rounded-xl border border-surface-800 bg-surface-900 px-3">
              {loading ? (
                <LoadingSpinner size={16} />
              ) : (
                <span className="text-sm text-gray-100">
                  {result || "—"}
                </span>
              )}
            </div>
          </div>
        </div>

        {result && !loading && (
          <p className="text-center text-sm text-gray-500">
            {amount} {fromCurrency} = {result} {toCurrency}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>
            {rates?.time_last_update_utc
              ? `Last updated: ${rates.time_last_update_utc}`
              : ""}
          </span>
          <button
            onClick={() => loadRates(fromCurrency)}
            className={cn(
              "flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-300",
              loading && "animate-spin"
            )}
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
