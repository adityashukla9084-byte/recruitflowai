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
  };
};

export default function TemplateCorporate({
  formData,
  aiResume,
}: Props) {
  // Parse skills from comma-separated string
  const skillsList = formData.skills
    ? formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="max-w-[794px] w-full min-h-[1123px] bg-white shadow-2xl mx-auto overflow-hidden print:shadow-none print:max-w-none print:min-h-0">

      <div className="flex">

        {/* ── Sidebar ── */}
        <div className="w-[32%] bg-slate-900 text-white p-8 print:p-6">

          <div className="w-28 h-28 rounded-full bg-cyan-500 flex items-center justify-center text-4xl font-bold mb-8">
            {formData.name
              ? formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "AI"}
          </div>

          {/* Contact */}
          <h2 className="text-xl font-bold mb-4 text-cyan-400">
            CONTACT
          </h2>

          <div className="space-y-3 text-sm">
            {formData.email && (
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">✉</span>
                <span className="break-all">{formData.email}</span>
              </div>
            )}
            {formData.phone && (
              <div className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">📞</span>
                <span>{formData.phone}</span>
              </div>
            )}
            {!formData.email && !formData.phone && (
              <p className="text-slate-400 italic text-xs">No contact info provided</p>
            )}
          </div>

          {/* Skills */}
          {skillsList.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">
                SKILLS
              </h2>
              <div className="space-y-2 text-sm">
                {skillsList.map((skill, index) => (
                  <p key={index}>✔ {skill}</p>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">
              EDUCATION
            </h2>
            {formData.education ? (
              <p className="text-sm leading-6 whitespace-pre-wrap">
                {formData.education}
              </p>
            ) : (
              <p className="text-slate-400 italic text-xs">
                No education info provided
              </p>
            )}
          </div>

        </div>

        {/* ── Main Content ── */}
        <div className="flex-1 p-10">

          {/* Name & Title */}
          <h1 className="text-4xl font-extrabold text-slate-900">
            {formData.name || "Your Name"}
          </h1>

          <p className="text-cyan-600 mt-2 text-lg">
            Professional Resume
          </p>

          {/* Contact line */}
          {(formData.phone || formData.email) && (
            <p className="mt-2 text-sm text-slate-500">
              {[formData.phone, formData.email]
                .filter(Boolean)
                .join(" | ")}
            </p>
          )}

          {/* Professional Summary */}
          {aiResume.summary && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 border-b-2 border-cyan-500 pb-2 uppercase">
                Summary
              </h2>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-700 text-sm">
                {aiResume.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {aiResume.experience && aiResume.experience.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 border-b-2 border-cyan-500 pb-2 uppercase">
                Experience
              </h2>
              <div className="mt-4 space-y-5">
                {aiResume.experience.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-base text-slate-900">
                        {exp.title}
                      </h3>
                      {exp.duration && (
                        <span className="text-xs text-slate-500 shrink-0 ml-2">
                          {exp.duration}
                        </span>
                      )}
                    </div>
                    {exp.company && (
                      <p className="text-cyan-700 text-sm font-medium">
                        {exp.company}
                      </p>
                    )}
                    {exp.bullets && exp.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-slate-700 list-disc ml-5">
                        {exp.bullets.map((bullet, bIndex) => (
                          <li key={bIndex} className="leading-6">
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {aiResume.projects && aiResume.projects.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 border-b-2 border-cyan-500 pb-2 uppercase">
                Projects
              </h2>
              <div className="mt-4 space-y-4">
                {aiResume.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-base text-slate-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-slate-700 leading-6 mt-1">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {aiResume.certifications && aiResume.certifications.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 border-b-2 border-cyan-500 pb-2 uppercase">
                Certifications
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {aiResume.certifications.map((cert, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-cyan-600 mt-0.5">●</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Languages */}
          {aiResume.languages && aiResume.languages.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-slate-900 border-b-2 border-cyan-500 pb-2 uppercase">
                Languages
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                {aiResume.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-cyan-100 text-cyan-700 px-4 py-2 text-sm font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}