"use client";

import Link from "next/link";
import {
  Brain,
  FilePlus2,
  Briefcase,
  Mic,
  BarChart3,
  ListChecks,
  ArrowUpRight,
  User,
} from "lucide-react";

const actionConfigs = [
  {
    title: "Resume Builder",
    description: "Generate structured, ATS-optimized resumes from candidate data.",
    href: "/dashboard/resume-builder",
    icon: FilePlus2,
    color: "#8B5CF6", // Violet
  },
  {
  title: "My Profile",
  description: "Manage your personal profile and account information.",
  href: "/dashboard/profile",
  icon: User,
  color: "#6366F1",
},
  {
    title: "Mock Interview",
    description: "Prep candidates with position-specific AI interview questions.",
    href: "/dashboard/interview",
    icon: Mic,
    color: "#EC4899", // Pink
  },
  {
    title: "Career Coach",
    description: "AI-guided roadmap, salary benchmarks, and negotiation prep.",
    href: "/dashboard/career-coach",
    icon: Brain,
    color: "#10B981", // Emerald
  },
  {
    title: "Job Finder",
    description: "Match open requisitions against active candidate profiles.",
    href: "/dashboard/job-finder",
    icon: Briefcase,
    color: "#06B6D4", // Cyan
  },
  {
    title: "Application Tracker",
    description: "Pipeline view of active submissions and stage progress.",
    href: "/dashboard/jobs",
    icon: ListChecks,
    color: "#F59E0B", // Amber
  },
  {
    title: "Analytics",
    description: "Score trends, submission metrics, and keyword gap history.",
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "#3B82F6", // Blue
  },
];

export default function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {actionConfigs.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.title}
            href={item.href}
            className="group flex flex-col justify-between p-5 bg-theme-card border border-theme-border/50 hover:border-theme-accent/30 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] focus-visible:outline-2 relative overflow-hidden"
          >
            {/* Glowing background bloom on hover */}
            <div
              className="absolute -right-12 -bottom-12 w-28 h-28 rounded-full blur-[32px] opacity-0 group-hover:opacity-15 transition-opacity duration-300"
              style={{ backgroundColor: item.color }}
            />

            <div className="space-y-4 relative z-10">
              {/* Premium Icon Badge Wrapper */}
              <div 
                className="w-9 h-9 rounded-xl border border-theme-border flex items-center justify-center transition-all duration-300"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${item.color} 8%, var(--bg-card-hover))`,
                  borderColor: `color-mix(in srgb, ${item.color} 20%, var(--border-primary))`
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={2}
                  className="transition-colors duration-300"
                  style={{ color: item.color }}
                  aria-hidden="true"
                />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-theme-text group-hover:text-theme-accent transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-xs text-theme-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between relative z-10">
              <span className="text-[9px] font-bold uppercase tracking-wider text-theme-text-muted group-hover:text-theme-accent transition-colors duration-300">
                Launch Tool
              </span>
              <ArrowUpRight
                size={12}
                strokeWidth={2}
                className="text-theme-text-muted group-hover:text-theme-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                aria-hidden="true"
              />
            </div>
          </Link>
        );
      })}
    </div>
  );
}