// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import { Insight } from "../schemas/insight.ts";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
		// Each operation is performed asynchronously in sequence,
		// otherwise json is null at the time the map is applied.
		const loadInsights = async () => {
			const result = await fetch("/api/insights");
			const json = await result.json();
			console.log(json);

			const updatedInsights = json.map((raw: any) =>
				Insight.parse({
					id: raw.id,
					brandId: raw.brand,
					date: new Date(raw.createdAt),
					text: raw.text,
				})
			);
			
			setInsights(updatedInsights);
		};

		loadInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <Insights className={styles.insights} insights={insights} />
    </main>
  );
};
