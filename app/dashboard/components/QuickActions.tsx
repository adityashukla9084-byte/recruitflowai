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
  FileSearch,
} from "lucide-react";

const featuredTools = [
  {
    title: "Resume Builder",
    description: "Generate structured, ATS-optimized professional resumes from your candidate profile data. Select modern templates and export high-quality formats.",
    href: "/dashboard/resume-builder",
    icon: FilePlus2,
    color: "#D4AF37", // Champagne Gold
  },
  {
    title: "Mock Interview",
    description: "Prep candidates with position-specific AI questions and simulated technical screen interviews. View real-time transcripts and assessment reports.",
    href: "/dashboard/interview",
    icon: Mic,
    color: "#CBD5E1", // Platinum / Silver
  },
];

const compactTools = [
  {
    title: "Resume Analysis",
    description: "Scan resumes against job descriptions to identify keywords and layout gaps.",
    href: "#upload-section",
    icon: FileSearch,
    color: "#D4AF37", // Champagne Gold
  },
  {
    title: "Job Finder",
    description: "Match active candidate profiles against open vacancies and pipelines.",
    href: "/dashboard/job-finder",
    icon: Briefcase,
    color: "#10B981", // Emerald
  },
  {
    title: "Career Coach",
    description: "AI-guided benchmarks, salary ranges, and negotiation roadmaps.",
    href: "/dashboard/career-coach",
    icon: Brain,
    color: "#F3CA4B", // Bright Gold
  },
  {
    title: "Application Tracker",
    description: "Pipeline view of active submissions and interview stage progress.",
    href: "/dashboard/job-tracker",
    icon: ListChecks,
    color: "#94A3B8", // Steel / Slate
  },
  {
    title: "Analytics",
    description: "ATS score trend graphs, candidate pipelines, and progress history.",
    href: "/dashboard/analytics",
    icon: BarChart3,
    color: "#CBD5E1", // Platinum
  },
];

export default function QuickActions() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* ── Featured Tools (Top, Large Cards) ── */}
      <div className="grid gap-3 md:grid-cols-2">
        {featuredTools.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={item.href.startsWith("#") ? (e) => handleScroll(e, item.href) : undefined}
              className="group flex flex-col justify-between p-4.5 bg-theme-card border border-theme-border hover:border-theme-accent/30 rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] relative overflow-hidden cursor-pointer"
            >
              {/* Glow bloom on hover (Optimized) */}
              <div
                className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)` }}
              />

              <div className="space-y-3">
                <div 
                  className="w-9 h-9 rounded-xl border border-theme-border flex items-center justify-center"
                  style={{ 
                    backgroundColor: `color-mix(in srgb, ${item.color} 8%, var(--bg-card-hover))`,
                    borderColor: `color-mix(in srgb, ${item.color} 20%, var(--border-primary))`
                  }}
                >
                  <Icon
                    size={16}
                    strokeWidth={2}
                    style={{ color: item.color }}
                    aria-hidden="true"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-theme-accent bg-theme-accent/10 px-2 py-0.5 rounded-md">
                    Featured Tool
                  </span>
                  <h3 className="text-sm font-bold text-theme-text group-hover:text-theme-accent transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-theme-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-theme-text-muted group-hover:text-theme-accent transition-colors duration-300">
                  Launch Assistant
                </span>
                <ArrowUpRight
                  size={12}
                  strokeWidth={2.5}
                  className="text-theme-text-muted group-hover:text-theme-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300"
                  aria-hidden="true"
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── Compact Tools List (Bottom) ── */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {compactTools.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={item.href.startsWith("#") ? (e) => handleScroll(e, item.href) : undefined}
              className="group flex items-center gap-2.5 p-2 bg-theme-card border border-theme-border hover:border-theme-accent/20 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] relative overflow-hidden cursor-pointer"
            >
              {/* Micro Icon Badge */}
              <div 
                className="w-8 h-8 rounded-lg border border-theme-border flex items-center justify-center shrink-0"
                style={{ 
                  backgroundColor: `color-mix(in srgb, ${item.color} 8%, var(--bg-card-hover))`,
                  borderColor: `color-mix(in srgb, ${item.color} 15%, var(--border-primary))`
                }}
              >
                <Icon
                  size={14}
                  strokeWidth={2}
                  style={{ color: item.color }}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-theme-text truncate group-hover:text-theme-accent transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-[11px] text-theme-text-muted leading-tight truncate">
                  {item.description}
                </p>
              </div>

              <ArrowUpRight
                size={11}
                strokeWidth={2}
                className="text-theme-text-muted/60 group-hover:text-theme-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                aria-hidden="true"
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
