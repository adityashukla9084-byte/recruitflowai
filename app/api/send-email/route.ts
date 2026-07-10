import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
console.log("RESEND KEY:", process.env.RESEND_API_KEY);
export async function POST() {
  try {
    const { data, error } = await resend.emails.send({
      from: "RecruitFlow AI <onboarding@resend.dev>",
      to: ['adityashukla9084@gmail.com'],
      subject: "RecruitFlow AI Test Email 🚀",
      html: `
        <h1>Hello Aditya 👋</h1>
        <p>Your email integration is working successfully.</p>
        <p>This email was sent from RecruitFlow AI.</p>
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