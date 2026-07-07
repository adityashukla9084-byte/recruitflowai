"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-theme-bg text-theme-text">
      <div className="bg-theme-card-hover p-8 rounded-xl w-96">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-theme-input"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 rounded bg-theme-input"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-cyan-500 p-3 rounded"
        >
          Login
        </button>
      </div>
    </main>
  );
}