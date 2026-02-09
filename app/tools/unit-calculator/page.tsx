"use client";

import { useState, useMemo } from "react";
import { ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { UNIT_CATEGORIES, UnitCategory } from "@/lib/conversions/unit-categories";
import { getUnitsForCategory, convert } from "@/lib/conversions/units";
import { cn } from "@/lib/utils";

export default function UnitCalculatorPage() {
  const [category, setCategory] = useState<UnitCategory>("Length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("ft");
  const [value, setValue] = useState("1");

  const units = useMemo(() => getUnitsForCategory(category), [category]);

  const unitOptions = useMemo(
    () => units.map((u) => ({ value: u.code, label: `${u.code} — ${u.name}` })),
    [units]
  );

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    const converted = convert(num, fromUnit, toUnit, category);
    // Smart formatting: use fixed for small numbers, exponential for very large/small
    if (Math.abs(converted) < 0.0001 && converted !== 0) {
      return converted.toExponential(6);
    }
    if (Math.abs(converted) > 1e12) {
      return converted.toExponential(6);
    }
    return converted.toLocaleString("en-US", { maximumFractionDigits: 8 });
  }, [value, fromUnit, toUnit, category]);

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const newUnits = getUnitsForCategory(cat);
    setFromUnit(newUnits[0]?.code || "");
    setToUnit(newUnits[1]?.code || newUnits[0]?.code || "");
    setValue("1");
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-50">Unit Calculator</h1>
        <p className="mt-2 text-gray-400">
          Convert between units of measurement
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {UNIT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-sm font-medium transition-colors",
              category === cat
                ? "bg-brand-500 text-white"
                : "bg-surface-800 text-gray-400 hover:text-gray-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div className="space-y-3">
            <Select
              label="From"
              options={unitOptions}
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
            />
            <Input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter value"
            />
          </div>

          <button
            onClick={swap}
            className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-gray-500 transition-colors hover:bg-surface-800 hover:text-gray-300 sm:mb-0"
          >
            <ArrowRightLeft size={18} />
          </button>

          <div className="space-y-3">
            <Select
              label="To"
              options={unitOptions}
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
            />
            <div className="flex h-10 items-center rounded-xl border border-surface-800 bg-surface-900 px-3">
              <span className="text-sm text-gray-100">
                {result || "—"}
              </span>
            </div>
          </div>
        </div>

        {value && result && (
          <p className="text-center text-sm text-gray-500">
            {value} {fromUnit} = {result} {toUnit}
          </p>
        )}
      </div>
    </div>
  );
}
