import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY!
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert resume writer with deep experience across every industry — education, healthcare, sales, hospitality, skilled trades, government, engineering, software, and more.

You will be given raw information about a real person: their work history, education, certifications, skills, and achievements, written in their own words.

Raw Candidate Information:
- Full Name: ${body.name || ""}
- Contact Email: ${body.email || ""}
- Contact Phone: ${body.phone || ""}
- Location: ${body.location || ""}
- LinkedIn: ${body.linkedin || ""}
- Target Role / Job Description (if any): ${body.targetRole || ""}
- Skills: ${body.skills || ""}
- Education: ${body.education || ""}
- Experience / Work History / Achievements: ${body.experience || ""}

Before writing anything, work out what field this person is actually in from the information given. Let that determine every choice below — do not default to a generic template.

Rules:
- Rewrite everything in polished, professional resume language. Never copy the input word-for-word.
- Start every bullet with a strong action verb (Led, Designed, Managed, Taught, Reduced, Increased, Coordinated).
- Include numbers and results wherever the input supports them (students taught, revenue, percentage, team size, time saved). Never invent numbers that aren't in the input.
- Choose skills and section headings that fit THIS person's actual field. Do not add a "Technical Skills" section listing programming languages or software tools unless the person's background genuinely involves them. For non-technical fields, label the section "Core Skills" or "Key Competencies" and only include skills the input actually supports.
- Never invent employers, dates, job titles, certifications, or skills that aren't in the input. If something is missing, leave it out rather than guessing.
- If a target role or job description is provided, lean the professional summary and skills toward its language and priorities — but only where the person's real background actually supports it.

Output ONLY valid JSON, exactly in this structure, with nothing before or after it — no markdown, no explanation:

{
  "full_name": "${body.name || ""}",
  "target_role": "${body.targetRole || ""}",
  "contact": { 
    "email": "${body.email || ""}", 
    "phone": "${body.phone || ""}", 
    "location": "${body.location || ""}", 
    "linkedin": "${body.linkedin || ""}" 
  },
  "professional_summary": "2-3 sentences, tailored to this person's field and experience level",
  "core_skills": ["field-relevant, evidence-based skills only"],
  "experience": [
    {
      "title": "",
      "organization": "",
      "location": "",
      "start_date": "",
      "end_date": "",
      "bullets": ["one-line, achievement-focused bullet"]
    }
  ],
  "education": [
    { "degree": "", "institution": "", "location": "", "year": "" }
  ],
  "certifications": [""],
  "additional_sections": [
    { "heading": "e.g. Awards, Publications, Volunteer Work", "items": [""] }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean the response - remove markdown code fences if present
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();

    // Parse and validate the JSON
    let parsedResume;
    try {
      parsedResume = JSON.parse(cleanedText);
    } catch {
      // If JSON parsing fails, return the raw text as a fallback summary
      return NextResponse.json({
        resume: {
          full_name: body.name || "",
          target_role: body.targetRole || "",
          contact: {
            email: body.email || "",
            phone: body.phone || "",
            location: body.location || "",
            linkedin: body.linkedin || ""
          },
          professional_summary: cleanedText,
          core_skills: [],
          experience: [],
          education: [],
          certifications: [],
          additional_sections: []
        },
      });
    }

    return NextResponse.json({
      resume: parsedResume,
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