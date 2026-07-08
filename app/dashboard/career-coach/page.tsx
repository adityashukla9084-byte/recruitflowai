"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function CareerCoachPage() {
  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm your AI Career Coach. Ask me anything about resumes, interviews, careers, skills, jobs or salary.",
    },
  ]);

  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!question.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    const res = await fetch("/api/career-coach", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: data.reply,
      },
    ]);

    setQuestion("");

    setLoading(false);
  }
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold mb-2">
          🧠 AI Career Coach
        </h1>

        <p className="text-slate-400 mb-8">
          Ask anything about careers, interviews, resumes, skills or salary.
        </p>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 h-[600px] flex flex-col">

          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-cyan-600 ml-auto"
                    : "bg-slate-800"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="bg-slate-800 rounded-2xl p-4 w-fit">
                Thinking...
              </div>
            )}

          </div>

          <div className="border-t border-slate-800 p-4 flex gap-3">

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask your career question..."
              className="flex-1 rounded-xl bg-slate-800 p-4 outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-600 px-8 font-bold disabled:opacity-50"
            >
              Send
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}