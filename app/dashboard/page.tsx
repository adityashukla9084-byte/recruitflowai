"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { AnalysisResult } from "./types";

import ProgressCard from "./components/ProgressCard";
import Sidebar from "./components/sidebar";
import FeedbackCard from "./components/FeedbackCard";
import KeywordCard from "./components/KeywordCard";
import InterviewCard from "./components/InterviewCard";
import ResumeRewriteCard from "./components/ResumeRewriteCard";
import JobMatchCard from "./components/JobMatchCard";
import SalaryCard from "./components/SalaryCard";
import CoverLetterCard from "./components/CoverLetterCard";
import HistoryCard from "./components/HistoryCard";
import DownloadReportButton from "./components/DownloadReportButton";
import StatsCards from "./components/statscards";
import Header from "./components/header";
import Hero from "./components/hero";
import ScoreGauge from "./components/ScoreGauge";
import QuickActions from "./components/QuickActions";

export default function Dashboard() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);



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
  <div className="flex bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white">
    <Sidebar />

    <main className="flex-1 min-h-screen">
<Header />
      <nav className="flex items-center justify-between border-b border-slate-800 px-10 py-5">

        <h1 className="text-3xl font-extrabold text-cyan-400">
          RecruitFlow AI
        </h1>

        <button
          onClick={handleLogout}
          className="rounded-xl bg-red-500 px-5 py-2 font-bold hover:bg-red-600"
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
      reports={1}
      salary={result?.salaryRange}
    />
  </div>
</div>

<QuickActions />
        <h2 className="text-5xl font-extrabold">
          🚀 AI Resume Analyzer
        </h2>

        <p className="mt-3 text-lg text-slate-400">
          Built for Corporate Hiring & ATS Optimization
        </p>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-8 shadow-2xl">

          <input
            type="file"
          
            accept=".pdf,.docx"
            className="mb-6 w-full rounded-2xl border border-slate-700 bg-slate-800/60 p-4"
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
  className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-900 p-4 text-white"
  rows={8}
/>
          <button
            onClick={handleAnalyze}
            disabled={loading}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 py-4 text-lg font-bold transition hover:scale-[1.02]"
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

                <div className="rounded-2xl border border-green-700 bg-slate-900 p-6">

                  <h2 className="mb-4 text-2xl font-bold text-green-400">
                    ✅ Strengths
                  </h2>

                  <ul className="space-y-2 list-disc ml-5">

                    {result.strengths.map((item,index)=>(

                      <li key={index}>{item}</li>

                    ))}

                  </ul>

                </div>

                <div className="rounded-2xl border border-red-700 bg-slate-900 p-6">

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

              <div className="rounded-2xl border border-yellow-700 bg-slate-900 p-6">

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

      <footer className="border-t border-slate-800 py-6 mt-16">

        <div className="mx-auto max-w-7xl flex items-center justify-between px-10">

          <div>

            <h2 className="font-bold text-cyan-400">
              RecruitFlow AI
            </h2>

            <p className="text-sm text-slate-400">
              AI Powered Resume Analyzer
            </p>

          </div>

          <div className="text-right">

            <p className="text-slate-400">
              Version 2.0
            </p>

            <p className="text-xs text-slate-500">
              Built with Next.js • Supabase • Gemini AI
            </p>

          </div>

        </div>

      </footer>

    </main>
  </div>
  );
}