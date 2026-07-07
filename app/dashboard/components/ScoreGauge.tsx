"use client";

import { motion } from "framer-motion";

type Props = {
  score: number;
};

export default function ScoreGauge({ score }: Props) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-theme-border-card bg-theme-card backdrop-blur-xl p-8">
      <div className="relative h-44 w-44">
        <svg className="rotate-[-90deg]" width="176" height="176">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="#1e293b"
            strokeWidth="12"
            fill="transparent"
          />

          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            stroke="#06b6d4"
            strokeWidth="12"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5 }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div>
            <p className="text-4xl font-bold text-center">{score}%</p>
            <p className="text-sm text-theme-text-secondary">ATS Score</p>
          </div>
        </div>
      </div>
    </div>
  );
}