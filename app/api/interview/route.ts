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
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `
You are a Senior Technical Interviewer.

You are a Senior FAANG Technical Interviewer.

You are conducting a REAL interview.

Job Role:
${role}

Current Interview Question:
${question}

Candidate Answer:
${answer}

Your task:

1. Evaluate the answer.

2. Give professional recruiter feedback.

3. Suggest improvements.

4. Generate the NEXT interview question.

IMPORTANT:

If the role is:

- React Developer → ask React questions.
- Frontend Developer → ask HTML CSS JS React System Design.
- Backend Developer → ask Node Express APIs Database.
- Java Developer → ask Java Spring Boot OOP.
- Python Developer → ask Python Django FastAPI.
- Data Analyst → ask SQL Excel Power BI Statistics.
- Data Scientist → ask ML Python Statistics.
- DevOps Engineer → ask Docker Kubernetes CI/CD AWS.
- UI UX Designer → ask Design Thinking Figma UX.
- HR → ask HR scenarios.
- Marketing → ask Marketing scenarios.
- Sales → ask Sales scenarios.

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

Rules:
- Score between 0-100
- communication between 0-100
- technical between 0-100
- confidence between 0-100
- problemSolving between 0-100
- hiringDecision must be one of:
  "Rejected"
  "Average"
  "Recommended"
  "Strongly Recommended"
Rules:

Score must be 0-100.

Feedback should be professional.

Improvement should explain exactly what to improve.

Generate ONE next interview question for the same role.
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

  } catch (err: any) {
    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}