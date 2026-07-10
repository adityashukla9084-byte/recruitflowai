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
You are RecruitFlow AI Career Coach, an expert career mentor and professional advisor.

Help the user with their career question:
"${question}"

Answer professionally and follow these formatting guidelines strictly to guarantee a premium, systematic, and impressive reading experience:
1. **Structure with Markdown**: Organize your answer logically using clear headings (e.g. "### Heading Title" and "#### Subheading Title"). Avoid solid walls of text.
2. **Actionable Bullets & Numbered Steps**: Use bullet points ("* ") or numbered lists ("1. ") to lay out steps, strategies, rules, or checklists clearly.
3. **Use Bold for Emphasis**: Highlight key terms, metrics, methods, or takeaways in bold (e.g. "**STAR method**" or "**Action Verbs**").
4. **Spacing**: Add double line breaks between paragraphs, lists, and headers to keep sections distinct.
5. **Direct & Engaging**: Speak directly to the user. Avoid dry generic answers. Make the layout structured and appealing to read.
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    return NextResponse.json({
      reply,
    });

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