"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { AnalysisResult } from "./types";

import ProgressCard from "./components/ProgressCard";
import FeedbackCard from "./components/FeedbackCard";
import KeywordCard from "./components/KeywordCard";
import InterviewCard from "./components/InterviewCard";
import ResumeRewriteCard from "./components/ResumeRewriteCard";
import JobMatchCard from "./components/JobMatchCard";
import SalaryCard from "./components/SalaryCard";
import CoverLetterCard from "./components/CoverLetterCard";
import HistoryCard from "./components/HistoryCard";
import DownloadReportButton from "./components/DownloadReportButton";
import StatsCards from "./components/StatsCards";
import Header from "./components/header";
import Hero from "./components/hero";
import ScoreGauge from "./components/ScoreGauge";
import QuickActions from "./components/QuickActions";
import AnalyticsChart from "./components/AnalyticsChart";

export default function Dashboard() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportsCount, setReportsCount] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
const [chartData, setChartData] = useState<
  { name: string; score: number }[]
>([]);



  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        supabase
          .from("analysis_history")
          .select("ats_score, created_at", {
            count: "exact",
          })
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })
          .then(({ data, count }) => {
            if (active) {
              setReportsCount(count ?? 0);
              if (data) {
                setChartData(
                  data.map((item, index) => ({
                    name: `#${index + 1}`,
                    score: item.ats_score,
                  }))
                );
              }
            }
          });
      }
    });
    return () => {
      active = false;
    };
  }, []);


  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleAnalyze() {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
formData.append("file", file);
formData.append("jobDescription", jobDescription);

const {
  data: { session },
} = await supabase.auth.getSession();
console.log("TOKEN FOUND");

const response = await fetch("/api/analyze", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${session?.access_token}`,
  },
  body: formData,
});

      const data = await response.json();
    
      if (!response.ok || data.error) {
        alert(data.error ?? "Analysis Failed");
        return;
      }

      setResult(data.result);
    } catch (err) {
      console.error(err);
      alert("Analysis Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="flex bg-gradient-to-br from-[var(--bg-gradient-from)] via-[var(--bg-gradient-via)] to-[var(--bg-gradient-to)] text-theme-text">
    

    <main className="flex-1 min-h-screen">
<Header />
      <nav className="flex items-center justify-between border-b border-theme-border px-10 py-5">

        <h1 className="text-3xl font-extrabold text-theme-accent">
          RecruitFlow AI
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-red-500 px-5 py-2 font-bold text-white hover:bg-red-600"
        >
          Logout
        </button>

      </nav>

      <section className="mx-auto max-w-7xl p-10">
 <Hero />   
 <div className="grid gap-6 lg:grid-cols-3 mb-8">
  <div className="lg:col-span-1">
    <ScoreGauge score={result?.atsScore ?? 0} />
  </div>

  <div className="lg:col-span-2">
    <StatsCards
  atsScore={result?.atsScore}
  jobMatch={result?.jobMatchScore}
  reports={reportsCount}
  salary={result?.salaryRange}
  loading={loading}
/>

  </div>
</div>

<QuickActions />
<AnalyticsChart data={chartData} />
<div className="mt-8 grid gap-6 md:grid-cols-3">
  <div className="rounded-3xl border border-theme-border-card bg-theme-card p-6 shadow-[var(--shadow-card)]">
    <p className="text-theme-text-secondary">Highest ATS</p>
    <h2 className="mt-2 text-4xl font-bold">
      {chartData.length
        ? Math.max(...chartData.map((x) => x.score))
        : 0}
      %
    </h2>
  </div>

  <div className="rounded-3xl border border-theme-border-card bg-theme-card p-6 shadow-[var(--shadow-card)]">
    <p className="text-theme-text-secondary">Average ATS</p>
    <h2 className="mt-2 text-4xl font-bold">
      {chartData.length
        ? Math.round(
            chartData.reduce((a, b) => a + b.score, 0) /
              chartData.length
          )
        : 0}
      %
    </h2>
  </div>

  <div className="rounded-3xl border border-theme-border-card bg-theme-card p-6 shadow-[var(--shadow-card)]">
    <p className="text-theme-text-secondary">Total Reports</p>
    <h2 className="mt-2 text-4xl font-bold">
      {reportsCount}
    </h2>
  </div>
</div>
        <h2 className="text-5xl font-extrabold">
          🚀 AI Resume Analyzer
        </h2>

        <p className="mt-3 text-lg text-theme-text-secondary">
          Built for Corporate Hiring & ATS Optimization
        </p>

        <div className="mt-10 rounded-3xl border border-theme-border-card bg-theme-card backdrop-blur-xl p-8 shadow-2xl">

          <input
            type="file"
          
            accept=".pdf,.docx"
            className="mb-6 w-full rounded-2xl border border-theme-border-input bg-theme-input p-4 text-theme-text"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setFile(e.target.files[0]);
                setResult(null);
              }
            }}
          />
<textarea
  placeholder="Paste Job Description here..."
  value={jobDescription}
  onChange={(e) => setJobDescription(e.target.value)}
  className="mt-4 w-full rounded-xl border border-theme-border-input bg-theme-bg-secondary p-4 text-theme-text"
  rows={8}
/>
          <button
            onClick={handleAnalyze}
            disabled={loading}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-lg font-bold text-white transition hover:scale-[1.02]"
          >
            {loading ? "Analyzing Resume..." : "Analyze Resume"}
          </button>
          {result && (

            <div className="mt-10 space-y-8">

              <div className="grid gap-6 md:grid-cols-2">

                <ProgressCard
                  title="ATS Score"
                  value={result.atsScore}
                />

                <ProgressCard
                  title="Grammar Score"
                  value={result.grammarScore}
                />

                <ProgressCard
                  title="Formatting Score"
                  value={result.formattingScore}
                />

                <ProgressCard
                  title="Readability"
                  value={result.readabilityScore}
                />

              </div>

              <FeedbackCard
                feedback={result.recruiterFeedback}
              />

              <div className="grid gap-6 md:grid-cols-2">

                <div className="rounded-2xl border border-green-700 bg-theme-card p-6">

                  <h2 className="mb-4 text-2xl font-bold text-green-400">
                    ✅ Strengths
                  </h2>

                  <ul className="space-y-2 list-disc ml-5">

                    {result.strengths.map((item,index)=>(

                      <li key={index}>{item}</li>

                    ))}

                  </ul>

                </div>

                <div className="rounded-2xl border border-red-700 bg-theme-card p-6">

                  <h2 className="mb-4 text-2xl font-bold text-red-400">
                    ❌ Weaknesses
                  </h2>

                  <ul className="space-y-2 list-disc ml-5">

                    {result.weaknesses.map((item,index)=>(

                      <li key={index}>{item}</li>

                    ))}

                  </ul>

                </div>

              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <KeywordCard
  matchedKeywords={result.matchedKeywords}
  missingKeywords={result.missingKeywords}
/>
             
              </div>
          
          
         <div className="grid gap-6 md:grid-cols-2">

                <ResumeRewriteCard
                  rewrittenSummary={result.rewrittenSummary}
                />

                <InterviewCard
                  questions={result.interviewQuestions}
                />

              </div>

              <div className="grid gap-6 md:grid-cols-2">

                <SalaryCard
  salary={result.salaryRange}
/>
                
                <JobMatchCard
  matchScore={result.jobMatchScore}
/>
                
              </div>

              <CoverLetterCard
  coverLetter={result.coverLetter}
/>
<DownloadReportButton
  result={result}
/>
              <HistoryCard
                date={new Date().toLocaleDateString()}
                score={result.atsScore}
              />

              <div className="rounded-2xl border border-yellow-700 bg-theme-card p-6">

                <h2 className="mb-4 text-2xl font-bold text-yellow-400">
                  💡 AI Suggestions
                </h2>

                <ul className="list-disc ml-5 space-y-2">
  {result.suggestions.map((item, index) => (
    <li key={index}>{item}</li>
  ))}
</ul>

</div>

</div>

)}

</div>

</section>

      <footer className="border-t border-theme-border py-6 mt-16">

        <div className="mx-auto max-w-7xl flex items-center justify-between px-10">

          <div>

            <h2 className="font-bold text-theme-accent">
              RecruitFlow AI
            </h2>

            <p className="text-sm text-theme-text-secondary">
              AI Powered Resume Analyzer
            </p>

          </div>

          <div className="text-right">

            <p className="text-theme-text-secondary">
              Version 2.0
            </p>

            <p className="text-xs text-theme-text-muted">
              Built with Next.js • Supabase • Gemini AI
            </p>

          </div>

        </div>

      </footer>

    </main>
  </div>
  );
}