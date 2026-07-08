"use client";

import { useState } from "react";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Building2,
  ExternalLink,
  Star,
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

export default function JobFinderPage() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const [jobs, setJobs] = useState<Job[]>([]);

  async function searchJobs() {
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch("/api/job-finder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
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
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setJobs([]);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-3">
          🚀 AI Job Finder
        </h1>

        <p className="text-slate-400 mb-8">
          Find jobs matched with your skills.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Frontend Developer..."
            className="rounded-xl bg-slate-900 border border-slate-800 p-4"
          />

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Delhi, Remote..."
            className="rounded-xl bg-slate-900 border border-slate-800 p-4"
          />

          <button
            onClick={searchJobs}
            disabled={loading}
            className="rounded-xl bg-cyan-500 font-bold"
          >
            {loading ? "Searching..." : "Search Jobs"}
          </button>

        </div>

        {error && (
          <div className="rounded-xl bg-red-900/50 border border-red-700 p-4 mb-6 text-red-300">
            ⚠️ {error}
          </div>
        )}

        {searched && !loading && jobs.length === 0 && !error && (
          <div className="rounded-xl bg-slate-900 border border-slate-800 p-8 text-center text-slate-400">
            No jobs found. Try a different search query or location.
          </div>
        )}

        <div className="grid gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 hover:border-cyan-500 transition"
            >
              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-2xl font-bold">
                    {job.role}
                  </h2>

                  <div className="flex flex-wrap gap-6 mt-4 text-slate-300">

                    <div className="flex items-center gap-2">
                      <Building2 size={18} />
                      {job.company}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      {job.location}
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign size={18} />
                      {job.salary}
                    </div>

                  </div>

                </div>

                <div className="text-right">

                  <div className="rounded-full bg-green-600 px-4 py-2 font-bold">
                    {job.match}% Match
                  </div>

                </div>

              </div>

              <div className="mt-8 flex gap-4">

                <button
                  className="rounded-xl bg-yellow-500 px-5 py-3 flex items-center gap-2 font-bold"
                >
                  <Star size={18} />
                  Save
                </button>

                <a
                  href={job.applyUrl}
                  target="_blank"
                  className="rounded-xl bg-cyan-500 px-6 py-3 flex items-center gap-2 font-bold"
                >
                  <ExternalLink size={18} />
                  Apply
                </a>

              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}