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
You are a world-class ATS Resume Writer.

Create a professional one-page resume for the following candidate.

Candidate Details:
Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone}
Skills: ${body.skills}
Education: ${body.education}
Experience: ${body.experience}

IMPORTANT: You MUST respond with valid JSON only. No markdown, no code fences, no extra text.

Return this exact JSON structure:
{
  "summary": "A strong 3-4 sentence professional summary",
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End",
      "bullets": ["achievement 1", "achievement 2", "achievement 3"]
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description of the project and technologies used"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "languages": ["Language 1", "Language 2"],
  "strengths": ["Soft Strength 1", "Soft Strength 2", "Soft Strength 3", "Soft Strength 4", "Soft Strength 5"],
  "competencies": [
    "Competency 1: Brief description of candidate's capacity",
    "Competency 2: Brief description of candidate's capacity",
    "Competency 3: Brief description of candidate's capacity"
  ]
}

Rules:
- Generate realistic, ATS-friendly content based on the candidate's details.
- "strengths" MUST be soft/personal skills (e.g. "Clear Communicator", "Analytical Thinker", "Detail-Oriented", "Time Management") and must not repeat the candidate's technical skills.
- If candidate didn't provide experience, create relevant experience entries based on their skills.
- If candidate didn't provide specific info for a section, generate suitable recommendations.
- Keep language professional and action-oriented.
- Use strong action verbs in experience bullets.
- Return ONLY the JSON object, nothing else.
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
          summary: cleanedText,
          experience: [],
          projects: [],
          certifications: [],
          languages: ["English"],
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