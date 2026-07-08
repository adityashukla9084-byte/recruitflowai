"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Job = {
  id: number;
  company: string;
  role: string;
  status: string;
};

export default function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  async function loadJobs() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("job_tracker")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setJobs(data || []);
  }

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        supabase
          .from("job_tracker")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            if (active) {
              setJobs(data || []);
            }
          });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  async function addJob() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("job_tracker").insert({
      user_id: user.id,
      company,
      role,
      status,
    });

    setCompany("");
    setRole("");
    setStatus("Applied");

    loadJobs();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          📋 Job Application Tracker
        </h1>

        <div className="grid md:grid-cols-4 gap-4">

          <input
            placeholder="Company"
            value={company}
            onChange={(e)=>setCompany(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 p-4"
          />

          <input
            placeholder="Role"
            value={role}
            onChange={(e)=>setRole(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 p-4"
          />

          <select
            value={status}
            onChange={(e)=>setStatus(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-700 p-4"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          <button
            onClick={addJob}
            className="rounded-xl bg-cyan-500 font-bold"
          >
            Add
          </button>

        </div>

        <div className="mt-10 space-y-5">

          {jobs.map((job)=>(

            <div
              key={job.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex justify-between"
            >

              <div>

                <h2 className="text-2xl font-bold">
                  {job.company}
                </h2>

                <p className="text-slate-400">
                  {job.role}
                </p>

              </div>

              <span className="rounded-full bg-cyan-500 px-5 py-2 h-fit">
                {job.status}
              </span>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}