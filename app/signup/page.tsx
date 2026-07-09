"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password || !name || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data?.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            user_id: data.user.id,
            full_name: name,
            phone: phone,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError.message);
        }
      }

      alert("Account created successfully!");

      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-theme-bg">
      <div className="w-full max-w-md rounded-2xl bg-theme-bg-secondary shadow-[var(--shadow-card)] p-8">

        <h1 className="mb-8 text-center text-3xl font-bold text-theme-accent">
          RecruitFlow AI
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="mb-4 w-full rounded-lg border border-theme-border-input bg-theme-card-hover p-4 text-theme-text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="tel"
          placeholder="Phone Number"
          className="mb-4 w-full rounded-lg border border-theme-border-input bg-theme-card-hover p-4 text-theme-text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="mb-4 w-full rounded-lg border border-theme-border-input bg-theme-card-hover p-4 text-theme-text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-6 w-full rounded-lg border border-theme-border-input bg-theme-card-hover p-4 text-theme-text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full rounded-lg bg-cyan-500 py-4 font-bold hover:bg-cyan-600 text-white"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

      </div>
    </main>
  );
}