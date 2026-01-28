import type { HasDBClient } from "../shared.ts";
import { createTable } from "$tables/insights.ts";

type Input = HasDBClient;

export default (input: Input): void => {
  input.db.exec(createTable);

  console.log("Insight table created successfully!");
  return;
};
