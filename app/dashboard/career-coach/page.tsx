"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, User, Send, Brain, MessageSquare, Compass, RefreshCw } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const starterPrompts = [
  {
    title: "Salary Negotiation",
    desc: "Ask for a raise or evaluate a compensation offer",
    query: "How do I negotiate my salary offer for a new role?"
  },
  {
    title: "Resume Critique",
    desc: "Check if your resume meets modern ATS criteria",
    query: "What is the checklist to write a highly ATS-optimized resume?"
  },
  {
    title: "Career Transition",
    desc: "Strategies to pivot into a new field or industry",
    query: "How should I transition my career into a different industry?"
  },
  {
    title: "Interview Mastery",
    desc: "Structure responses to mock behavioral questions",
    query: "How can I structure my answers for behavioral interview questions?"
  }
];

export default function CareerCoachPage() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 Welcome! I am your AI Career Coach. Ask me anything about career roads, resume enhancements, salary negotiation, or mock interview preparation.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  async function sendMessage(overrideQuestion?: string) {
    const activeQuestion = overrideQuestion || question;
    if (!activeQuestion.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: activeQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/career-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: activeQuestion,
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
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Sorry, something went wrong. Please try sending your message again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-6 md:p-12 relative overflow-hidden flex justify-center items-start">
      {/* Background blobs */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl w-full space-y-8 relative z-10 animate-[fadeIn_0.5s]">
        
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>Interactive AI Mentor</span>
          </div>
          
          <div>
            <h1 className="text-4xl font-black tracking-tight leading-none text-white flex items-center gap-2.5">
              <Brain className="h-9 w-9 text-cyan-400 shrink-0" />
              <span>AI Career Coach</span>
            </h1>
            <p className="text-sm text-theme-text-secondary mt-1.5 font-medium leading-relaxed">
              Formulate strategic queries regarding job placements, resume structures, behavioral questions, or salary evaluations.
            </p>
          </div>
        </div>

        {/* Chat Window Box */}
        <div className="rounded-3xl border border-theme-border bg-theme-card/30 backdrop-blur-xl h-[650px] flex flex-col overflow-hidden shadow-2xl relative">
          
          {/* Message List Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={index}
                  className={`flex gap-3.5 max-w-[85%] items-start animate-[fadeIn_0.3s] ${
                    isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  {/* Avatar Icons */}
                  <div className={`h-8.5 w-8.5 rounded-full flex items-center justify-center shrink-0 border shadow-inner ${
                    isUser 
                      ? "bg-teal-500/10 border-teal-500/20 text-teal-400" 
                      : "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
                  }`}>
                    {isUser ? <User size={15} /> : <Sparkles size={14} />}
                  </div>

                  {/* Message Bubble */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {isUser ? "Candidate" : "Career Coach"}
                      </span>
                    </div>
                    
                    <div
                      className={`rounded-2xl p-4.5 text-sm leading-relaxed text-justify shadow-md ${
                        isUser
                          ? "bg-gradient-to-tr from-teal-600 to-cyan-500 text-white font-medium whitespace-pre-wrap"
                          : "bg-slate-950/60 border border-slate-900 text-[#F5F5F4] font-medium"
                      }`}
                    >
                      {isUser ? (
                        msg.content
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Conversation Starter Prompts (Visible only initially) */}
            {messages.length === 1 && !loading && (
              <div className="grid gap-4 sm:grid-cols-2 mt-8 animate-[fadeIn_0.5s] pt-4 border-t border-slate-900/60">
                {starterPrompts.map((starter, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(starter.query)}
                    className="text-left rounded-2xl border border-slate-900 bg-slate-950/40 p-5 hover:border-cyan-500/30 hover:bg-slate-950/60 active:scale-[0.99] transition duration-300 shadow-sm cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition mb-1 flex items-center gap-1.5">
                        <Compass className="h-4 w-4 text-cyan-400" />
                        <span>{starter.title}</span>
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        {starter.desc}
                      </p>
                    </div>
                    <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-wider mt-4 flex items-center gap-1">
                      <span>Send Prompt</span>
                      <span className="translate-x-0 group-hover:translate-x-1 transition duration-300">→</span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex gap-3.5 items-start mr-auto max-w-[80%]">
                <div className="h-8.5 w-8.5 rounded-full flex items-center justify-center shrink-0 border bg-cyan-500/10 border-cyan-500/20 text-cyan-400">
                  <Sparkles size={14} className="animate-spin" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Career Coach</span>
                  <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4.5 flex items-center gap-1.5 shadow-md">
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="border-t border-slate-900 p-4.5 flex gap-3 bg-slate-950/40 backdrop-blur-md">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={loading}
              placeholder="Ask a question about resumes, careers, interviews..."
              className="flex-1 rounded-xl bg-slate-950/60 border border-slate-900 p-4 outline-none text-sm text-white placeholder-slate-500 focus:border-cyan-500/30 transition disabled:opacity-40"
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !question.trim()}
              className="rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 px-6 font-bold flex items-center gap-1.5 transition cursor-pointer text-sm"
            >
              {loading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <>
                  <Send size={13} />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  // Split content by newlines
  const lines = content.split("\n");

  return (
    <div className="space-y-3.5 text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-2" />;

        // Headers
        if (trimmed.startsWith("### ")) {
          return (
            <h3 key={index} className="text-sm md:text-base font-black text-cyan-400 mt-4 border-l-2 border-cyan-500 pl-2">
              {parseBold(trimmed.substring(4))}
            </h3>
          );
        }
        if (trimmed.startsWith("#### ")) {
          return (
            <h4 key={index} className="text-xs md:text-sm font-extrabold text-white mt-3">
              {parseBold(trimmed.substring(5))}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2 key={index} className="text-base md:text-lg font-black text-white mt-5 border-b border-slate-900 pb-1">
              {parseBold(trimmed.substring(3))}
            </h2>
          );
        }

        // Bullet Lists
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          return (
            <div key={index} className="flex items-start gap-2 pl-3">
              <span className="text-cyan-400 mt-1.5 shrink-0 select-none text-[8px]">●</span>
              <div className="flex-1">{parseBold(trimmed.substring(2))}</div>
            </div>
          );
        }

        // Numbered Lists
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={index} className="flex items-start gap-2 pl-3">
              <span className="text-teal-400 font-bold shrink-0 select-none text-xs">{numMatch[1]}.</span>
              <div className="flex-1">{parseBold(numMatch[2])}</div>
            </div>
          );
        }

        // Divider
        if (trimmed === "---" || trimmed === "***") {
          return <hr key={index} className="border-slate-900 my-4" />;
        }

        // Normal paragraph
        return (
          <p key={index} className="text-justify whitespace-pre-wrap">
            {parseBold(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function parseBold(text: string) {
  // Split on double asterisks for bolding
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-cyan-400 font-extrabold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    
    // Split on single asterisks for italics
    const italicParts = part.split(/(\*.*?\*)/g);
    return italicParts.map((subPart, j) => {
      if (subPart.startsWith("*") && subPart.endsWith("*")) {
        return (
          <em key={j} className="text-[#F5F5F4] font-semibold italic">
            {subPart.slice(1, -1)}
          </em>
        );
      }
      return subPart;
    });
  });
}