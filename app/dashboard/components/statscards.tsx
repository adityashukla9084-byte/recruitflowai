"use client";

import {
  FileText,
  Target,
  TrendingUp,
  Briefcase,
} from "lucide-react";

type Props = {
  atsScore?: number;
  jobMatch?: number;
  reports?: number;
  salary?: string;
  loading?: boolean;
};

export default function StatsCards({
  atsScore = 0,
  jobMatch = 0,
  reports = 0,
  salary = "—",
  loading = false,
}: Props) {

  const cards = [
    {
      title: "ATS Score",
      value: `${atsScore}%`,
      icon: TrendingUp,
    },
    {
      title: "Job Match",
      value: `${jobMatch}%`,
      icon: Target,
    },
    {
      title: "Reports",
      value: reports,
      icon: FileText,
    },
    {
      title: "Salary",
      value: salary,
      icon: Briefcase,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-lg p-6 hover:border-cyan-500 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400">{card.title}</p>
                {loading ? (
  <div className="mt-2 h-8 w-24 animate-pulse rounded bg-slate-700" />
) : (
  <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
)}
              </div>

              <Icon size={34} className="text-cyan-400" />
            </div>
          </div>
        );
      })}
    </div>
  );
}