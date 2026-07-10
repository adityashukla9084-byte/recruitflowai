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
      model: "gemini-2.5-flash",
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
let userObject: any = null;

if (authHeader?.startsWith("Bearer ")) {
  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user },
    error,
  } = await admin.auth.getUser(token);

  console.log("AUTH USER:", user);
  console.log("AUTH ERROR:", error);

  userId = user?.id ?? null;
  userObject = user;
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

if (userObject && userObject.email) {
  const emailReportsEnabled = userObject.user_metadata?.email_reports === true;
  if (emailReportsEnabled) {
    const fullName = userObject.user_metadata?.full_name || userObject.user_metadata?.name || "";
    sendReportEmail(userObject.email, fullName, analysis).catch((err) =>
      console.error("[Email Pipeline] Trigger error:", err)
    );
  }
}

return NextResponse.json({
  success: true,
  result: analysis,
});
    
      
  

  } catch (error) {
    const err = error as { message?: string };
    console.error("RecruitFlow AI Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: err?.message || "Analysis Failed",
      },
      {
        status: 500,
      }
    );
  }
}

async function sendReportEmail(
  email: string,
  fullName: string,
  analysis: any
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[Email Pipeline] RESEND_API_KEY is not defined. Email reports will not be sent.");
    return;
  }

  const atsColor = analysis.atsScore >= 80 ? "#10b981" : analysis.atsScore >= 50 ? "#f59e0b" : "#f43f5e";
  const matchColor = analysis.jobMatchScore >= 80 ? "#10b981" : analysis.jobMatchScore >= 50 ? "#f59e0b" : "#f43f5e";

  const strengthsList = (analysis.strengths || []).map((s: string) => `<li>${s}</li>`).join("");
  const weaknessesList = (analysis.weaknesses || []).map((w: string) => `<li>${w}</li>`).join("");
  const missingList = (analysis.missingKeywords || []).map((k: string) => `<span style="background-color:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.2); color:#f43f5e; padding:3px 8px; margin:4px; border-radius:4px; display:inline-block; font-size:11px;">${k}</span>`).join("");
  const matchedList = (analysis.matchedKeywords || []).map((k: string) => `<span style="background-color:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.2); color:#10b981; padding:3px 8px; margin:4px; border-radius:4px; display:inline-block; font-size:11px;">${k}</span>`).join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>RecruitFlow AI - Assessment Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #05070f; color: #e2e8f0; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #0b0f19; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 24px; margin-bottom: 24px; }
        .title { color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; }
        .subtitle { color: #94a3b8; font-size: 14px; margin: 0; }
        .stats-grid { display: table; width: 100%; margin-bottom: 24px; }
        .stat-col { display: table-cell; width: 50%; text-align: center; padding: 12px; background-color: #05070f; border: 1px solid #1e293b; border-radius: 8px; }
        .stat-label { font-size: 10px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; font-weight: bold; }
        .stat-value { font-size: 32px; font-weight: 900; margin-top: 4px; font-family: monospace; }
        .section-title { font-size: 16px; font-weight: bold; color: #ffffff; margin-top: 24px; margin-bottom: 12px; border-left: 3px solid #06b6d4; padding-left: 8px; }
        .feedback { background-color: #05070f; border: 1px dashed #1e293b; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.6; color: #cbd5e1; }
        ul { padding-left: 20px; margin: 8px 0; font-size: 13px; line-height: 1.6; color: #cbd5e1; }
        li { margin-bottom: 6px; }
        .keyword-container { margin: 8px 0; }
        .footer { text-align: center; font-size: 11px; color: #64748b; margin-top: 32px; border-top: 1px solid #1e293b; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 class="title">RecruitFlow AI</h1>
          <p class="subtitle">Personal Resume Analysis &amp; Placement Report</p>
        </div>

        <p style="font-size: 14px; color: #cbd5e1; margin-bottom: 20px;">
          Hello <strong>${fullName || "Candidate"}</strong>,
        </p>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 24px;">
          Your resume scan is complete. We compared your experience profile against modern ATS parsing engines and verified keyword alignments. Here are your assessment scores and recommendations:
        </p>

        <div class="stats-grid">
          <div class="stat-col" style="border-right: 6px solid #05070f;">
            <div class="stat-label">ATS Score</div>
            <div class="stat-value" style="color: ${atsColor};">${analysis.atsScore}%</div>
          </div>
          <div class="stat-col" style="border-left: 6px solid #05070f;">
            <div class="stat-label">Job Match Rate</div>
            <div class="stat-value" style="color: ${matchColor};">${analysis.jobMatchScore}%</div>
          </div>
        </div>

        <div class="section-title">Recruiter Assessment Feedback</div>
        <div class="feedback">${analysis.recruiterFeedback}</div>

        <div class="section-title">Key Strengths</div>
        <ul>${strengthsList}</ul>

        <div class="section-title">Optimization Areas (Gaps)</div>
        <ul>${weaknessesList}</ul>

        <div class="section-title">Missing Target Keywords</div>
        <div class="keyword-container">${missingList}</div>

        <div class="section-title">Detected Keywords</div>
        <div class="keyword-container">${matchedList}</div>

        <div class="footer">
          This is an automated report dispatched because you enabled "Email Reports" in your RecruitFlow AI Dashboard settings.
          <br>&copy; 2026 RecruitFlow AI. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "RecruitFlow AI <onboarding@resend.dev>",
        to: email.toLowerCase(),
        subject: `RecruitFlow AI - Resume Analysis Report (Score: ${analysis.atsScore}%)`,
        html: emailHtml,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("[Email Pipeline] Resend API Error:", errorData);
    } else {
      console.log(`[Email Pipeline] Assessment report dispatched successfully to ${email}`);
    }
  } catch (err) {
    console.error("[Email Pipeline] Failed to send report email:", err);
  }
}