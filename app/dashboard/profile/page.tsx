"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    education: "",
    university: "",
    bio: "",
    email: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
  setLoading(false);
  return;
}

    const { data, error } = await supabase
  .from("profiles")
  .select("*")
  .eq("user_id", user.id)
  .maybeSingle();

console.log(error);
console.log(data);

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        phone: data.phone || "",
        education: data.education || "",
        university: data.university || "",
        bio: data.bio || "",
        email: user.email || "",
      });
    } else {
      setProfile((prev) => ({
        ...prev,
        email: user.email || "",
      }));
    }

    setLoading(false);
  }

  async function saveProfile() {
  console.log("Save button clicked");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  if (!user) {
    alert("User not found");
    return;
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({
      user_id: user.id,
      full_name: profile.full_name,
      phone: profile.phone,
      education: profile.education,
      university: profile.university,
      bio: profile.bio,
    })
    .select();

  console.log(data);
  console.log(error);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Profile Updated Successfully");
}
  if (loading) {
    return (
      <main className="min-h-screen bg-theme-bg text-theme-text flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-theme-bg text-theme-text p-10">
      <div className="max-w-3xl mx-auto rounded-2xl bg-theme-bg-secondary shadow-[var(--shadow-card)] p-8 border border-theme-border-card">

        <h1 className="text-4xl font-bold mb-8">
          👤 My Profile
        </h1>

        <div className="space-y-5">

          <input
            className="w-full rounded-lg bg-theme-card-hover p-3"
            placeholder="Full Name"
            value={profile.full_name}
            onChange={(e) =>
              setProfile({
                ...profile,
                full_name: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded-lg bg-slate-800 p-3"
            value={profile.email}
            disabled
          />

          <input
            className="w-full rounded-lg bg-slate-800 p-3"
            placeholder="Phone"
            value={profile.phone}
            onChange={(e) =>
              setProfile({
                ...profile,
                phone: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded-lg bg-slate-800 p-3"
            placeholder="Education"
            value={profile.education}
            onChange={(e) =>
              setProfile({
                ...profile,
                education: e.target.value,
              })
            }
          />

          <input
            className="w-full rounded-lg bg-slate-800 p-3"
            placeholder="University"
            value={profile.university}
            onChange={(e) =>
              setProfile({
                ...profile,
                university: e.target.value,
              })
            }
          />

          <textarea
            className="w-full rounded-lg bg-theme-card-hover p-3"
            rows={4}
            placeholder="Bio"
            value={profile.bio}
            onChange={(e) =>
              setProfile({
                ...profile,
                bio: e.target.value,
              })
            }
          />

          <button
            onClick={saveProfile}
            className="rounded-lg bg-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-600"
          >
            Save Profile
          </button>

        </div>

      </div>
    </main>
  );
}