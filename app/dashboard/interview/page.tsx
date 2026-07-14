"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Search, CheckCircle2, AlertCircle, Sparkles, Sliders } from "lucide-react";
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
    <main className="min-h-screen bg-theme-bg text-theme-text p-6 md:p-12 relative overflow-hidden">
      {/* Decorative blurred background blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center sm:text-left space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen AI Technology</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            AI Mock Interview Portal
          </h1>
          <p className="text-theme-text-secondary text-base md:text-lg max-w-2xl font-medium">
            Practice mock interviews tailored specifically for your target companies or configure a customized role to start your preparation.
          </p>
        </div>

        {/* Resume Detection Banner */}
        {hasResume !== null && (
          <div className={`rounded-2xl p-5 border backdrop-blur-xl shadow-[var(--shadow-card)] transition-all duration-300 ${
            hasResume 
              ? "bg-teal-500/5 border-teal-500/20 text-teal-300 hover:bg-teal-500/10" 
              : "bg-amber-500/5 border-amber-500/20 text-amber-300 hover:bg-amber-500/10"
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl shrink-0 ${hasResume ? "bg-teal-500/10" : "bg-amber-500/10"}`}>
                {hasResume ? (
                  <CheckCircle2 className="h-6 w-6 text-teal-400" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-400" />
                )}
              </div>
              <div className="space-y-1">
                <p className="font-bold text-base leading-none">
                  {hasResume ? "AI Resume Synchronization Active" : "No Synced Resume Found"}
                </p>
                <p className="text-sm opacity-80 leading-relaxed font-medium">
                  {hasResume 
                    ? "Your mock interview sessions will automatically compile questions tailored directly to the work experience and skills listed on your uploaded resume."
                    : "Upload a resume on your dashboard to unlock custom experience tailoring, or proceed using the general industry template."
                  }
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Configuration grid */}
        <div className="grid gap-6 md:grid-cols-2">
          
          {/* Company Search Card */}
          <div className="rounded-3xl border border-theme-border bg-theme-card/30 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xl relative hover:border-theme-border/60 transition-all duration-300">
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Building2 className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Company-Specific Interview</h2>
              <p className="text-sm text-theme-text-secondary leading-relaxed font-medium">
                Prep for top-tier companies. AI generates actual past and likely interview questions for the organization you select.
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 flex items-center rounded-2xl bg-slate-950/60 border border-slate-900 px-4 focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/20 transition duration-300">
                <Search className="text-theme-text-muted h-5 w-5 mr-2" />
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Enter Google, Amazon, Tesla..."
                  className="w-full bg-transparent py-4 text-sm text-white placeholder-theme-text-muted outline-none"
                />
              </div>
              <button
                onClick={() => startInterview(company)}
                disabled={!company.trim()}
                className="rounded-2xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold px-6 py-4 transition shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 cursor-pointer flex items-center gap-1.5"
              >
                <span>Start</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>

          {/* Custom Role Card */}
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-theme-card/30 to-teal-950/10 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-xl hover:border-cyan-500/40 transition-all duration-300 relative group">
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-2xl bg-teal-500/10 text-teal-400">
                <Sliders className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Configure Custom Role</h2>
              <p className="text-sm text-theme-text-secondary leading-relaxed font-medium">
                Targeting a unique job specification? Customise the interview parameters to evaluate skills for any specific vacancy.
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/interview/custom")}
              className="w-full rounded-2xl bg-teal-600 hover:bg-indigo-700 text-white font-bold py-4.5 text-center shadow-lg shadow-teal-600/10 hover:shadow-teal-600/20 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Setup Custom Job Parameters</span>
              <Sliders className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>

        {/* Popular Companies */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <span>⭐</span>
            <span>Popular Corporate Tracks</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.slice(0, 12).map((item) => (
              <button
                key={item}
                onClick={() => startInterview(item)}
                className="text-left rounded-2xl border border-theme-border bg-theme-card/20 backdrop-blur-md p-6 hover:border-cyan-500/40 hover:bg-theme-card/45 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px] relative group overflow-hidden"
              >
                <div className="absolute -right-3 -top-3 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/15 transition-all duration-500" />
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-800 flex items-center justify-center text-cyan-400 font-extrabold text-sm shadow-inner group-hover:text-white transition duration-300">
                    {item.substring(0, 2)}
                  </div>
                  <ArrowRight size={16} className="text-theme-text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                <div className="mt-4">
                  <h3 className="text-base font-bold text-white leading-none mb-1.5">{item}</h3>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Practice Mock Track</span>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}