import { Briefcase } from "lucide-react";
import Link from "next/link";
import {
  History,
  Download,
  FileText,
  
  Mic,
  User,
  BarChart3,
  Settings,
} from "lucide-react";

const actions = [
  {
  title: "Job Tracker",
  href: "/dashboard/jobs",
  icon: Briefcase,
},
  {
    title: "AI Mock Interview",
    href: "/dashboard/interview",
    icon: Mic,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "History",
    href: "/history",
    icon: History,
  },
  {
    title: "Download Report",
    href: "#",
    icon: Download,
  },
  {
    title: "Cover Letter",
    href: "#",
    icon: FileText,
  },
  {
    title: "Job Match",
    href: "#",
    icon: Briefcase,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function QuickActions() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-8">
      {actions.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-2xl border border-theme-border-card bg-theme-card backdrop-blur-xl p-6 hover:border-cyan-500 hover:scale-[1.02] transition shadow-[var(--shadow-card)]"
          >
            <Icon className="text-theme-accent mb-4" size={32} />

            <h3 className="font-bold text-lg">
              {item.title}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}