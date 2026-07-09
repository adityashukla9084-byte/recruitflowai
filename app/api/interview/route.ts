import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
 const { role, question, answer, token } = await request.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    let resumeText = "";
    if (token) {
      const {
        data: { user },
      } = await admin.auth.getUser(token);

      if (user) {
        const { data: history } = await admin
          .from("analysis_history")
          .select("summary, result")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (history && history.length > 0) {
          const latest = history[0];
          resumeText = latest.summary || "";
          if (latest.result) {
            const resData = latest.result as any;
            if (resData.skillsFound && resData.skillsFound.length > 0) {
              resumeText += "\nSkills: " + resData.skillsFound.join(", ");
            }
            if (resData.overallVerdict) {
              resumeText += "\nResume Summary: " + resData.overallVerdict;
            }
          }
        }
      }
    }

    let prompt = `
You are a Senior Technical Interviewer.
You are a Senior FAANG Technical Interviewer.
You are conducting a REAL interview.

Job Role:
${role}
`;

    if (resumeText) {
      prompt += `
Candidate Resume Context:
${resumeText}
`;
    }

    prompt += `
Current Interview Question:
${question}

Candidate Answer:
${answer}

Your task:

1. Evaluate the answer.

2. Give professional recruiter feedback.

3. Suggest improvements.

4. Generate the NEXT interview question.
`;

    if (resumeText) {
      prompt += `
IMPORTANT:
- Since a resume was detected, you MUST tailor the nextQuestion specifically to the candidate's skills, experience, or projects mentioned in their resume context, making it relevant to the ${role} position.
- Do NOT repeat questions and make them progressively more challenging based on their resume background.
`;
    } else {
      prompt += `
IMPORTANT:

If the role is:

- React Developer → ask React questions.
- Frontend Developer → ask HTML CSS JS React System Design.
- Backend Developer → ask Node Express APIs Database.
- Java Developer → ask Java Spring Boot OOP.
- Python Developer → ask Python Django FastAPI.
- Data Analyst → ask SQL Excel Power BI Statistics.
- Data Scientist → ask ML Python Statistics.
- DevOps Engineer → ask DevOps tools.
- UI UX Designer → ask Design Thinking Figma UX.
- HR → ask HR scenarios.
- Marketing → ask Marketing scenarios.
- Sales → ask Sales scenarios.
`;
    }

    prompt += `
Never repeat:

"Tell me about yourself"

unless it is the FIRST question.

Every nextQuestion must become progressively harder.

Questions must sound like Google, Amazon, Microsoft interviewers.

Return ONLY JSON.

{
"score":0,
"feedback":"",
"improvement":"",
"nextQuestion":"",
"communication":0,
"technical":0,
"confidence":0,
"problemSolving":0,
"hiringDecision":""
}
`;

    const result = await model.generateContent(prompt);

    const text = result.response.text();
const aiResult = JSON.parse(text);

let userId: string | null = null;

if (token) {
  const {
    data: { user },
  } = await admin.auth.getUser(token);

  userId = user?.id ?? null;
}

await admin.from("interview_history").insert({
  user_id: userId,
  job_role: role,
  question,
  answer,
  score: aiResult.score,
  feedback: aiResult.feedback,
  improvement: aiResult.improvement,
});

return NextResponse.json(aiResult);

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Something went wrong";
    return NextResponse.json(
      {
        error: errorMsg,
      },
      {
        status: 500,
      }
    );
  }
}