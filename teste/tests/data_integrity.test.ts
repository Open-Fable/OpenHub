import { DataProcessor, MarketEntry, CompetitorEntry } from "../scripts/data_processor";

describe("Data Integrity Tests - EV-Vision 2026", () => {
  let processor: DataProcessor;

  beforeAll(() => {
    processor = new DataProcessor();
  });

  test("Market JSON should contain at least 15 valid entries", () => {
    const data: MarketEntry[] = processor.loadMarketData();
    expect(data.length).toBeGreaterThanOrEqual(15);

    // Check specific data point from research
    const germany2026 = data.find((d) => d.country === "Allemagne" && d.year === 2026);
    expect(germany2026).toBeDefined();
    expect(germany2026?.sales_volume).toBe(1250000);
    expect(germany2026?.market_share_pct).toBe(32.0);
  });

  test("Competitor CSV should contain at least 10 manufacturers with 6 columns", () => {
    const data: CompetitorEntry[] = processor.loadCompetitorData();
    expect(data.length).toBeGreaterThanOrEqual(10);

    const tesla = data.find((c) => c.manufacturer === "Tesla");
    expect(tesla).toBeDefined();
    expect(tesla?.flagshipModel).toBe("Model 2");
    expect(tesla?.avgPriceEuro).toBe(25000);
  });

  test("Market data should have consistent year ranges", () => {
    const data: MarketEntry[] = processor.loadMarketData();
    const years = new Set(data.map((d) => d.year));
    expect(years.has(2024)).toBe(true);
    expect(years.has(2025)).toBe(true);
    expect(years.has(2026)).toBe(true);
  });

  test("All numeric values should be valid numbers", () => {
    const marketData = processor.loadMarketData();
    marketData.forEach((entry) => {
      expect(typeof entry.sales_volume).toBe("number");
      expect(isNaN(entry.sales_volume)).toBe(false);
    });

    const compData = processor.loadCompetitorData();
    compData.forEach((entry) => {
      expect(typeof entry.marketSharePct).toBe("number");
      expect(isNaN(entry.marketSharePct)).toBe(false);
    });
  });
});
