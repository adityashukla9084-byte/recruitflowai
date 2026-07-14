"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import TemplateCorporate from "../components/TemplateCorporate";

type ContactInfo = {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
};

type ExperienceItem = {
  title: string;
  organization: string;
  location: string;
  start_date: string;
  end_date: string;
  bullets: string[];
};

type EducationItem = {
  degree: string;
  institution: string;
  location: string;
  year: string;
};

type AdditionalSection = {
  heading: string;
  items: string[];
};

type ResumeData = {
  formData: {
    name: string;
    email: string;
    phone: string;
    skills: string;
    education: string;
    experience: string;
    targetRole?: string;
    location?: string;
    linkedin?: string;
  };
  aiResume: {
    full_name: string;
    target_role: string;
    contact: ContactInfo;
    professional_summary: string;
    core_skills: string[];
    experience: ExperienceItem[];
    education: EducationItem[];
    certifications: string[];
    additional_sections: AdditionalSection[];
  };
};

export default function ResumePreview() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem("generatedResume");

    if (data) {
      try {
        const parsed = JSON.parse(data);

        // Handle legacy format (plain string)
        if (typeof parsed === "string") {
          setResumeData({
            formData: {
              name: "Your Name",
              email: "",
              phone: "",
              skills: "",
              education: "",
              experience: "",
            },
            aiResume: {
              full_name: "Your Name",
              target_role: "",
              contact: { email: "", phone: "", location: "", linkedin: "" },
              professional_summary: parsed,
              core_skills: [],
              experience: [],
              education: [],
              certifications: [],
              additional_sections: [],
            },
          });
        } else {
          setResumeData(parsed);
        }
      } catch {
        // If parsing fails entirely, treat as plain string
        setResumeData({
          formData: {
            name: "Your Name",
            email: "",
            phone: "",
            skills: "",
            education: "",
            experience: "",
          },
          aiResume: {
            full_name: "Your Name",
            target_role: "",
            contact: { email: "", phone: "", location: "", linkedin: "" },
            professional_summary: data,
            core_skills: [],
            experience: [],
            education: [],
            certifications: [],
            additional_sections: [],
          },
        });
      }
    }
  }, []);

  if (!mounted) {
    return <main className="min-h-screen bg-slate-950" />;
  }

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
    <main className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* Background blobs for premium space-dark look */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto print-container relative z-10 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print border-b border-slate-900 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              <span>ATS Score Optimized</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white leading-none">
              AI Resume Preview
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Review your polished resume. Click Download PDF to save or print the document.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/dashboard/resume-builder"
              className="rounded-xl border border-slate-800 hover:border-slate-700 px-5 py-3.5 font-bold text-sm text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer bg-slate-950/20 backdrop-blur"
            >
              <span>← Edit Details</span>
            </a>
            <button
              onClick={() => window.print()}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 px-6 py-3.5 font-bold text-sm transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        <div className="resume-template shadow-2xl rounded-2xl overflow-hidden print:rounded-none">
          <TemplateCorporate
            formData={resumeData.formData}
            aiResume={resumeData.aiResume}
          />
        </div>

      </div>
    </main>
  );
}