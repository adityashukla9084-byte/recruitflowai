"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function InterviewSession() {
  const params = useSearchParams();

  const role = params.get("role") || "Software Engineer";

  const [question, setQuestion] = useState(
  `Tell me about yourself as a ${role}.`
  );

  const [answer, setAnswer] = useState("");

  const [result, setResult] = useState<any>(null);
const [loading, setLoading] = useState(false);

async function submitAnswer() {
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

if (data.nextQuestion) {
  setQuestion(data.nextQuestion);
}

setAnswer("");

setLoading(false);

  
}

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          AI Interview
        </h1>

        <p className="text-cyan-400 mb-8">
          Role: {role}
        </p>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

          <h2 className="text-xl font-bold mb-4">
            Question 1
          </h2>

          <p className="text-slate-300">
            {question}
          </p>

        </div>

        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          rows={8}
          placeholder="Type your answer..."
          className="w-full mt-8 rounded-xl bg-slate-900 border border-slate-800 p-4 outline-none"
        />

        <button
  onClick={submitAnswer}
  disabled={loading}
  className="mt-6 flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-600 disabled:opacity-50"
>
  {loading ? "Evaluating..." : "Submit Answer"}
  <Send size={18} />
</button>
{result && (
  <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">

    <h2 className="text-2xl font-bold text-cyan-400">
      AI Evaluation
    </h2>

    <div>
      <p className="text-slate-400">Score</p>
      <h3 className="text-4xl font-bold">
        {result.score}/100
      </h3>
    </div>

    <div>
      <p className="font-semibold">
        Feedback
      </p>

      <p className="text-slate-300 mt-2">
        {result.feedback}
      </p>
    </div>

    <div>
      <p className="font-semibold">
        Improvement
      </p>

      <p className="text-slate-300 mt-2">
        {result.improvement}
      </p>
    </div>

  </div>
)}
        </div>
        </main>
  );
}   