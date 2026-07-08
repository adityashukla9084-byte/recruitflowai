import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { question } = await request.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are RecruitFlow AI Career Coach.

You are an expert career mentor.

Answer professionally.

Help users with:

- Resume
- ATS
- Interviews
- Jobs
- Career roadmap
- Salary
- Skills
- Certifications
- LinkedIn
- Cover letters

Question:
${question}

Give a detailed but easy-to-understand answer.
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    return NextResponse.json({
      reply,
    });

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