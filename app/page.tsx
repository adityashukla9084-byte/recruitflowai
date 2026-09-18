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
  Layers, 
  Award,
  ArrowUpRight,
  Info,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Logo from "./components/Logo";
import HiringCommandCenter from "./components/HiringCommandCenter";

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
    quote: "After being ghosted on 30+ applications, I ran my resume here. It pointed out that my formatting was parsing incorrectly and that my bullet points lacked metrics. Fixed it, and got an Atlassian callback a week later.",
    name: "Marcus Vance",
    role: "Senior React Engineer",
    company: "Atlassian",
    score: "ATS: 58% → 84%"
  },
  {
    quote: "The keyword tool showed me I was missing key PM terms like 'GTM strategy' and 'OKR alignment' even though I did that work daily. Adding them in got me past the screen at Snowflake.",
    name: "Elena Rostova",
    role: "Technical Product Manager",
    company: "Snowflake",
    score: "ATS: 64% → 89%"
  },
  {
    quote: "The AI mock interviewer is surprisingly good. It deep-dived into the distributed systems projects on my resume and asked actual L6-level questions. Felt super prepared going into my Netflix loop.",
    name: "Devon Miller",
    role: "Infrastructure Engineer",
    company: "Netflix",
    score: "ATS: 71% → 90%"
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

  // Premium Navigation Hover State
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null);
  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Interactive Demo", href: "#demo" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" }
  ];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



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
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-[#FFFFF0] relative overflow-hidden select-none">
      {/* Premium Cursor Spotlight Follower */}
      <div className={`hidden ${isHovered ? "hidden-active" : ""}`} />
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
        className="absolute top-[-10%] left-[-10%] w-[700px] h-[700px] bg-transparent pointer-events-none will-change-gpu" 
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
        className="absolute top-[20%] right-[-10%] w-[800px] h-[800px] bg-transparent pointer-events-none will-change-gpu" 
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
        className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-transparent pointer-events-none will-change-gpu" 
      />

      {/* Dotted grid pattern overlay */}
      <div 
        className="absolute inset-0 bg-transparent bg-[size:24px_24px] pointer-events-none" 
        aria-hidden="true" 
      />



      {/* Wrapper to ensure content stacks correctly above the z-0 video background */}
      <div className="relative z-10 w-full flex flex-col">
        {/* Floating Sticky Glass Navbar */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-[#050505]/65  px-6 lg:px-12 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size={24} />

          <nav className="hidden md:flex items-center gap-1.5 p-1 bg-[#050505]/[0.02] border border-zinc-800 rounded-full  relative">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className="relative px-4 py-2 text-xs font-bold tracking-wide tracking-wide text-zinc-400 hover:text-[#FFFFF0] transition-colors duration-300 rounded-full"
                onMouseEnter={() => setHoveredNavIndex(index)}
                onMouseLeave={() => setHoveredNavIndex(null)}
              >
                <span className="relative z-10">{item.name}</span>
                {hoveredNavIndex === index && (
                  <motion.span
                    layoutId="navbar-hover-glow"
                    className="absolute inset-0 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full -z-0 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold tracking-wide text-zinc-300 hover:text-[#FFFFF0] transition-colors">
              Log In
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="hidden sm:block">
              <Link 
                href="/login" 
                className="text-xs font-bold tracking-wide bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 px-4 py-2 rounded-xl transition-all duration-200 border border-zinc-700 shadow-[0_4px_12px_rgba(20,184,166,0.25)]"
              >
                Sign Up
              </Link>
            </motion.div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-[#FFFFF0] hover:bg-[#050505]/[0.04] transition-all duration-200 cursor-pointer"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Dropdown Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden w-full border-b border-zinc-800 bg-[#050505]/95  px-6 py-5 flex flex-col gap-4 absolute top-[68px] left-0 z-40 shadow-xl"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold tracking-wide text-zinc-300 hover:text-[#FFFFF0] transition-colors py-2 border-b border-zinc-800"
              >
                {item.name}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl bg-[#D4AF37] text-[#0F172A] font-bold tracking-wide text-xs shadow-md border border-[#D4AF37]/30 mt-2"
            >
              Sign Up Free
            </Link>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Hero section */}
      <section className="relative w-full border-b border-zinc-800 overflow-hidden">
        {/* Subtle radial glow backgrounds */}
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none" />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-16 pb-10 sm:px-8 sm:pt-20 sm:pb-14 md:pt-24 md:pb-16 lg:px-12"
        >
          {/* ── Text Block ── */}
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            {/* Pill Badge */}
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.14em] mb-7"
            >
              <Sparkles size={11} />
              <span>AI-Powered Recruitment Intelligence</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-[-0.04em] leading-[1.04] text-[#F8FAFC]"
            >
              Automate Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3CA4B]">
                Entire Hiring
              </span>{" "}
              Pipeline.
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="font-sans text-base sm:text-lg text-[#94A3B8] max-w-xl mx-auto mt-6 font-normal leading-[1.7]"
            >
              From resume intake to offer letter — watch AI scan, score, shortlist, and schedule interviews in real time.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3"
            >
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-7 py-3.5 font-bold tracking-wide text-sm text-[#0F172A] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#EBC855] cursor-pointer shadow-[0_8px_24px_rgba(212,175,55,0.25)]"
                >
                  <span>Start Hiring Smarter</span>
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
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-7 py-3.5 font-bold tracking-wide text-sm text-[#F8FAFC] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/30 hover:bg-white/[0.06] cursor-pointer"
                >
                  <span>Watch Demo</span>
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* ── Cinematic Command Center Visual ── */}
          <motion.div
            variants={fadeInUp}
            className="w-full"
          >
            <HiringCommandCenter />
          </motion.div>
        </motion.div>
      </section>

      {/* Career intelligence engine */}
      <section className="relative overflow-hidden border-b border-zinc-800 bg-[#0A0A0A] py-20 sm:py-24">
        <div className="absolute -left-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-[#D4AF37]/[0.06] blur-[120px] pointer-events-none" />
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-[#D4AF37]/[0.05] blur-[100px] pointer-events-none" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-16 lg:px-12">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-[#D4AF37]/10 px-3 py-1.5 text-[10px] font-bold tracking-wide uppercase tracking-[0.14em] text-[#D4AF37]">
              <Sparkles size={12} />
              Career intelligence engine
            </div>
            <h2 className="font-display max-w-xl text-4xl font-black leading-[1.08] tracking-[-0.04em] text-slate-50 sm:text-5xl">
              Every signal, working toward your <span className="text-[#FFFFF0]">next yes.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
              RecruitFlow connects resume quality, role-fit signals, and interview preparation into one focused career workflow.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                [FileSearch, "Resume intelligence", "Find the gaps that hold your application back."],
                [TrendingUp, "Role-fit signals", "Prioritize the skills recruiters are actually looking for."],
                [GraduationCap, "Interview readiness", "Turn insights into confident, targeted preparation."],
              ].map(([Icon, title, description]) => {
                const FeatureIcon = Icon as typeof FileSearch;
                return (
                  <div key={title as string} className="flex gap-4 rounded-2xl border border-zinc-800 bg-[#050505]/[0.035] p-4 ">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/10 text-[#D4AF37]">
                      <FeatureIcon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold tracking-wide text-[#FFFFF0]">{title as string}</h3>
                      <p className="mt-1 text-sm leading-5 text-zinc-400">{description as string}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.97 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-r from-[#D4AF37]/15 via-[#D4AF37]/8 to-[#D4AF37]/5 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#050505] p-1 shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
              <Image
                src="/recruitflow-career-engine-3d.png"
                alt="Three-dimensional RecruitFlow career intelligence engine"
                width={1792}
                height={1024}
                className="h-auto w-full rounded-[21px]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Infinite Logo Marquee (Social Proof) */}
      <section className="py-6 border-t border-b border-zinc-800 bg-[#050505]/20 overflow-hidden select-none relative w-full">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#05070F] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#05070F] to-transparent z-10" />
        
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, repeatIndex) => (
            <div key={repeatIndex} className="flex items-center gap-16">
              <span className="text-xs font-bold tracking-wide text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                <Layers size={14} className="text-violet-500" /> METACLOUD
              </span>
              <span className="text-xs font-bold tracking-wide text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                <Shield size={14} className="text-[#D4AF37]" /> APEX SECURITY
              </span>
              <span className="text-xs font-bold tracking-wide text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                <Zap size={14} className="text-[#D4AF37]" /> ZAPLINE
              </span>
              <span className="text-xs font-bold tracking-wide text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                <TrendingUp size={14} className="text-emerald-500" /> HYPERGROWTH
              </span>
              <span className="text-xs font-bold tracking-wide text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                <Award size={14} className="text-amber-500" /> PRIME HR
              </span>
              <span className="text-xs font-bold tracking-wide text-zinc-400 tracking-widest uppercase flex items-center gap-2">
                <Sparkles size={14} className="text-pink-500" /> GENESIS AI
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Demo Resume Parser Sandbox Section */}
      <section id="demo" className="w-full overflow-hidden border-b border-zinc-800 bg-[#050505] py-[64px] md:py-[96px] lg:py-[120px] relative z-10">
        {/* 3D Scanner Demo Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/scanner-demo-3d.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[80%_center] opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,26,0.98)_0%,rgba(10,14,26,0.80)_55%,rgba(10,14,26,0.50)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0E1A] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A] to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center space-y-5 mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/8  shadow-[0_0_20px_rgba(20,184,166,0.12)]">
              <Zap size={11} className="text-[#D4AF37] " />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">Live Demo — Try It Now</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.06] text-[#FFFFF0]">
              See the{" "}
              <span className="relative inline-block">
                <span className="text-[#FFFFF0]">AI Scanner</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#D4AF37]/60 to-[#D4AF37]/0 rounded-full" />
              </span>
              {" "}in Action
            </h2>
            <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
              Pick a real-world role, run a simulated ATS audit, and watch our engine surface exactly what's holding your resume back.
            </p>
          </div>

        {/* Dashboard Mockup Panel Preview / Interactive Sandbox */}
        <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 bg-[#050505] p-2 shadow-2xl ">
          <div className="rounded-xl border border-zinc-800 bg-[#050505] overflow-hidden relative">
            {/* Mock Header */}
            <div className="h-12 bg-[#050505] border-b border-zinc-800 flex items-center px-4 justify-between select-none">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
              </div>
              <span className="text-[10px] text-zinc-400 font-mono">sandbox-ats-v2.0.dev</span>
              <div className="flex gap-1">
                {sandboxState !== "idle" && (
                  <button 
                    onClick={resetDemoScan}
                    className="text-[9px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-zinc-300 font-bold tracking-wide transition-all border border-zinc-800 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            {/* Role Tab Selector (Only clickable when scanner is idle) */}
            <div className="flex border-b border-zinc-800 bg-[#050505]/20 p-2 gap-2 justify-center">
              {([
                { id: "swe", label: "Software Engineer" },
                { id: "pm", label: "Product Manager" },
                { id: "design", label: "UI/UX Designer" }
              ] as const).map(role => (
                <button
                  key={role.id}
                  disabled={sandboxState !== "idle"}
                  onClick={() => handleRoleChange(role.id)}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-wide rounded-lg transition-all ${
                    sandboxRole === role.id 
                      ? "bg-[#D4AF37] text-black text-[#FFFFF0] shadow-sm" 
                      : "text-zinc-400 hover:text-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed"
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
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/5 border border-zinc-700 text-[#FFFFF0] flex items-center justify-center mx-auto shadow-[0_4px_16px_rgba(20,184,166,0.08)]">
                    <FileText size={22} className="" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold tracking-wide text-[#FFFFF0] font-mono">{roleData[sandboxRole].resumeName}</h3>
                    <p className="text-xs text-zinc-400 mt-1">Target Requisition: <span className="font-bold tracking-wide text-[#FFFFF0]">{roleData[sandboxRole].roleName}</span></p>
                  </div>
                  <button 
                    onClick={startDemoScan}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] text-white hover:bg-gray-800 text-[#FFFFF0] py-3.5 px-6 font-bold tracking-wide text-xs hover:shadow-[0_0_20px_rgba(20,184,166,0.4)] active:scale-[0.98] transition-all cursor-pointer border border-[#D4AF37]/30"
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
                  <div className="hidden" />
                  {/* Glowing progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-semibold tracking-wide text-zinc-400">
                      <span className="capitalize">{sandboxState}...</span>
                      <span className="font-mono text-[#FFFFF0]">{sandboxProgress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#050505]/40 rounded-full overflow-hidden border border-zinc-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${sandboxProgress}%` }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        className="h-full bg-[#D4AF37] text-white rounded-full shadow-[0_0_10px_rgba(20,184,166,0.4)]"
                      />
                    </div>
                  </div>

                  {/* Terminal-like Scanning Logs */}
                  <div className="bg-[#050505] border border-zinc-800 rounded-xl p-4 font-mono text-[10px] space-y-2 text-zinc-400 h-[120px] overflow-y-auto">
                    {scanLogs.map((log, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <span className="text-[#D4AF37]">❯</span>
                        <span>{log}</span>
                        {index === scanLogs.length - 1 && (
                          <span className="w-1.5 h-3 bg-indigo-400  inline-block" />
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
                    <div className="bg-[#050505] border border-zinc-800 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold tracking-wide text-[#FFFFF0] uppercase tracking-wider">Recruiter Feedback Audit</span>
                        <span className="text-[9px] font-mono font-bold tracking-wide bg-[#4ADE80]/10 text-[#FFFFF0] border border-[#4ADE80]/20 px-2 py-0.5 rounded">
                          COMPLETED
                        </span>
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                        {roleData[sandboxRole].feedback}
                      </p>
                      <div className="h-[1px] bg-[#050505]/5" />
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold tracking-wide text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 ">
                          <Info size={11} className="text-[#FFFFF0]" />
                          <span>Click Gaps below for AI Suggested Bullet Points</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Score Card */}
                    <div className="bg-[#050505] border border-zinc-800 rounded-xl p-4 flex flex-col justify-between h-[120px] shadow-sm relative overflow-hidden">
                      <span className="text-[10px] font-bold tracking-wide text-zinc-400 uppercase tracking-wider">Overall ATS Score</span>
                      <div className="flex items-baseline gap-2 mt-2">
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-4xl font-extrabold text-[#FFFFF0] font-mono tracking-tight"
                        >
                          {roleData[sandboxRole].targetScore}%
                        </motion.span>
                        <span className="text-[9px] text-[#FFFFF0] font-bold tracking-wide">EXCELLENT MATCH</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${roleData[sandboxRole].targetScore}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F3CA4B] rounded-full shadow-[0_0_8px_rgba(20,184,166,0.25)]" 
                        />
                      </div>
                    </div>

                    {/* Keywords Card with click-expand triggers */}
                    <div className="bg-[#050505] border border-zinc-800 rounded-xl p-4 space-y-2">
                      <span className="text-[10px] font-bold tracking-wide text-zinc-400 uppercase tracking-wider block">Gaps &amp; Missing Keywords</span>
                      <div className="flex flex-wrap gap-1.5">
                        {roleData[sandboxRole].missingKeywords.map((kw) => (
                          <button
                            key={kw.name}
                            onClick={() => setActiveAdviceKeyword(activeAdviceKeyword === kw.name ? null : kw.name)}
                            className={`text-[8.5px] font-bold tracking-wide px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center gap-1 ${
                              activeAdviceKeyword === kw.name 
                                ? "bg-rose-500 text-[#FFFFF0] border-rose-400 shadow-sm" 
                                : "bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20"
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
                        className="col-span-full border border-zinc-700 bg-[#050505] rounded-xl p-3.5"
                      >
                        <p className="text-[9px] font-bold tracking-wide text-[#FFFFF0] uppercase tracking-widest flex items-center gap-1.5">
                          <Sparkles size={11} className=" text-[#FFFFF0]" />
                          <span>AI Resume Builder Suggestion for "{activeAdviceKeyword}"</span>
                        </p>
                        <p className="text-xs text-zinc-300 font-mono mt-1.5 italic p-2 bg-[#050505] border border-zinc-800 rounded-lg select-text selection:bg-[#D4AF37] selection:text-[#FFFFF0]">
                          "{roleData[sandboxRole].missingKeywords.find(k => k.name === activeAdviceKeyword)?.advice}"
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Sandbox CTA Footer */}
                  <div className="col-span-full mt-3 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-zinc-700 bg-[#D4AF37]/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#FFFFF0] shadow-sm">
                        <Sparkles size={14} />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs font-bold tracking-wide text-[#FFFFF0]">Unlock detailed audit insights</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Generate custom cover letters &amp; interview coaches instantly.</p>
                      </div>
                    </div>
                    <Link 
                      href="/login" 
                      className="flex items-center gap-1.5 rounded-lg bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 text-[#FFFFF0] px-4 py-2.5 font-bold tracking-wide text-xs shadow-md shadow-[#D4AF37]/10 hover:shadow-[#D4AF37]/20 transition-all whitespace-nowrap border border-zinc-700 cursor-pointer"
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
      <section id="features" className="w-full overflow-hidden border-b border-zinc-800 bg-[#050505] py-[64px] md:py-[96px] lg:py-[120px] relative z-10">
        {/* 3D Features Architecture Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/features-3d.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[20%_center] opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,26,0.50)_0%,rgba(10,14,26,0.85)_50%,rgba(10,14,26,0.98)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0E1A] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A] to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="text-center space-y-5 mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/8  shadow-[0_0_20px_rgba(212,175,55,0.12)]">
              <Shield size={11} className="text-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">Core Architecture</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.06] text-[#FFFFF0]">
              Every Tool You Need to{" "}
              <br className="hidden sm:block" />
              <span className="text-[#FFFFF0]">Outsmart the ATS</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
              Powered by the same semantic-matching algorithms used by Fortune 500 recruiting teams — now working for <em className="text-zinc-300 not-italic font-semibold tracking-wide">you</em>.
            </p>
          </div>

        {/* Tab Switcher Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-[#050505] border border-zinc-800 rounded-xl">
            {featureTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold tracking-wide rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? "bg-[#D4AF37] text-black text-[#FFFFF0] shadow-[0_4px_12px_rgba(20,184,166,0.2)]" 
                      : "text-zinc-400 hover:text-zinc-200"
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
        <div className="grid gap-6 lg:grid-cols-2 items-center max-w-5xl mx-auto bg-[#050505] border border-zinc-800 rounded-2xl p-6 sm:p-10 shadow-xl ">
          {featureTabs.map((tab) => {
            if (tab.id !== activeTab) return null;
            return (
              <motion.div 
                key={tab.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="inline-block px-2.5 py-0.5 rounded bg-[#D4AF37]/10 text-[#FFFFF0] border border-zinc-700 text-[9px] font-bold tracking-wide uppercase tracking-wider">
                  {tab.badge}
                </div>
                <h3 className="font-display text-2xl font-black tracking-tight text-[#FFFFF0] leading-snug">{tab.headline}</h3>
                <p className="font-sans text-xs text-zinc-300 leading-relaxed font-normal">{tab.description}</p>
                <div className="flex items-center gap-2 text-[#FFFFF0] font-bold tracking-wide text-xs">
                  <CheckCircle2 size={13} className="text-[#FFFFF0]" />
                  <span>{tab.metric}</span>
                </div>
              </motion.div>
            );
          })}

          {/* Visual card showcase side */}
          <div className="relative aspect-video rounded-xl bg-[#050505] border border-zinc-800 overflow-hidden p-6 flex flex-col justify-between">
            {activeTab === "audit" && (
              <div className="space-y-4 my-auto">
                <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Margin compliance:</span>
                  <span className="text-[#FFFFF0]">1.0 in (Standard)</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Font safety index:</span>
                  <span className="text-[#FFFFF0]">100% Parsable</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono border-b border-zinc-800 pb-2">
                  <span className="text-zinc-400">Tables parser audit:</span>
                  <span className="text-amber-300">Complex columns detected</span>
                </div>
              </div>
            )}

            {activeTab === "keywords" && (
              <div className="space-y-4 my-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#FFFFF0] border border-[#4ADE80]/20">Next.js (Match)</span>
                  <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#FFFFF0] border border-[#4ADE80]/20">GraphQL (Match)</span>
                  <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">Kubernetes (Missing)</span>
                  <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#FFFFF0] border border-[#4ADE80]/20">SQL (Match)</span>
                  <span className="text-[10px] font-bold tracking-wide px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">Docker (Missing)</span>
                </div>
              </div>
            )}

            {activeTab === "coach" && (
              <div className="space-y-3 my-auto">
                <div className="p-3 bg-[#050505] border border-zinc-800 rounded-lg">
                  <p className="text-[9px] font-mono text-[#FFFFF0]">BEHAVIORAL PROMPT</p>
                  <p className="text-xs text-zinc-300 font-bold tracking-wide mt-1">"Can you describe a scenario where you migrated an application architecture to Next.js?"</p>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-transparent from-[#D4AF37]/5 via-transparent to-transparent pointer-events-none" />
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
        className="w-full overflow-hidden border-b border-zinc-800 bg-[#050505] py-[64px] md:py-[96px] lg:py-[120px] relative z-10"
      >
        {/* 3D Statistics Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/statistics-3d.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-[rgba(10,14,26,0.72)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0E1A] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A] to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <div className="bg-gradient-to-r from-[#D4AF37]/10 via-[#D4AF37]/5 to-[#D4AF37]/3 border border-[#D4AF37]/25 rounded-2xl p-8 sm:p-12  shadow-lg">
            <div className="grid gap-6 sm:grid-cols-3 text-center">
              <div className="space-y-1">
                <span className="block text-4xl sm:text-5xl font-black text-[#FFFFF0] font-mono tracking-tight">
                  {statAccuracy}%
                </span>
                <span className="block text-[10px] sm:text-xs font-bold tracking-wide text-[#FFFFF0] uppercase tracking-widest">ATS Parser Accuracy</span>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 sm:border-x border-zinc-800 pt-6 sm:pt-0">
                <span className="block text-4xl sm:text-5xl font-black text-[#FFFFF0] font-mono tracking-tight">
                  {statTime.toFixed(1)}s
                </span>
                <span className="block text-[10px] sm:text-xs font-bold tracking-wide text-[#FFFFF0] uppercase tracking-widest">Average Analysis Time</span>
              </div>
              <div className="space-y-1 border-t sm:border-t-0 pt-6 sm:pt-0">
                <span className="block text-4xl sm:text-5xl font-black text-[#FFFFF0] font-mono tracking-tight">
                  {statEfficiency}x
                </span>
                <span className="block text-[10px] sm:text-xs font-bold tracking-wide text-[#FFFFF0] uppercase tracking-widest">Hiring Match Efficiency</span>
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
        className="w-full overflow-hidden border-b border-zinc-800 bg-[#050505] py-[64px] md:py-[96px] lg:py-[120px] relative z-10"
      >
        {/* 3D Testimonials Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/testimonials-3d.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,14,26,0.95)_0%,rgba(10,14,26,0.75)_50%,rgba(10,14,26,0.95)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0E1A] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A] to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div variants={fadeInUp} className="text-center space-y-4 mb-14">
            <span className="inline-block text-[10px] font-bold tracking-wide uppercase tracking-widest text-[#FFFFF0] bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/25">
              Success Stories
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#FFFFF0]">Trusted by Top Tier Candidates</h2>
            <p className="font-sans text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto font-normal leading-relaxed">
              Discover how developers, managers, and analysts successfully landed competitive career roles.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3 items-stretch">
            {testimonials.map((t, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="bg-[#050505] border border-zinc-800 rounded-2xl p-6 sm:p-8 relative flex flex-col justify-between hover:border-[#14B8A6]/25 hover:shadow-[0_4px_20px_rgba(20,184,166,0.08)] transition-all duration-300 shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className="text-[#FFFFF0] text-xs">★</span>
                      ))}
                    </div>
                    <span className="text-[9px] font-bold tracking-wide font-mono px-2 py-0.5 rounded bg-[#4ADE80]/10 text-[#FFFFF0] border border-[#4ADE80]/20">
                      {t.score}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-medium leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 border-t border-zinc-800 pt-4">
                  <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 border border-zinc-700 flex items-center justify-center text-xs font-bold tracking-wide text-[#FFFFF0] font-mono">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold tracking-wide text-[#FFFFF0]">{t.name}</h4>
                    <p className="text-[10px] text-zinc-400 font-medium">{t.role} · {t.company}</p>
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
        className="w-full overflow-hidden border-b border-zinc-800 bg-[#050505] py-[64px] md:py-[96px] lg:py-[120px] relative z-10"
      >
        {/* 3D Pricing Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/pricing-3d.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[75%_center] opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,26,0.98)_0%,rgba(10,14,26,0.80)_60%,rgba(10,14,26,0.60)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0E1A] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A] to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div variants={fadeInUp} className="text-center space-y-5 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/8  shadow-[0_0_20px_rgba(212,175,55,0.12)]">
              <TrendingUp size={11} className="text-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">Simple, Transparent Pricing</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.06] text-[#FFFFF0] max-w-3xl mx-auto">
              Invest in Your{" "}
              <span className="text-[#FFFFF0]">Career Breakthrough</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
              Start free. Upgrade when you're ready. Cancel anytime — no commitments, no hidden fees.
            </p>
          </motion.div>

          {/* Toggle billing period selector */}
          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-3.5 mb-14">
            <span className={`text-xs font-bold tracking-wide ${billingCycle === "monthly" ? "text-[#FFFFF0]" : "text-zinc-400"}`}>Monthly billing</span>
            <button 
              onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-[#050505] border border-zinc-800 p-0.5 relative transition-all cursor-pointer"
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-[#D4AF37] transition-all ${billingCycle === "yearly" ? "translate-x-6" : "translate-x-0"}`} />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs font-bold tracking-wide ${billingCycle === "yearly" ? "text-[#FFFFF0]" : "text-zinc-400"}`}>Yearly billing</span>
              <span className="text-[9px] font-bold tracking-wide uppercase tracking-wider bg-[#4ADE80]/10 text-[#FFFFF0] border border-[#4ADE80]/20 px-2 py-0.5 rounded-full ">
                Save 20%
              </span>
            </div>
          </motion.div>

          {/* Cards container */}
          <div className="grid gap-6 lg:grid-cols-3 max-w-6xl mx-auto items-stretch">
            {/* Starter Plan */}
            <motion.div 
              variants={fadeInUp}
              className="bg-[#050505] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 hover:bg-[#050505] hover:shadow-[0_4px_20px_rgba(20,184,166,0.05)] transition-all duration-300 shadow-md"
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-wide text-[#FFFFF0]">Starter</h3>
                  <p className="text-[10px] text-zinc-400">Perfect for initial scans.</p>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-[#FFFFF0]">$0</span>
                  <span className="text-[10px] text-zinc-400">/ forever</span>
                </div>
                <div className="h-[1px] bg-[#050505]/5" />
                <ul className="space-y-3" aria-label="Starter features list">
                  {["3 resume scans monthly", "Standard layout analyzer", "Primary keyword density score"].map((f) => (
                    <li key={f} className="flex gap-2.5 text-xs text-zinc-400 font-medium">
                      <Check size={13} className="text-[#FFFFF0] shrink-0 mt-[1px]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                href="/login" 
                className="w-full text-center py-3.5 rounded-xl border border-zinc-800 hover:bg-[#050505]/[0.08] hover:border-white/20 text-[#FFFFF0] font-bold tracking-wide text-xs mt-8 transition-all duration-300 cursor-pointer"
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro Plan (Most Popular Highlighted) */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-b from-[#0F172A]/60 to-[#D4AF37]/5 border border-[#D4AF37]/25 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#D4AF37]/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.15)] transition-all duration-300 relative shadow-lg shadow-[#0F172A]/40"
            >
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#D4AF37] text-black border border-zinc-800 px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-wide uppercase tracking-wider text-[#FFFFF0] shadow-md ">
                Most Popular
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-wide text-[#FFFFF0]">Professional</h3>
                  <p className="text-[10px] text-[#FFFFF0]">Maximize interview invitations.</p>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-[#FFFFF0]">
                    {billingCycle === "yearly" ? "$15" : "$19"}
                  </span>
                  <span className="text-[10px] text-zinc-400">/ month</span>
                </div>
                <div className="h-[1px] bg-[#050505]/5" />
                <ul className="space-y-3" aria-label="Pro features list">
                  {[
                    "Unlimited resume scans",
                    "AI Career Coach integrations",
                    "Job Requisition sync comparisons",
                    "Automated cover letter generator",
                    "Live Simulated Recruiter coach"
                  ].map((f) => (
                    <li key={f} className="flex gap-2.5 text-xs text-zinc-200 font-medium">
                      <Check size={13} className="text-[#FFFFF0] shrink-0 mt-[1px]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                href="/login" 
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#D4AF37] text-white hover:bg-gray-800 hover:bg-[#EBC855] text-black font-extrabold text-sm mt-8 border border-[#D4AF37]/40 shadow-[0_0_24px_rgba(212,175,55,0.35)] hover:shadow-[0_0_36px_rgba(212,175,55,0.45)] transition-all duration-300 cursor-pointer"
              >
                <Sparkles size={14} className="shrink-0" />
                Start 7-Day Free Trial
                <ArrowRight size={14} className="shrink-0" />
              </Link>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div 
              variants={fadeInUp}
              className="bg-[#050505] border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-zinc-700 hover:bg-[#050505] hover:shadow-[0_4px_20px_rgba(20,184,166,0.05)] transition-all duration-300 shadow-md"
            >
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold tracking-wide text-[#FFFFF0]">Enterprise</h3>
                  <p className="text-[10px] text-zinc-400">For agencies &amp; recruiters.</p>
                </div>
                <div className="flex items-baseline gap-1 font-mono">
                  <span className="text-3xl font-black text-[#FFFFF0]">Custom</span>
                </div>
                <div className="h-[1px] bg-[#050505]/5" />
                <ul className="space-y-3" aria-label="Enterprise features list">
                  {[
                    "Dedicated API endpoint keys",
                    "Custom fine-tuned assessment models",
                    "Bulk CSV parsing & export pipelines",
                    "Multi-seat coordinator workspaces",
                    "Priority support SLA agreements"
                  ].map((f) => (
                    <li key={f} className="flex gap-2.5 text-xs text-zinc-400 font-medium">
                      <Check size={13} className="text-[#FFFFF0] shrink-0 mt-[1px]" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link 
                href="/login" 
                className="w-full text-center py-3.5 rounded-xl border border-zinc-800 hover:bg-[#050505]/[0.08] hover:border-white/20 text-[#FFFFF0] font-bold tracking-wide text-xs mt-8 transition-all duration-300 cursor-pointer"
              >
                Contact Sales
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Accordion FAQ Section */}
      <section id="faq" className="w-full overflow-hidden border-b border-zinc-800 bg-[#050505] py-[64px] md:py-[96px] lg:py-[120px] relative z-10">
        {/* 3D FAQ Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/faq-3d.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[15%_center] opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,26,0.45)_0%,rgba(10,14,26,0.88)_40%,rgba(10,14,26,0.98)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0E1A] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A] to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="text-center space-y-5 mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D4AF37]/30 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5  shadow-[0_0_20px_rgba(212,175,55,0.12)]">
              <Sparkles size={11} className="text-[#D4AF37]" />
              <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#D4AF37]">Got Questions? We've Got Answers</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-[1.06] text-[#FFFFF0]">
              Everything You{" "}
              <span className="text-[#FFFFF0]">Need to Know</span>
            </h2>
            <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
              From how our ATS engine works to data privacy — every question answered, clearly.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-[#050505] border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs font-bold tracking-wide text-[#FFFFF0] hover:bg-[#050505]/5 transition-all cursor-pointer"
                  >
                    <span>{f.question}</span>
                    <ChevronDown 
                      size={14} 
                      className={`text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#FFFFF0]" : "rotate-0"}`} 
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-zinc-800"
                      >
                        <p className="font-sans p-5 text-[11px] leading-relaxed text-zinc-300 font-normal">
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
        className="w-full overflow-hidden border-b border-zinc-800 bg-[#050505] py-[64px] md:py-[96px] lg:py-[120px] relative z-10"
      >
        {/* 3D CTA Launch Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <Image
            src="/cta-3d.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center opacity-28"
          />
          <div className="absolute inset-0 bg-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0E1A] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A0E1A] to-transparent" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div variants={fadeInUp} className="space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl font-black tracking-tight text-[#FFFFF0] leading-tight">
              Stop Guessing. Audit Your Resume Today.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto font-normal leading-relaxed">
              Ensure your professional achievements aren't getting filtered by robotic screeners. Sign up now and scan your first resume instantly.
            </p>
            <div className="flex justify-center mt-8">
              <motion.div 
                whileHover={{ scale: 1.02, y: -1 }} 
                whileTap={{ scale: 0.98 }}
              >
                <Link 
                  href="/login" 
                  className="flex items-center gap-2 rounded-xl bg-[#D4AF37] hover:bg-[#D4AF37]/90 hover:shadow-[0_0_24px_rgba(20,184,166,0.35)] text-black px-8 py-4 font-bold tracking-wide text-sm transition-all duration-300 border border-zinc-700 shadow-md cursor-pointer"
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
      <footer className="border-t border-zinc-800 py-8 bg-[#050505]/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400 font-medium">
          <Logo size={16} textSize="text-xs" fontWeight="font-semibold tracking-wide" />
          <span>&copy; {new Date().getFullYear()} RecruitFlow AI. All rights reserved.</span>
        </div>
      </footer>
      </div>
    </div>
  );
}
