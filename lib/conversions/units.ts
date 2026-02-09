import { UnitCategory } from "./unit-categories";

interface UnitDef {
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

interface CategoryDef {
  baseUnit: string;
  units: Record<string, UnitDef>;
}

const linear = (factor: number) => ({
  toBase: (v: number) => v * factor,
  fromBase: (v: number) => v / factor,
});

const CATEGORIES: Record<UnitCategory, CategoryDef> = {
  Length: {
    baseUnit: "m",
    units: {
      mm: { name: "Millimeter", ...linear(0.001) },
      cm: { name: "Centimeter", ...linear(0.01) },
      m: { name: "Meter", ...linear(1) },
      km: { name: "Kilometer", ...linear(1000) },
      in: { name: "Inch", ...linear(0.0254) },
      ft: { name: "Foot", ...linear(0.3048) },
      yd: { name: "Yard", ...linear(0.9144) },
      mi: { name: "Mile", ...linear(1609.344) },
    },
  },
  Weight: {
    baseUnit: "kg",
    units: {
      mg: { name: "Milligram", ...linear(0.000001) },
      g: { name: "Gram", ...linear(0.001) },
      kg: { name: "Kilogram", ...linear(1) },
      t: { name: "Metric Ton", ...linear(1000) },
      oz: { name: "Ounce", ...linear(0.0283495) },
      lb: { name: "Pound", ...linear(0.453592) },
      st: { name: "Stone", ...linear(6.35029) },
    },
  },
  Temperature: {
    baseUnit: "K",
    units: {
      C: {
        name: "Celsius",
        toBase: (v) => v + 273.15,
        fromBase: (v) => v - 273.15,
      },
      F: {
        name: "Fahrenheit",
        toBase: (v) => (v - 32) * (5 / 9) + 273.15,
        fromBase: (v) => (v - 273.15) * (9 / 5) + 32,
      },
      K: { name: "Kelvin", toBase: (v) => v, fromBase: (v) => v },
    },
  },
  Volume: {
    baseUnit: "L",
    units: {
      mL: { name: "Milliliter", ...linear(0.001) },
      L: { name: "Liter", ...linear(1) },
      gal: { name: "US Gallon", ...linear(3.78541) },
      qt: { name: "US Quart", ...linear(0.946353) },
      pt: { name: "US Pint", ...linear(0.473176) },
      cup: { name: "US Cup", ...linear(0.236588) },
      floz: { name: "US Fluid Ounce", ...linear(0.0295735) },
      m3: { name: "Cubic Meter", ...linear(1000) },
    },
  },
  Area: {
    baseUnit: "m2",
    units: {
      mm2: { name: "Square Millimeter", ...linear(0.000001) },
      cm2: { name: "Square Centimeter", ...linear(0.0001) },
      m2: { name: "Square Meter", ...linear(1) },
      km2: { name: "Square Kilometer", ...linear(1000000) },
      ha: { name: "Hectare", ...linear(10000) },
      in2: { name: "Square Inch", ...linear(0.00064516) },
      ft2: { name: "Square Foot", ...linear(0.092903) },
      ac: { name: "Acre", ...linear(4046.86) },
      mi2: { name: "Square Mile", ...linear(2589988.11) },
    },
  },
  Speed: {
    baseUnit: "m/s",
    units: {
      "m/s": { name: "Meters/Second", ...linear(1) },
      "km/h": { name: "Kilometers/Hour", ...linear(1 / 3.6) },
      mph: { name: "Miles/Hour", ...linear(0.44704) },
      kn: { name: "Knots", ...linear(0.514444) },
      "ft/s": { name: "Feet/Second", ...linear(0.3048) },
    },
  },
  Time: {
    baseUnit: "s",
    units: {
      ms: { name: "Millisecond", ...linear(0.001) },
      s: { name: "Second", ...linear(1) },
      min: { name: "Minute", ...linear(60) },
      h: { name: "Hour", ...linear(3600) },
      d: { name: "Day", ...linear(86400) },
      wk: { name: "Week", ...linear(604800) },
      mo: { name: "Month (30d)", ...linear(2592000) },
      yr: { name: "Year (365d)", ...linear(31536000) },
    },
  },
  Data: {
    baseUnit: "B",
    units: {
      B: { name: "Byte", ...linear(1) },
      KB: { name: "Kilobyte", ...linear(1024) },
      MB: { name: "Megabyte", ...linear(1048576) },
      GB: { name: "Gigabyte", ...linear(1073741824) },
      TB: { name: "Terabyte", ...linear(1099511627776) },
      bit: { name: "Bit", ...linear(0.125) },
      Kb: { name: "Kilobit", ...linear(128) },
      Mb: { name: "Megabit", ...linear(131072) },
      Gb: { name: "Gigabit", ...linear(134217728) },
    },
  },
};

export function getUnitsForCategory(
  category: UnitCategory
): { code: string; name: string }[] {
  const cat = CATEGORIES[category];
  return Object.entries(cat.units).map(([code, def]) => ({
    code,
    name: def.name,
  }));
}

export function convert(
  value: number,
  fromUnit: string,
  toUnit: string,
  category: UnitCategory
): number {
  const cat = CATEGORIES[category];
  const from = cat.units[fromUnit];
  const to = cat.units[toUnit];

  if (!from || !to) return 0;

  const baseValue = from.toBase(value);
  return to.fromBase(baseValue);
}
