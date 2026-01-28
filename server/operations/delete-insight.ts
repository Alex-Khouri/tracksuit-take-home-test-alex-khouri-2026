import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): Insight | undefined => {
  console.log(`Deleting insight for ID=${input.id}...`);

  // While it could be confusing for users to see lingering entries with IDs that they just deleted
  // (i.e. if multiple entries with the same ID were mistakenly created), it's better for those
  // entries to be visible because it could provide a clear indication of database mismanagement.
  const [row] = input.db
    .sql<
    insightsTable.Row
  >`DELETE FROM insights WHERE id = ${input.id} LIMIT 1`;

  if (row) {
    const result = undefined;
    console.log("Insight deleted!");
    return result;
  }

  return;
};
