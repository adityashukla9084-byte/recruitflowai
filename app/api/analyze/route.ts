import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";
import { extractText } from "unpdf";

export const runtime = "nodejs";

type AnalysisResult = {
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





const MAX_FILE_SIZE = 10 * 1024 * 1024;

async function extractPdfText(buffer: Buffer): Promise<string> {
  const { text } = await extractText(new Uint8Array(buffer), {
    mergePages: true,
  });

  return text;
}

async function extractResumeText(file: File): Promise<string> {
  if (file.size === 0) {
    throw new Error("Resume is empty.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Resume must be under 10MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    return await extractPdfText(buffer);
  }

  if (fileName.endsWith(".docx")) {
    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value;
  }

  throw new Error("Only PDF and DOCX files are supported.");
}

function parseAnalysis(text: string): AnalysisResult {
  const cleaned = text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "");

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1) {
    throw new Error("Invalid AI response.");
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1));

  return {
    atsScore: Number(parsed.atsScore) || 0,

    overallVerdict: parsed.overallVerdict || "",

    summary: parsed.summary || "",

    strengths: parsed.strengths || [],

    weaknesses: parsed.weaknesses || [],

    matchedKeywords: parsed.matchedKeywords || [],

    missingKeywords: parsed.missingKeywords || [],

    skillsFound: parsed.skillsFound || [],

    skillsMissing: parsed.skillsMissing || [],

    grammarScore: parsed.grammarScore || 0,

    formattingScore: parsed.formattingScore || 0,

    readabilityScore: parsed.readabilityScore || 0,

    achievementsScore: parsed.achievementsScore || 0,

    recruiterFeedback: parsed.recruiterFeedback || "",

    rewrittenSummary: parsed.rewrittenSummary || "",

    interviewQuestions: parsed.interviewQuestions || [],

    suggestions: parsed.suggestions || [],
    jobMatchScore: parsed.jobMatchScore || parsed.atsScore || 0,

hiringProbability: parsed.hiringProbability || 75,

salaryRange: parsed.salaryRange || "",

coverLetter: parsed.coverLetter || "",

  };
}
export async function POST(request: Request) {
  try {
    const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing." },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file");
    const jobDescription =
  (formData.get("jobDescription") as string) || "";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Resume file missing." },
        { status: 400 }
      );
    }

    const resumeText = await extractResumeText(file);

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from resume." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are RecruitFlow AI.

You are an elite ATS Resume Analyzer used by Fortune 500 recruiters.

Analyze the resume professionally.

Return ONLY valid JSON.
Job Description:
${jobDescription}

Resume:
${resumeText}
{
  "atsScore":0,
  "overallVerdict":"",
  "summary":"",
  "strengths":[],
  "weaknesses":[],
  "matchedKeywords":[],
  "missingKeywords":[],
  "skillsFound":[],
  "skillsMissing":[],
  "grammarScore":0,
  "formattingScore":0,
  "readabilityScore":0,
  "achievementsScore":0,
  "recruiterFeedback":"",
  "rewrittenSummary":"",
  "interviewQuestions":[],
  "suggestions":[],
  "jobMatchScore":0,
"hiringProbability":0,
"salaryRange":"",
"coverLetter":""
}

Rules:
Return:
- jobMatchScore (0-100)
- hiringProbability (0-100)
- realistic salaryRange based on resume
- personalized coverLetter (250-350 words)

ATS score must be between 0 and 100.

Return exactly:

- 5 strengths
- 5 weaknesses
- 10 matchedKeywords
- 10 missingKeywords
- 10 skillsFound
- 10 skillsMissing
- 10 interviewQuestions
- 5 suggestions

Grammar score 0-100

Formatting score 0-100

Readability score 0-100

Achievements score 0-100

Overall verdict should be 2-3 professional lines.

Recruiter feedback should explain why a recruiter would shortlist or reject the candidate.

Rewrite the professional summary in recruiter-friendly language.

Return ONLY JSON.

Resume:

${resumeText}
`;
if (!jobDescription.trim()) {
  console.warn("No Job Description provided. Running resume-only analysis.");
}
    const result = await model.generateContent(prompt);

    const text = result.response.text();

    const analysis = parseAnalysis(text);

    const authHeader = request.headers.get("Authorization");

let userId: string | null = null;

if (authHeader?.startsWith("Bearer ")) {
  const token = authHeader.replace("Bearer ", "");

const {
  data: { user },
  error,
} = await admin.auth.getUser(token);

console.log("AUTH USER:", user);
console.log("AUTH ERROR:", error);

userId = user?.id ?? null;
}
console.log("USER ID BEFORE INSERT:", userId);
await admin.from("analysis_history").insert({
  user_id: userId,
  ats_score: analysis.atsScore,
  job_match: analysis.jobMatchScore,
  salary_range: analysis.salaryRange,
  summary: analysis.summary,
  feedback: analysis.recruiterFeedback,
  result: analysis,
});

return NextResponse.json({
  success: true,
  result: analysis,
});
    
      
  

  } catch (error: any) {
    console.error("RecruitFlow AI Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Analysis Failed",
      },
      {
        status: 500,
      }
    );
  }
}