"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type UserProfile = {
  email: string;
  id: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUser({
      email: user.email ?? "",
      id: user.id,
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/70 p-10">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-cyan-500 flex items-center justify-center text-4xl font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-4xl font-bold">My Profile</h1>

            <p className="text-slate-400 mt-2">
              {user?.email}
            </p>

            <p className="text-xs text-slate-500 mt-2">
              {user?.id}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}