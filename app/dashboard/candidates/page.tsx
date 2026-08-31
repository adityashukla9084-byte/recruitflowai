"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Plus, User, Star, Briefcase, MapPin, CheckCircle2, XCircle } from "lucide-react";
import PullToRefresh from "@/app/components/PullToRefresh";
import { motion, AnimatePresence } from "framer-motion";

type Candidate = {
  id: string;
  name: string;
  role: string;
  location: string;
  experience: string;
  matchScore: number;
  status: "New" | "Shortlisted" | "Rejected" | "Interview";
  skills: string[];
  avatar?: string;
};

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: "1",
    name: "Alex Sterling",
    role: "Senior Frontend Engineer",
    location: "Remote, US",
    experience: "7 Yrs",
    matchScore: 94,
    status: "Shortlisted",
    skills: ["React", "TypeScript", "Next.js"],
  },
  {
    id: "2",
    name: "Samantha Lee",
    role: "Product Designer",
    location: "New York, NY",
    experience: "5 Yrs",
    matchScore: 88,
    status: "New",
    skills: ["Figma", "UI/UX", "Prototyping"],
  },
  {
    id: "3",
    name: "David Chen",
    role: "Backend Developer",
    location: "San Francisco, CA",
    experience: "4 Yrs",
    matchScore: 72,
    status: "Interview",
    skills: ["Node.js", "PostgreSQL", "AWS"],
  },
  {
    id: "4",
    name: "Jessica Rivera",
    role: "Engineering Manager",
    location: "Austin, TX",
    experience: "10+ Yrs",
    matchScore: 96,
    status: "New",
    skills: ["Leadership", "System Design", "Agile"],
  },
  {
    id: "5",
    name: "Michael Chang",
    role: "DevOps Engineer",
    location: "Seattle, WA",
    experience: "6 Yrs",
    matchScore: 85,
    status: "Rejected",
    skills: ["Docker", "Kubernetes", "CI/CD"],
  },
];

export default function CandidatesPage() {
  const [loading, setLoading] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCandidates(mockCandidates);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = async () => {
    await fetchData();
  };

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="min-h-screen bg-[#050505] text-[#FFFFF0] pb-24 md:pb-8">
        
        {/* Sticky App Bar & Search */}
        <div className="sticky top-0 z-30 bg-[#050505]/90  border-b border-white/[0.04] pt-safe-top">
          <div className="px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight text-[#FFFFF0]">Candidates</h1>
            <button className="p-2 rounded-full bg-white/[0.03] border border-white/[0.04] text-zinc-300">
              <Filter size={18} />
            </button>
          </div>
          
          <div className="px-4 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
              <input 
                type="text" 
                placeholder="Search candidates, roles..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F0F0F] border border-white/[0.06] rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/50 transition-all text-[#FFFFF0] placeholder:text-zinc-300"
              />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-4 max-w-lg mx-auto md:max-w-none">
          
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              {loading ? "Loading..." : `${filteredCandidates.length} Results`}
            </span>
            <span className="text-xs text-[#D4AF37] font-semibold">Most Relevant</span>
          </div>

          <AnimatePresence mode="popLayout">
            {loading ? (
              // Skeleton Loading State
              Array.from({ length: 4 }).map((_, i) => (
                <motion.div 
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-[#0A0A0A] border border-white/[0.04] rounded-2xl p-4 flex gap-4 animate-pulse"
                >
                  <div className="w-14 h-14 rounded-full bg-white/[0.05]" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-white/[0.05] rounded-md w-1/2" />
                    <div className="h-3 bg-white/[0.05] rounded-md w-3/4" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 bg-white/[0.05] rounded-full w-16" />
                      <div className="h-6 bg-white/[0.05] rounded-full w-16" />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : filteredCandidates.length > 0 ? (
              filteredCandidates.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-[#0A0A0A] border border-white/[0.04] rounded-2xl p-4 relative shadow-[0_4px_20px_rgba(0,0,0,0.2)] active:scale-[0.98] transition-transform md:active:scale-100"
                >
                  <button className="absolute top-3 right-3 p-1.5 text-zinc-300 active:bg-white/[0.05] md:hover:bg-white/[0.05] rounded-full">
                    <MoreVertical size={18} />
                  </button>
                  
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0F0F0F] to-[#1A1A1A] border border-white/[0.08] flex items-center justify-center text-lg font-bold text-[#D4AF37] shadow-inner">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-[#050505] rounded-full p-0.5">
                        <div className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[9px] font-black w-6 h-6 rounded-full flex items-center justify-center">
                          {candidate.matchScore}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#FFFFF0] truncate pr-8">{candidate.name}</h3>
                      <p className="text-sm text-zinc-300 truncate font-medium">{candidate.role}</p>
                      
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-300">
                        <div className="flex items-center gap-1">
                          <Briefcase size={12} className="text-[#D4AF37]" />
                          <span>{candidate.experience}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#D4AF37]" />
                          <span className="truncate">{candidate.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {candidate.skills.map(skill => (
                      <span key={skill} className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/[0.03] border border-white/[0.04] rounded-full text-theme-text">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                    <button className="flex-1 py-2 rounded-xl bg-[#C5A028]/10 text-[#D4AF37] text-xs font-bold flex items-center justify-center gap-1.5 active:bg-[#C5A028]/20 transition-colors">
                      <CheckCircle2 size={14} />
                      Shortlist
                    </button>
                    <button className="flex-1 py-2 rounded-xl bg-white/[0.03] text-theme-text text-xs font-bold flex items-center justify-center gap-1.5 active:bg-white/[0.05] transition-colors border border-white/[0.04]">
                      <XCircle size={14} />
                      Reject
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 px-4"
              >
                <div className="w-16 h-16 mx-auto bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center justify-center mb-4 text-zinc-300">
                  <User size={24} />
                </div>
                <h3 className="font-bold text-[#FFFFF0] mb-1">No Candidates Found</h3>
                <p className="text-sm text-zinc-300 max-w-[250px] mx-auto leading-relaxed">
                  We couldn't find any candidates matching your search criteria.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Button (FAB) */}
        <button className="fixed bottom-[100px] md:bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-[#D4AF37] to-[#C5A028] text-[#050505] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(212,175,55,0.4)] active:scale-95 md:hover:scale-105 transition-transform z-40">
          <Plus size={24} strokeWidth={2.5} />
        </button>

      </div>
    </PullToRefresh>
  );
}
