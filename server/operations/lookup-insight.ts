import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type InputID = HasDBClient & {
  id: number;
};

export function lookupInsightByID(input: InputID): Insight | undefined {
  console.log(`Looking up insight for ID=${input.id}...`);

  const [row] = input.db
    .sql<
    insightsTable.Row
  >`SELECT * FROM insights WHERE id = ${input.id} LIMIT 1`;

  if (row) {
    const result = { ...row, createdAt: new Date(row.createdAt) };
    console.log("Insight retrieved:", result);
    return result;
  }

  return;
}

type InputBrandText = HasDBClient & {
  brand: number;
  text: string;
};

export function lookupInsightByContent(input: InputBrandText): Insight | undefined {
  console.log(`Looking up insight for brand=${input.brand}...`);

  const [row] = input.db
    .sql<
    insightsTable.Row
  >`SELECT * FROM insights WHERE brand = ${input.brand} AND text = ${input.text} LIMIT 1`;

  if (row) {
    const result = { ...row, createdAt: new Date(row.createdAt) };
    console.log("Insight retrieved:", result);
    return result;
  }

  return;
}
