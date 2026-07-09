"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(false);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) setProfile(data);
  }

  async function saveProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;
setLoading(true);

const { error } = await supabase
  .from("profiles")
  .update({
    full_name: profile.full_name,
    phone: profile.phone,
    education: profile.education,
    universities: profile.universities,
    linkedin: profile.linkedin,
    github: profile.github,
    bio: profile.bio,
  })
  .eq("user_id", user.id);

setLoading(false);

if (error) {
  alert(error.message);
} else {
  alert("Profile Updated ✅");
}
 }
   
  

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          My Profile
        </h1>

        <div className="space-y-5">

          <input
            className="w-full rounded-xl bg-slate-900 p-4"
            placeholder="Full Name"
            value={profile.full_name || ""}
            onChange={(e)=>
              setProfile({...profile,full_name:e.target.value})
            }
          />

          <input
            className="w-full rounded-xl bg-slate-900 p-4"
            placeholder="Phone"
            value={profile.phone || ""}
            onChange={(e)=>
              setProfile({...profile,phone:e.target.value})
            }
          />

          <input
            className="w-full rounded-xl bg-slate-900 p-4"
            placeholder="Education"
            value={profile.education || ""}
            onChange={(e)=>
              setProfile({...profile,education:e.target.value})
            }
          />

          <input
            className="w-full rounded-xl bg-slate-900 p-4"
            placeholder="University"
            value={profile.universities || ""}
            onChange={(e)=>
              setProfile({...profile,universities:e.target.value})
            }
          />

          <input
            className="w-full rounded-xl bg-slate-900 p-4"
            placeholder="LinkedIn"
            value={profile.linkedin || ""}
            onChange={(e)=>
              setProfile({...profile,linkedin:e.target.value})
            }
          />

          <input
            className="w-full rounded-xl bg-slate-900 p-4"
            placeholder="GitHub"
            value={profile.github || ""}
            onChange={(e)=>
              setProfile({...profile,github:e.target.value})
            }
          />

          <textarea
            className="w-full rounded-xl bg-slate-900 p-4"
            rows={5}
            placeholder="Bio"
            value={profile.bio || ""}
            onChange={(e)=>
              setProfile({...profile,bio:e.target.value})
            }
          />

         <button
  onClick={saveProfile}
  disabled={loading}
  className="rounded-xl bg-cyan-500 px-8 py-4 font-bold disabled:opacity-50"
>
  {loading ? "Saving..." : "Save Profile"}
</button>
        </div>

      </div>
    </main>
  );
}