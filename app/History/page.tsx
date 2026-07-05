"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Analysis = {
  id: string;
  ats_score: number;
  job_match: number;
  salary_range: string;
  created_at: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("analysis_history")
      .select("id, ats_score, job_match, salary_range, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setHistory(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">📊 Analysis History</h1>

      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="text-gray-400">
            No analysis found.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >
              <p className="text-xl font-bold">
                ATS Score: {item.ats_score}
              </p>

              <p>Job Match: {item.job_match}%</p>

              <p>Salary: {item.salary_range}</p>

              <p className="text-sm text-gray-400 mt-2">
                {new Date(item.created_at).toLocaleString()}
              </p>

              <button className="mt-4 bg-cyan-500 px-4 py-2 rounded-lg">
                View Report
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}