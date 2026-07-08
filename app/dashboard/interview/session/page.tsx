"use client";

import { Mic, Square, CheckCircle, Brain, Sparkles, Send, AlertTriangle, X } from "lucide-react";
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

  // Native Speech Recognition states
  const [isListening, setIsListening] = useState(false);
  const [supportsSpeech, setSupportsSpeech] = useState(true);
  const [permissionError, setPermissionError] = useState(false);
  const recognitionRef = useRef<any>(null);
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        for (let i = event.resultIndex; i < event.results.length; i++) {
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
        console.error("Speech Recognition Error:", e);
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

  useEffect(() => {
    let active = true;
    fetch("/api/interview/first-question", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setQuestion(data.question);
        }
      });
    return () => {
      active = false;
    };
  }, [role]);

  function speak(text: string) {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  }

  useEffect(() => {
    if (question) {
      speak(question);
    }
  }, [question]);

  // Auto-submit logic after 4 seconds of silence when user stops talking
  useEffect(() => {
    if (!answer || !isListening) return;

    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
    }

    autoSubmitTimeoutRef.current = setTimeout(() => {
      submitAnswer();
    }, 4000);

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
        console.error("Failed to start speech recognition:", err);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error("Failed to stop speech recognition:", err);
      }
    }
  };

  async function submitAnswer() {
    // Clear any pending timeouts
    if (autoSubmitTimeoutRef.current) {
      clearTimeout(autoSubmitTimeoutRef.current);
    }

    // Stop listening
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    if (!answer.trim()) return;

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch("/api/interview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        question,
        answer,
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
  }

  if (!supportsSpeech) {
    if (!mounted) {
      return null;
    }
    return (
      <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
        Browser doesn&apos;t support Speech Recognition. Please try Chrome, Edge, or Safari.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">AI Mock Interview</h1>
          <p className="text-theme-accent">Role: {role}</p>
        </div>

        {permissionError && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-5 shadow-lg flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-red-500 text-base">Microphone Access Denied</h3>
              <p className="text-sm text-theme-text-secondary mt-1 leading-relaxed">
                Microphone access was blocked. Please click the lock/microphone icon in your browser's address bar to allow access, then reload the page to start speaking.
              </p>
            </div>
            <button 
              onClick={() => setPermissionError(false)}
              className="p-1 rounded-lg hover:bg-red-500/10 text-theme-text-secondary hover:text-red-500 transition cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        <div className="rounded-2xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-6 shadow-[var(--shadow-card)]">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Brain className="h-5 w-5 text-theme-accent" />
            <span>Question {questionCount} of 7</span>
          </h2>
          <p className="text-theme-text leading-relaxed text-base">
            {question || "Generating interview question..."}
          </p>
        </div>

        <div className="relative">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={8}
            placeholder="Speak your answer (click Start Recording) or type here directly..."
            className="w-full rounded-xl bg-theme-card-hover/20 border border-theme-border p-4 outline-none text-theme-text placeholder-theme-text-muted focus:border-theme-accent/50 focus:ring-1 focus:ring-theme-accent/30 transition-all duration-300 resize-none leading-relaxed"
          />
          {isListening && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/25 px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span>Recording Live</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {!isListening ? (
            <button
              onClick={startListening}
              className="rounded-xl bg-emerald-600 px-5 py-3.5 flex items-center gap-2 text-white hover:bg-emerald-700 transition duration-300 font-semibold shadow-md shadow-emerald-600/10 cursor-pointer"
            >
              <Mic size={18} />
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="rounded-xl bg-red-600 px-5 py-3.5 flex items-center gap-2 text-white hover:bg-red-700 transition duration-300 font-semibold shadow-md shadow-red-600/10 cursor-pointer"
            >
              <Square size={18} />
              Stop Recording
            </button>
          )}

          <button
            onClick={submitAnswer}
            disabled={loading || !answer.trim()}
            className="rounded-xl bg-indigo-600 px-6 py-3.5 font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-700 transition duration-300 shadow-md shadow-indigo-600/10 flex items-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Answer</span>
              </>
            )}
          </button>
        </div>

        <div className="rounded-xl border border-theme-border bg-theme-card/30 backdrop-blur-xl p-5 shadow-sm text-sm space-y-2">
          <p className="text-theme-accent font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>🎙 Voice Interview Instructions</span>
          </p>
          <div className="text-theme-text-secondary space-y-1.5 pl-1.5 mt-2">
            <p>1. Click **Start Recording** and allow microphone access if prompted.</p>
            <p>2. Speak your answer clearly into your microphone.</p>
            <p>3. Click **Stop Recording** when you finish, or let the AI automatically evaluate after **4 seconds of silence**.</p>
          </div>
        </div>

        {result && (
          <div className="rounded-2xl border border-theme-border bg-theme-card/45 backdrop-blur-xl p-6 space-y-5 shadow-lg">
            <h2 className="text-xl font-bold text-theme-accent flex items-center gap-2">
              <CheckCircle className="h-5.5 w-5.5 text-emerald-500" />
              <span>AI Evaluation Feedback</span>
            </h2>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="bg-theme-bg-secondary/45 border border-theme-border p-4 rounded-xl">
                <p className="text-xs text-theme-text-secondary uppercase tracking-wider font-semibold">Evaluation Score</p>
                <h3 className="text-3xl font-black mt-1 text-theme-accent">{result.score}/100</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="font-semibold text-sm uppercase text-theme-text-secondary tracking-wider">Analysis Feedback</p>
                <p className="text-theme-text mt-2 leading-relaxed text-sm whitespace-pre-wrap">{result.feedback}</p>
              </div>

              <div className="border-t border-theme-border/60 pt-4">
                <p className="font-semibold text-sm uppercase text-theme-text-secondary tracking-wider">Key Improvements</p>
                <p className="text-theme-text mt-2 leading-relaxed text-sm whitespace-pre-wrap">{result.improvement}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function InterviewSession() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <span className="font-medium text-sm text-theme-text-secondary">Loading Session...</span>
          </div>
        </div>
      }
    >
      <InterviewSessionContent />
    </Suspense>
  );
}