"use client";

import {
  FileText,
  Target,
  TrendingUp,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  atsScore?: number;
  jobMatch?: number;
  reports?: number;
  salary?: string;
  loading?: boolean;
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 14 } },
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
      glow: "from-blue-500/20 to-indigo-500/20",
      iconColor: "text-blue-500 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Job Match",
      value: `${jobMatch}%`,
      icon: Target,
      glow: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Reports",
      value: reports,
      icon: FileText,
      glow: "from-purple-500/20 to-pink-500/20",
      iconColor: "text-purple-500 dark:text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Salary Guide",
      value: salary,
      icon: Briefcase,
      glow: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-500 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-5 sm:grid-cols-2 h-full"
    >
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            className="relative overflow-hidden rounded-2xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-6 shadow-[var(--shadow-card)] hover:shadow-lg transition-all duration-300 group"
          >
            {/* Soft glowing ambient circle on hover */}
            <div className={`absolute -right-10 -bottom-10 h-28 w-28 rounded-full bg-gradient-to-tr ${card.glow} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-xs font-semibold text-theme-text-secondary tracking-wider uppercase">{card.title}</p>
                {loading ? (
                  <div className="mt-3 h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                ) : (
                  <h2 className="mt-2.5 text-3xl font-extrabold tracking-tight">{card.value}</h2>
                )}
              </div>

              <div className={`p-3 rounded-xl ${card.bgColor} ${card.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={24} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}