"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";
import type { CategorySummaryItem } from "../lib/api";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  items: CategorySummaryItem[];
  colors: Record<string, string>;
  currency: string;
};

export function CategorySpendingChart({ items, colors, currency }: Props) {
  return (
    <div className="mx-auto max-w-sm">
      <Pie
        data={{
          labels: items.map((item) => item.category),
          datasets: [{
            data: items.map((item) => item.total),
            backgroundColor: items.map((item) => colors[item.category] || "#cbd5e1"),
            borderColor: "#f7f9ff",
            borderWidth: 3,
          }],
        }}
        options={{
          plugins: {
            legend: { position: "bottom", labels: { boxWidth: 12, padding: 14 } },
            tooltip: { callbacks: { label: (context) => `${context.label}: ${currency} ${Number(context.raw).toLocaleString()}` } },
          },
        }}
      />
    </div>
  );
}
