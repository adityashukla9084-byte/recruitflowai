"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
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

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-theme-border bg-theme-card/90 backdrop-blur-md p-3 shadow-lg">
        <p className="text-xs text-theme-text-secondary font-semibold uppercase tracking-wider">Run {payload[0].payload.name}</p>
        <p className="text-lg font-bold mt-0.5 text-theme-accent">
          {payload[0].value}% <span className="text-xs font-medium text-theme-text-secondary">ATS Score</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ data }: Props) {
  return (
    <div className="rounded-3xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-6 mt-8 shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300">
      <h2 className="mb-6 text-xl font-bold tracking-tight px-2">
        ATS Optimization Trend
      </h2>

      <div className="w-full" style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-primary)" opacity={0.4} />

            <XAxis
              dataKey="name"
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />

            <YAxis
              stroke="var(--text-muted)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "#3b82f6", strokeWidth: 1, strokeDasharray: "4 4" }} />

            <Area
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#scoreColor)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#3b82f6" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}