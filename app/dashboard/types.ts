export type AnalysisResult = {
  atsScore: number;
  overallVerdict: string;
  summary: string;
  strengths: string[];
  weaknesses: string[];

  matchedKeywords: string[];
  missingKeywords: string[];

  skillsFound: string[];
  skillsMissing: string[];

  grammarScore: number;
  formattingScore: number;
  readabilityScore: number;
  achievementsScore: number;

  recruiterFeedback: string;

  rewrittenSummary: string;
  interviewQuestions: string[];

  suggestions: string[];

  jobMatchScore: number;
  hiringProbability: number;

  salaryRange: string;

  coverLetter: string;
};