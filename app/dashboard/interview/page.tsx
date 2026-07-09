"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Search, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

const companies = [
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Apple",
  "Netflix",
  "OpenAI",
  "NVIDIA",
  "Tesla",
  "Oracle",
  "IBM",
  "Adobe",
  "TCS",
  "Infosys",
  "Wipro",
  "HCLTech",
  "Tech Mahindra",
  "Accenture",
  "Capgemini",
  "Cognizant",
  "Deloitte",
  "EY",
  "KPMG",
  "PwC",
  "Flipkart",
  "Swiggy",
  "Zomato",
  "Razorpay",
  "PhonePe",
  "Meesho",
  "CRED",
  "Zepto",
];

export default function InterviewHome() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [hasResume, setHasResume] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        supabase
          .from("analysis_history")
          .select("id")
          .eq("user_id", user.id)
          .limit(1)
          .then(({ data }) => {
            if (active) {
              setHasResume(data && data.length > 0);
            }
          });
      } else {
        if (active) setHasResume(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const filtered = companies.filter((c) =>
    c.toLowerCase().includes(company.toLowerCase())
  );

  function startInterview(name: string) {
    if (!name.trim()) return;

    router.push(
      `/dashboard/interview/session?company=${encodeURIComponent(name)}`
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">
          🎙 AI Mock Interview
        </h1>

        <p className="text-theme-text-secondary mb-10">
          Search any company in the world or choose one below.
        </p>

        {hasResume !== null && (
          <div className={`mb-8 rounded-2xl p-4.5 border flex items-start sm:items-center gap-3.5 shadow-sm ${
            hasResume 
              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300" 
              : "bg-amber-500/10 border-amber-500/20 text-amber-300"
          }`}>
            {hasResume ? (
              <>
                <CheckCircle2 className="h-5.5 w-5.5 text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-sm font-bold">Resume Detected</p>
                  <p className="text-xs opacity-90 mt-0.5">Your mock interview questions will automatically be tailored to your skills, experience, and projects.</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="h-5.5 w-5.5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <p className="text-sm font-bold">No Resume Detected</p>
                  <p className="text-xs opacity-90 mt-0.5">Upload a resume on the Dashboard first for a personalized interview, or proceed with a general role-based interview.</p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="rounded-3xl border border-theme-border-card bg-theme-card shadow-[var(--shadow-card)] p-6 mb-10">

          <div className="flex gap-3">

            <div className="flex-1 flex items-center rounded-2xl bg-theme-card-hover px-4">

              <Search className="text-theme-text-secondary mr-3" />

              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Google, SpaceX, Samsung, JP Morgan..."
                className="w-full bg-transparent py-4 outline-none"
              />

            </div>

            <button
              onClick={() => startInterview(company)}
              className="rounded-2xl bg-cyan-500 px-8 font-bold hover:bg-cyan-600"
            >
              Start
            </button>

          </div>

        </div>
<div className="mb-10 rounded-3xl border border-cyan-500 bg-theme-card shadow-[var(--shadow-card)] p-8">

  <h2 className="text-3xl font-bold">
    ⚙️ Custom Role Interview
  </h2>

  <p className="mt-3 text-theme-text-secondary">
    Enter any job role like React Developer, HR, Data Analyst, Marketing, etc.
  </p>

  <button
    onClick={() => router.push("/dashboard/interview/custom")}
    className="mt-6 rounded-2xl bg-cyan-500 px-8 py-4 font-bold hover:bg-cyan-600"
  >
    Start Custom Interview
  </button>

</div>
        <h2 className="text-2xl font-bold mb-6">
          ⭐ Popular Companies
        </h2>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {filtered.map((item) => (

            <button
              key={item}
              onClick={() => startInterview(item)}
              className="text-left rounded-3xl border border-theme-border-card bg-theme-card shadow-[var(--shadow-card)] p-8 hover:border-cyan-500 hover:scale-[1.02] transition"
            >
              <Building2
                size={42}
                className="text-theme-accent mb-5"
              />

              <h2 className="text-2xl font-bold">
                {item}
              </h2>

              <div className="mt-8 flex items-center gap-2 text-theme-accent">

                Start Interview

                <ArrowRight size={18} />

              </div>

            </button>

          ))}

        </div>

      </div>
    </main>
  );
}