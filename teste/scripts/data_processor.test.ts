import { DataProcessor, MarketEntry } from "./data_processor";
import * as fs from "fs";
import * as path from "path";

describe("DataProcessor", () => {
  const testDataDir = path.join(__dirname, "../data");
  const processor = new DataProcessor(testDataDir);

  test("should load market data correctly", async () => {
    const data = await processor.getMarketData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toHaveProperty("country");
    expect(typeof data[0].sales_volume).toBe("number");
  });

  test("should load competitors data correctly", async () => {
    const data = await processor.getCompetitorsData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(5);
    expect(data[0].manufacturer).toBe("Tesla");
    expect(data[0].marketSharePct).toBe(18.5);
  });

  test("should throw error for missing file", async () => {
    const invalidProcessor = new DataProcessor("non_existent_dir");
    await expect(invalidProcessor.getMarketData()).rejects.toThrow();
  });
});
