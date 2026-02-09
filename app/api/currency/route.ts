import { NextRequest } from "next/server";

let cache: { data: Record<string, unknown>; timestamp: number; base: string } | null = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const base = request.nextUrl.searchParams.get("base") || "USD";

    if (
      cache &&
      cache.base === base &&
      Date.now() - cache.timestamp < CACHE_TTL
    ) {
      return Response.json(cache.data);
    }

    const apiUrl = process.env.EXCHANGE_RATE_API_URL || "https://open.er-api.com/v6/latest";
    const res = await fetch(`${apiUrl}/${base}`);

    if (!res.ok) {
      throw new Error(`ExchangeRate API returned ${res.status}`);
    }

    const data = await res.json();
    cache = { data, timestamp: Date.now(), base };

    return Response.json(data);
  } catch (error) {
    console.error("[CURRENCY]", error);

    if (cache) {
      return Response.json({
        ...cache.data,
        _stale: true,
        _staleReason: "Failed to refresh rates",
      });
    }

    return Response.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}
