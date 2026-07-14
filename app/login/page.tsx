"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // GSAP integration states
  const [gsapLoaded, setGsapLoaded] = useState(false);
  const idleTimeline = useRef<any>(null);
  const submitHoverTimeline = useRef<any>(null);
  const passwordPeekTimeline = useRef<any>(null);
  const [isPasswordMode, setIsPasswordMode] = useState(false);

  // Dynamic GSAP script injector
  useEffect(() => {
    if (typeof window !== "undefined") {
      if ((window as any).gsap) {
        setGsapLoaded(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js";
      script.async = true;
      script.onload = () => setGsapLoaded(true);
      document.body.appendChild(script);

      return () => {
        // Cleanup script if navigating away before load
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, []);

  // Idle Breathing Animation initialization
  useEffect(() => {
    if (!gsapLoaded) return;
    const gsap = (window as any).gsap;

    // Create a master idle animation timeline
    idleTimeline.current = gsap.timeline({ repeat: -1, defaults: { ease: "sine.inOut" } });
    
    idleTimeline.current.to("#char-head-group", { y: -4, duration: 1.8, yoyo: true, repeat: -1 }, 0);
    idleTimeline.current.to("#char-body", { y: -1.5, duration: 1.8, yoyo: true, repeat: -1 }, 0.1);
    idleTimeline.current.to("#char-antenna-tip", { fill: "#22D3EE", duration: 0.9, yoyo: true, repeat: -1 }, 0);
    idleTimeline.current.to("#char-laptop-screen", { opacity: 0.7, duration: 0.4, yoyo: true, repeat: -1 }, 0);

    return () => {
      if (idleTimeline.current) {
        idleTimeline.current.kill();
      }
    };
  }, [gsapLoaded]);

  // Periodic Random Blinking effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const blink = () => {
      if (!gsapLoaded || isPasswordMode) {
        timer = setTimeout(blink, 2000 + Math.random() * 2000);
        return;
      }
      const gsap = (window as any).gsap;
      gsap.timeline()
        .to("#char-eyes", { scaleY: 0.1, transformOrigin: "center center", duration: 0.08 })
        .to("#char-eyes", { scaleY: 1, transformOrigin: "center center", duration: 0.08 });
      
      timer = setTimeout(blink, 2500 + Math.random() * 3000);
    };
    timer = setTimeout(blink, 3000);
    return () => clearTimeout(timer);
  }, [gsapLoaded, isPasswordMode]);

  // GSAP Interaction Triggers
  const triggerFocus = (type: "name" | "phone" | "email" | "password" | "confirmPassword") => {
    if (!gsapLoaded) return;
    const gsap = (window as any).gsap;

    if (submitHoverTimeline.current) {
      submitHoverTimeline.current.kill();
      submitHoverTimeline.current = null;
    }
    if (passwordPeekTimeline.current) {
      passwordPeekTimeline.current.kill();
      passwordPeekTimeline.current = null;
    }

    if (type === "password" || type === "confirmPassword") {
      setIsPasswordMode(true);
      
      // SNEAKY PEEK-A-BOO PASSWORD REACTION:
      // Left arm completely covers the left side of visor
      gsap.to("#char-left-arm", { 
        x: 18, 
        y: -38, 
        rotation: 65, 
        transformOrigin: "top right", 
        duration: 0.35, 
        ease: "back.out(1.5)" 
      });
      // Right arm half-covers right side, leaving a gap
      gsap.to("#char-right-arm", { 
        x: -12, 
        y: -25, 
        rotation: -35, 
        transformOrigin: "top left", 
        duration: 0.35, 
        ease: "back.out(1.5)" 
      });
      
      // Left eye turns off completely
      gsap.to("#char-eye-l", { opacity: 0, scale: 0.1, duration: 0.2 });

      // Right eye gets huge and starts darting back and forth suspiciously
      passwordPeekTimeline.current = gsap.timeline({ repeat: -1 });
      passwordPeekTimeline.current
        .to("#char-eye-r", { opacity: 1, scale: 1.6, x: -3, y: 1, duration: 0.2, ease: "power1.out" })
        .to("#char-eye-r", { x: -6, duration: 0.25, delay: 0.3 }) // Peeking close
        .to("#char-eye-r", { x: -2, duration: 0.25, delay: 0.3 })
        .to("#char-eye-r", { y: -2, duration: 0.15 })             // Looking up
        .to("#char-eye-r", { y: 2, duration: 0.15 })              // Looking down
        .to("#char-eye-r", { x: -3, y: 1, duration: 0.25 });

      gsap.to("#char-head-group", { rotation: -3, duration: 0.35 });
      gsap.to("#char-antenna-tip", { fill: "#F59E0B", duration: 0.2 }); // Amber "active surveillance" light
    } else {
      setIsPasswordMode(false);
      // Restore eyes
      gsap.to("#char-eye-l", { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.3 });
      gsap.to("#char-eye-r", { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.3 });

      // Normal input fields: Look left at form and tilt head inquisitively
      gsap.to("#char-eyes", { x: -6, y: 1, scaleY: 1, opacity: 1, duration: 0.3, ease: "power1.out" });
      gsap.to("#char-head-group", { rotation: -8, x: -4, transformOrigin: "center bottom", duration: 0.4, ease: "power1.out" });
      
      // Arms "typing" slightly on laptop
      gsap.to("#char-left-arm", { x: -2, y: -2, rotation: 10, duration: 0.3 });
      gsap.to("#char-right-arm", { x: 2, y: -2, rotation: -10, duration: 0.3 });
      gsap.to("#char-antenna-tip", { fill: "#14B8A6", duration: 0.3 });
    }
  };

  const triggerReset = () => {
    setIsPasswordMode(false);
    if (!gsapLoaded) return;
    const gsap = (window as any).gsap;

    if (passwordPeekTimeline.current) {
      passwordPeekTimeline.current.kill();
      passwordPeekTimeline.current = null;
    }
    if (submitHoverTimeline.current) {
      submitHoverTimeline.current.kill();
      submitHoverTimeline.current = null;
    }

    // Smoothly restore default idle pose
    gsap.to("#char-eye-l", { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.4 });
    gsap.to("#char-eye-r", { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.4 });
    gsap.to("#char-eyes", { x: 0, y: 0, scaleY: 1, opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.to("#char-head-group", { rotation: 0, x: 0, y: 0, duration: 0.4, ease: "power2.out" });
    gsap.to(["#char-left-arm", "#char-right-arm"], { x: 0, y: 0, rotation: 0, duration: 0.4, ease: "power2.out" });
    gsap.to("#char-antenna-tip", { fill: "#14B8A6", scale: 1, duration: 0.3 });
  };

  const triggerHoverSubmit = (hovering: boolean) => {
    if (!gsapLoaded) return;
    const gsap = (window as any).gsap;

    if (passwordPeekTimeline.current) {
      passwordPeekTimeline.current.kill();
      passwordPeekTimeline.current = null;
    }
    if (submitHoverTimeline.current) {
      submitHoverTimeline.current.kill();
      submitHoverTimeline.current = null;
    }

    if (hovering) {
      setIsPasswordMode(true); // Disable automatic blinks during dance
      gsap.to("#char-eye-l", { opacity: 1, scale: 1, duration: 0.2 });
      gsap.to("#char-eye-r", { opacity: 1, scale: 1, duration: 0.2 });

      // Happy cheer / dance timeline
      submitHoverTimeline.current = gsap.timeline();
      
      // Raise arms in cheer!
      submitHoverTimeline.current.to("#char-left-arm", { 
        x: -8, 
        y: -40, 
        rotation: 125, 
        transformOrigin: "top right", 
        duration: 0.3, 
        ease: "back.out(1.2)" 
      }, 0);
      submitHoverTimeline.current.to("#char-right-arm", { 
        x: 8, 
        y: -40, 
        rotation: -125, 
        transformOrigin: "top left", 
        duration: 0.3, 
        ease: "back.out(1.2)" 
      }, 0);

      // Head bobs dynamically!
      submitHoverTimeline.current.to("#char-head-group", { 
        y: "-=6", 
        yoyo: true, 
        repeat: -1, 
        duration: 0.15, 
        ease: "sine.inOut" 
      }, 0.1);

      // Arms wave back and forth excitedly
      submitHoverTimeline.current.to("#char-left-arm", {
        rotation: 145,
        yoyo: true,
        repeat: -1,
        duration: 0.1,
        ease: "sine.inOut"
      }, 0.2);
      submitHoverTimeline.current.to("#char-right-arm", {
        rotation: -145,
        yoyo: true,
        repeat: -1,
        duration: 0.1,
        ease: "sine.inOut"
      }, 0.2);

      // Cyber eyes scale up
      submitHoverTimeline.current.to("#char-eyes", { scale: 1.25, duration: 0.25 }, 0);
      
      // Antenna tip flashes green/cyan
      submitHoverTimeline.current.to("#char-antenna-tip", { 
        fill: "#4ADE80", 
        yoyo: true, 
        repeat: -1, 
        duration: 0.2 
      }, 0);
    } else {
      triggerReset();
    }
  };

  function resetForm() {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setPhone("");
    setError("");
    setSuccess("");
    triggerReset();
  }

  function switchMode(mode: boolean) {
    setIsSignUp(mode);
    resetForm();
  }

  async function handleGoogleLogin() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate Google sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGithubLogin() {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate GitHub sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (isSignUp) {
      if (!fullName || !phone) {
        setError("Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
          setError(error.message);
        } else {
          if (data?.user) {
            const { error: profileError } = await supabase
              .from("profiles")
              .upsert({
                user_id: data.user.id,
                full_name: fullName,
                phone: phone,
              });
            if (profileError) {
              console.error("Error creating profile:", profileError.message);
            }
          }
          setSuccess("Account created! Check your email to verify, then log in.");
          setTimeout(() => switchMode(false), 2500);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setError(error.message);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0E1A] text-[#F5F5F4] relative overflow-hidden px-4 select-none">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(20,184,166,0.02)_1.5px,transparent_1.5px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Main Layout Centered Container */}
      <div className="relative z-10 w-full max-w-4xl my-8 flex flex-col items-center justify-center">

        {/* Side-by-Side Flex Box */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10">
          
          {/* Animated Illustration Column (Hidden on mobile, wraps mascot) */}
          <div className="hidden md:flex flex-col w-full max-w-[340px] shrink-0">
            {/* Mascot Header */}
            <div className="text-center md:text-left mb-4 px-2">
              <span className="inline-block text-[9px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/15 mb-2">
                Interactive Mascot Preview
              </span>
              <p className="text-xs text-slate-400 font-medium">
                Watch the RecruitFlow assistant mascot respond dynamically as you complete the form.
              </p>
            </div>

            {/* Mascot Container */}
            <div className="flex flex-col items-center justify-center w-full h-[360px] bg-[#111216]/20 backdrop-blur-xl border border-white/5 rounded-2xl p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 to-transparent rounded-2xl pointer-events-none" />
            
            {/* Mascot SVG */}
            <svg width="240" height="240" viewBox="0 0 200 200" fill="none" className="relative z-10">
              {/* Floor/Desktop Shadow glow */}
              <ellipse cx="100" cy="165" rx="50" ry="12" fill="url(#floorShadow)" opacity="0.45" />

              {/* Robot Mascot Group */}
              <g id="mascot-graphics">
                
                {/* Robot Torso Body */}
                <rect id="char-body" x="78" y="92" width="44" height="52" rx="14" fill="#1E293B" stroke="#334155" strokeWidth="2.5" />
                <circle id="char-core" cx="100" cy="114" r="5" fill="#14B8A6" className="animate-pulse" />
                
                {/* Left Shoulder Joint */}
                <circle cx="78" cy="106" r="4.5" fill="#475569" />
                
                {/* Left Arm & Hand */}
                <g id="char-left-arm">
                  <path d="M78 106 C60 106, 52 120, 56 138" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <circle cx="56" cy="138" r="4.5" fill="#14B8A6" />
                </g>

                {/* Right Shoulder Joint */}
                <circle cx="122" cy="106" r="4.5" fill="#475569" />
                
                {/* Right Arm & Hand */}
                <g id="char-right-arm">
                  <path d="M122 106 C140 106, 148 120, 144 138" stroke="#334155" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  <circle cx="144" cy="138" r="4.5" fill="#14B8A6" />
                </g>

                {/* Robot Head Assembly */}
                <g id="char-head-group">
                  {/* Stem & Antenna */}
                  <rect x="98.5" y="28" width="3" height="15" fill="#475569" rx="1.5" />
                  <circle id="char-antenna-tip" cx="100" cy="24" r="5" fill="#14B8A6" />
                  
                  {/* Neck joint */}
                  <rect x="94" y="80" width="12" height="14" rx="2" fill="#475569" />

                  {/* Helmet Head */}
                  <rect id="char-head" x="74" y="38" width="52" height="44" rx="12" fill="#1E293B" stroke="#334155" strokeWidth="2.5" />
                  
                  {/* Visor Display Screen */}
                  <rect id="char-screen" x="80" y="44" width="40" height="28" rx="7" fill="#0A0E1A" stroke="#334155" strokeWidth="1" />
                  
                  {/* Cyber Eyes */}
                  <g id="char-eyes">
                    <ellipse id="char-eye-l" cx="91" cy="58" rx="4.5" ry="4.5" fill="#22D3EE" />
                    <ellipse id="char-eye-r" cx="109" cy="58" rx="4.5" ry="4.5" fill="#22D3EE" />
                  </g>
                </g>
                
              </g>

              {/* Floating Tech Console Laptop */}
              <g id="char-laptop">
                <path d="M60 148 H140 L144 162 H56 Z" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                <rect id="char-laptop-screen" x="65" y="150" width="70" height="2" rx="1" fill="#22D3EE" opacity="0.6" />
                <circle cx="100" cy="155" r="2" fill="#14B8A6" />
              </g>

              {/* Definitions */}
              <defs>
                <radialGradient id="floorShadow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(100 165) rotate(90) scale(12 50)">
                  <stop offset="0%" stopColor="#14B8A6" />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
            
            <p className="text-[10px] text-slate-500 font-medium font-mono mt-4 text-center select-none">
              Mascot status: <span className="text-teal-400">{gsapLoaded ? "ACTIVE" : "CONNECTING..."}</span>
            </p>
            </div>
          </div>

          {/* Form & Header Column */}
          <div className="w-full max-w-md flex flex-col justify-end">
            
            {/* Brand/Logo Header */}
            <div className="text-center md:text-left mb-6">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group cursor-pointer">
                <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
                  <span className="absolute w-6 h-6 rotate-45 border border-teal-500/50 bg-teal-500/10 rounded-[4px] group-hover:scale-105 transition-all" />
                  <span className="absolute w-2.5 h-2.5 rotate-45 bg-gradient-to-tr from-teal-500 to-cyan-500 rounded-[2px]" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-teal-400 via-cyan-300 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                  RecruitFlow AI
                </span>
              </Link>
            </div>

            {/* Form Card Column */}
            <div className="w-full bg-[#111216]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Custom Tab Switcher */}
            <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 mb-6">
              <button
                onClick={() => switchMode(false)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  !isSignUp 
                    ? "bg-teal-600 text-white shadow-[0_4px_12px_rgba(20,184,166,0.2)]" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => switchMode(true)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
                  isSignUp 
                    ? "bg-teal-600 text-white shadow-[0_4px_12px_rgba(20,184,166,0.2)]" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Feedback alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl p-3.5 mb-5 flex items-center gap-2"
                >
                  <span>⚠️</span>
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium rounded-xl p-3.5 mb-5 flex items-center gap-2"
                >
                  <span>✅</span>
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form fields Container */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {isSignUp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                      <div className="relative">
                        <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="John Doe"
                          value={fullName}
                          onFocus={() => triggerFocus("name")}
                          onBlur={triggerReset}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none focus:border-teal-500/50 transition-all font-medium"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                      <div className="relative">
                        <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input 
                          type="text" 
                          placeholder="+1 (555) 123-4567"
                          value={phone}
                          onFocus={() => triggerFocus("phone")}
                          onBlur={triggerReset}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none focus:border-teal-500/50 transition-all font-medium"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="email" 
                    placeholder="you@example.com"
                    value={email}
                    onFocus={() => triggerFocus("email")}
                    onBlur={triggerReset}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none focus:border-teal-500/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onFocus={() => triggerFocus("password")}
                    onBlur={triggerReset}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isSignUp && handleSubmit()}
                    className="w-full pl-10 pr-10 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none focus:border-teal-500/50 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up only) */}
              <AnimatePresence initial={false}>
                {isSignUp && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5 overflow-hidden"
                  >
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Confirm Password</label>
                    <div className="relative">
                      <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        value={confirmPassword}
                        onFocus={() => triggerFocus("confirmPassword")}
                        onBlur={triggerReset}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none focus:border-teal-500/50 transition-all font-medium"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Form Actions Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              onMouseEnter={() => triggerHoverSubmit(true)}
              onMouseLeave={() => triggerHoverSubmit(false)}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-teal-600 text-white py-3.5 px-6 font-bold text-xs mt-6 hover:shadow-[0_4px_16px_rgba(20,184,166,0.3)] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer border border-teal-500/30"
            >
              {loading ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-[1.5px] border-white/20 border-t-white animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                  <ArrowRight size={13} />
                </>
              )}
            </button>

            {/* Social Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-[1px] bg-white/5" />
              <span className="text-[10px] font-bold text-slate-600">OR</span>
              <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            {/* Social OAuth Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 transition-all cursor-pointer disabled:opacity-50"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  width="14"
                  height="14"
                  alt="Google"
                  className="shrink-0"
                />
                <span>Continue with Google</span>
              </button>

              <button
                onClick={handleGithubLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs py-3 transition-all cursor-pointer disabled:opacity-50"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.28-1.56 3.285-1.23 3.285-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>
            </div>
          </div>
        </div>
        
      </div>

        {/* Small Print Footer */}
        <p className="text-[10px] text-slate-600 font-medium mt-6 text-center">
          By continuing, you agree to our Terms of Service &amp; Privacy Policy
        </p>
      </div>
    </main>
  );
}