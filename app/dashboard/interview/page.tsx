"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight, Search } from "lucide-react";

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