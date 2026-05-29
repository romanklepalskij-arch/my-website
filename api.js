/* =============================================
   js/api.js  –  Tokyo Neon Empire
   World Bank API fetching + fallback handling
   ============================================= */

"use strict";

const API = (() => {
  const WB_BASE = "https://api.worldbank.org/v2/country/JPN/indicator";

  /* Fetch a World Bank indicator, return sorted array [{year, value}] */
  async function fetchIndicator(indicator, perPage = 20) {
    const url = `${WB_BASE}/${indicator}?format=json&per_page=${perPage}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`WB fetch failed: ${indicator}`);
    const payload = await res.json();
    return (payload?.[1] || [])
      .filter(row => row && row.value != null)
      .map(row => ({ year: +row.date, value: +row.value }))
      .sort((a, b) => b.year - a.year);
  }

  /*
    Fetch all indicators in parallel.
    Returns { population, tourism, airPassengers }
    Each is either an array [{year,value}] or null if the fetch failed.
  */
  async function fetchAll() {
    const [pop, tour, air] = await Promise.allSettled([
      fetchIndicator("SP.POP.TOTL", 15),   // Population
      fetchIndicator("ST.INT.ARVL",  15),   // International tourist arrivals
      fetchIndicator("IS.AIR.PSGR",  15)    // Air transport, passengers carried
    ]);

    return {
      population:   pop.status  === "fulfilled" ? pop.value  : null,
      tourism:      tour.status === "fulfilled" ? tour.value : null,
      airPassengers: air.status === "fulfilled" ? air.value : null
    };
  }

  /* Get the latest non-null entry from a series */
  function latest(series) {
    return series?.find(r => r.value != null) ?? null;
  }

  /* Format a large number with k / M / B / T suffix */
  function fmt(n) {
    if (n == null) return "—";
    if (n >= 1e12) return (n / 1e12).toFixed(2) + "T";
    if (n >= 1e9)  return (n / 1e9).toFixed(1)  + "B";
    if (n >= 1e6)  return (n / 1e6).toFixed(1)  + "M";
    if (n >= 1e3)  return (n / 1e3).toFixed(1)  + "k";
    return n.toLocaleString();
  }

  return { fetchAll, latest, fmt };
})();
