// deno-lint-ignore-file no-explicit-any
import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import { Insight } from "../schemas/insight.ts";
import styles from "./app.module.css";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);

	const updateInsights = async () =>
	{
		// Each operation is performed asynchronously in sequence,
		// otherwise json is null at the time data is mapped to page objects.
		const result = await fetch("/api/insights");
			const json = await result.json();

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

  useEffect(() => {
		updateInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <Insights className={styles.insights} insights={insights} updateParent={updateInsights}/>
    </main>
  );
};
