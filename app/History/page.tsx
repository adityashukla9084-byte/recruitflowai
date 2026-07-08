"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Analysis = {
  id: string;
  ats_score: number;
  job_match: number;
  salary_range: string;
  created_at: string;
};

export default function HistoryPage() {
  const router = useRouter();

  const [history, setHistory] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        supabase
          .from("analysis_history")
          .select("id, ats_score, job_match, salary_range, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .then(({ data, error }) => {
            if (active) {
              if (!error && data) {
                setHistory(data);
              }
              setLoading(false);
            }
          });
      } else {
        if (active) {
          setLoading(false);
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function deleteAnalysis(id: string) {
    const ok = confirm("Delete this analysis?");

    if (!ok) return;

    await supabase
      .from("analysis_history")
      .delete()
      .eq("id", id);

    loadHistory();
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-8">
      <h1 className="text-4xl font-bold mb-8">
        📊 Analysis History
      </h1>

      <div className="space-y-6">
        {history.length === 0 ? (
          <div className="text-gray-400">
            No analysis found.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="bg-theme-card-hover rounded-xl p-6 border border-theme-border-input"
            >
              <p className="text-xl font-bold">
                ATS Score: {item.ats_score}
              </p>

              <p>Job Match: {item.job_match}%</p>

              <p>Salary: {item.salary_range}</p>

              <p className="text-sm text-gray-400 mt-2">
                {new Date(item.created_at).toLocaleString()}
              </p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() =>
                    router.push(`/history/${item.id}`)
                  }
                  className="rounded-lg bg-cyan-500 px-4 py-2"
                >
                  View Report
                </button>

                <button
                  onClick={() => deleteAnalysis(item.id)}
                  className="rounded-lg bg-red-500 px-4 py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}