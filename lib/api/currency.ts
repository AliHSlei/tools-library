export interface CurrencyRates {
  result: string;
  base_code: string;
  rates: Record<string, number>;
  time_last_update_utc: string;
  _stale?: boolean;
}

export async function fetchRates(base: string): Promise<CurrencyRates> {
  const res = await fetch(`/api/currency?base=${encodeURIComponent(base)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch exchange rates");
  }

  return res.json();
}
