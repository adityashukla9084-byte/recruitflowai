import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const {
      data: { user },
    } = await admin.auth.getUser(token);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: interviews } = await admin
      .from("interview_history")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false })
      .limit(5);

    const { data: jobs } = await admin
      .from("job_tracker")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    return NextResponse.json({
      interviews: interviews ?? [],
      jobs: jobs ?? [],
      analysis: null,
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