"use client";

import { useState } from "react";

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);

  function update(
    key: keyof typeof form,
    value: string
  ) {
    setForm({
      ...form,
      [key]: value,
    });
  }

  async function generateResume() {
    if (!form.name.trim()) {
      alert("Please enter your full name.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/resume-builder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      // Store both the form data and the AI-generated resume
      localStorage.setItem(
        "generatedResume",
        JSON.stringify({
          formData: form,
          aiResume: data.resume,
        })
      );

      window.location.href =
        "/dashboard/resume-builder/preview";
    } catch (err) {
      console.error(err);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          AI Resume Builder
        </h1>

        <div className="space-y-5">

          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) =>
              update("name", e.target.value)
            }
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4"
          />

          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              update("email", e.target.value)
            }
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              update("phone", e.target.value)
            }
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4"
          />

          <textarea
            rows={4}
            placeholder="Skills (comma separated, e.g. JavaScript, React, Node.js)"
            value={form.skills}
            onChange={(e) =>
              update("skills", e.target.value)
            }
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4"
          />

          <textarea
            rows={4}
            placeholder="Education (e.g. B.Tech in Computer Science, XYZ University, 2020-2024)"
            value={form.education}
            onChange={(e) =>
              update("education", e.target.value)
            }
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4"
          />

          <textarea
            rows={6}
            placeholder="Experience (e.g. Software Developer at ABC Corp, 2 years, worked on...)"
            value={form.experience}
            onChange={(e) =>
              update("experience", e.target.value)
            }
            className="w-full rounded-xl bg-slate-900 border border-slate-800 p-4"
          />

          <button
            onClick={generateResume}
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 disabled:cursor-not-allowed py-4 font-bold transition"
          >
            {loading ? "Generating Resume..." : "Generate AI Resume"}
          </button>

        </div>

      </div>

    </main>
  );
}