/* =============================================
   data/japan-stats.js  –  Tokyo Neon Empire
   All seeded / curated Japan statistics
   (used as fallback AND to enrich live API data)
   ============================================= */

"use strict";

const JAPAN_DATA = {

  /* ── Population ── */
  population: {
    latest: 123_975_371,
    year: 2024,
    fallbackSeries: [
      { year: 2024, value: 123_975_371 },
      { year: 2023, value: 124_516_650 },
      { year: 2022, value: 125_124_989 },
      { year: 2021, value: 125_681_593 },
      { year: 2020, value: 126_226_568 },
      { year: 2019, value: 126_860_301 },
      { year: 2018, value: 127_185_332 },
      { year: 2017, value: 127_484_450 },
      { year: 2016, value: 127_748_513 },
      { year: 2015, value: 127_994_511 }
    ],
    source: "World Bank SP.POP.TOTL"
  },

  /* ── Tourism ── */
  tourism: {
    arrivals2024: 36_870_000,
    arrivals2023: 25_066_350,
    arrivals2022:  3_832_110,
    arrivals2019: 31_882_049,
    visitorSpend2024: 8_100_000_000_000,   // yen
    visitorSpend2023: 5_300_000_000_000,
    topSourceCountries: [
      { country: "South Korea", arrivals: 8_870_000, pct: 24.1 },
      { country: "China",       arrivals: 6_410_000, pct: 17.4 },
      { country: "Taiwan",      arrivals: 4_200_000, pct: 11.4 },
      { country: "USA",         arrivals: 2_330_000, pct:  6.3 },
      { country: "Hong Kong",   arrivals: 2_100_000, pct:  5.7 },
      { country: "Australia",   arrivals: 1_050_000, pct:  2.8 }
    ],
    source: "JNTO 2024 annual report"
  },

  /* ── Economy ── */
  economy: {
    gdpUSD: 4_213_000_000_000,   // USD, 2024 estimate
    gdpPerCapita: 34_017,
    gdpGrowth: 1.9,              // %
    inflation: 2.8,              // % 2024 CPI
    unemploymentRate: 2.6,       // % 2024
    tradeBalance: -5_100_000,    // million USD 2024
    currentAccount: 194_257,     // USD million 2024
    usdJpy: 160.14,
    topix: 3_727.21,
    nikkei: 40_074.0,
    source: "IMF, BoJ, e-Stat Apr 2026"
  },

  /* ── Retail & consumer ── */
  retail: {
    salesValueBillionYen: 13_217,      // Apr 2026 e-Stat
    yoyChange: 1.3,                     // %
    ecommerceShare: 10.2,               // % of total retail 2024
    householdSpend: 329_000,            // yen/month average 2024
    source: "e-Stat dashboard Apr 2026"
  },

  /* ── Travel & hospitality ── */
  hospitality: {
    guestNights: 54_414_700,       // Mar 2026 e-Stat
    hotelOccupancy: 72.4,          // % 2024
    avgRoomRate: 18_200,           // yen 2024
    airPassengers2024: 121_000_000,
    source: "e-Stat dashboard Mar 2026"
  },

  /* ── Technology ── */
  tech: {
    internetPenetration: 93.2,    // % 2024
    smartphoneUsage: 87.5,        // %
    itExports: 12_400,            // USD million 2024
    aiInvestment: 2_100,          // USD million 2024 (govt)
    source: "MIC Japan, IDC 2024"
  },

  /* ── Anime industry ── */
  anime: {
    marketSizeUSD: 25_900_000_000,  // 2023
    titles2024: 289,
    overseasRevenue: 1_500_000_000, // USD 2023
    streamingSubscribers: 40_000_000, // global, anime-focused platforms
    source: "Association of Japanese Animations 2024"
  },

  /* ── Energy ── */
  energy: {
    renewableShare: 22.4,          // % of generation 2024
    nuclearShare:  10.5,           // %
    co2PerCapita:   8.1,           // tonnes 2023
    source: "Agency for Natural Resources and Energy JP 2024"
  },

  /* ── Demographics ── */
  demographics: {
    medianAge: 49.1,
    over65Pct: 29.4,
    birthRate: 6.6,               // per 1000 2023
    lifeExpectancyF: 87.2,
    lifeExpectancyM: 81.3,
    source: "Statistics Bureau of Japan 2024"
  },

  /* ── Infrastructure ── */
  infrastructure: {
    shinkansen_km: 3_041,
    airports: 175,
    seaports: 994,
    highwayKm: 91_000,
    source: "MLIT Japan 2024"
  }
};

/* Ticker facts built from data above */
const TICKER_FACTS = [
  { badge: "JNTO",       text: `Japan welcomed ${JAPAN_DATA.tourism.arrivals2024.toLocaleString()} visitors in 2024 — a record high.` },
  { badge: "BoJ",        text: `USD/JPY rate stands at ¥${JAPAN_DATA.economy.usdJpy}. NIKKEI 225 closed at ${JAPAN_DATA.economy.nikkei.toLocaleString()}.` },
  { badge: "ANIME",      text: `Japan's anime industry is worth $${(JAPAN_DATA.anime.marketSizeUSD/1e9).toFixed(1)}B globally in 2023.` },
  { badge: "e-Stat",     text: `Retail sales value reached ¥${JAPAN_DATA.retail.salesValueBillionYen.toLocaleString()}B (Apr 2026).` },
  { badge: "World Bank", text: `Japan population is ${JAPAN_DATA.population.latest.toLocaleString()} people — declining ~500k/year.` },
  { badge: "MIC JP",     text: `93.2% of Japan is online. Smartphone usage: 87.5% of population.` },
  { badge: "JNTO",       text: `Visitor spending hit ¥${(JAPAN_DATA.tourism.visitorSpend2024/1e12).toFixed(1)} trillion in 2024.` },
  { badge: "e-Stat",     text: `${JAPAN_DATA.hospitality.guestNights.toLocaleString()} hotel guest-nights recorded in Japan (Mar 2026).` },
  { badge: "IMF",        text: `Japan GDP: $${(JAPAN_DATA.economy.gdpUSD/1e12).toFixed(2)} trillion. GDP per capita: $${JAPAN_DATA.economy.gdpPerCapita.toLocaleString()}.` },
  { badge: "Stats JPN",  text: `Median age in Japan: ${JAPAN_DATA.demographics.medianAge} years. Over-65 population: ${JAPAN_DATA.demographics.over65Pct}%.` },
  { badge: "MLIT",       text: `Japan Shinkansen network spans ${JAPAN_DATA.infrastructure.shinkansen_km.toLocaleString()} km across 175 airports.` },
  { badge: "ANRE JP",    text: `Renewable energy now supplies ${JAPAN_DATA.energy.renewableShare}% of Japan's electricity generation.` }
];

/* Live feed events (randomly shown in panel) */
const FEED_EVENTS = [
  { color: "pink",  text: "New visitor arrival logged at Narita International Airport." },
  { color: "blue",  text: "Retail transaction recorded in Shibuya shopping district." },
  { color: "gold",  text: "TOPIX index updated — markets open in Tokyo." },
  { color: "green", text: "Hotel guest-night tallied: domestic traveller, Kyoto Prefecture." },
  { color: "pink",  text: "Inbound tourist spending processed — avg ¥231,000 per trip." },
  { color: "blue",  text: "Shinkansen N700 departed Tokyo Station — seats 97% occupied." },
  { color: "gold",  text: "Anime streaming session started — title: Frieren Beyond Journey's End." },
  { color: "green", text: "Solar output up +3.8% this hour — renewable grid contribution rising." },
  { color: "pink",  text: "International flight landed at Haneda — 312 passengers." },
  { color: "blue",  text: "e-commerce purchase completed — electronics, Osaka." },
  { color: "gold",  text: "Yen exchange rate tick — USD/JPY moved 0.04 points." },
  { color: "green", text: "New J-pop release chart position updated — #1 streamed track." }
];
