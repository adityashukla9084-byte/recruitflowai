"use client";

import Link from "next/link";
import { Brain, ArrowRight } from "lucide-react";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "React Developer",
  "Next.js Developer",
  "Node.js Developer",
  "Python Developer",
  "Java Developer",
  "Data Analyst",
  "UI/UX Designer",
  "Product Manager",
  "HR Recruiter",
];

export default function InterviewPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Brain className="text-cyan-400" size={38} />
            AI Mock Interview
          </h1>

          <p className="text-slate-400 mt-3">
            Select your target job role and start an AI-powered interview.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <Link
              key={role}
              href={`/dashboard/interview/session?role=${encodeURIComponent(role)}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-cyan-500 transition"
            >
              <h2 className="text-xl font-bold">
                {role}
              </h2>

              <div className="mt-6 flex items-center gap-2 text-cyan-400">
                Start Interview
                <ArrowRight size={18} />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}