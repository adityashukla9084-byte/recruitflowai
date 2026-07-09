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

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; payload: { name: string } }[] }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl border border-theme-border bg-theme-card/90 backdrop-blur-md p-3 shadow-lg"
        style={{ minWidth: 120 }}
      >
        <p
          className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted"
        >
          Run {payload[0].payload.name}
        </p>
        <p
          className="text-base font-bold mt-1 text-theme-text"
          style={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {payload[0].value}
          <span className="text-xs font-normal text-theme-text-muted ml-0.5">%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalyticsChart({ data }: Props) {
  return (
    <div className="bg-theme-card border border-theme-border/50 rounded-2xl p-5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 cursor-default relative overflow-hidden group">
      
      {/* Subtle indicator accent line on the left side of card */}
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <h3 className="text-[9px] font-bold uppercase tracking-widest text-theme-text-muted mb-5 select-none">
        ATS Score Over Time
      </h3>

      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border-primary)"
              strokeOpacity={0.6}
            />

            <XAxis
              dataKey="name"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              dy={8}
            />

            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}`}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--accent)", strokeWidth: 1, strokeDasharray: "3 3" }}
            />

            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#areaFill)"
              activeDot={{ r: 4, strokeWidth: 0, fill: "var(--accent)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}