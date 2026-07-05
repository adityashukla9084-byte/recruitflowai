"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ReportPage() {
  const { id } = useParams();

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    const { data, error } = await supabase
      .from("analysis_history")
      .select("result")
      .eq("id", id)
      .single();

    if (!error && data) {
      setReport(data.result);
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

  if (!report) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        Report not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        📄 Analysis Report
      </h1>

      <div className="space-y-6">

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">Summary</h2>
          <p>{report.summary}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">
            Recruiter Feedback
          </h2>
          <p>{report.recruiterFeedback}</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">
            Missing Keywords
          </h2>

          <ul className="list-disc ml-6">
            {report.missingKeywords?.map((item: string) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">
            Cover Letter
          </h2>

          <pre className="whitespace-pre-wrap">
            {report.coverLetter}
          </pre>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-2">
            Interview Questions
          </h2>

          <ul className="list-disc ml-6">
            {report.interviewQuestions?.map(
              (q: string, index: number) => (
                <li key={index}>{q}</li>
              )
            )}
          </ul>
        </div>

      </div>

    </main>
  );
}