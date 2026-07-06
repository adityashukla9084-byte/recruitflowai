export default function Hero() {
  return (
    <div className="mb-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-8 shadow-2xl">
      <h1 className="text-5xl font-extrabold">
        🚀 RecruitFlow AI
      </h1>

      <p className="mt-4 max-w-3xl text-lg text-cyan-100">
        Analyze resumes, improve ATS score, match job descriptions,
        generate cover letters and prepare for interviews — all powered by AI.
      </p>

      <div className="mt-8 flex gap-4 flex-wrap">
        <div className="rounded-xl bg-white/10 px-5 py-3">
          ⚡ AI Powered
        </div>

        <div className="rounded-xl bg-white/10 px-5 py-3">
          📄 ATS Optimized
        </div>

        <div className="rounded-xl bg-white/10 px-5 py-3">
          🎯 Job Match
        </div>

        <div className="rounded-xl bg-white/10 px-5 py-3">
          💼 Recruiter Ready
        </div>
      </div>
    </div>
  );
}