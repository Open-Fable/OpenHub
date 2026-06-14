/**
 * Script de validation des données du marché 2026.
 * Vérifie la cohérence entre les fichiers JSON et les rapports de recherche.
 */

import * as fs from "fs";
import * as path from "path";

interface MarketData {
  market_forecast_2026: {
    total_bev_sales_units: number;
  };
  segmentation_share_2026: Record<string, { percentage: number }>;
}

function validateMarketData(): void {
  try {
    const dataPath = path.join(__dirname, "../data/market_data_2026.json");
    const rawData = fs.readFileSync(dataPath, "utf-8");
    const data: MarketData = JSON.parse(rawData);

    // 1. Validation du total des segments (doit être 100%)
    const segments = data.segmentation_share_2026;
    const totalPercentage = Object.values(segments).reduce(
      (acc, curr) => acc + curr.percentage,
      0,
    );

    if (totalPercentage !== 100) {
      throw new Error(
        `Incohérence segmentation : Total = ${totalPercentage}% (attendu: 100%)`,
      );
    }

    // 2. Validation du volume de ventes
    if (data.market_forecast_2026.total_bev_sales_units !== 4800000) {
      throw new Error(
        `Incohérence volume : ${data.market_forecast_2026.total_bev_sales_units} (attendu: 4800000)`,
      );
    }

    console.log("✅ Validation réussie : Les données JSON sont cohérentes et complètes.");
  } catch (error) {
    console.error(
      "❌ Erreur de validation :",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
}

validateMarketData();
