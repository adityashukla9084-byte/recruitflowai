"use client";

import StatsCards from "../components/StatsCards";
import AnalyticsChart from "../components/AnalyticsChart";

export default function AnalyticsPage() {
  const chartData = [
    { name: "Jan", score: 72 },
    { name: "Feb", score: 75 },
    { name: "Mar", score: 80 },
    { name: "Apr", score: 84 },
    { name: "May", score: 88 },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          📊 Analytics Dashboard
        </h1>

        <p className="mt-3 text-slate-400">
          View ATS trends, Job Match insights and resume performance.
        </p>
      </div>

      <StatsCards
        atsScore={88}
        jobMatch={82}
        reports={12}
        salary="₹10-15 LPA"
      />

      <AnalyticsChart data={chartData} />
    </main>
  );
}