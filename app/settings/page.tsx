"use client";

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-4xl mx-auto rounded-3xl border border-slate-800 bg-slate-900/70 p-10">
        <h1 className="text-4xl font-bold mb-8">
          Settings
        </h1>

        <div className="space-y-6">

          <div className="rounded-2xl bg-slate-800 p-6">
            <h2 className="font-bold text-xl">
              Appearance
            </h2>

            <p className="text-slate-400 mt-2">
              Dark Mode (Coming Soon)
            </p>
          </div>

          <div className="rounded-2xl bg-slate-800 p-6">
            <h2 className="font-bold text-xl">
              Notifications
            </h2>

            <p className="text-slate-400 mt-2">
              Email Notifications (Coming Soon)
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}