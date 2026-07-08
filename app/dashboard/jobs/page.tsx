"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Job = {
  id: number;
  company: string;
  role: string;
  status: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  async function loadJobs() {
    const { data } = await supabase
      .from("job_tracker")
      .select("*")
      .order("id", { ascending: false });

    setJobs(data || []);
  }
async function deleteJob(id: number) {
  const { error } = await supabase
    .from("job_tracker")
    .delete()
    .eq("id", id);

  if (error) {
    console.log(error);
    alert(error.message);
    return;
  }

  loadJobs();
}
  useEffect(() => {
    let active = true;
    supabase
      .from("job_tracker")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        if (active) {
          setJobs(data || []);
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

        <h1 className="text-4xl font-bold mb-8">
          📋 Job Tracker
        </h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company"
            className="rounded-xl bg-slate-900 border border-slate-800 p-3"
          />

          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            className="rounded-xl bg-slate-900 border border-slate-800 p-3"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl bg-slate-900 border border-slate-800 p-3"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          <button
            onClick={addJob}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-600 font-bold p-3"
          >
            Add Job
          </button>

        </div>

        <div className="rounded-2xl border border-slate-800 overflow-hidden">

          <table className="w-full">

            <thead className="bg-slate-900">
              <tr>
                <th className="p-4 text-left">Company</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>

              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-6 text-center text-slate-400"
                  >
                    No jobs added yet.
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-t border-slate-800"
                  >

                    <td className="p-4">
                      {job.company}
                    </td>

                    <td className="p-4">
                      {job.role}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">

                        <span className="rounded-full bg-cyan-500 px-3 py-1 text-sm">
                          {job.status}
                        </span>

                        <button
                          onClick={() => deleteJob(job.id)}
                          className="rounded-lg bg-red-600 px-3 py-1 text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}