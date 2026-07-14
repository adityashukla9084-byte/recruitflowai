"use client";

import { Mic, Square, CheckCircle, Brain, Sparkles, Send, AlertTriangle, X, Video, VideoOff, RefreshCw, Volume2, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, Suspense } from "react";
import { supabase } from "@/lib/supabase";

function InterviewSessionContent() {
  const params = useSearchParams();

  const role =
    params.get("role") ||
    params.get("company") ||
    "Software Engineer";

  const [question, setQuestion] = useState("");
  const [mounted, setMounted] = useState(false);
  const [answer, setAnswer] = useState("");

  type EvaluationResult = {
    score: number;
    feedback: string;
    improvement: string;
    nextQuestion?: string;
  };

  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(1);
  const [hasResume, setHasResume] = useState<boolean | null>(null);

  // Video feed states
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(120);

  // Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const recognitionRef = useRef<any>(null);
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // AI Interviewer visual status state: "speaking" | "listening" | "thinking" | "idle"
  const [interviewerStatus, setInterviewerStatus] = useState<"speaking" | "listening" | "thinking" | "idle">("idle");

  // Load Webcam Feed
  useEffect(() => {
    if (cameraEnabled && typeof navigator !== "undefined" && navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch((err) => {
          console.warn("Camera access denied or unavailable:", err);
          setCameraEnabled(false);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraEnabled]);

  // Speech Recognition API setup
  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      const SpeechRecognitionAPI =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognitionAPI) {
        setSupportsSpeech(false);
        return;
      }

      const rec = new SpeechRecognitionAPI();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript.trim()) {
          setAnswer(currentTranscript);
        }
      };

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onerror = (e: any) => {
        console.warn("Speech Recognition Error:", e.error, e.message);
        if (e.error === "not-allowed") {
          setPermissionError(true);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  // Initialize Session / Load First Question
  useEffect(() => {
    let active = true;
    
    async function initSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!active) return;
      
      if (session?.user) {
        const { data: history } = await supabase
          .from("analysis_history")
          .select("id")
          .eq("user_id", session.user.id)
          .limit(1);
        if (active) {
          setHasResume(history && history.length > 0);
        }
      }

      try {
        setInterviewerStatus("thinking");
        const res = await fetch("/api/interview/first-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role,
            token: session?.access_token,
          }),
        });
        const data = await res.json();
        if (active) {
          setQuestion(data.question);
        }
      } catch (err) {
        console.error("Error loading first question:", err);
        if (active) setInterviewerStatus("idle");
      }
    }

    initSession();

    return () => {
      active = false;
    };
  }, [role]);

  // Question speaking logic with state sync
  function speak(text: string) {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = "en-US";
      
      utterance.onstart = () => {
        setInterviewerStatus("speaking");
      };
      
      utterance.onend = () => {
        setInterviewerStatus("listening");
        // Automatically start recording when interviewer stops speaking
        startListening();
      };
      
      utterance.onerror = () => {
        setInterviewerStatus("listening");
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }

  useEffect(() => {
    if (question) {
      speak(question);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  // Countdown timer logic
  useEffect(() => {
    if (loading || !mounted || interviewerStatus === "thinking") return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          submitAnswer();
          return 120;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, mounted, questionCount, interviewerStatus]);

  // Reset timer on new question
  useEffect(() => {
    setTimeLeft(120);
  }, [questionCount]);

  // Auto-submit logic after 4 seconds of silence when user stops talking
  useEffect(() => {
    if (!answer || !isListening) return;

    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
    }

    autoSubmitTimeoutRef.current = setTimeout(() => {
      submitAnswer();
    }, 5000); // 5 seconds of silence auto-submits

    return () => {
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, isListening]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        setAnswer("");
        recognitionRef.current.start();
      } catch (err) {
        console.warn("Failed to start speech recognition:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn("Failed to stop speech recognition:", err);
      }
    }
  };

  async function submitAnswer() {
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // Even if answer is empty, proceed to prevent blocking the session progress
    const candidateAnswer = answer.trim() || "(No answer recorded)";

    setLoading(true);
    setInterviewerStatus("thinking");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
          question,
          answer: candidateAnswer,
          token: session?.access_token,
        }),
      });

      const data = await res.json();
      setResult(data);

      const nextCount = questionCount + 1;
      setQuestionCount(nextCount);

      if (nextCount > 7) {
        window.location.href = "/dashboard/interview/report";
        return;
      }

      if (data.nextQuestion) {
        setQuestion(data.nextQuestion);
      }

      setAnswer("");
      setLoading(false);
    } catch (err) {
      console.error("Submission failed:", err);
      setLoading(false);
      setInterviewerStatus("listening");
    }
  }

  function handleEndInterview() {
    if (confirm("Are you sure you want to end the interview now? Your progress will be saved, and you will be redirected to the performance scorecard.")) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (stream) {
        try {
          stream.getTracks().forEach((track) => track.stop());
        } catch (e) {}
      }
      window.location.href = "/dashboard/interview/report";
    }
  }

  if (!supportsSpeech) {
    if (!mounted) return null;
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-md">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold">Speech Recognition Unsupported</h2>
          <p className="text-sm text-slate-400">
            This browser does not support the speech synthesis or recognition APIs required for the interactive mock interview. For the best experience, please use Google Chrome, Microsoft Edge, or Apple Safari.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-4 md:p-8 relative overflow-hidden flex items-center justify-center">
      {/* Dynamic keyframe styles */}
      <style>{`
        @keyframes wavePulse {
          0%, 100% { height: 6px; }
          50% { height: 26px; }
        }
        .wave-bar {
          animation: wavePulse 1.2s ease-in-out infinite;
        }
      `}</style>

      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl w-full grid md:grid-cols-5 gap-6 relative z-10">
        
        {/* Left Column: Video Feeds (2/5 Span) */}
        <div className="md:col-span-2 flex flex-col gap-6">
          
          {/* AI Interviewer Video Card */}
          <div className="relative rounded-2xl border border-theme-border bg-slate-950/80 aspect-[4/3] overflow-hidden flex flex-col items-center justify-center shadow-lg group">
            
            {/* Holographic background scanner lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none z-10" />

            {/* Speaking/Thinking Visual Wave */}
            {interviewerStatus === "speaking" && (
              <div className="absolute inset-0 bg-cyan-500/5 flex items-center justify-center z-0 transition-opacity duration-300">
                <div className="w-48 h-48 rounded-full border border-cyan-500/10 animate-ping absolute" />
                <div className="w-32 h-32 rounded-full border border-cyan-500/20 animate-[ping_2s_infinite] absolute" />
              </div>
            )}

            {/* AI Avatar */}
            <div className="relative z-10 flex flex-col items-center gap-4 text-center">
              <div className={`h-24 w-24 rounded-full bg-gradient-to-br border-2 flex items-center justify-center shadow-2xl transition-all duration-500 ${
                interviewerStatus === "speaking" 
                  ? "from-cyan-500/20 to-cyan-500/20 border-cyan-500 scale-105" 
                  : interviewerStatus === "thinking" 
                  ? "from-indigo-500/20 to-purple-500/20 border-teal-400 animate-pulse"
                  : "from-slate-800 to-slate-900 border-slate-700"
              }`}>
                {interviewerStatus === "thinking" ? (
                  <Brain className="h-10 w-10 text-teal-400 animate-spin" />
                ) : (
                  <Sparkles className={`h-10 w-10 ${interviewerStatus === "speaking" ? "text-cyan-400" : "text-slate-400"}`} />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-extrabold text-base tracking-tight">AI Interviewer</h3>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                  {interviewerStatus === "speaking" 
                    ? "Speaking" 
                    : interviewerStatus === "listening" 
                    ? "Listening to you" 
                    : interviewerStatus === "thinking" 
                    ? "Analyzing Answer" 
                    : "Idle"}
                </span>
              </div>
            </div>

            {/* Audio Waveform Indicator */}
            {interviewerStatus === "speaking" && (
              <div className="absolute bottom-4 flex items-center gap-1 z-20">
                <div className="wave-bar w-1 bg-cyan-400 rounded-full" style={{ animationDelay: "0.1s" }} />
                <div className="wave-bar w-1 bg-cyan-400 rounded-full" style={{ animationDelay: "0.4s" }} />
                <div className="wave-bar w-1 bg-cyan-400 rounded-full" style={{ animationDelay: "0.2s" }} />
                <div className="wave-bar w-1 bg-cyan-400 rounded-full" style={{ animationDelay: "0.6s" }} />
                <div className="wave-bar w-1 bg-cyan-400 rounded-full" style={{ animationDelay: "0.3s" }} />
              </div>
            )}
          </div>

          {/* User Webcam Video Card */}
          <div className="relative rounded-2xl border border-theme-border bg-slate-950/80 aspect-[4/3] overflow-hidden shadow-lg group">
            {cameraEnabled ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-theme-text-muted bg-slate-950/40">
                <div className="h-16 w-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <User className="h-7 w-7 text-slate-500" />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Camera Feed Disabled</p>
              </div>
            )}

            {/* Video Feed Control Overlays */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
              <button
                onClick={() => setCameraEnabled(!cameraEnabled)}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition cursor-pointer hover:scale-105 active:scale-95 ${
                  cameraEnabled 
                    ? "bg-slate-950/60 border-slate-800 text-white hover:bg-slate-900" 
                    : "bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
                }`}
                title={cameraEnabled ? "Turn off camera" : "Turn on camera"}
              >
                {cameraEnabled ? <Video size={16} /> : <VideoOff size={16} />}
              </button>
            </div>

            <div className="absolute top-4 left-4 z-20">
              <span className="text-[10px] text-white/80 font-bold uppercase tracking-wider bg-slate-950/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10">
                Candidate Feed
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Interview Session Details (3/5 Span) */}
        <div className="md:col-span-3 flex flex-col gap-6">

          {/* Page Title & Status */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight leading-none text-white">AI Assessment</h1>
              <p className="text-xs text-theme-text-secondary mt-1.5 font-bold uppercase tracking-widest">{role}</p>
            </div>
            <div className="flex items-center gap-3">
              {hasResume !== null && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border bg-teal-500/10 border-teal-500/20 text-teal-400">
                  {hasResume ? "Tailored to your resume" : "General profile interview"}
                </span>
              )}
              <button
                onClick={handleEndInterview}
                className="rounded-xl border border-red-500/30 hover:border-red-500 hover:bg-red-500/10 text-red-400 px-4 py-2 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer bg-slate-950/20 backdrop-blur"
              >
                <X size={14} />
                <span>End Interview</span>
              </button>
            </div>
          </div>

          {/* Micro-Notification Banner */}
          {permissionError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-4 shadow-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-red-500 text-sm">Microphone Access Denied</h3>
                <p className="text-xs text-theme-text-secondary mt-0.5 leading-relaxed">
                  Speech recognition blocked. Please grant microphone privileges in your browser and reload the page.
                </p>
              </div>
              <button 
                onClick={() => setPermissionError(false)}
                className="p-1 rounded-lg hover:bg-red-500/10 text-theme-text-secondary transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Question Box Card */}
          <div className="rounded-2xl border border-theme-border bg-theme-card/30 backdrop-blur-xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
              <h2 className="text-sm font-bold text-slate-400 flex items-center gap-2 uppercase tracking-widest">
                <Brain className="h-4 w-4 text-cyan-400" />
                <span>Question {questionCount} of 7</span>
              </h2>
              
              {/* Question Audio Repeat Button */}
              {question && (
                <button
                  onClick={() => speak(question)}
                  className="p-1.5 rounded-lg border border-theme-border hover:border-cyan-500/40 text-theme-text-secondary hover:text-cyan-400 transition cursor-pointer"
                  title="Replay Audio Question"
                >
                  <Volume2 size={14} />
                </button>
              )}
            </div>
            
            <p className="text-white leading-relaxed text-base font-medium">
              {question || "Generating interview question..."}
            </p>
          </div>

          {/* Question Response Interface */}
          <div className="space-y-4">
            
            {/* Input Textarea Container */}
            <div className="relative">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={7}
                placeholder="Type your answer here or click Start Recording to speak..."
                className="w-full rounded-2xl bg-slate-950/60 border border-slate-900 p-5 outline-none text-theme-text placeholder-theme-text-muted focus:border-cyan-500/30 focus:ring-1 focus:ring-cyan-500/10 transition-all duration-300 resize-none leading-relaxed text-sm"
              />

              {/* Countdown overlay timer */}
              <div className="absolute bottom-4 right-4 flex items-center gap-3">
                
                {/* Visual Speaking Indicator */}
                {isListening && (
                  <div className="flex items-center gap-1 h-4 px-2 py-0.5 rounded-md bg-red-500/15 border border-red-500/25">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping mr-1" />
                    <div className="wave-bar w-0.5 bg-red-400" style={{ animationDelay: "0.1s" }} />
                    <div className="wave-bar w-0.5 bg-red-400" style={{ animationDelay: "0.3s" }} />
                    <div className="wave-bar w-0.5 bg-red-400" style={{ animationDelay: "0.2s" }} />
                  </div>
                )}

                {/* Clock indicator */}
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors duration-300 ${
                  timeLeft <= 15 
                    ? "bg-red-500/10 border-red-500/20 text-red-400 animate-pulse" 
                    : "bg-slate-950/80 border-slate-800 text-slate-300"
                }`}>
                  <span>⏱</span>
                  <span>{timeLeft}s remaining</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-3">
                {!isListening ? (
                  <button
                    onClick={startListening}
                    disabled={loading || interviewerStatus === "thinking"}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-3.5 flex items-center gap-2 text-white transition font-bold shadow-md shadow-emerald-600/10 cursor-pointer text-sm"
                  >
                    <Mic size={16} />
                    <span>Record Answer</span>
                  </button>
                ) : (
                  <button
                    onClick={stopListening}
                    className="rounded-xl bg-red-600 hover:bg-red-700 px-5 py-3.5 flex items-center gap-2 text-white transition font-bold shadow-md shadow-red-600/10 cursor-pointer text-sm"
                  >
                    <Square size={16} />
                    <span>Stop Recording</span>
                  </button>
                )}

                <button
                  onClick={submitAnswer}
                  disabled={loading || !answer.trim() || interviewerStatus === "thinking"}
                  className="rounded-xl bg-teal-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3.5 font-bold text-white transition shadow-md shadow-teal-600/10 flex items-center gap-2 cursor-pointer text-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Submit Answer</span>
                    </>
                  )}
                </button>
              </div>

              {/* Horizontal Progress Track Indicator */}
              <div className="flex gap-1.5 items-center">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <div
                    key={num}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      num < questionCount
                        ? "bg-teal-500 w-2.5"
                        : num === questionCount
                        ? "bg-cyan-400 w-6 shadow-[0_0_8px_var(--color-theme-accent)]"
                        : "bg-slate-800 w-2.5"
                    }`}
                    title={`Question ${num}`}
                  />
                ))}
              </div>
            </div>

          </div>

          {/* Quick Voice Tip Box */}
          <div className="rounded-xl border border-theme-border bg-theme-card/10 p-4.5 text-xs space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Voice Assist Tip</span>
            </div>
            <p className="text-theme-text-secondary font-medium">
              Click **Record Answer** and speak naturally. A silence duration of **5 seconds** will trigger automatic response validation and submit the question. You can also edit the text box manually at any point.
            </p>
          </div>

          {/* Feedback Overlay inside Session (If available from previous questions) */}
          {result && (
            <div className="rounded-2xl border border-theme-border bg-theme-card/25 backdrop-blur-xl p-5 space-y-4 shadow-lg animate-[fadeIn_0.5s]">
              <div className="flex items-center justify-between border-b border-theme-border/60 pb-3.5">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-400" />
                  <span>Previous Answer Brief Feedback</span>
                </h3>
                <span className="text-xs font-black text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Last Score: {result.score}/100
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">AI Critique</span>
                  <p className="text-theme-text leading-relaxed font-medium line-clamp-3">{result.feedback}</p>
                </div>
                <div className="space-y-1 border-t md:border-t-0 md:border-l border-theme-border/60 pt-3.5 md:pt-0 md:pl-4">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Recommendation</span>
                  <p className="text-theme-text leading-relaxed font-medium line-clamp-3">{result.improvement}</p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </main>
  );
}

export default function InterviewSession() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
            <span className="font-bold text-sm tracking-wider uppercase text-cyan-400 animate-pulse">Initializing Session...</span>
          </div>
        </div>
      }
    >
      <InterviewSessionContent />
    </Suspense>
  );
}