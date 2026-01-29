// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import {
  lookupInsightByContent,
  lookupInsightByID,
} from "./operations/lookup-insight.ts";
import createInsightTable from "./operations/create-insight-table.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";

console.log("Loading configuration...");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}...`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

createInsightTable({ db });

console.log("Initialising server...");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  try {
    ctx.response.status = 200;
    ctx.response.body = "OK";
  } catch (error) {
    console.log(`INTERNAL SERVER ERROR (/_health): ${error}`);
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
  }
});

router.get("/insights", (ctx) => {
  try {
    const result = listInsights({ db });
    ctx.response.status = 200;
    ctx.response.body = result;
  } catch (error) {
    console.log(`INTERNAL SERVER ERROR (/insights): ${error}`);
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
  }
});

router.get("/insights/:id", (ctx) => {
  try {
    const params = ctx.params as Record<string, any>;
    const result = lookupInsightByID({ db, id: params.id });

    if (result === undefined) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Client error: resource not found" };
    }

    ctx.response.status = 200;
    ctx.response.body = result;
  } catch (error) {
    console.log(`INTERNAL SERVER ERROR (/insights/:id): ${error}`);
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
  }
});

router.post("/insights/create", async (ctx) => {
  try {
    const body = ctx.request.body;
    const value = await body.json();

    const brandValue = Number(value.brand);
    const textValue = value.text;
    const createdAtValue = new Date(value.createdAt);

    const preliminaryResult = lookupInsightByContent({
      db,
      brand: brandValue,
      text: textValue,
    });

    if (preliminaryResult !== undefined) {
      ctx.response.status = 409; // "Conflict"
      ctx.response.body = {
        error: "Client error: insight with those details already exists",
      };
      return;
    }

    const result = createInsight({
      db,
      brand: brandValue,
      text: textValue,
      createdAt: createdAtValue,
    });

    ctx.response.status = 201;
    ctx.response.body = result;
  } catch (error) {
    console.log(`INTERNAL SERVER ERROR (/insights/create): ${error}`);
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
  }
});

router.delete("/insights/delete/:id", (ctx) => {
  try {
    const params = ctx.params as Record<string, any>;
    const result = lookupInsightByID({ db, id: params.id });

    if (result === undefined) {
      ctx.response.status = 404;
      ctx.response.body = { error: "Client error: resource not found" };
    }

    deleteInsight({ db, id: params.id });
    ctx.response.status = 200;
    ctx.response.body = { success: true };
  } catch (error) {
    console.log(`INTERNAL SERVER ERROR (/insights/delete): ${error}`);
    ctx.response.status = 500;
    ctx.response.body = { error: "Server error" };
  }
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
