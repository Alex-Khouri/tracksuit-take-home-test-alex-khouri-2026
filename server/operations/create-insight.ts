import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";
import { insertStatement } from "$tables/insights.ts";

type Input = HasDBClient & {
  brand: number;
  text: string;
  createdAt: Date;
};

export default (input: Input): Insight | undefined => {
  console.log(`Creating insight for brand=${input.brand}`);

  const insert: insightsTable.Insert = {
    brand: input.brand,
    text: input.text,
    createdAt: input.createdAt,
  };

  input.db.exec(insertStatement(insert));

  const [row] = input.db.sql<
    insightsTable.Row
  >`SELECT * FROM insights WHERE id = last_insert_rowid()`;

  if (row) {
    const result = { ...row, createdAt: new Date(row.createdAt) };
    return result;
  }

  console.log("Insight not found");
  return;
};
