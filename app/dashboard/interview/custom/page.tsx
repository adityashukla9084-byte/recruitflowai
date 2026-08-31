"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomInterview() {
  const router = useRouter();

  const [role, setRole] = useState("");

  function startInterview() {
    if (!role.trim()) {
      alert("Enter a job role");
      return;
    }

    router.push(
      `/dashboard/interview/session?role=${encodeURIComponent(role)}`
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center p-8">

      <div className="w-full max-w-xl rounded-3xl border border-theme-border-card bg-theme-card p-8 shadow-[var(--shadow-card)]">

        <h1 className="text-4xl font-bold">
          Custom AI Interview
        </h1>

        <p className="mt-3 text-theme-text-secondary">
          Enter any job role and AI will create interview questions.
        </p>

        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Example: Frontend Developer"
          className="mt-8 w-full rounded-xl border border-theme-border-input bg-theme-input p-4 outline-none text-theme-text"
        />

        <button
          onClick={startInterview}
          className="mt-6 w-full rounded-xl bg-[#C5A028] py-4 font-bold text-[#FFFFF0] hover:bg-[#B89020]"
        >
          Start Interview
        </button>

      </div>

    </main>
  );
}
