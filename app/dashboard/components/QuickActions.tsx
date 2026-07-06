import Link from "next/link";
import {
  FileText,
  History,
  Download,
  Briefcase,
} from "lucide-react";

const actions = [
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
            className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-6 hover:border-cyan-500 hover:scale-[1.02] transition"
          >
            <Icon className="text-cyan-400 mb-4" size={32} />
            <h3 className="font-bold text-lg">
              {item.title}
            </h3>
          </Link>
        );
      })}
    </div>
  );
}