import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { role } = await request.json();

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
You are a Senior FAANG Technical Interviewer.

Generate ONLY ONE professional first interview question.

Role:
${role}

Rules:

- If role is React Developer → ask React.
- If role is Frontend Developer → ask HTML CSS JS React.
- If role is Backend Developer → ask APIs Node Database.
- If role is HR → ask HR.
- If role is Marketing → ask Marketing.
- If role is Sales → ask Sales.
- If role is Data Analyst → ask SQL Excel Power BI.
- If role is Data Scientist → ask ML Python Statistics.

Do NOT always ask:
"Tell me about yourself."

Only ask that if it naturally fits.

Return ONLY JSON.

{
  "question":""
}
`;

    const result = await model.generateContent(prompt);

    let text = result.response.text();

    // Strip markdown code fences if present
    text = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

    return NextResponse.json(JSON.parse(text));

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