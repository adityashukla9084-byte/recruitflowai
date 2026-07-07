"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Report = {
  job_role: string;
  score: number;
  feedback: string;
  improvement: string;
  created_at: string;
};

export default function InterviewReportPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("interview_history")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!error && data) {
      setReport(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
        Loading Report...
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
        No Interview Report Found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-10">
      <div className="max-w-5xl mx-auto rounded-3xl border border-theme-border-card bg-theme-card p-10 shadow-[var(--shadow-card)]">

        <h1 className="text-5xl font-bold text-theme-accent mb-10">
          AI Interview Report
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div className="rounded-2xl bg-theme-card-hover p-6 border border-theme-border-card">
            <p className="text-theme-text-secondary">
              Overall Score
            </p>

            <h2 className="text-6xl font-bold mt-3">
              {report.score}/100
            </h2>
          </div>

          <div className="rounded-2xl bg-theme-card-hover p-6 border border-theme-border-card">
            <p className="text-theme-text-secondary">
              Job Role
            </p>

            <h2 className="text-3xl font-bold mt-3">
              {report.job_role}
            </h2>
          </div>

        </div>

        <div className="mt-10 rounded-2xl bg-theme-card-hover p-6 border border-theme-border-card">

          <h3 className="text-2xl font-bold mb-4">
            AI Feedback
          </h3>

          <p className="text-theme-text-secondary leading-relaxed">
            {report.feedback}
          </p>

        </div>

        <div className="mt-8 rounded-2xl bg-theme-card-hover p-6 border border-theme-border-card">

          <h3 className="text-2xl font-bold mb-4">
            Improvement Plan
          </h3>

          <p className="text-theme-text-secondary leading-relaxed">
            {report.improvement}
          </p>

        </div>

      </div>
    </main>
  );
}