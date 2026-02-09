export const UNIT_CATEGORIES = [
  "Length",
  "Weight",
  "Temperature",
  "Volume",
  "Area",
  "Speed",
  "Time",
  "Data",
] as const;

export type UnitCategory = (typeof UNIT_CATEGORIES)[number];
