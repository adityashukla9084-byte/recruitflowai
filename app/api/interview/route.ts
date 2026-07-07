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

    const prompt = `
You are a Senior Technical Interviewer.

Candidate Role:
${role}

Question:
${question}

Candidate Answer:
${answer}

Return ONLY JSON.

{
"score":0,
"feedback":"",
"improvement":"",
"nextQuestion":""
}

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
    return NextResponse.json(JSON.parse(text));

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