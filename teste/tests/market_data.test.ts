import * as fs from "fs";
import * as path from "path";

describe("Market Data Integrity", () => {
  const dataPath = path.resolve(__dirname, "../data/market_data_2026.json");
  const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  test("should have the correct total sales for 2026", () => {
    expect(data.market_forecast_2026.total_bev_sales_units).toBe(4800000);
  });

  test("should have a market share between 27 and 30 percent", () => {
    const share = data.market_forecast_2026.market_share_percentage;
    expect(share).toBeGreaterThanOrEqual(27);
    expect(share).toBeLessThanOrEqual(30);
  });

  test("segmentation percentages should sum to 100", () => {
    const segments = data.segmentation_share_2026;
    const total = Object.values(segments).reduce(
      (acc: number, curr: any) => acc + curr.percentage,
      0,
    );
    expect(total).toBe(100);
  });

  test("battery cost should be under 100 USD/kWh", () => {
    expect(data.battery_economics.avg_cost_per_kwh_usd).toBeLessThanOrEqual(100);
  });

  test("should contain all 5 key country breakdowns", () => {
    expect(data.country_breakdown.length).toBeGreaterThanOrEqual(5);
  });
});
