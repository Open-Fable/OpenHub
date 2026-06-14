import * as fs from "fs";
import * as path from "path";

/**
 * Interface representing the structure of market data entries.
 */
export interface MarketEntry {
  country: string;
  year: number;
  sales_volume: number;
  market_share_pct: number;
  infrastructure_target: number;
}

/**
 * Interface representing the structure of competitor data entries.
 */
export interface CompetitorEntry {
  manufacturer: string;
  marketSharePct: number;
  flagshipModel: string;
  avgPriceEuro: number;
  avgRangeWltpKm: number;
  keyInnovation: string;
}

/**
 * Processes market and competitor data to generate a summary report.
 */
export class DataProcessor {
  private readonly dataDir: string;

  constructor(dataDir: string = "data") {
    this.dataDir = dataDir;
  }

  /**
   * Loads and parses the market JSON data.
   */
  public loadMarketData(): MarketEntry[] {
    const filePath = path.join(this.dataDir, "market_data_2026.json");
    try {
      const rawData = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(rawData) as MarketEntry[];
    } catch (error) {
      throw new Error(`Failed to load market data: ${(error as Error).message}`);
    }
  }

  /**
   * Loads and parses the competitors CSV data.
   */
  public loadCompetitorData(): CompetitorEntry[] {
    const filePath = path.join(this.dataDir, "competitors_2026.csv");
    try {
      const rawData = fs.readFileSync(filePath, "utf-8");
      const lines = rawData.trim().split("\n");
      // Skip header
      return lines.slice(1).map((line) => {
        const [manufacturer, share, model, price, range, innovation] = line.split(",");
        return {
          manufacturer,
          marketSharePct: parseFloat(share),
          flagshipModel: model,
          avgPriceEuro: parseInt(price, 10),
          avgRangeWltpKm: parseInt(range, 10),
          keyInnovation: innovation,
        };
      });
    } catch (error) {
      throw new Error(`Failed to load competitor data: ${(error as Error).message}`);
    }
  }

  /**
   * Calculates the total projected sales for a specific year.
   */
  public calculateTotalSales(data: MarketEntry[], year: number): number {
    return data
      .filter((entry) => entry.year === year && entry.country !== "Europe (Total)")
      .reduce((sum, entry) => sum + entry.sales_volume, 0);
  }

  /**
   * Generates a console summary of the processed data.
   */
  public generateSummary(): void {
    const marketData = this.loadMarketData();
    const competitors = this.loadCompetitorData();

    const total2026 = this.calculateTotalSales(marketData, 2026);
    const topCompetitor = competitors.reduce((prev, current) =>
      prev.marketSharePct > current.marketSharePct ? prev : current,
    );

    console.log("--- EV-VISION 2026 DATA SUMMARY ---");
    console.log(`Total Projected EU Sales (2026): ${total2026.toLocaleString()} units`);
    console.log(
      `Market Leader: ${topCompetitor.manufacturer} (${topCompetitor.marketSharePct}%)`,
    );
    console.log(`Average Range Target: ${topCompetitor.avgRangeWltpKm} km`);
    console.log("-----------------------------------");
  }
}

// Execution
try {
  const processor = new DataProcessor();
  processor.generateSummary();
} catch (err) {
  console.error("Processing Error:", (err as Error).message);
  process.exit(1);
}
