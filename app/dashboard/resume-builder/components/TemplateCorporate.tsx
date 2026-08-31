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

type Props = {
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

export default function TemplateCorporate({
  formData,
  aiResume,
}: Props) {
  // Parse skills fallback robustly if aiResume.core_skills is empty
  let skillsList: string[] = aiResume.core_skills && aiResume.core_skills.length > 0
    ? aiResume.core_skills
    : [];

  if (skillsList.length === 0 && formData.skills) {
    const rawSkills = formData.skills.trim();
    if (rawSkills.includes("\n")) {
      skillsList = rawSkills.split("\n").map(s => s.trim().replace(/^[-•*✔▪●]\s*/, "")).filter(Boolean);
    } else if (rawSkills.match(/\d+[.)]?\s+/)) {
      const parts = rawSkills.split(/\s+(?=\d+\b)/);
      skillsList = parts.map(s => s.replace(/^\d+[.)]?\s*/, "").trim()).filter(Boolean);
    } else if (rawSkills.includes(",")) {
      skillsList = rawSkills.split(",").map(s => s.trim()).filter(Boolean);
    } else {
      skillsList = [rawSkills];
    }
  }

  // Parse education string fallback if aiResume.education is empty
  const eduLines = formData.education
    ? formData.education.split("\n").map((line) => line.trim()).filter(Boolean)
    : [];

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
      return `${yearNum - 3} - ${yearNum}`;
    }
    if (qualLower.includes("intermediate") || qualLower.includes("class xii") || qualLower.includes("12th") || qualLower.includes("senior secondary") || qualLower.includes("public school")) {
      return `${yearNum - 2} - ${yearNum}`;
    }
    if (qualLower.includes("class x") || qualLower.includes("10th") || qualLower.includes("secondary")) {
      return `${yearNum - 1} - ${yearNum}`;
    }
    return `${yearNum - 2} - ${yearNum}`;
  };

  const parsedEducation = eduLines.map((line) => {
    const yearMatch = line.match(/\b\d{4}\s*[-–]\s*\d{4}\b|\b\d{4}\b/);
    let year = yearMatch ? yearMatch[0] : "—";
    const scoreMatch = line.match(/\d+(?:\.\d+)?\s*(?:%|CGPA)/i);
    const score = scoreMatch ? scoreMatch[0] : "—";

    let qualification = line;
    if (yearMatch) qualification = qualification.replace(yearMatch[0], "");
    if (scoreMatch) qualification = qualification.replace(scoreMatch[0], "");
    
    qualification = qualification
      .trim()
      .replace(/^[-•*✔▪●]\s*/, "")
      .replace(/,\s*$/, "")
      .trim();

    year = formatYearRange(year, qualification);
    return { qualification, year, score };
  });

  const educationList = aiResume.education && aiResume.education.length > 0
    ? aiResume.education.map(edu => ({
        qualification: edu.degree,
        institution: edu.institution,
        location: edu.location,
        year: edu.year,
        score: "—"
      }))
    : parsedEducation.map(edu => ({
        qualification: edu.qualification,
        institution: "",
        location: "",
        year: edu.year,
        score: edu.score
      }));

  // Helper variables for sidebar filtering
  const additionalSections = aiResume.additional_sections || [];
  const sidebarSectionKeywords = ["language", "lang", "strength", "competenc", "interest", "hobb", "skill"];
  
  const sidebarSections = additionalSections.filter(sec => 
    sidebarSectionKeywords.some(keyword => sec.heading.toLowerCase().includes(keyword))
  );
  const mainSections = additionalSections.filter(sec => 
    !sidebarSectionKeywords.some(keyword => sec.heading.toLowerCase().includes(keyword))
  );

  // Fallback lists for legacy compatibility
  const languagesList = (aiResume as any).languages && (aiResume as any).languages.length > 0 
    ? (aiResume as any).languages 
    : ["English (Fluent)", "Hindi (Fluent)"];

  const strengthsList = (aiResume as any).strengths && (aiResume as any).strengths.length > 0
    ? (aiResume as any).strengths
    : ["Clear Communicator", "Analytical Thinker", "Quick Learner", "Team Player", "Detail-Oriented", "Time Management"];

  const defaultCompetencies = [
    "Language & Communication: Proficient in writing, speaking, and organizing ideas clearly.",
    "Project Execution: Experienced in coordinating milestones, tasks, and deadlines.",
    "Collaboration: Supportive contributor focused on positive group outcomes."
  ];

  const competenciesList = (aiResume as any).competencies && (aiResume as any).competencies.length > 0
    ? (aiResume as any).competencies
    : (aiResume.experience && aiResume.experience.length > 0
        ? aiResume.experience.map(exp => `${exp.title}: Driving growth and success at ${exp.organization || (exp as any).company || "relevant projects"}.`)
        : defaultCompetencies);

  // Dynamic Skill Heading
  const isTechnical = (aiResume.target_role || formData.skills || "").toLowerCase().match(/software|developer|engineer|programmer|coder|tech/i);
  const skillsHeading = isTechnical ? "TECHNICAL SKILLS" : "CORE SKILLS";

  // Contact Info Resolution
  const emailVal = aiResume.contact?.email || formData.email;
  const phoneVal = aiResume.contact?.phone || formData.phone;
  const locationVal = aiResume.contact?.location || formData.location || "Meerut, UP, India";
  const linkedinVal = aiResume.contact?.linkedin || formData.linkedin;

  return (
    <div className="max-w-[794px] w-full min-h-[1123px] print:h-[297mm] print:w-[210mm] bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:max-w-[210mm] print:max-h-[297mm] flex flex-col font-sans text-slate-800">
      
      {/* ── Header Banner (Centered, Dark Blue Background) ── */}
      <div className="bg-[#0f1e36] text-[#FFFFF0] py-7 px-10 text-center select-none border-b-4 border-[#C5A028] print:py-6">
        <h1 className="text-3.5xl font-black tracking-widest uppercase text-[#FFFFF0] leading-none">
          {aiResume.full_name || formData.name || "CANDIDATE NAME"}
        </h1>
        <p className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest mt-2">
          {aiResume.target_role || "Professional Resume"}
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
              {phoneVal && <p className="flex items-center gap-1.5">📞 {phoneVal}</p>}
              {emailVal && <p className="flex items-center gap-1.5 break-all">✉ {emailVal}</p>}
              {locationVal && <p className="flex items-center gap-1.5">📍 {locationVal}</p>}
              {linkedinVal && <p className="flex items-center gap-1.5 break-all">🔗 {linkedinVal}</p>}
            </div>
          </div>

          {/* Core/Technical Skills */}
          <div>
            <h2 className="text-xs font-bold tracking-widest text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase mb-2.5">
              {skillsHeading}
            </h2>
            <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
              {skillsList.length > 0 ? (
                skillsList.map((skill, index) => <p key={index}>▪ {skill}</p>)
              ) : (
                <p className="text-theme-text italic">No skills listed</p>
              )}
            </div>
          </div>

          {/* Dynamic Sidebar Sections */}
          {sidebarSections.length > 0 ? (
            sidebarSections.map((sec, index) => (
              <div key={index}>
                <h2 className="text-xs font-bold tracking-widest text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase mb-2.5">
                  {sec.heading}
                </h2>
                <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
                  {sec.items.map((item, idx) => (
                    <p key={idx}>• {item}</p>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <>
              {/* Fallback legacy sections */}
              <div>
                <h2 className="text-xs font-bold tracking-widest text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase mb-2.5">
                  LANGUAGES
                </h2>
                <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
                  {languagesList.map((lang: string, index: number) => <p key={index}>• {lang}</p>)}
                </div>
              </div>
              <div>
                <h2 className="text-xs font-bold tracking-widest text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase mb-2.5">
                  STRENGTHS
                </h2>
                <div className="space-y-1.5 text-[11px] text-slate-700 font-medium">
                  {strengthsList.map((str: string, index: number) => (
                    <p key={index}>● {str}</p>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>

        {/* ── Right Content Area (White background) ── */}
        <div className="flex-1 p-8 print:p-5 print:py-5.5 space-y-4.5">

          {/* Professional Summary */}
          {(aiResume.professional_summary || aiResume.professional_summary === "" || (aiResume as any).summary) && (
            <div>
              <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2">
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-[11px] leading-5 text-slate-700 text-justify">
                {aiResume.professional_summary || (aiResume as any).summary}
              </p>
            </div>
          )}

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2">
              EDUCATION
            </h2>
            <div className="overflow-hidden border border-[#cbd5e0] rounded-lg mt-2.5">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-[#0f1e36] text-[#FFFFF0] text-xs uppercase tracking-wider">
                    <th className="py-1.5 px-3 font-bold">Qualification / Institution</th>
                    <th className="py-1.5 px-3 font-bold w-24 text-center">Year</th>
                    <th className="py-1.5 px-3 font-bold w-20 text-center">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {educationList.length > 0 ? (
                    educationList.map((edu, index) => (
                      <tr key={index} className="border-b border-[#cbd5e0] last:border-b-0 hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-semibold text-slate-800">
                          {edu.qualification}
                          {(edu.institution || edu.location) && (
                            <span className="block text-xs font-normal text-zinc-300">
                              {edu.institution || ""}{edu.location ? `, ${edu.location}` : ""}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-theme-text text-center">{edu.year}</td>
                        <td className="py-2 px-3 font-bold text-slate-700 text-center">{edu.score}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-2 px-3 text-zinc-300 italic text-center">No education records provided</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Professional Experience */}
          {aiResume.experience && aiResume.experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2.5">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-3">
                {aiResume.experience.map((exp, index) => {
                  const orgName = exp.organization || (exp as any).company || "";
                  const loc = exp.location || "";
                  const duration = (exp.start_date && exp.end_date)
                    ? `${exp.start_date} - ${exp.end_date}`
                    : ((exp as any).duration || "");

                  return (
                    <div key={index} className="text-[11px] text-slate-700">
                      <div className="flex justify-between items-baseline font-bold text-slate-800">
                        <span>▸ {exp.title}</span>
                        <span className="text-zinc-300 font-medium text-xs">{duration}</span>
                      </div>
                      {orgName && (
                        <p className="text-cyan-700 font-semibold mb-0.5">
                          {orgName}{loc ? ` (${loc})` : ""}
                        </p>
                      )}
                      {exp.bullets && exp.bullets.length > 0 ? (
                        <ul className="list-disc pl-4.5 mt-1 space-y-1 text-theme-text">
                          {exp.bullets.map((bullet, idx) => (
                            <li key={idx} className="leading-4 text-justify">{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dynamic Main Sections (Awards, Volunteer, Projects, etc.) */}
          {mainSections.map((sec, index) => (
            <div key={index}>
              <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2.5">
                {sec.heading}
              </h2>
              <ul className="list-disc pl-4.5 mt-1 space-y-1 text-[11px] text-slate-700">
                {sec.items.map((item, idx) => (
                  <li key={idx} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legacy Key Projects Fallback */}
          {(!aiResume.additional_sections || aiResume.additional_sections.length === 0) && (aiResume as any).projects && (aiResume as any).projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2.5">
                KEY PROJECTS & ENGAGEMENTS
              </h2>
              <div className="space-y-2">
                {((aiResume as any).projects as any[]).map((proj, index) => (
                  <div key={index} className="text-[11px] text-slate-700">
                    <div className="font-bold text-slate-800">
                      <span>▸ {proj.name}</span>
                    </div>
                    {proj.description && (
                      <p className="text-theme-text pl-4.5 mt-0.5 leading-4 text-justify">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legacy Competencies Fallback */}
          {(!aiResume.additional_sections || aiResume.additional_sections.length === 0) && competenciesList && competenciesList.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-[#0f1e36] border-b border-[#cbd5e0] pb-1 uppercase tracking-wide mb-2.5">
                CORE COMPETENCIES
              </h2>
              <div className="space-y-1.5 text-[11px] text-slate-700 leading-4">
                {competenciesList.map((comp: string, index: number) => {
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
          )}

          {/* Certifications */}
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
