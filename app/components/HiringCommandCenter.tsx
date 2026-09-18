"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ScanLine,
  CheckCircle2,
  Calendar,
  Award,
  User,
  Briefcase,
  TrendingUp,
  BarChart3,
  Clock,
} from "lucide-react";

/* ─── Types ─── */
type Phase =
  | "intake"
  | "scanning"
  | "scoring"
  | "pipeline"
  | "interview"
  | "hired"
  | "reset";

type Candidate = {
  name: string;
  role: string;
  skills: string[];
  score: number;
  interviewDate: string;
};

/* ─── Candidate Pool ─── */
const candidates: Candidate[] = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Engineer",
    skills: ["React", "TypeScript", "Next.js", "GraphQL"],
    score: 94,
    interviewDate: "Sept 24, 2:00 PM",
  },
  {
    name: "Marcus Vega",
    role: "Lead Product Manager",
    skills: ["Roadmaps", "OKRs", "SQL", "Agile"],
    score: 88,
    interviewDate: "Sept 26, 10:30 AM",
  },
  {
    name: "Priya Sharma",
    role: "ML Engineer",
    skills: ["Python", "TensorFlow", "AWS", "MLOps"],
    score: 91,
    interviewDate: "Sept 28, 3:00 PM",
  },
];

/* ─── Pipeline Stages ─── */
const pipelineStages = ["Applied", "Screened", "Shortlisted", "Interview", "Hired"];

/* ─── Phase Timing (ms) ─── */
const PHASE_TIMING: Record<Phase, number> = {
  intake: 2200,
  scanning: 3200,
  scoring: 2400,
  pipeline: 3000,
  interview: 2400,
  hired: 2800,
  reset: 1800,
};

/* ─── Mini Floating Metric Card ─── */
function MetricCard({
  label,
  value,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className="rounded-xl border border-white/[0.06] bg-[#0F172A]/90 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)] will-change-gpu"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Icon size={11} className="text-[#D4AF37]" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
          {label}
        </span>
      </div>
      <span
        className="text-lg font-black text-[#F8FAFC]"
        style={{ fontFamily: "var(--font-geist-mono, monospace)", fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </span>
    </motion.div>
  );
}

/* ─── Mini Area Chart (pure CSS) ─── */
function MiniChart() {
  const points = [28, 35, 32, 45, 42, 58, 55, 62, 68, 72, 78, 85];
  const max = 100;
  const w = 140;
  const h = 48;
  const pathD = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - (p / max) * h;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  const fillD = `${pathD} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.2} />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={fillD} fill="url(#chartFill)" />
      <path d={pathD} fill="none" stroke="#D4AF37" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

/* ─── Score Ring (pure SVG, no blur) ─── */
function ScoreRing({ score, animate }: { score: number; animate: boolean }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444";

  return (
    <div className="relative flex items-center justify-center" style={{ width: 80, height: 80 }}>
      <svg width={80} height={80} className="absolute" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={40} cy={40} r={r} fill="transparent" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <motion.circle
          cx={40}
          cy={40}
          r={r}
          fill="transparent"
          stroke={color}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: animate ? offset : circ }}
          transition={{ duration: 1.4, ease: [0.4, 0, 0.2, 1] }}
        />
      </svg>
      <motion.span
        className="relative z-10 text-lg font-black text-[#F8FAFC]"
        style={{ fontFamily: "var(--font-geist-mono, monospace)", fontVariantNumeric: "tabular-nums" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: animate ? 1 : 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {score}%
      </motion.span>
    </div>
  );
}

/* ─── Scanning Lines Effect ─── */
function ScanLines({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none z-10">
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute left-0 right-0 h-8 bg-gradient-to-b from-[#D4AF37]/10 to-transparent"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function HiringCommandCenter() {
  const [phase, setPhase] = useState<Phase>("intake");
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [activeStage, setActiveStage] = useState(0);
  const [visibleSkills, setVisibleSkills] = useState(0);

  const candidate = candidates[candidateIdx];

  /* ─── Phase machine ─── */
  const advancePhase = useCallback(() => {
    setPhase((prev) => {
      const order: Phase[] = ["intake", "scanning", "scoring", "pipeline", "interview", "hired", "reset"];
      const idx = order.indexOf(prev);
      const next = order[(idx + 1) % order.length];

      // On reset → prepare next candidate
      if (next === "intake") {
        setCandidateIdx((ci) => (ci + 1) % candidates.length);
        setActiveStage(0);
        setVisibleSkills(0);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(advancePhase, PHASE_TIMING[phase]);
    return () => clearTimeout(timer);
  }, [phase, advancePhase]);

  /* ─── Skill reveal during scanning ─── */
  useEffect(() => {
    if (phase !== "scanning") return;
    setVisibleSkills(0);
    const intervals: NodeJS.Timeout[] = [];
    candidate.skills.forEach((_, i) => {
      intervals.push(setTimeout(() => setVisibleSkills(i + 1), 600 + i * 500));
    });
    return () => intervals.forEach(clearTimeout);
  }, [phase, candidate.skills]);

  /* ─── Pipeline stage progression ─── */
  useEffect(() => {
    if (phase !== "pipeline") return;
    setActiveStage(2); // Already screened
    const t1 = setTimeout(() => setActiveStage(3), 1200);
    return () => clearTimeout(t1);
  }, [phase]);

  useEffect(() => {
    if (phase === "interview") setActiveStage(3);
    if (phase === "hired") setActiveStage(4);
  }, [phase]);

  const showCandidate = phase !== "reset";
  const showScoring = phase === "scoring" || phase === "pipeline" || phase === "interview" || phase === "hired";
  const showInterview = phase === "interview" || phase === "hired";
  const showHired = phase === "hired";

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* ── Floating Analytics Panels ── */}
      <div className="hidden lg:block absolute -left-4 top-8 z-20">
        <MetricCard label="Candidates Today" value="47" icon={User} delay={0.2} />
      </div>
      <div className="hidden lg:block absolute -right-4 top-4 z-20">
        <MetricCard label="Avg Match Score" value="78%" icon={TrendingUp} delay={0.4} />
      </div>
      <div className="hidden lg:block absolute -right-2 bottom-8 z-20">
        <div className="rounded-xl border border-white/[0.06] bg-[#0F172A]/90 px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={11} className="text-[#D4AF37]" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
              Weekly Hires
            </span>
          </div>
          <MiniChart />
        </div>
      </div>

      {/* ── Main Command Center Panel ── */}
      <div className="relative rounded-2xl border border-white/[0.06] bg-[#0F172A]/80 shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-[#0B1120]/60">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
            RecruitFlow AI — Hiring Command Center
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-bold text-[#10B981]">LIVE</span>
          </div>
        </div>

        {/* Content area */}
        <div className="relative min-h-[340px] sm:min-h-[380px] md:min-h-[420px] p-5 sm:p-6 md:p-8">

          {/* ── Pipeline Stage Indicators ── */}
          <div className="flex items-center gap-1 sm:gap-2 mb-8">
            {pipelineStages.map((stage, i) => {
              const isActive = i <= activeStage && showCandidate;
              const isCurrent = i === activeStage && showCandidate;
              return (
                <div key={stage} className="flex items-center gap-1 sm:gap-2 flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      className={`w-full h-1.5 rounded-full transition-colors duration-500 ${
                        isActive ? "" : "bg-white/[0.06]"
                      }`}
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, #D4AF37, #F3CA4B)"
                          : undefined,
                      }}
                      animate={{
                        boxShadow: isCurrent
                          ? "0 0 12px rgba(212,175,55,0.4)"
                          : "none",
                      }}
                    />
                    <span
                      className={`mt-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${
                        isActive ? "text-[#D4AF37]" : "text-[#475569]"
                      }`}
                    >
                      {stage}
                    </span>
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <div className="w-3 sm:w-6 h-[1px] bg-white/[0.06] mt-[-12px]" />
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Central Action Area ── */}
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">

            {/* Candidate Card */}
            <AnimatePresence mode="wait">
              {showCandidate && (
                <motion.div
                  key={`candidate-${candidateIdx}`}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="relative flex-shrink-0 w-full md:w-[240px] rounded-xl border border-white/[0.08] bg-[#1E293B]/80 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] will-change-gpu"
                >
                  <ScanLines active={phase === "scanning"} />

                  {/* File header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center">
                      <FileText size={18} className="text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F8FAFC]">{candidate.name}</p>
                      <p className="text-[10px] text-[#94A3B8]">{candidate.role}</p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="mb-3">
                    <motion.div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest"
                      animate={{
                        backgroundColor:
                          phase === "scanning"
                            ? "rgba(212,175,55,0.15)"
                            : showHired
                            ? "rgba(16,185,129,0.15)"
                            : showInterview
                            ? "rgba(59,130,246,0.15)"
                            : showScoring
                            ? "rgba(16,185,129,0.15)"
                            : "rgba(148,163,184,0.1)",
                        color:
                          phase === "scanning"
                            ? "#D4AF37"
                            : showHired
                            ? "#10B981"
                            : showInterview
                            ? "#60A5FA"
                            : showScoring
                            ? "#10B981"
                            : "#94A3B8",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {phase === "scanning" && <><ScanLine size={9} /> Analyzing...</>}
                      {phase === "scoring" && <><TrendingUp size={9} /> Scored</>}
                      {phase === "pipeline" && <><Briefcase size={9} /> Shortlisted</>}
                      {phase === "interview" && <><Calendar size={9} /> Interview Set</>}
                      {phase === "hired" && <><CheckCircle2 size={9} /> Hired</>}
                      {phase === "intake" && <><Clock size={9} /> Processing...</>}
                    </motion.div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1.5">
                    {candidate.skills.map((skill, i) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                          opacity: i < visibleSkills || (phase !== "scanning" && phase !== "intake") ? 1 : 0,
                          scale: i < visibleSkills || (phase !== "scanning" && phase !== "intake") ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.3 }}
                        className="px-2 py-0.5 rounded text-[9px] font-bold text-[#CBD5E1] bg-white/[0.06] border border-white/[0.06]"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Center Column: Score + Details */}
            <div className="flex-1 flex flex-col items-center gap-5 min-w-0">

              {/* Score Ring */}
              <AnimatePresence>
                {showScoring && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col items-center gap-2"
                  >
                    <ScoreRing score={candidate.score} animate={showScoring} />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]"
                    >
                      Strong Match
                    </motion.span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interview Schedule */}
              <AnimatePresence>
                {showInterview && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-[#1E293B]/60"
                  >
                    <Calendar size={16} className="text-[#60A5FA]" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
                        Interview Scheduled
                      </p>
                      <p className="text-xs font-bold text-[#F8FAFC]">
                        {candidate.interviewDate}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* HIRED celebration */}
              <AnimatePresence>
                {showHired && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 px-5 py-3 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10"
                  >
                    <motion.div
                      initial={{ rotate: -20 }}
                      animate={{ rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Award size={20} className="text-[#D4AF37]" />
                    </motion.div>
                    <div>
                      <p className="text-sm font-black text-[#10B981] tracking-wide">
                        HIRED
                      </p>
                      <p className="text-[10px] text-[#94A3B8]">
                        Offer accepted • {candidate.role}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Live Feed */}
            <div className="hidden md:flex flex-col gap-3 w-[200px] flex-shrink-0">
              <div className="rounded-xl border border-white/[0.06] bg-[#1E293B]/50 p-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-2">
                  AI Activity Log
                </p>
                <div className="space-y-1.5 max-h-[140px] overflow-hidden">
                  <AnimatePresence>
                    {phase === "intake" && (
                      <LogEntry key="l1" text={`Resume received: ${candidate.name}`} />
                    )}
                    {(phase === "scanning") && (
                      <>
                        <LogEntry key="l2" text="Parsing document structure..." />
                        <LogEntry key="l3" text="Extracting skill keywords..." delay={0.4} />
                        <LogEntry key="l4" text="Running ATS compliance audit..." delay={0.8} />
                      </>
                    )}
                    {phase === "scoring" && (
                      <>
                        <LogEntry key="l5" text="Computing match score..." />
                        <LogEntry key="l6" text={`Score: ${candidate.score}% — Strong Match`} delay={0.5} />
                      </>
                    )}
                    {phase === "pipeline" && (
                      <LogEntry key="l7" text="Candidate shortlisted ✓" />
                    )}
                    {phase === "interview" && (
                      <LogEntry key="l8" text="Interview auto-scheduled ✓" />
                    )}
                    {phase === "hired" && (
                      <LogEntry key="l9" text="🎉 Offer accepted!" />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Connection lines (decorative) */}
              <svg className="w-full h-6 overflow-visible" viewBox="0 0 200 24">
                <motion.line
                  x1="20" y1="12" x2="180" y2="12"
                  stroke="rgba(212,175,55,0.15)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                  animate={{ strokeDashoffset: [0, -16] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <circle cx="20" cy="12" r="2" fill="#D4AF37" opacity={0.4} />
                <circle cx="180" cy="12" r="2" fill="#D4AF37" opacity={0.4} />
              </svg>

              <div className="rounded-xl border border-white/[0.06] bg-[#1E293B]/50 p-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#94A3B8] mb-1">
                  Pipeline Velocity
                </p>
                <p
                  className="text-base font-black text-[#F8FAFC]"
                  style={{ fontFamily: "var(--font-geist-mono, monospace)" }}
                >
                  4.2 <span className="text-[10px] font-bold text-[#94A3B8]">days avg</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Log Entry Sub-component ─── */
function LogEntry({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start gap-1.5"
    >
      <span className="mt-[3px] w-1 h-1 rounded-full bg-[#D4AF37] shrink-0" />
      <span className="text-[10px] text-[#CBD5E1] leading-tight">{text}</span>
    </motion.div>
  );
}
