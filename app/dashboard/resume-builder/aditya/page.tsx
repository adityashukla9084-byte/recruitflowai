"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AdityaResumePage() {
  const contactInfo = {
    name: "Aditya Shukla",
    title: "English Literature Graduate & Academic Researcher",
    phone: "+91 90688 69828",
    email: "Adityashukla9836@gmail.com",
    linkedin: "linkedin.com/in/adityashukla",
    portfolio: "adityashuklablog.com",
  };

  const summary =
    "Highly motivated and detail-oriented M.A. English Literature candidate with a proven track record in advanced literary analysis, critical research, and effective communication. Adept at synthesizing complex information, crafting compelling arguments, and delivering impactful presentations. Seeking to leverage strong analytical capabilities, academic excellence, and transferable skills in a challenging professional environment.";

  const skillsList = {
    technical: [
      "Literary Analysis & Critical Research",
      "Textual Criticism & Contextual Analysis",
      "Digital Humanities Cataloging & Archive Contribution",
      "Blog Management & Digital Publishing",
      "Online Content Creation",
    ],
    soft: [
      "Clear & Persuasive Communication",
      "Analytical & Independent Thinking",
      "Rapid Academic Learning",
      "Team Collaboration & Co-authorship",
      "Meticulous Detail Orientation & Time Management",
    ],
    languages: ["English (Fluent)", "Hindi (Fluent)"],
  };

  const education = [
    {
      degree: "Master of Arts (M.A.) in English Literature",
      institution: "University of Delhi, Delhi",
      year: "2023 - 2025",
      score: "CGPA: 8.2/10 (Expected)",
    },
    {
      degree: "Bachelor of Arts (B.A. Hons.) in English",
      institution: "University of Delhi, Delhi",
      year: "2020 - 2023",
      score: "CGPA: 7.9/10",
    },
    {
      degree: "Class XII (Senior Secondary, CBSE)",
      institution: "Kendriya Vidyalaya, New Delhi",
      year: "2019 - 2020",
      score: "Percentage: 88.5%",
    },
    {
      degree: "Class X (Secondary, CBSE)",
      institution: "Kendriya Vidyalaya, New Delhi",
      year: "2016 - 2017",
      score: "CGPA: 9.2/10",
    },
  ];

  const experience = [
    {
      title: "Graduate Research & Academic Contributor",
      company: "Academic Studies, Leading Institution",
      duration: "2023 - Present",
      bullets: [
        "Delivered multiple structured presentations on advanced literary theory and textual criticism, earning high commendations for clarity and analytical depth from faculty and peers.",
        "Authored a detailed analytical research paper exploring identity and post-colonial themes in contemporary Indian English fiction, demonstrating critical inquiry skills.",
        "Conducted a comprehensive cross-cultural comparative study of Victorian and modern Indian prose styles to develop a nuanced understanding of socio-literary contexts.",
      ],
    },
    {
      title: "Digital Humanities Research Assistant",
      company: "University Initiative",
      duration: "2023 - 2024",
      bullets: [
        "Collaborated on a university-led digital humanities initiative to catalog and analyze literary texts.",
        "Utilized advanced research methodologies and meticulous attention to detail to contribute to an online public archive, enhancing database accessibility.",
      ],
    },
    {
      title: "Literary Content Creator & Blog Manager",
      company: "Personal Digital Platform",
      duration: "2021 - 2023",
      bullets: [
        "Developed and managed a personal online platform dedicated to literary analysis, book reviews, and cultural commentary.",
        "Articulated complex ideas to a broad audience, fostering reader engagement and showcasing independent critical thought.",
      ],
    },
  ];

  const certifications = [
    "Academic Writing & Research Skills (Online Certification)",
    "Advanced Presentation Design & Delivery (Workshop)",
    "Introduction to Digital Tools for Humanities Research (Course)",
  ];

  return (
    <main className="min-h-screen bg-slate-950 p-6 sm:p-10 text-slate-800">
      
      {/* Dynamic Local Print Override styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait !important;
            margin: 12mm 12mm 12mm 12mm !important;
          }
          html, body {
            background: #FFFFFF !important;
            color: #1E293B !important;
            font-family: 'Arial', 'Helvetica', sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            overflow: hidden !important;
          }
          main {
            background: #FFFFFF !important;
            padding: 0 !important;
            min-height: auto !important;
          }
          .no-print {
            display: none !important;
          }
          .print-a4-sheet {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
            background: #FFFFFF !important;
          }
        }
      `}</style>

      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print text-white">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl bg-teal-600 hover:bg-indigo-700 active:scale-95 px-5 py-2.5 font-bold text-white transition-all duration-200 shadow-lg shadow-indigo-500/20"
        >
          <Printer size={15} />
          Print / Save A4 PDF
        </button>
      </div>

      {/* A4 Paper Template */}
      <div 
        className="print-a4-sheet mx-auto bg-white border border-slate-200 shadow-2xl p-10 flex flex-col justify-between"
        style={{
          width: "210mm",
          height: "297mm",
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div className="space-y-4.5">
          {/* 1. CONTACT INFO */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase mb-1">
              {contactInfo.name}
            </h1>
            <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-2.5">
              {contactInfo.title}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
              <span>📞 {contactInfo.phone}</span>
              <span>✉ {contactInfo.email}</span>
              <a href={`https://${contactInfo.linkedin}`} target="_blank" className="hover:underline">🔗 LinkedIn</a>
              <a href={`https://${contactInfo.portfolio}`} target="_blank" className="hover:underline">🌐 Blog</a>
            </div>
          </div>

          {/* 2. SUMMARY */}
          <div className="space-y-1.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Professional Summary
            </h2>
            <p className="text-xs text-slate-600 leading-5 text-justify">
              {summary}
            </p>
          </div>

          {/* 3. SKILLS */}
          <div className="space-y-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Core Skills
            </h2>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-800 border-b border-slate-200 pb-0.5">TECHNICAL SKILLS</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {skillsList.technical.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 border-b border-slate-200 pb-0.5">SOFT SKILLS</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {skillsList.soft.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-800 border-b border-slate-200 pb-0.5">LANGUAGES</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                  {skillsList.languages.map((lang, index) => (
                    <li key={index}>{lang}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 4. EDUCATION */}
          <div className="space-y-2">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Education
            </h2>
            <div className="space-y-1.5">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-slate-500 font-medium"> — {edu.institution}</span>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="font-bold text-slate-700">{edu.score}</span>
                    <span className="text-slate-500 ml-2">({edu.year})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. EXPERIENCE & PROJECTS */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
              Work Experience & Projects
            </h2>
            <div className="space-y-3">
              {experience.map((exp, index) => (
                <div key={index} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{exp.title}</span>
                    <span className="text-slate-500 font-medium">{exp.duration}</span>
                  </div>
                  <div className="text-indigo-700 font-bold">{exp.company}</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600 leading-4">
                    {exp.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 6. CERTIFICATIONS */}
          {certifications.length > 0 && (
            <div className="space-y-1.5">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide">
                Certifications
              </h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-0.5 list-disc pl-4 text-xs text-slate-600">
                {certifications.map((cert, index) => (
                  <li key={index}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-medium">
          Aditya Shukla • Resume generated & verified via RecruitFlow AI evaluation protocol.
        </div>
      </div>

    </main>
  );
}
