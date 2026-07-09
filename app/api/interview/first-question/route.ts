import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { role, token } = await request.json();

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    let prompt = `
You are a Senior FAANG Technical Interviewer.

Generate ONLY ONE professional first interview question.

Role:
${role}
`;

    if (resumeText) {
      prompt += `
Candidate Resume Context:
${resumeText}

Rules:
- Since a resume was detected, you MUST tailor the first question to build on the candidate's skills, experience, or projects in their resume that are relevant to the ${role} position.
- Do NOT ask a generic question; make it specific and professional based on their resume profile.
`;
    } else {
      prompt += `
Rules:
- Since no resume was uploaded, ask a standard professional first question for the job role: ${role}.
- If role is React Developer → ask React.
- If role is Frontend Developer → ask HTML CSS JS React.
- If role is Backend Developer → ask APIs Node Database.
- If role is HR → ask HR.
- If role is Marketing → ask Marketing.
- If role is Sales → ask Sales.
- If role is Data Analyst → ask SQL Excel Power BI.
- If role is Data Scientist → ask ML Python Statistics.
`;
    }

    prompt += `
Do NOT always ask: "Tell me about yourself." Only ask that if it naturally fits.

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