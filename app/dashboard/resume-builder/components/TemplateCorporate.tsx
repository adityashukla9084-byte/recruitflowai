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

type Props = {
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
    strengths?: string[];
    competencies?: string[];
  };
};

export default function TemplateCorporate({
  formData,
  aiResume,
}: Props) {
  // Parse skills robustly (handles commas, newlines, and lists like "1. Skill A 2 Skill B")
  let skillsList: string[] = [];
  if (formData.skills) {
    const rawSkills = formData.skills.trim();
    if (rawSkills.includes("\n")) {
      skillsList = rawSkills.split("\n").map(s => s.trim().replace(/^[-•*✔▪●]\s*/, "")).filter(Boolean);
    } else if (rawSkills.match(/\d+[.)]?\s+/)) {
      // Split on digits that serve as delimiters (e.g., " 2 ", " 3. ")
      const parts = rawSkills.split(/\s+(?=\d+\b)/);
      skillsList = parts.map(s => s.replace(/^\d+[.)]?\s*/, "").trim()).filter(Boolean);
    } else if (rawSkills.includes(",")) {
      skillsList = rawSkills.split(",").map(s => s.trim()).filter(Boolean);
    } else {
      skillsList = [rawSkills];
    }
  }

  // Parse education string into structured items for the table
  const eduLines = formData.education
    ? formData.education.split("\n").map((line) => line.trim()).filter(Boolean)
    : [];

  // Helper to format single passing years into logical academic ranges
  const formatYearRange = (yearStr: string, qualText: string) => {
    const clean = yearStr.trim();
    if (clean === "—" || clean.includes("-") || clean.includes("–")) {
      return clean;
    }
    const yearNum = parseInt(clean, 10);
    if (isNaN(yearNum)) return clean;

    const qualLower = qualText.toLowerCase();
    if (qualLower.includes("masters") || qualLower.includes("m.a.") || qualLower.includes("m.sc") || qualLower.includes("mba") || qualLower.includes("post graduate")) {
      return `${yearNum - 2} - ${yearNum}`;
    }
    if (qualLower.includes("bachelors") || qualLower.includes("b.a.") || qualLower.includes("b.sc") || qualLower.includes("b.tech") || qualLower.includes("degree") || qualLower.includes("graduation")) {
      return `${yearNum - 3} - ${yearNum}`; // standard 3-year BA
    }
    if (qualLower.includes("intermediate") || qualLower.includes("class xii") || qualLower.includes("12th") || qualLower.includes("senior secondary") || qualLower.includes("public school")) {
      return `${yearNum - 2} - ${yearNum}`;
    }
    if (qualLower.includes("class x") || qualLower.includes("10th") || qualLower.includes("secondary")) {
      return `${yearNum - 1} - ${yearNum}`;
    }
    return `${yearNum - 2} - ${yearNum}`; // Default fallback range duration
  };

  const parsedEducation = eduLines.map((line) => {
    // Extract A4 single 4-digit year or range (e.g. 2023 - 2025, 2021) without matching marks/percentages
    const yearMatch = line.match(/\b\d{4}\s*[-–]\s*\d{4}\b|\b\d{4}\b/);
    let year = yearMatch ? yearMatch[0] : "—";

    // Try to extract score percentage or CGPA (e.g., 85% or 7.8 CGPA)
    const scoreMatch = line.match(/\d+(?:\.\d+)?\s*(?:%|CGPA)/i);
    const score = scoreMatch ? scoreMatch[0] : "—";

    // Remove parsed year/score to clean the qualification text
    let qualification = line;
    if (yearMatch) qualification = qualification.replace(yearMatch[0], "");
    if (scoreMatch) qualification = qualification.replace(scoreMatch[0], "");
    
    qualification = qualification
      .trim()
      .replace(/^[-•*✔▪●]\s*/, "") // Remove bullet symbols
      .replace(/,\s*$/, "") // Remove trailing comma
      .trim();

    // Format single years into ranges dynamically
    year = formatYearRange(year, qualification);

    return { qualification, year, score };
  });

  // Dynamic Fallbacks based on candidate metadata instead of hardcoding another user's content
  const languagesList = aiResume.languages && aiResume.languages.length > 0 
    ? aiResume.languages 
    : ["English (Fluent)", "Hindi (Fluent)"];

  const strengthsList = aiResume.strengths && aiResume.strengths.length > 0
    ? aiResume.strengths
    : ["Clear Communicator", "Analytical Thinker", "Quick Learner", "Team Player", "Detail-Oriented", "Time Management"];

  const defaultCompetencies = [
    "Language & Communication: Proficient in writing, speaking, and organizing ideas clearly.",
    "Project Execution: Experienced in coordinating milestones, tasks, and deadlines.",
    "Collaboration: Supportive contributor focused on positive group outcomes."
  ];

  const competenciesList = aiResume.competencies && aiResume.competencies.length > 0
    ? aiResume.competencies
    : (aiResume.experience && aiResume.experience.length > 0
        ? aiResume.experience.map(exp => `${exp.title}: Driving growth and success at ${exp.company || "relevant projects"}.`)
        : defaultCompetencies);

  return (
    <div className="max-w-[794px] w-full min-h-[1123px] print:h-[297mm] print:w-[210mm] bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:max-w-[210mm] print:max-h-[297mm] flex flex-col font-sans text-slate-800">
      
      {/* ── Header Banner (Centered, Dark Blue Background) ── */}
      <div className="bg-[#0f1e36] text-white py-7 px-10 text-center select-none border-b-4 border-cyan-500 print:py-6">
        <h1 className="text-3.5xl font-black tracking-widest uppercase text-white leading-none">
          {formData.name || "CANDIDATE NAME"}
        </h1>
        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mt-2">
          Professional Resume
        </p>
      </div>

      <div className="flex flex-1 print:h-full">

        {/* ── Left Sidebar (Light Blue/Gray background) ── */}
        <div className="w-[30%] bg-[#f0f4f8] p-6 print:p-4.5 print:flex-shrink-0 border-r border-[#e2e8f0] space-y-5">
          
          {/* Contact */}
          <div>
            <h2 className="text-xs font-bold tracking-widest text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase mb-2.5">
              CONTACT
            </h2>
            <div className="space-y-2 text-[11px] font-medium text-slate-700 leading-relaxed">
              {formData.phone && <p className="flex items-center gap-1.5">📞 {formData.phone}</p>}
              {formData.email && <p className="flex items-center gap-1.5 break-all">✉ {formData.email}</p>}
              <p className="flex items-center gap-1.5">📍 Meerut, UP, India</p>
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="text-xs font-bold tracking-widest text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase mb-2.5">
              LANGUAGES
            </h2>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {languagesList.map((lang, index) => <p key={index}>• {lang}</p>)}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h2 className="text-xs font-bold tracking-widest text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase mb-2.5">
              TECHNICAL SKILLS
            </h2>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {skillsList.length > 0 ? (
                skillsList.map((skill, index) => <p key={index}>▪ {skill}</p>)
              ) : (
                <p className="text-slate-400 italic">No skills listed</p>
              )}
            </div>
          </div>

          {/* Strengths */}
          <div>
            <h2 className="text-xs font-bold tracking-widest text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase mb-2.5">
              STRENGTHS
            </h2>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {strengthsList.map((str, index) => (
                <p key={index}>● {str}</p>
              ))}
            </div>
          </div>

        </div>

        {/* ── Right Content Area (White background) ── */}
        <div className="flex-1 p-8 print:p-5 print:py-5.5 space-y-4.5">

          {/* Professional Profile */}
          {aiResume.summary && (
            <div>
              <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2">
                PROFESSIONAL PROFILE
              </h2>
              <p className="text-[11px] leading-5 text-slate-700 text-justify">
                {aiResume.summary}
              </p>
            </div>
          )}

          {/* Education Table */}
          <div>
            <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2">
              EDUCATION
            </h2>
            <div className="overflow-hidden border border-[#cbd5e0] rounded-lg mt-2.5">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-[#0f1e36] text-white text-[10px] uppercase tracking-wider">
                    <th className="py-1.5 px-3 font-bold">Qualification</th>
                    <th className="py-1.5 px-3 font-bold w-24 text-center">Year</th>
                    <th className="py-1.5 px-3 font-bold w-20 text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedEducation.length > 0 ? (
                    parsedEducation.map((edu, index) => (
                      <tr key={index} className="border-b border-[#cbd5e0] last:border-b-0 hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-semibold text-slate-800">{edu.qualification}</td>
                        <td className="py-2 px-3 text-slate-600 text-center">{edu.year}</td>
                        <td className="py-2 px-3 font-bold text-slate-700 text-center">{edu.score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-2 px-3 text-slate-500 italic text-center">No education records provided</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Core Competencies */}
          <div>
            <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2.5">
              CORE COMPETENCIES
            </h2>
            <div className="space-y-1.5 text-[11px] text-slate-700 leading-4">
              {competenciesList.map((comp, index) => {
                const parts = comp.split(":");
                const title = parts[0];
                const desc = parts.slice(1).join(":");
                return (
                  <p key={index}>
                    <strong className="text-slate-800 font-bold">▸ {title}:</strong>{desc}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Academic Projects & Engagements */}
          {aiResume.experience && aiResume.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2.5">
                ACADEMIC PROJECTS & ENGAGEMENTS
              </h2>
              <div className="space-y-2">
                {aiResume.experience.map((exp, index) => (
                  <div key={index} className="text-[11px] text-slate-700">
                    <div className="flex justify-between items-baseline font-bold text-slate-800">
                      <span>▸ {exp.title}</span>
                      <span className="text-slate-500 font-medium text-[10px]">{exp.duration}</span>
                    </div>
                    {exp.company && <p className="text-cyan-700 font-semibold mb-0.5">{exp.company}</p>}
                    {exp.bullets && exp.bullets.length > 0 ? (
                      <p className="text-slate-600 pl-4.5 mt-0.5 leading-4 text-justify">
                        {exp.bullets.join(" ")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications (Positioned properly to fit) */}
          {aiResume.certifications && aiResume.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2">
                CERTIFICATIONS
              </h2>
              <ul className="grid grid-cols-1 gap-1 pl-4.5 list-disc text-[11px] text-slate-700 mt-2">
                {aiResume.certifications.map((cert, index) => (
                  <li key={index} className="leading-relaxed">{cert}</li>
                ))}
              </ul>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}