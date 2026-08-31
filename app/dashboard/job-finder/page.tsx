"use client";

import { useState } from "react";
import {
  MapPin,
  DollarSign,
  Building2,
  ExternalLink,
  Star,
  Search,
  Sparkles,
  SlidersHorizontal,
  BookmarkCheck,
  Briefcase
} from "lucide-react";

type Job = {
  id: number;
  company: string;
  role: string;
  location: string;
  salary: string;
  match: number;
  applyUrl: string;
};

const filterTags = ["Remote", "Full-time", "Contract", "Internship", "Entry-level"];

export default function JobFinderPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedJobIds, setSavedJobIds] = useState<number[]>([]);

  const [jobs, setJobs] = useState<Job[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleSaveJob = (id: number) => {
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((jId) => jId !== id) : [...prev, id]
    );
  };

  async function searchJobs() {
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      // Unify text inputs and filter tags for search query
      const tagQuery = selectedTags.length > 0 ? " " + selectedTags.join(" ") : "";
      const res = await fetch("/api/job-finder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query + tagQuery,
          location,
        }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setJobs([]);
      } else {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Something went wrong";
      setError(errorMsg);
      setJobs([]);
    }

    setLoading(false);
  }

  // Deterministic company logo gradient
  const getCompanyGradient = (company: string) => {
    const gradients = [
      "from- to-[#]",
      "from- to-[#]",
      "from-purple-500 to-indigo-400",
      "from-pink-500 to-rose-400",
      "from-amber-500 to-orange-400",
      "-[#C5A028] to-blue-400",
    ];
    let hash = 0;
    for (let i = 0; i < company.length; i++) {
      hash += company.charCodeAt(i);
    }
    return gradients[hash % gradients.length];
  };

  // Match score color resolution
  const getMatchStyles = (match: number) => {
    if (match >= 85) {
      return {
        color: "text-emerald-400",
        border: "border-emerald-500/20",
        bg: "bg-emerald-500/10",
        label: "Excellent Match",
      };
    }
    if (match >= 65) {
      return {
        color: "text-[#D4AF37]",
        border: "border-[#C5A028]/20",
        bg: "bg-[#C5A028]/10",
        label: "Good Match",
      };
    }
    return {
      color: "text-red-400",
      border: "border-red-500/20",
      bg: "bg-red-500/10",
      label: "Moderate Match",
    };
  };

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-6 md:p-12 relative overflow-hidden flex justify-center items-start">
      {/* Background blurred glow elements */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-[#C5A028]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-[#C5A028]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full space-y-10 relative z-10 animate-[fadeIn_0.5s]">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A028]/10 border border-[#C5A028]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>AI Powered Discovery</span>
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-[#FFFFF0]">
              AI Job Finder
            </h1>
            <p className="text-sm text-theme-text-secondary mt-1.5 font-medium leading-relaxed max-w-2xl">
              Discover vacancies tailored to your skillset. Enter keywords, location parameters, and click search to extract real-time recommendations.
            </p>
          </div>
        </div>

        {/* Search Panel Card */}
        <div className="rounded-3xl border border-theme-border bg-theme-card/30 backdrop-blur-xl p-6 shadow-2xl space-y-5">
          
          <div className="grid gap-4 md:grid-cols-3">
            {/* Query Input */}
            <div className="flex items-center rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 px-4 focus-within:border-[#C5A028]/30 transition">
              <Search className="text-zinc-300 h-4.5 w-4.5 mr-2 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer..."
                className="w-full bg-transparent py-4 text-sm text-[#FFFFF0] placeholder-slate-500 outline-none"
              />
            </div>

            {/* Location Input */}
            <div className="flex items-center rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 px-4 focus-within:border-[#C5A028]/30 transition">
              <MapPin className="text-zinc-300 h-4.5 w-4.5 mr-2 shrink-0" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. New York, NY or Remote..."
                className="w-full bg-transparent py-4 text-sm text-[#FFFFF0] placeholder-slate-500 outline-none"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={searchJobs}
              disabled={loading}
              className="rounded-xl bg-[#C5A028] hover:bg-[#B89020] disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold py-4 text-sm transition shadow-lg shadow-[#] cursor-pointer flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Briefcase size={16} />
                  <span>Search Vacancies</span>
                </>
              )}
            </button>
          </div>

          {/* Filter Chips Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-900/60">
            <span className="text-xs text-zinc-300 font-bold uppercase tracking-widest mr-1.5 flex items-center gap-1">
              <SlidersHorizontal size={10} />
              <span>Filters</span>
            </span>
            {filterTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition duration-300 cursor-pointer ${
                    active
                      ? "bg-[#C5A028]/10 border-[#C5A028]/35 text-[#D4AF37]"
                      : "bg-zinc-950/40 border-zinc-900 text-theme-text hover:border-zinc-800 hover:text-zinc-300"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>

        </div>

        {/* Error State Banner */}
        {error && (
          <div className="rounded-xl bg-red-500/5 border border-red-500/20 p-4 text-xs font-bold text-red-400 flex items-center gap-2 animate-[fadeIn_0.3s]">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Empty State Banner */}
        {searched && !loading && jobs.length === 0 && !error && (
          <div className="rounded-2xl border border-theme-border bg-theme-card/10 backdrop-blur p-12 text-center text-theme-text max-w-md mx-auto space-y-3">
            <div className="h-12 w-12 rounded-full bg-theme-bg-secondary/40 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-300">
              🔍
            </div>
            <h3 className="text-[#FFFFF0] font-bold text-base leading-none">No Openings Found</h3>
            <p className="text-xs text-theme-text leading-relaxed font-medium">
              We couldn't extract any active vacancies matching your search keywords. Try adjusting your query or filters.
            </p>
          </div>
        )}

        {/* Job Listings Grid */}
        <div className="grid gap-6">
          {jobs.map((job) => {
            const match = getMatchStyles(job.match);
            const saved = savedJobIds.includes(job.id);
            const gradient = getCompanyGradient(job.company);

            return (
              <div
                key={job.id}
                className="rounded-3xl border border-theme-border bg-theme-card/30 backdrop-blur-xl p-6 md:p-8 flex flex-col justify-between hover:border-[#C5A028]/30 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 shadow-xl group relative overflow-hidden"
              >
                {/* Decorative blob on hover */}
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-[#C5A028]/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
                
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
                  <div className="flex items-start gap-4.5">
                    {/* Dynamic initial logo */}
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-[#FFFFF0] font-black text-lg shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      {job.company.substring(0, 1).toUpperCase()}
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl md:text-2xl font-black tracking-tight text-[#FFFFF0] group-hover:text-[#D4AF37] transition-colors duration-300">
                        {job.role}
                      </h2>
                      
                      {/* Job metadata badges */}
                      <div className="flex flex-wrap gap-2 text-xs font-semibold text-zinc-300 pt-1.5">
                        <div className="flex items-center gap-1.5 bg-theme-bg-secondary/60 border border-zinc-900 px-3 py-1.5 rounded-xl">
                          <Building2 size={13} className="text-[#D4AF37]" />
                          <span>{job.company}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-theme-bg-secondary/60 border border-zinc-900 px-3 py-1.5 rounded-xl">
                          <MapPin size={13} className="text-[#D4AF37]" />
                          <span>{job.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5 bg-theme-bg-secondary/60 border border-zinc-900 px-3 py-1.5 rounded-xl">
                          <DollarSign size={13} className="text-emerald-400" />
                          <span className="text-emerald-400 font-bold">{job.salary}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Gauge */}
                  <div className="md:text-right shrink-0">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-extrabold shadow-[var(--shadow-card)] ${match.bg} ${match.border} ${match.color}`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      <span>{job.match}% Match ({match.label})</span>
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="mt-8 pt-5 border-t border-zinc-900/60 flex items-center justify-between gap-4 relative z-10">
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`px-5 py-3 rounded-xl font-bold text-xs flex items-center gap-1.5 border transition duration-300 cursor-pointer ${
                        saved
                          ? "bg-[#C5A028]/10 border-[#C5A028]/35 text-[#D4AF37]"
                          : "bg-zinc-950/40 border-zinc-900 text-theme-text hover:border-zinc-800 hover:text-theme-text"
                      }`}
                    >
                      {saved ? (
                        <>
                          <BookmarkCheck size={14} />
                          <span>Saved</span>
                        </>
                      ) : (
                        <>
                          <Star size={14} />
                          <span>Save Job</span>
                        </>
                      )}
                    </button>

                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-[#C5A028] hover:bg-[#B89020] text-slate-950 px-6 py-3 flex items-center gap-1.5 font-bold text-xs transition shadow-lg shadow-[#] hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>

                  <span className="text-xs text-zinc-300 font-semibold tracking-wider uppercase hidden sm:inline">
                    Active Posting
                  </span>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}