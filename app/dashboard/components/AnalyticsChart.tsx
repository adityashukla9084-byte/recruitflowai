"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

type Props = {
  data: {
    name: string;
    score: number;
  }[];
};

export default function AnalyticsChart({ data }: Props) {
  return (
    
    <div className="rounded-3xl border border-theme-border-card bg-theme-card backdrop-blur-xl p-6 mt-8 shadow-[var(--shadow-card)]">
      <h2 className="mb-6 text-2xl font-bold">
        ATS Score Trend
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

          <XAxis dataKey="name" stroke="#94a3b8" />

          <YAxis stroke="#94a3b8" />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#06b6d4"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}