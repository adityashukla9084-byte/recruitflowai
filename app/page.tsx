"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  FileSearch, 
  GraduationCap, 
  ChevronDown, 
  Check, 
  FileText, 
  Brain, 
  Award,
  ArrowUpRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

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

// FAQ Questions list
const faqs = [
  {
    question: "How does RecruitFlow AI analyze my resume?",
    answer: "We use advanced large language models paired with custom parser heuristics to read your resume just like an Applicant Tracking System (ATS) does. We analyze keyword density, document structure, typography hierarchy, and context relevance to give you a comprehensive compliance audit."
  },
  {
    question: "Is my personal data safe and private?",
    answer: "Absolutely. We encrypt all uploaded resumes and job descriptions. Your personal information is never sold to third parties, shared, or used to train open models. You can also delete your entire analysis history at any time."
  },
  {
    question: "What formats of resumes are supported?",
    answer: "We officially support PDF (.pdf) and Microsoft Word (.docx) formats, which are the primary formats accepted by standard corporate ATS platforms today."
  },
  {
    question: "How accurate is the ATS scoring engine?",
    answer: "Our engine is calibrated against the parsing algorithms of top-tier industry ATS software (like Workday, Greenhouse, and Lever). We achieve a 98% accuracy correlation with real recruiter filters."
  }
];

// Testimonials data
const testimonials = [
  {
    quote: "RecruitFlow AI helped me revamp my resume for Google's L5 Software Engineer position. I got a callback in 4 days!",
    name: "Alex Rivera",
    role: "Senior Fullstack Developer",
    company: "Now at Google",
    score: "85% → 96%"
  },
  {
    quote: "As a product manager, I struggled to bypass automated screens. This tool highlighted exactly what keywords were missing.",
    name: "Sarah Chen",
    role: "Lead Product Manager",
    company: "Now at Stripe",
    score: "68% → 91%"
  },
  {
    quote: "The simulated interview coach questions were incredibly accurate. It felt exactly like my technical loop conversation.",
    name: "David Kim",
    role: "Backend Engineer",
    company: "Now at Netflix",
    score: "72% → 94%"
  }
];

// Features List for interactive tabs
const featureTabs = [
  {
    id: "audit",
    title: "ATS Audit",
    icon: Shield,
    badge: "Engine v2.1",
    headline: "Uncover formatting traps before recruiters do.",
    description: "Scan your layout structure, margins, font compatibility, and tables to ensure the ATS parses every single word cleanly without overlapping data trees.",
    metric: "98% Parsing Accuracy"
  },
  {
    id: "keywords",
    title: "Keyword Density",
    icon: FileSearch,
    badge: "Smart Sync",
    headline: "Align keywords with target requisitions.",
    description: "Compare your resume directly with any job posting. Instantly pinpoint missing skills, active action verbs, and specialized metrics required to unlock high matches.",
    metric: "1.5s Keyword Analysis"
  },
  {
    id: "coach",
    title: "AI Interview Coach",
    icon: GraduationCap,
    badge: "Interactive",
    headline: "Simulate candidate review rounds.",
    description: "Receive custom behavioral and technical interview questions based directly on the identified gaps in your resume, prepping you for standard interviewer rubrics.",
    metric: "Personalized Prep Guide"
  }
];

// Sandbox Job Roles data mapping
const roleData = {
  swe: {
    resumeName: "Fullstack_Developer_Demo.pdf",
    roleName: "Senior Fullstack Engineer",
    targetScore: 94,
    matchedKeywords: ["Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Supabase", "REST APIs"],
    missingKeywords: [
      { name: "Kubernetes", advice: "Add container deployment details: 'Orchestrated 15+ container workloads using Kubernetes'" },
      { name: "Docker", advice: "Demonstrate sandbox local settings: 'Containerized development workflows using Docker'" },
      { name: "CI/CD Pipeline", advice: "Outline deployment automations: 'Built GitHub Actions CI/CD workflows'" }
    ],
    feedback: "Formatting complies with standard parser models. High compatibility with modern React frameworks, but lacks deployment container metrics.",
    logs: [
      "Initializing Parser...",
      "Extracting PDF layout tree structure...",
      "Auditing font & margin safety compliance...",
      "Running semantic keyword matching against Requisition...",
      "Analyzing layout tree tags... ✅",
      "Analysis score compiled successfully!"
    ]
  },
  pm: {
    resumeName: "Product_Manager_Demo.pdf",
    roleName: "Lead Product Manager",
    targetScore: 87,
    matchedKeywords: ["Product Roadmap", "Agile Scrums", "SQL", "User Research", "Metrics-driven"],
    missingKeywords: [
      { name: "A/B Testing", advice: "Detail experiment parameters: 'Designed A/B testing protocols improving conversions by 12%'" },
      { name: "Google Analytics", advice: "Cite analytics pipelines: 'Monitored user behavior metrics via Google Analytics'" },
      { name: "Data Science", advice: "Incorporate analytics dashboards: 'Built simple regression models to map retention'" }
    ],
    feedback: "Excellent strategy metrics. Resume indicates strong product lifecycle experience, but needs more detailed quantitative experimental validation.",
    logs: [
      "Initializing Parser...",
      "Scanning roadmap metrics...",
      "Analyzing stakeholder management keywords...",
      "Evaluating Agile/Scrum credentials...",
      "Running semantic keyword matching...",
      "Analysis score compiled successfully!"
    ]
  },
  design: {
    resumeName: "UIUX_Designer_Demo.pdf",
    roleName: "Senior UI/UX Designer",
    targetScore: 91,
    matchedKeywords: ["Figma", "Wireframing", "Design Systems", "User Flows", "Prototyping"],
    missingKeywords: [
      { name: "Accessibility", advice: "Reference WCAG guidelines: 'Conformed layouts to WCAG 2.1 accessibility benchmarks'" },
      { name: "Framer", advice: "Detail interactive layout tools: 'Authored high-fidelity interactive mockups in Framer'" },
      { name: "User Testing", advice: "Incorporate client review cycles: 'Conducted user testing panels on 25+ subjects'" }
    ],
    feedback: "Visual portfolio links parsed correctly. Highly optimized for Figma design systems, but needs more focus on accessibility benchmarks (WCAG).",
    logs: [
      "Initializing Parser...",
      "Auditing graphic layouts...",
      "Checking color contrast compliance...",
      "Scanning typography hierarchies...",
      "Running semantic keyword matching...",
      "Analysis score compiled successfully!"
    ]
  }
};

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMoveSpotlight = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      container.style.setProperty("--mouse-x", `${x}px`);
      container.style.setProperty("--mouse-y", `${y}px`);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    container.addEventListener("mousemove", handleMouseMoveSpotlight);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      container.removeEventListener("mousemove", handleMouseMoveSpotlight);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Billing cycle selector
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  // Active feature tab
  const [activeTab, setActiveTab] = useState("audit");

  // FAQ collapse state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Statistics counters
  const [statAccuracy, setStatAccuracy] = useState(0);
  const [statTime, setStatTime] = useState(0);
  const [statEfficiency, setStatEfficiency] = useState(0);

  // Interactive sandbox scanner simulation states
  const [sandboxRole, setSandboxRole] = useState<"swe" | "pm" | "design">("swe");
  const [sandboxState, setSandboxState] = useState<"idle" | "parsing" | "auditing" | "scoring" | "completed">("idle");
  const [sandboxProgress, setSandboxProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  
  // Interactive keyword gap advisor state
  const [activeAdviceKeyword, setActiveAdviceKeyword] = useState<string | null>(null);



  // Count up stats counters on load
  useEffect(() => {
    let accuracyTarget = 98;
    let timeTarget = 1.5;
    let efficiencyTarget = 10;

    let accInterval = setInterval(() => {
      setStatAccuracy(prev => {
        if (prev >= accuracyTarget) {
          clearInterval(accInterval);
          return accuracyTarget;
        }
        return prev + 2;
      });
    }, 20);

    let timeInterval = setInterval(() => {
      setStatTime(prev => {
        if (prev >= timeTarget) {
          clearInterval(timeInterval);
          return timeTarget;
        }
        return Math.round((prev + 0.1) * 10) / 10;
      });
    }, 45);

    let effInterval = setInterval(() => {
      setStatEfficiency(prev => {
        if (prev >= efficiencyTarget) {
          clearInterval(effInterval);
          return efficiencyTarget;
        }
        return prev + 1;
      });
    }, 70);

    return () => {
      clearInterval(accInterval);
      clearInterval(timeInterval);
      clearInterval(effInterval);
    };
  }, []);

  // Trigger interactive sandbox scan
  const startDemoScan = () => {
    if (sandboxState !== "idle") return;
    setSandboxState("parsing");
    setSandboxProgress(0);
    setScanLogs([roleData[sandboxRole].logs[0]]);
    setActiveAdviceKeyword(null);

    let currentProgress = 0;
    const roleLogs = roleData[sandboxRole].logs;

    const interval = setInterval(() => {
      currentProgress += 5;
      setSandboxProgress(Math.min(currentProgress, 100));

      if (currentProgress === 20) {
        setScanLogs(prev => [...prev, roleLogs[1]]);
      } else if (currentProgress === 40) {
        setScanLogs(prev => [...prev, roleLogs[2]]);
        setSandboxState("auditing");
      } else if (currentProgress === 65) {
        setScanLogs(prev => [...prev, roleLogs[3]]);
      } else if (currentProgress === 80) {
        setScanLogs(prev => [...prev, roleLogs[4]]);
        setSandboxState("scoring");
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setSandboxState("completed");
        setScanLogs(prev => [...prev, roleLogs[5]]);
      }
    }, 120);
  };

  const resetDemoScan = () => {
    setSandboxState("idle");
    setSandboxProgress(0);
    setScanLogs([]);
    setActiveAdviceKeyword(null);
  };

  // Change role resets scanner
  const handleRoleChange = (role: "swe" | "pm" | "design") => {
    setSandboxRole(role);
    resetDemoScan();
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0A0E1A] text-[#F5F5F4] relative overflow-hidden select-none">
      {/* Premium Cursor Spotlight Follower */}
      <div className={`mouse-spotlight ${isHovered ? "mouse-spotlight-active" : ""}`} />
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
        className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(20,184,166,0.05)_0%,transparent_70%)] pointer-events-none will-change-gpu" 
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
        className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(6,182,212,0.05)_0%,transparent_70%)] pointer-events-none will-change-gpu" 
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
        className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(20,184,166,0.05)_0%,transparent_70%)] pointer-events-none will-change-gpu" 
      />

      {/* Dotted grid pattern overlay */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.04)_1.5px,transparent_1.5px)] bg-[size:24px_24px] pointer-events-none" 
        aria-hidden="true" 
      />



      {/* Wrapper to ensure content stacks correctly above the z-0 video background */}
      <div className="relative z-10 w-full flex flex-col">
        {/* Floating Sticky Glass Navbar */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#0A0E1A]/65 backdrop-blur-md px-6 lg:px-12 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
              <span className="absolute w-4.5 h-4.5 rotate-45 border border-teal-500/50 bg-[#14B8A6]/10 rounded-[3px] animate-pulse" />
              <span className="absolute w-2 h-2 rotate-45 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-[1.5px]" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-teal-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              RecruitFlow AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-[#F5F5F4] transition-colors">Features</a>
            <a href="#demo" className="hover:text-[#F5F5F4] transition-colors">Interactive Demo</a>
            <a href="#pricing" className="hover:text-[#F5F5F4] transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-[#F5F5F4] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-semibold text-slate-300 hover:text-[#F5F5F4] transition-colors">
              Log In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                href="/login" 
                className="text-xs font-bold bg-[#14B8A6] text-[#0A0E1A] hover:bg-[#14B8A6]/90 px-4 py-2 rounded-xl transition-all duration-200 border border-[#14B8A6]/20 shadow-[0_4px_12px_rgba(20,184,166,0.25)]"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero section */}
      <section onMouseMove={handleMouseMove} className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 border-b border-white/[0.08] overflow-hidden flex flex-col items-center">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.025] mix-blend-overlay z-0" 
          style={{ backgroundImage: "url('/hero_background.jpg')" }}
        />
        
        {/* Giant Left Glowing Orb (Royal Blue) */}
        <motion.div 
          style={{ x: useTransform(mouseX, [-500, 500], [-30, 30]), y: useTransform(mouseY, [-500, 500], [-30, 30]) }}
          className="absolute top-[40%] left-[25%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[650px] bg-[radial-gradient(ellipse,rgba(37,99,235,0.15)_0%,transparent_70%)] pointer-events-none z-0 mix-blend-screen will-change-gpu" 
        />

        {/* Giant Right Glowing Orb (Orange) */}
        <motion.div 
          style={{ x: useTransform(mouseX, [-500, 500], [30, -30]), y: useTransform(mouseY, [-500, 500], [30, -30]) }}
          className="absolute top-[30%] left-[75%] -translate-x-1/2 -translate-y-1/2 w-[850px] h-[600px] bg-[radial-gradient(ellipse,rgba(234,88,12,0.1)_0%,transparent_70%)] pointer-events-none z-0 mix-blend-screen will-change-gpu" 
        />

        {/* Floating dust particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-blue-500/20 blur-[1px] animate-float-slow" />
          <div className="absolute top-[50%] left-[80%] w-2 h-2 rounded-full bg-teal-500/20 blur-[1px] animate-float-medium" />
          <div className="absolute top-[75%] left-[25%] w-1 h-1 rounded-full bg-orange-500/20 blur-[1.5px] animate-float-slow" style={{ animationDelay: "3s" }} />
          <div className="absolute top-[30%] left-[65%] w-2 h-2 rounded-full bg-indigo-500/15 blur-[1px] animate-float-medium" style={{ animationDelay: "5s" }} />
        </div>

        {/* 3D Perspective Grid Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 perspective-container">
          <div className="absolute bottom-0 left-[-50%] right-[-50%] h-[500px] perspective-grid" />
        </div>

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col items-center text-center"
        >
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center z-10 relative">
            {/* Pill Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-[10px] font-bold uppercase tracking-wider mb-8"
            >
              <Sparkles size={11} className="animate-pulse" />
              <span>AI-Powered ATS Scanner</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="font-display text-5xl sm:text-7xl lg:text-[64px] font-black tracking-[-0.02em] leading-[1.1] text-[#F5F5F4] max-w-3xl"
            >
              Beat the ATS. Land the <span className="bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">Interview.</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="font-sans text-base text-[#9CA3AF] max-w-2xl mt-8 font-normal leading-[1.6]"
            >
              Scan your resume for ATS compatibility, identify missing keywords, and simulate recruiter screenings in seconds.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto z-10"
            >
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#14B8A6] text-[#0A0E1A] hover:bg-[#14B8A6]/90 hover:shadow-[0_0_24px_rgba(20,184,166,0.35)] text-white px-8 py-4 font-bold text-sm transition-all duration-300 border border-blue-500/20 shadow-md shadow-[#14B8A6]/10 cursor-pointer"
                >
                  <span>Scan Resume Free</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <a 
                  href="#demo" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/5 hover:bg-white/[0.08] hover:border-white/20 text-[#F5F5F4] px-8 py-4 font-bold text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-pointer"
                >
                  <span>Interactive Demo</span>
                </a>
              </motion.div>
            </motion.div>

            {/* Browser Mockup Visual Container */}
            <motion.div 
              variants={fadeInUp}
              className="mt-16 sm:mt-20 w-full max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-[#111827] p-2 shadow-[0_0_50px_rgba(20,184,166,0.15)] backdrop-blur-xl transition-all duration-500 hover:border-[#14B8A6]/30 overflow-hidden relative z-10"
            >
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes dash {
                  from { stroke-dashoffset: 251.2; }
                  to { stroke-dashoffset: 15.1; }
                }
              `}} />
              <div className="rounded-xl border border-white/[0.08] bg-[#111827] overflow-hidden relative">
                {/* Mock Browser Header */}
                <div className="h-11 bg-[#111827] border-b border-white/[0.08] flex items-center px-4 justify-between select-none">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#111827]/80 px-4 py-1 rounded-md border border-white/[0.08] text-[9px] text-slate-400 font-mono w-48 sm:w-64 justify-center">
                    <Shield size={10} className="text-[#14B8A6]" />
                    <span>recruitflow-ai.com/dashboard/scan</span>
                  </div>
                  <div className="w-8" />
                </div>

                {/* Mock Dashboard App Content */}
                <div className="p-4 sm:p-6 bg-[#111827] grid gap-6 md:grid-cols-12 text-left">
                  {/* Left Column: Parsed Structure Tree (3 cols) */}
                  <div className="md:col-span-3 space-y-4 border-r border-white/[0.08] pr-4 hidden md:block">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Document Audit</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Margins (1.0")</span>
                        <CheckCircle2 size={12} className="text-[#4ADE80]" />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Standard Fonts</span>
                        <CheckCircle2 size={12} className="text-[#4ADE80]" />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">No Hidden Text</span>
                        <CheckCircle2 size={12} className="text-[#4ADE80]" />
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">Header Structure</span>
                        <CheckCircle2 size={12} className="text-[#4ADE80]" />
                      </div>
                    </div>
                  </div>

                  {/* Center Column: ATS Match Score & Radial Chart (5 cols) */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center py-4 border-b md:border-b-0 md:border-r border-white/[0.08] pr-0 md:pr-4">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest mb-4 self-center md:self-start">ATS Score Summary</p>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      {/* Radial Score Indicator */}
                      <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                        <circle cx="50" cy="50" r="40" stroke="url(#blueGradient)" strokeWidth="8" fill="transparent" strokeDasharray="251.2" strokeDashoffset="251.2" className="animate-[dash_1.5s_ease-out_forwards]" style={{ strokeDashoffset: '15.1' }} />
                        <defs>
                          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#60A5FA" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="flex flex-col items-center">
                        <span className="text-3xl font-black text-[#F5F5F4] tracking-tight">94%</span>
                        <span className="text-[8px] font-bold text-[#14B8A6] uppercase tracking-wider">Matched</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Key Skills Checklist (4 cols) */}
                  <div className="md:col-span-4 space-y-4 pl-0 md:pl-4">
                    <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">Keyword Alignment</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="text-slate-300 font-bold">Matched Keywords (6)</span>
                          <span className="text-[#4ADE80] font-bold">92%</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">Next.js</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">TypeScript</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">TailwindCSS</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center text-[10px] mb-1">
                          <span className="text-slate-300 font-bold">Missing Requisites (2)</span>
                          <span className="text-rose-400 font-bold">Action Needed</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Docker</span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">CI/CD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Infinite Logo Marquee (Social Proof) */}
      <section className="py-6 border-t border-b border-white/[0.08] bg-[#111827]/20 overflow-hidden select-none relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#05070F] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#05070F] to-transparent z-10" />
        
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, repeatIndex) => (
            <div key={repeatIndex} className="flex items-center gap-16">
              <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase flex items-center gap-2">
                <Brain size={14} className="text-violet-500" /> METACLOUD
              </span>
              <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase flex items-center gap-2">
                <Shield size={14} className="text-teal-500" /> APEX SECURITY
              </span>
              <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase flex items-center gap-2">
                <Zap size={14} className="text-cyan-500" /> ZAPLINE
              </span>
              <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-500" /> HYPERGROWTH
              </span>
              <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase flex items-center gap-2">
                <Award size={14} className="text-amber-500" /> PRIME HR
              </span>
              <span className="text-xs font-bold text-[#6B7280] tracking-widest uppercase flex items-center gap-2">
                <Sparkles size={14} className="text-pink-500" /> GENESIS AI
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo Resume Parser Sandbox Section */}
      <section id="demo" className="w-full overflow-hidden border-b border-white/[0.08] bg-[#0A0E1A] py-[64px] md:py-[96px] lg:py-[120px] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-1 rounded-full border border-[#14B8A6]/15">
              Test Drive RecruitFlow
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F4]">Interactive Scanner Sandbox</h2>
            <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto font-normal leading-relaxed">
              Choose a mock candidate target requisition below and click to run a simulated ATS analysis.
            </p>
          </div>

        {/* Dashboard Mockup Panel Preview / Interactive Sandbox */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-white/[0.08] bg-[#111827] p-2 shadow-2xl backdrop-blur-xl">
          <div className="rounded-xl border border-white/[0.08] bg-[#111827] overflow-hidden relative">
            {/* Mock Header */}
            <div className="h-12 bg-[#111827] border-b border-white/[0.08] flex items-center px-4 justify-between select-none">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[10px] text-[#6B7280] font-mono">sandbox-ats-v2.0.dev</span>
              <div className="flex gap-1">
                {sandboxState !== "idle" && (
                  <button 
                    onClick={resetDemoScan}
                    className="text-[9px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-all border border-white/[0.08] cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Role Tab Selector (Only clickable when scanner is idle) */}
            <div className="flex border-b border-white/[0.08] bg-[#111827]/20 p-2 gap-2 justify-center">
              {([
                { id: "swe", label: "Software Engineer" },
                { id: "pm", label: "Product Manager" },
                { id: "design", label: "UI/UX Designer" }
              ] as const).map(role => (
                <button
                  key={role.id}
                  disabled={sandboxState !== "idle"}
                  onClick={() => handleRoleChange(role.id)}
                  className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                    sandboxRole === role.id 
                      ? "bg-[#14B8A6] text-[#0A0E1A] text-white shadow-sm" 
                      : "text-slate-400 hover:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  } cursor-pointer`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {/* Sandbox Workspace Body */}
            <div className="p-4 sm:p-6 min-h-[300px] flex flex-col justify-center">
              {sandboxState === "idle" && (
                <div className="text-center max-w-md mx-auto space-y-5 py-6">
                  <div className="w-12 h-12 rounded-2xl bg-[#14B8A6]/5 border border-[#14B8A6]/20 text-[#14B8A6] flex items-center justify-center mx-auto shadow-[0_4px_16px_rgba(20,184,166,0.08)]">
                    <FileText size={22} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-mono">{roleData[sandboxRole].resumeName}</h3>
                    <p className="text-xs text-slate-400 mt-1">Target Requisition: <span className="font-bold text-[#14B8A6]">{roleData[sandboxRole].roleName}</span></p>
                  </div>
                  <button 
                    onClick={startDemoScan}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-600 hover:to-cyan-500 text-white py-3.5 px-6 font-bold text-xs hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-[0.98] transition-all cursor-pointer border border-teal-500/30"
                  >
                    <Sparkles size={13} />
                    <span>Run Simulated Audit</span>
                  </button>
                </div>
              )}

              {/* Progress and Active Scans */}
              {(sandboxState === "parsing" || sandboxState === "auditing" || sandboxState === "scoring") && (
                <div className="max-w-md mx-auto w-full space-y-6 py-6 relative overflow-hidden">
                  {/* Premium Scanner Laser Beam */}
                  <div className="animate-laser-scan" />
                  {/* Glowing progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                      <span className="capitalize">{sandboxState}...</span>
                      <span className="font-mono text-[#14B8A6]">{sandboxProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#111827]/40 rounded-full overflow-hidden border border-white/[0.08]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sandboxProgress}%` }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-teal-500 via-indigo-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.4)]"
                      />
                    </div>
                  </div>

                  {/* Terminal-like Scanning Logs */}
                  <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-4 font-mono text-[10px] space-y-2 text-slate-400 h-[120px] overflow-y-auto">
                    {scanLogs.map((log, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="text-teal-500">❯</span>
                        <span>{log}</span>
                        {index === scanLogs.length - 1 && (
                          <span className="w-1.5 h-3 bg-indigo-400 animate-pulse inline-block" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Render Completed Mock scorecard */}
              {sandboxState === "completed" && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left"
                >
                  <div className="md:col-span-2 space-y-4">
                    {/* Feedback Card */}
                    <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-wider">Recruiter Feedback Audit</span>
                        <span className="text-[9px] font-mono font-bold bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 px-2 py-0.5 rounded">
                          COMPLETED
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {roleData[sandboxRole].feedback}
                      </p>
                      <div className="h-[1px] bg-white/5" />
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                          <Info size={11} className="text-[#14B8A6]" />
                          <span>Click Gaps below for AI Suggested Bullet Points</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Score Card */}
                    <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-4 flex flex-col justify-between h-[120px] shadow-sm relative overflow-hidden">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall ATS Score</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-4xl font-extrabold text-[#14B8A6] font-mono tracking-tight"
                        >
                          {roleData[sandboxRole].targetScore}%
                        </motion.span>
                        <span className="text-[9px] text-[#4ADE80] font-bold">EXCELLENT MATCH</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${roleData[sandboxRole].targetScore}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-[0_0_8px_rgba(20,184,166,0.25)]" 
                        />
                      </div>
                    </div>

                    {/* Keywords Card with click-expand triggers */}
                    <div className="bg-[#111827] border border-white/[0.08] rounded-xl p-4 space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Gaps &amp; Missing Keywords</span>
                      <div className="flex flex-wrap gap-1.5">
                        {roleData[sandboxRole].missingKeywords.map((kw) => (
                          <button
                            key={kw.name}
                            onClick={() => setActiveAdviceKeyword(activeAdviceKeyword === kw.name ? null : kw.name)}
                            className={`text-[8.5px] font-bold px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
                              activeAdviceKeyword === kw.name 
                                ? "bg-rose-500 text-white border-rose-400 shadow-sm" 
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                            }`}
                          >
                            <span>{kw.name}</span>
                            <ChevronDown size={8} className={`transition-transform duration-200 ${activeAdviceKeyword === kw.name ? "rotate-180" : ""}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Keyword Advisor Bubble */}
                  <AnimatePresence>
                    {activeAdviceKeyword && (
                      <motion.div 
                        initial={{ opacity: 0, y: -4, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -4, height: 0 }}
                        className="col-span-full border border-[#14B8A6]/20 bg-[#111827] rounded-xl p-3.5"
                      >
                        <p className="text-[9px] font-bold text-[#14B8A6] uppercase tracking-widest flex items-center gap-1.5">
                          <Sparkles size={11} className="animate-pulse text-[#14B8A6]" />
                          <span>AI Resume Builder Suggestion for "{activeAdviceKeyword}"</span>
                        </p>
                        <p className="text-xs text-slate-300 font-mono mt-1.5 italic p-2 bg-[#111827] border border-white/[0.08] rounded-lg select-text selection:bg-teal-500 selection:text-white">
                          "{roleData[sandboxRole].missingKeywords.find(k => k.name === activeAdviceKeyword)?.advice}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sandbox CTA Footer */}
                  <div className="col-span-full mt-3 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-[#14B8A6]/20 bg-[#14B8A6]/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#14B8A6]/10 flex items-center justify-center text-[#14B8A6] shadow-sm">
                        <Sparkles size={14} />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs font-bold text-white">Unlock detailed audit insights</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Generate custom cover letters &amp; interview coaches instantly.</p>
                      </div>
                    </div>
                    <Link 
                      href="/login" 
                      className="flex items-center gap-1.5 rounded-lg bg-[#14B8A6] text-[#0A0E1A] hover:bg-[#14B8A6]/90 text-white px-4 py-2.5 font-bold text-xs shadow-md shadow-teal-600/10 hover:shadow-teal-600/20 transition-all whitespace-nowrap border border-[#14B8A6]/20 cursor-pointer"
                    >
                      <span>Create Account &amp; Scan Yours</span>
                      <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Interactive Tabs / Features Grid Section */}
      <section id="features" className="w-full overflow-hidden border-b border-white/[0.08] bg-[#0A0E1A] py-[64px] md:py-[96px] lg:py-[120px] relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-1 rounded-full border border-[#14B8A6]/15">
              Core Architecture
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F4]">Everything You Need to Beat the ATS</h2>
            <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto font-normal leading-relaxed">
              Our platform evaluates resumes using semantic matching algorithms similar to those deployed by top Fortune 500 hiring teams.
            </p>
          </div>

        {/* Tab Switcher Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-[#111827] border border-white/[0.08] rounded-xl">
            {featureTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-[#14B8A6] text-[#0A0E1A] text-white shadow-[0_4px_12px_rgba(20,184,166,0.2)]" 
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Tab content display */}
        <div className="grid gap-6 lg:grid-cols-2 items-center max-w-5xl mx-auto bg-[#111827] border border-white/[0.08] rounded-2xl p-6 sm:p-10 shadow-xl backdrop-blur-md">
          {featureTabs.map((tab) => {
            if (tab.id !== activeTab) return null;
            return (
              <motion.div 
                key={tab.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#14B8A6]/10 text-[#14B8A6] border border-[#14B8A6]/20 text-[9px] font-bold uppercase tracking-wider">
                  {tab.badge}
                </div>
                <h3 className="font-display text-2xl font-black tracking-tight text-[#F5F5F4] leading-snug">{tab.headline}</h3>
                <p className="font-sans text-xs text-[#9CA3AF] leading-relaxed font-normal">{tab.description}</p>
                <div className="flex items-center gap-2 text-[#14B8A6] font-bold text-xs">
                  <CheckCircle2 size={13} className="text-[#4ADE80]" />
                  <span>{tab.metric}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Visual card showcase side */}
          <div className="relative aspect-video rounded-xl bg-[#111827] border border-white/[0.08] overflow-hidden p-6 flex flex-col justify-between">
            {activeTab === "audit" && (
              <div className="space-y-4 my-auto">
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/[0.08] pb-2">
                  <span className="text-[#6B7280]">Margin compliance:</span>
                  <span className="text-[#4ADE80]">1.0 in (Standard)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/[0.08] pb-2">
                  <span className="text-[#6B7280]">Font safety index:</span>
                  <span className="text-[#4ADE80]">100% Parsable</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono border-b border-white/[0.08] pb-2">
                  <span className="text-[#6B7280]">Tables parser audit:</span>
                  <span className="text-amber-400">Complex columns detected</span>
                </div>
              </div>
            )}

            {activeTab === "keywords" && (
              <div className="space-y-4 my-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">Next.js (Match)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">GraphQL (Match)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Kubernetes (Missing)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">SQL (Match)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">Docker (Missing)</span>
                </div>
              </div>
            )}

            {activeTab === "coach" && (
              <div className="space-y-3 my-auto">
                <div className="p-3 bg-[#111827] border border-white/[0.08] rounded-lg">
                  <p className="text-[9px] font-mono text-[#14B8A6]">BEHAVIORAL PROMPT</p>
                  <p className="text-xs text-slate-300 font-bold mt-1">"Can you describe a scenario where you migrated an application architecture to Next.js?"</p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-500/5 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
        </div>
      </section>

      {/* Statistics Metrics Banner with Dynamic Count-Up states */}
      <motion.section 
        id="statistics" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="w-full overflow-hidden border-b border-white/[0.08] bg-[#0A0E1A] py-[64px] md:py-[96px] lg:py-[120px] relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="bg-gradient-to-r from-teal-600/10 via-cyan-600/5 to-cyan-500/10 border border-[#14B8A6]/15 rounded-2xl p-8 sm:p-12 backdrop-blur-xl shadow-lg">
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              <div className="space-y-1">
                <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {statAccuracy}%
                </span>
                <span className="block text-[10px] sm:text-xs font-bold text-[#14B8A6] uppercase tracking-widest">ATS Parser Accuracy</span>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-white/[0.08] pt-6 sm:pt-0">
                <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {statTime.toFixed(1)}s
                </span>
                <span className="block text-[10px] sm:text-xs font-bold text-[#14B8A6] uppercase tracking-widest">Average Analysis Time</span>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 pt-6 sm:pt-0">
                <span className="block text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                  {statEfficiency}x
                </span>
                <span className="block text-[10px] sm:text-xs font-bold text-[#14B8A6] uppercase tracking-widest">Hiring Match Efficiency</span>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
      
      {/* Testimonials Masonry Grid Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="w-full overflow-hidden border-b border-white/[0.08] bg-[#0A0E1A] py-[64px] md:py-[96px] lg:py-[120px] relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div variants={fadeInUp} className="text-center space-y-4 mb-14">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-1 rounded-full border border-[#14B8A6]/15">
              Success Stories
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F4]">Trusted by Top Tier Candidates</h2>
            <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto font-normal leading-relaxed">
              Discover how developers, managers, and analysts successfully landed competitive career roles.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            {testimonials.map((t, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="bg-[#111827] border border-white/[0.08] rounded-2xl p-6 sm:p-8 relative flex flex-col justify-between hover:border-[#14B8A6]/25 hover:shadow-[0_4px_20px_rgba(20,184,166,0.08)] transition-all duration-300 shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-[#14B8A6] text-xs">★</span>
                      ))}
                    </div>
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20">
                      {t.score}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 border-t border-white/[0.08] pt-4">
                  <div className="w-8 h-8 rounded-full bg-[#14B8A6]/10 border border-[#14B8A6]/20 flex items-center justify-center text-xs font-bold text-[#14B8A6] font-mono">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-[#6B7280] font-medium">{t.role} · {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      
      {/* Pricing Plans Grid with Billing Toggle */}
      <motion.section 
        id="pricing" 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="w-full overflow-hidden border-b border-white/[0.08] bg-[#0A0E1A] py-[64px] md:py-[96px] lg:py-[120px] relative z-10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div variants={fadeInUp} className="text-center space-y-4 mb-12">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-1 rounded-full border border-[#14B8A6]/15">
              Subscription Plans
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F4] max-w-2xl mx-auto">Flexible SaaS Pricing</h2>
            <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto font-normal leading-relaxed">
              Unlock your full ATS matching score capacity and practice mock recruiter panel reviews.
            </p>
          </motion.div>

          {/* Toggle billing period selector */}
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3.5 mb-14">
            <span className={`text-xs font-bold ${billingCycle === "monthly" ? "text-white" : "text-[#6B7280]"}`}>Monthly billing</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-[#111827] border border-white/[0.08] p-0.5 relative transition-all cursor-pointer"
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-teal-500 transition-all ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold ${billingCycle === "yearly" ? "text-white" : "text-[#6B7280]"}`}>Yearly billing</span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20 px-2 py-0.5 rounded-full animate-pulse">
                Save 20%
              </span>
            </div>
          </motion.div>

          {/* Cards container */}
          <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
            {/* Starter Plan */}
            <motion.div 
              variants={fadeInUp}
              className="bg-[#111827] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#14B8A6]/20 hover:bg-[#111827] hover:shadow-[0_4px_20px_rgba(20,184,166,0.05)] transition-all duration-300 shadow-md"
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Starter</h3>
                  <p className="text-[10px] text-[#6B7280]">Perfect for initial scans.</p>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">$0</span>
                  <span className="text-[10px] text-[#6B7280]">/ forever</span>
                </div>
                <div className="h-[1px] bg-white/5" />
                <ul className="space-y-3" aria-label="Starter features list">
                  {["3 resume scans monthly", "Standard layout analyzer", "Primary keyword density score"].map((f) => (
                    <li key={f} className="flex gap-2.5 text-xs text-slate-400 font-medium">
                      <Check size={13} className="text-[#14B8A6] shrink-0 mt-[1px]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                href="/login" 
                className="w-full text-center py-3.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 text-[#F5F5F4] font-bold text-xs mt-8 transition-all duration-300 cursor-pointer"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan (Most Popular Highlighted) */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-b from-slate-900/40 to-teal-950/10 border border-teal-500/35 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-teal-500/50 hover:shadow-[0_0_24px_rgba(20,184,166,0.15)] transition-all duration-300 relative shadow-lg shadow-teal-950/20"
            >
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#14B8A6] text-[#0A0E1A] border border-teal-400/25 px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider text-white shadow-md animate-pulse">
                Most Popular
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Professional</h3>
                  <p className="text-[10px] text-[#14B8A6]">Maximize interview invitations.</p>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">
                    {billingCycle === "yearly" ? "$15" : "$19"}
                  </span>
                  <span className="text-[10px] text-[#6B7280]">/ month</span>
                </div>
                <div className="h-[1px] bg-white/5" />
                <ul className="space-y-3" aria-label="Pro features list">
                  {[
                    "Unlimited resume scans",
                    "AI Career Coach integrations",
                    "Job Requisition sync comparisons",
                    "Automated cover letter generator",
                    "Live Simulated Recruiter coach"
                  ].map((f) => (
                    <li key={f} className="flex gap-2.5 text-xs text-slate-200 font-medium">
                      <Check size={13} className="text-[#14B8A6] shrink-0 mt-[1px]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                href="/login" 
                className="w-full text-center py-3.5 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:shadow-[0_0_24px_rgba(20,184,166,0.35)] text-white font-bold text-xs mt-8 border border-[#14B8A6]/20 shadow-md shadow-teal-500/10 transition-all duration-300 cursor-pointer"
              >
                Start 7-Day Free Trial
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              variants={fadeInUp}
              className="bg-[#111827] border border-white/[0.08] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#14B8A6]/20 hover:bg-[#111827] hover:shadow-[0_4px_20px_rgba(20,184,166,0.05)] transition-all duration-300 shadow-md"
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Enterprise</h3>
                  <p className="text-[10px] text-[#6B7280]">For agencies &amp; recruiters.</p>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-white">Custom</span>
                </div>
                <div className="h-[1px] bg-white/5" />
                <ul className="space-y-3" aria-label="Enterprise features list">
                  {[
                    "Dedicated API endpoint keys",
                    "Custom fine-tuned assessment models",
                    "Bulk CSV parsing & export pipelines",
                    "Multi-seat coordinator workspaces",
                    "Priority support SLA agreements"
                  ].map((f) => (
                    <li key={f} className="flex gap-2.5 text-xs text-slate-400 font-medium">
                      <Check size={13} className="text-[#14B8A6] shrink-0 mt-[1px]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                href="/login" 
                className="w-full text-center py-3.5 rounded-xl border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/20 text-[#F5F5F4] font-bold text-xs mt-8 transition-all duration-300 cursor-pointer"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Accordion FAQ Section */}
      <section id="faq" className="w-full overflow-hidden border-b border-white/[0.08] bg-[#0A0E1A] py-[64px] md:py-[96px] lg:py-[120px] relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-14">
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 px-3 py-1 rounded-full border border-[#14B8A6]/15">
              Common Questions
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F4]">Frequently Asked Questions</h2>
            <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto font-normal leading-relaxed">
              Learn more about ATS scanning systems, resume processing rules, and workspace settings.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#111827] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <span>{f.question}</span>
                    <ChevronDown 
                      size={14} 
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#14B8A6]" : "rotate-0"}`} 
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-white/[0.08]"
                      >
                        <p className="font-sans p-5 text-[11px] leading-relaxed text-[#9CA3AF] font-normal">
                          {f.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Action CTA Banner */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="w-full overflow-hidden border-b border-white/[0.08] bg-[#0A0E1A] py-[64px] md:py-[96px] lg:py-[120px] relative z-10"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={fadeInUp} className="space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#F5F5F4] leading-tight">
              Stop Guessing. Audit Your Resume Today.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#9CA3AF] max-w-xl mx-auto font-normal leading-relaxed">
              Ensure your professional achievements aren't getting filtered by robotic screeners. Sign up now and scan your first resume instantly.
            </p>
            <div className="flex justify-center mt-8">
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 rounded-xl bg-[#14B8A6] hover:bg-[#14B8A6]/90 hover:shadow-[0_0_24px_rgba(20,184,166,0.35)] text-[#0A0E1A] px-8 py-4 font-bold text-sm transition-all duration-300 border border-[#14B8A6]/20 shadow-md cursor-pointer"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight size={14} />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] py-8 bg-[#111827]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-sm bg-teal-500" />
            <span>RecruitFlow AI</span>
          </div>
          <span>&copy; {new Date().getFullYear()} RecruitFlow AI. All rights reserved.</span>
        </div>
      </footer>
      </div>
    </div>
  );
}