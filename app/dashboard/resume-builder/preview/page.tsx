"use client";

import { useState } from "react";
import TemplateCorporate from "../components/TemplateCorporate";

type ExperienceItem = {
  title: string;
  company: string;
  duration: string;
  bullets: string[];
};

type ProjectItem = {
  name: string;
  description: string;
};

type ResumeData = {
  formData: {
    name: string;
    email: string;
    phone: string;
    skills: string;
    education: string;
    experience: string;
  };
  aiResume: {
    summary: string;
    experience: ExperienceItem[];
    projects: ProjectItem[];
    certifications: string[];
    languages: string[];
  };
};

export default function ResumePreview() {
  const [resumeData] = useState<ResumeData | null>(() => {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem("generatedResume");

    if (data) {
      try {
        const parsed = JSON.parse(data);

        // Handle legacy format (plain string)
        if (typeof parsed === "string") {
          return {
            formData: {
              name: "Your Name",
              email: "",
              phone: "",
              skills: "",
              education: "",
              experience: "",
            },
            aiResume: {
              summary: parsed,
              experience: [],
              projects: [],
              certifications: [],
              languages: ["English"],
            },
          };
        } else {
          return parsed;
        }
      } catch {
        // If parsing fails entirely, treat as plain string
        return {
          formData: {
            name: "Your Name",
            email: "",
            phone: "",
            skills: "",
            education: "",
            experience: "",
          },
          aiResume: {
            summary: data,
            experience: [],
            projects: [],
            certifications: [],
            languages: ["English"],
          },
        };
      }
    }
    return null;
  });

  if (!resumeData) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">No resume data found.</p>
          <a
            href="/dashboard/resume-builder"
            className="rounded-xl bg-cyan-500 hover:bg-cyan-600 px-6 py-3 font-bold text-white inline-block"
          >
            Go to Resume Builder
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-10">
      <div className="max-w-5xl mx-auto print-container">

        <div className="flex items-center justify-between mb-8 no-print">
          <h1 className="text-4xl font-bold text-white">
            AI Resume Preview
          </h1>

          <div className="flex gap-4">
            <a
              href="/dashboard/resume-builder"
              className="rounded-xl border border-slate-600 hover:border-cyan-500 px-6 py-3 font-bold text-white transition"
            >
              ← Edit
            </a>
            <button
              onClick={() => window.print()}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-600 px-6 py-3 font-bold text-white transition"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="resume-template">
          <TemplateCorporate
            formData={resumeData.formData}
            aiResume={resumeData.aiResume}
          />
        </div>

      </div>
    </main>
  );
}