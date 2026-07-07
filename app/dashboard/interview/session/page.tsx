"use client";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import { Mic, Square } from "lucide-react";
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

  const [result, setResult] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  const [questionCount, setQuestionCount] =
    useState(1);

  const autoSubmitRef = useRef(false);
useEffect(() => {
  setMounted(true);
}, []);
  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
     if (!mounted) {
   return null;
 }
     return (
       <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
         Browser doesn't support Speech Recognition.
       </div>
     );
   }

  useEffect(() => {
    async function loadFirstQuestion() {
      const res = await fetch("/api/interview/first-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role,
        }),
      });

      const data = await res.json();

      setQuestion(data.question);
    }

    loadFirstQuestion();
  }, [role]);

  function speak(text: string) {
    window.speechSynthesis.cancel();

    const utterance =
      new SpeechSynthesisUtterance(text);

    utterance.rate = 1;

    utterance.pitch = 1;

    utterance.lang = "en-US";

    window.speechSynthesis.speak(utterance);
  }

  useEffect(() => {
    speak(question);
  }, [question]);
  

  useEffect(() => {
    
    if (!transcript) return;

    setAnswer(transcript);

    if (autoSubmitRef.current) return;

    autoSubmitRef.current = true;

    const timer = setTimeout(async () => {
      await submitAnswer();

      SpeechRecognition.stopListening();

      resetTranscript();

      autoSubmitRef.current = false;
    }, 3000);

    return () => clearTimeout(timer);
  }, [transcript]);

  async function submitAnswer() {
    if (!answer.trim()) return;

    setLoading(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const res = await fetch("/api/interview", {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
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

    if (nextCount > 2) {
      window.location.href =
        "/dashboard/interview/report";

      return;
    }

    if (data.nextQuestion) {
      setQuestion(data.nextQuestion);
    }

    setAnswer("");

    setLoading(false);
  }
 
  return (
  <main className="min-h-screen bg-theme-bg text-theme-text p-10">
    <div className="max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-2">
        AI Interview
      </h1>

      <p className="text-theme-accent mb-8">
        Role: {role}
      </p>

      <div className="rounded-2xl border border-theme-border-card bg-theme-card p-6 shadow-[var(--shadow-card)]">

        <h2 className="text-xl font-bold mb-4">
          Question {questionCount}
        </h2>

        <p className="text-theme-text-secondary">
          {question}
        </p>

      </div>

      <textarea
        value={transcript || answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={8}
        placeholder="Speak or type your answer..."
        className="w-full mt-8 rounded-xl bg-theme-card-hover border border-theme-border-input p-4 outline-none text-theme-text placeholder-theme-text-muted"
      />

      <div className="mt-6 flex gap-4">

        <button
          onClick={() =>
            SpeechRecognition.startListening({
              continuous: true,
              language: "en-US",
            })
          }
          className="rounded-xl bg-green-600 px-5 py-3 flex items-center gap-2 text-white hover:bg-green-700 transition"
        >
          <Mic size={18} />
          Start Recording
        </button>

        <button
          onClick={() => SpeechRecognition.stopListening()}
          className="rounded-xl bg-red-600 px-5 py-3 flex items-center gap-2 text-white hover:bg-red-700 transition"
        >
          <Square size={18} />
          Stop Recording
        </button>

        <button
          onClick={submitAnswer}
          disabled={loading}
          className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white disabled:opacity-50 hover:bg-cyan-600 transition"
        >
          {loading ? "Evaluating..." : "Submit"}
        </button>

      </div>

      <div className="mt-6 rounded-xl border border-theme-accent bg-theme-card p-4 shadow-[var(--shadow-card)]">

        <p className="text-theme-accent font-semibold">
          🎙 Voice Interview Mode
        </p>

        <p className="text-theme-text-secondary mt-2">
          1. Click Start Recording
        </p>

        <p className="text-theme-text-secondary">
          2. Speak your answer
        </p>

        <p className="text-theme-text-secondary">
          3. Stop Recording
        </p>

        <p className="text-theme-text-secondary">
          4. AI evaluates automatically after a few seconds
        </p>

      </div>

      {result && (
        <div className="mt-8 rounded-2xl border border-theme-border-card bg-theme-card p-6 space-y-5 shadow-[var(--shadow-card)]">

          <h2 className="text-2xl font-bold text-theme-accent">
            AI Evaluation
          </h2>

          <div>
            <p className="text-theme-text-secondary">
              Score
            </p>

            <h3 className="text-4xl font-bold">
              {result.score}/100
            </h3>
          </div>

          <div>
            <p className="font-semibold">
              Feedback
            </p>

            <p className="text-theme-text-secondary mt-2 leading-relaxed">
              {result.feedback}
            </p>
          </div>

          <div>
            <p className="font-semibold">
              Improvement
            </p>

            <p className="text-theme-text-secondary mt-2 leading-relaxed">
              {result.improvement}
            </p>
          </div>

        </div>
      )}

    </div>
  </main>
  );
}

export default function InterviewSession() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
        Loading Session...
      </div>
    }>
      <InterviewSessionContent />
    </Suspense>
  );
}