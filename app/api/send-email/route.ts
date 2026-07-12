import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "RecruitFlow AI <onboarding@resend.dev>",
      to: ['adityashukla9084@gmail.com'],
      subject: "✅ Resume Analysis Complete | RecruitFlow AI",
      html: `
<div style="max-width:600px;margin:auto;padding:30px;font-family:Arial;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb">
<h1 style="color:#2563eb;">RecruitFlow AI</h1>

<h2>Your Resume Analysis is Ready 🚀</h2>

<p>Hello,</p>

<p>Your resume has been successfully analyzed.</p>

<p>You can now view:</p>

<ul>
<li>ATS Score</li>
<li>Strengths</li>
<li>Weaknesses</li>
<li>AI Suggestions</li>
</ul>

<a href="https://recruit-flowai.site"
style="display:inline-block;background:#2563eb;color:white;padding:14px 22px;border-radius:8px;text-decoration:none;">
Open RecruitFlow AI
</a>

<hr>

<p style="font-size:12px;color:#777">
RecruitFlow AI © 2026
</p>
</div>
`,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to send email" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Send Email Catch Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send email" },
      { status: 500 }
    );
  }
}