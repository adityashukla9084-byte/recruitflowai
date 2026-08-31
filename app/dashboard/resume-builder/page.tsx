"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import TemplateCorporate from "./components/TemplateCorporate";
import { ArrowLeft, ArrowRight, Sparkles, User, Target, GraduationCap, Briefcase, RefreshCw, Eye } from "lucide-react";

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
    targetRole: "",
    location: "",
    linkedin: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && active) {
        setForm((prev) => ({
          ...prev,
          email: user.email || "",
        }));

        supabase
          .from("profiles")
          .select("full_name, phone, education, university, bio")
          .eq("user_id", user.id)
          .then(({ data, error }) => {
            if (active && data && data.length > 0) {
              const profile = data[0];
              setForm((prev) => ({
                ...prev,
                name: profile.full_name || prev.name,
                phone: profile.phone || prev.phone,
                education: profile.education 
                  ? `${profile.education}${profile.university ? `, ${profile.university}` : ""}`
                  : prev.education,
                experience: profile.bio || prev.experience,
              }));
            }
          });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function generateResume() {
    if (!form.name.trim()) {
      alert("Please enter your full name.");
      setStep(1);
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

      window.location.href = "/dashboard/resume-builder/preview";
    } catch (err) {
      console.error(err);
      alert("Failed to generate resume. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Next / Back Actions
  const handleNext = () => {
    if (step === 1 && !form.name.trim()) {
      alert("Full Name is required.");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  // Convert raw form details into dynamic live preview structures
  const previewResumeData = {
    full_name: form.name || "YOUR FULL NAME",
    target_role: form.targetRole || "Desired Job Title",
    contact: {
      email: form.email || "email@example.com",
      phone: form.phone || "+1 (555) 000-0000",
      location: form.location || "City, State",
      linkedin: form.linkedin || "linkedin.com/in/username",
    },
    professional_summary: form.experience
      ? "AI will rewrite this raw experience detail to create a premium, tailored, professional summary highlighting your key corporate accomplishments..."
      : "Your tailored AI professional summary will appear here once generated.",
    core_skills: form.skills
      ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["Skill Focus A", "Skill Focus B", "Skill Focus C"],
    experience: form.experience
      ? [
          {
            title: form.targetRole || "Professional Role",
            organization: "Organization Details",
            location: form.location || "Location",
            start_date: "Start",
            end_date: "Present",
            bullets: [form.experience.substring(0, 180) + "..."],
          },
        ]
      : [
          {
            title: "Job Title or Academic Role",
            organization: "Organization / University / Project Team",
            location: "City, State",
            start_date: "Start Date",
            end_date: "End Date",
            bullets: [
              "Experienced Candidates: Detail your past job roles, key achievements, and quantifiable metrics.",
              "Freshers / Students: Describe academic capstone projects, coding internships, hackathons, open-source contributions, or student leadership roles.",
            ],
          },
        ],
    education: form.education
      ? [
          {
            degree: form.education.split(",")[0]?.trim() || "Degree Name",
            institution: form.education.split(",")[1]?.trim() || "University Name",
            location: "",
            year: "Graduation Year",
          },
        ]
      : [
          {
            degree: "Qualification / Course",
            institution: "University / School Board",
            location: "City, State",
            year: "Year",
          },
        ],
    certifications: ["Professional Certifications & Awards"],
    additional_sections: [],
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-[#FFFFF0] p-4 md:p-8 relative overflow-hidden flex items-center justify-center">
      {/* Decorative Background Glowing Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A028]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-[#C5A028]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl w-full grid lg:grid-cols-5 gap-8 items-start relative z-10">
        
        {/* Left Column: Form Wizard (2/5 Span) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Title & Progress */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A028]/10 border border-[#C5A028]/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 animate-pulse" />
              <span>Resume Builder v3.0</span>
            </div>
            
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-none text-[#FFFFF0]">
                Create AI Resume
              </h1>
              <p className="text-xs text-theme-text-secondary mt-1.5 font-medium leading-relaxed">
                Fill in your details stage-by-stage. Our AI will automatically rewrite, structure, and format your final resume to match professional ATS standards.
              </p>
            </div>

            {/* Stepped Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center text-xs font-bold text-theme-text">
                <span className="uppercase tracking-widest text-xs text-[#D4AF37] font-extrabold">
                  {step === 1 && "Stage 1: Personal Details"}
                  {step === 2 && "Stage 2: Career Targets"}
                  {step === 3 && "Stage 3: Academic History"}
                  {step === 4 && "Stage 4: Experience Profile"}
                </span>
                <span>Stage {step} of 4</span>
              </div>
              <div className="h-1.5 bg-theme-bg-secondary border border-zinc-900 rounded-full overflow-hidden flex gap-0.5">
                {[1, 2, 3, 4].map((num) => (
                  <div
                    key={num}
                    className={`h-full flex-1 transition-all duration-500 ${
                      num <= step ? "bg-[#C5A028]" : "bg-slate-800"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stepped Wizard Form Card */}
          <div className="rounded-2xl border border-zinc-900 bg-theme-bg-secondary/40 backdrop-blur-xl p-6 shadow-2xl space-y-6">
            
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-[fadeIn_0.3s]">
                <div className="flex items-center gap-2 text-[#FFFFF0] font-bold text-sm uppercase tracking-widest border-b border-zinc-800/80 pb-2">
                  <User className="h-4 w-4 text-[#D4AF37]" />
                  <span>Contact Information</span>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-theme-text font-bold uppercase tracking-wider">Full Name *</label>
                    <input
                      placeholder="e.g. Jane Doe"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      autoComplete="off"
                      className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-theme-text font-bold uppercase tracking-wider">Email Address</label>
                    <input
                      placeholder="e.g. jane.doe@example.com"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      autoComplete="off"
                      className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-theme-text font-bold uppercase tracking-wider">Phone Number</label>
                    <input
                      placeholder="e.g. +1 (555) 123-4567"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      autoComplete="off"
                      className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs text-theme-text font-bold uppercase tracking-wider">Location</label>
                      <input
                        placeholder="e.g. Chicago, IL"
                        value={form.location}
                        onChange={(e) => update("location", e.target.value)}
                        autoComplete="off"
                        className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-theme-text font-bold uppercase tracking-wider">LinkedIn URL</label>
                      <input
                        placeholder="linkedin.com/in/name"
                        value={form.linkedin}
                        onChange={(e) => update("linkedin", e.target.value)}
                        autoComplete="off"
                        className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Target Focus */}
            {step === 2 && (
              <div className="space-y-4 animate-[fadeIn_0.3s]">
                <div className="flex items-center gap-2 text-[#FFFFF0] font-bold text-sm uppercase tracking-widest border-b border-zinc-800/80 pb-2">
                  <Target className="h-4 w-4 text-[#D4AF37]" />
                  <span>Target Role & Skillset</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs text-theme-text font-bold uppercase tracking-wider">Target Job Title / Role</label>
                    <input
                      placeholder="e.g. Senior Product Manager"
                      value={form.targetRole}
                      onChange={(e) => update("targetRole", e.target.value)}
                      autoComplete="off"
                      className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-theme-text font-bold uppercase tracking-wider">Core Competencies / Skills (Comma separated)</label>
                    <textarea
                      rows={5}
                      placeholder="e.g. JavaScript, Product Design, Project Execution, Financial Modeling"
                      value={form.skills}
                      onChange={(e) => update("skills", e.target.value)}
                      className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition resize-none leading-relaxed"
                    />
                  </div>
                </div>

                <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-xs text-theme-text leading-relaxed">
                  💡 **Tip**: Enter keywords matching the job description. Our AI will automatically rewrite and list these skills according to relevance.
                </div>
              </div>
            )}

            {/* Step 3: Education */}
            {step === 3 && (
              <div className="space-y-4 animate-[fadeIn_0.3s]">
                <div className="flex items-center gap-2 text-[#FFFFF0] font-bold text-sm uppercase tracking-widest border-b border-zinc-800/80 pb-2">
                  <GraduationCap className="h-4 w-4 text-[#D4AF37]" />
                  <span>Academic History</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-theme-text font-bold uppercase tracking-wider">Education Details</label>
                  <textarea
                    rows={7}
                    placeholder="e.g. Master of Business Administration, Harvard University, 2021-2023, GPA 3.8&#10;Bachelor of Science in Computer Science, MIT, 2017-2021"
                    value={form.education}
                    onChange={(e) => update("education", e.target.value)}
                    className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition resize-none leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-xs text-theme-text leading-relaxed">
                  📌 **Format Guideline**: List your degree, university name, year range, and achievements/scores. Separate multiple entries with newlines.
                </div>
              </div>
            )}

            {/* Step 4: Experience */}
            {step === 4 && (
              <div className="space-y-4 animate-[fadeIn_0.3s]">
                <div className="flex items-center gap-2 text-[#FFFFF0] font-bold text-sm uppercase tracking-widest border-b border-zinc-800/80 pb-2">
                  <Briefcase className="h-4 w-4 text-[#D4AF37]" />
                  <span>Professional Background</span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-theme-text font-bold uppercase tracking-wider">Work History & Accomplishments</label>
                  <textarea
                    rows={8}
                    placeholder="e.g. Project Manager at Acme Corp (2022-Present): Led cross-functional team to launch product, increased user engagement by 20%, saved 5 hours/week."
                    value={form.experience}
                    onChange={(e) => update("experience", e.target.value)}
                    className="w-full rounded-xl bg-theme-bg-secondary/60 border border-zinc-900 p-4 text-sm outline-none text-[#FFFFF0] focus:border-[#C5A028]/30 transition resize-none leading-relaxed"
                  />
                </div>

                <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-xs text-theme-text leading-relaxed space-y-1">
                  <p>🚀 **Action Bullet Optimization**:</p>
                  <p className="pl-2">• Start sentences with strong verbs (Led, Managed, Developed).</p>
                  <p className="pl-2">• Quantify business impacts with percentages or numbers.</p>
                </div>
              </div>
            )}

            {/* Navigation Button Controls */}
            <div className="flex gap-4 border-t border-zinc-800/80 pt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 rounded-xl border border-zinc-800 hover:border-slate-700 text-zinc-300 font-bold py-3.5 flex items-center justify-center gap-2 hover:bg-theme-bg-secondary transition cursor-pointer text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              )}
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 rounded-xl bg-[#C5A028] hover:bg-[#B89020] text-slate-950 font-bold py-3.5 flex items-center justify-center gap-2 transition cursor-pointer text-sm"
                >
                  <span>Next Step</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={generateResume}
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#C5A028] hover:bg-[#B89020] disabled:bg-theme-bg-secondary disabled:cursor-not-allowed text-slate-950 font-bold py-3.5 flex items-center justify-center gap-2 transition cursor-pointer text-sm shadow-lg shadow-[#]"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Polishing Draft...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate AI Resume</span>
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Live Draft Preview Panel (3/5 Span) */}
        <div className="lg:col-span-3 hidden lg:block sticky top-8 bg-zinc-950/80 border border-zinc-900 rounded-3xl p-6 shadow-2xl h-[calc(100vh-6rem)] overflow-hidden">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
            <div className="flex items-center gap-2 text-theme-text font-bold text-xs uppercase tracking-widest">
              <Eye className="h-4 w-4 text-[#D4AF37]" />
              <span>Real-Time Draft Canvas</span>
            </div>
            <span className="text-xs bg-theme-bg-secondary border border-zinc-800/80 text-theme-text font-bold px-2 py-0.5 rounded uppercase">
              Interactive Preview
            </span>
          </div>

          {/* Scrollable Container (Unscaled) */}
          <div className="w-full h-[calc(100%-3rem)] overflow-y-auto overflow-x-hidden pr-2 flex justify-center items-start">
            {/* Inner Wrapper (Scaled) */}
            <div className="origin-top scale-[0.60] xl:scale-[0.70] transition-all duration-300 w-[794px] shrink-0 my-[-18%] xl:my-[-12%]">
              <TemplateCorporate
                formData={form}
                aiResume={previewResumeData}
              />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}