"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Zap, TrendingUp, CheckCircle2, FileSearch, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
} as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#05070F] text-slate-100 relative overflow-hidden select-none">
      {/* Background Ambient Glows */}
      <motion.div 
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
          x: [0, 15, 0],
          y: [0, -15, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.08, 0.12, 0.08],
          x: [0, -20, 0],
          y: [0, 10, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" 
      />
      <motion.div 
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.08, 0.14, 0.08],
          x: [0, 10, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" 
      />

      {/* Dotted grid pattern overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.04)_1.5px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Floating Sticky Glass Navbar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#05070F]/65 backdrop-blur-md px-6 lg:px-12 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
              <span className="absolute w-4.5 h-4.5 rotate-45 border border-indigo-500/50 bg-indigo-500/10 rounded-[3px] animate-pulse" />
              <span className="absolute w-2 h-2 rotate-45 bg-gradient-to-tr from-violet-500 to-indigo-500 rounded-[1.5px]" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              RecruitFlow AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-slate-100 transition-colors">Features</a>
            <a href="#statistics" className="hover:text-slate-100 transition-colors">Performance</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-slate-100 transition-colors">
              Log In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/signup" 
                className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition-all duration-200 border border-indigo-500/30 shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-20 md:pt-24 flex flex-col items-center text-center"
      >
        {/* Banner Announcement */}
        <motion.div 
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-6 shadow-sm"
        >
          <Sparkles size={11} className="animate-pulse" />
          <span>Semantic Resume Scanner v2.1 is live</span>
        </motion.div>

        <motion.h1 
          variants={fadeInUp}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400"
        >
          Land More Interviews with{" "}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            AI-Driven ATS Audits
          </span>
        </motion.h1>

        <motion.p 
          variants={fadeInUp}
          className="text-base sm:text-lg text-slate-400 max-w-2xl mt-6 leading-relaxed font-medium"
        >
          Optimize your resume for applicant tracking systems, evaluate keyword alignment, and run simulated AI recruiter screenings in seconds.
        </motion.p>

        <motion.div 
          variants={fadeInUp}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto z-10"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link 
              href="/signup" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-[0_0_24px_rgba(99,102,241,0.45)] text-white px-8 py-4 font-bold text-sm transition-all"
            >
              <span>Scan Your Resume Free</span>
              <ArrowRight size={14} />
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link 
              href="/login" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 text-slate-100 px-8 py-4 font-bold text-sm transition-all shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
            >
              <span>Log In</span>
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <Link 
              href="/signup" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-300 px-8 py-4 font-bold text-sm transition-all shadow-[0_4px_12px_rgba(99,102,241,0.05)]"
            >
              <span>Sign Up</span>
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto"
          >
            <a 
              href="#features" 
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-transparent hover:border-white/5 text-slate-400 hover:text-white px-6 py-4 font-semibold text-sm transition-all"
            >
              <span>Explore Platform</span>
            </a>
          </motion.div>
        </motion.div>

        {/* Dashboard Mockup Panel Preview */}
        <motion.div 
          variants={fadeInUp}
          className="mt-16 w-full max-w-5xl rounded-2xl overflow-hidden border border-white/5 bg-slate-950/40 p-2 shadow-2xl backdrop-blur-xl"
        >
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-xl border border-white/5 bg-slate-900/10 overflow-hidden relative"
          >
            {/* Mock Header */}
            <div className="h-9 bg-slate-950/80 border-b border-white/5 flex items-center px-4 justify-between select-none">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[10px] text-slate-600 font-mono">recruitflow-dashboard-v2.0.local</span>
              <div className="w-4" />
            </div>

            {/* Mock Dashboard Body */}
            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Left Mock Col */}
              <div className="md:col-span-2 space-y-4">
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Analysis Scanner</span>
                    <span className="text-[10px] font-mono text-slate-500 font-bold">READY FOR UPLOAD</span>
                  </div>
                  <div className="border border-dashed border-white/5 rounded-lg py-8 text-center bg-slate-950/20">
                    <div className="mx-auto w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-2">
                      <Zap size={14} />
                    </div>
                    <p className="text-xs text-slate-300 font-semibold">Drag &amp; drop resume file here</p>
                    <p className="text-[10px] text-slate-500 mt-1">PDF, DOCX · max 10MB</p>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recruiter Feedback Audits</span>
                  <div className="space-y-2">
                    <div className="h-2 rounded bg-slate-800 w-full animate-pulse" />
                    <div className="h-2 rounded bg-slate-800 w-5/6 animate-pulse" />
                    <div className="h-2 rounded bg-slate-800 w-4/5 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Right Mock Col */}
              <div className="space-y-4">
                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between h-[120px] shadow-sm">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall ATS Score</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-4xl font-extrabold text-indigo-400 font-mono tracking-tight animate-pulse">85%</span>
                    <span className="text-[10px] text-emerald-400 font-bold">EXCELLENT MATCH</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" 
                    />
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-white/5 rounded-xl p-4 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Matched Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {["Next.js", "TailwindCSS", "TypeScript", "AI Engine", "SQL"].map((tag) => (
                      <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Features Grid Section */}
      <motion.section 
        id="features" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="max-w-7xl mx-auto px-6 lg:px-12 py-20 border-t border-white/5 relative z-10"
      >
        <motion.div variants={fadeInUp} className="text-center space-y-3 mb-16">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Core Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything You Need to Beat the ATS</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium">
            Our platform evaluates resumes using semantic matching algorithms similar to those deployed by top Fortune 500 hiring teams.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ 
              y: -8, 
              borderColor: "rgba(139, 92, 246, 0.4)",
              boxShadow: "0 10px 30px -10px rgba(139, 92, 246, 0.15)"
            }}
            className="group bg-slate-900/20 border border-white/5 rounded-2xl p-6 shadow-md backdrop-blur-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/25 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
              <Sparkles size={16} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">AI Resume Assessment</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Run automated semantic reviews to audit formatting, spelling, grammar, and overall layout compatibility for standard parser formats.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ 
              y: -8, 
              borderColor: "rgba(99, 102, 241, 0.4)",
              boxShadow: "0 10px 30px -10px rgba(99, 102, 241, 0.15)"
            }}
            className="group bg-slate-900/20 border border-white/5 rounded-2xl p-6 shadow-md backdrop-blur-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
              <TrendingUp size={16} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Keyword Density Matching</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Paste target job descriptions to identify missing technical skills, credentials, and core competencies required to bypass filtering steps.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ 
              y: -8, 
              borderColor: "rgba(6, 182, 212, 0.4)",
              boxShadow: "0 10px 30px -10px rgba(6, 182, 212, 0.15)"
            }}
            className="group bg-slate-900/20 border border-white/5 rounded-2xl p-6 shadow-md backdrop-blur-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
              <Zap size={16} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Simulated Interview Prompts</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Obtain dynamic practice questions customized based on identified gaps in your resume, preparing you for real technical discussions.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ 
              y: -8, 
              borderColor: "rgba(16, 185, 129, 0.4)",
              boxShadow: "0 10px 30px -10px rgba(16, 185, 129, 0.15)"
            }}
            className="group bg-slate-900/20 border border-white/5 rounded-2xl p-6 shadow-md backdrop-blur-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
              <CheckCircle2 size={16} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">ATS Formatting Checks</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Ensure font families, margins, headings, and column layouts compile into parsable text trees without overlapping characters.
            </p>
          </motion.div>

          {/* Card 5 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ 
              y: -8, 
              borderColor: "rgba(245, 158, 11, 0.4)",
              boxShadow: "0 10px 30px -10px rgba(245, 158, 11, 0.15)"
            }}
            className="group bg-slate-900/20 border border-white/5 rounded-2xl p-6 shadow-md backdrop-blur-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
              <FileSearch size={16} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Smart Rewrite Recommendations</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Obtain instant bullet-point variations utilizing active verbs and metrics-driven output styles to increase recruiter visual engagement.
            </p>
          </motion.div>

          {/* Card 6 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ 
              y: -8, 
              borderColor: "rgba(168, 85, 247, 0.4)",
              boxShadow: "0 10px 30px -10px rgba(168, 85, 247, 0.15)"
            }}
            className="group bg-slate-900/20 border border-white/5 rounded-2xl p-6 shadow-md backdrop-blur-md transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/25 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap size={16} />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Compensation Estimator</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Verify corresponding market salary values for similar job positions to evaluate whether offers meet industry standards.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Statistics Metrics Banner */}
      <motion.section 
        id="statistics" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-6 lg:px-12 py-16 border-t border-white/5 relative z-10"
      >
        <div className="bg-gradient-to-r from-violet-600/10 via-indigo-600/5 to-cyan-500/10 border border-white/5 rounded-3xl p-8 sm:p-12 backdrop-blur-xl">
          <div className="grid gap-8 sm:grid-cols-3 text-center">
            <div className="space-y-1">
              <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">98%</span>
              <span className="block text-[10px] sm:text-xs font-bold text-indigo-300 uppercase tracking-widest">ATS Parser Accuracy</span>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-white/10 pt-6 sm:pt-0">
              <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">1.5s</span>
              <span className="block text-[10px] sm:text-xs font-bold text-cyan-300 uppercase tracking-widest">Average Analysis Time</span>
            </div>
            <div className="space-y-1 border-t sm:border-t-0 pt-6 sm:pt-0">
              <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">10x</span>
              <span className="block text-[10px] sm:text-xs font-bold text-violet-300 uppercase tracking-widest">Hiring Match Efficiency</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Final Action CTA Banner */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="max-w-4xl mx-auto px-6 py-20 text-center relative z-10"
      >
        <motion.div variants={fadeInUp} className="space-y-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop Guessing. Audit Your Resume Today.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-medium leading-relaxed">
            Ensure your professional achievements aren't getting filtered by robotic screeners. Sign up now and scan your first resume instantly.
          </p>
          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                href="/signup" 
                className="flex items-center gap-2 rounded-xl bg-white hover:bg-slate-200 text-slate-950 px-8 py-4 font-bold text-sm shadow-xl transition-all"
              >
                <span>Sign Up Free</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-slate-950/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-sm bg-indigo-500" />
            <span>RecruitFlow AI</span>
          </div>
          <span>&copy; {new Date().getFullYear()} RecruitFlow AI. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}