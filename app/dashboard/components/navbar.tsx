"use client";

type NavbarProps = {
  onLogout: () => void;
};

export default function Navbar({
  onLogout,
}: NavbarProps) {
  return (
    <nav className="flex items-center justify-between border-b border-slate-800 px-8 py-5">

      <div>

        <h1 className="text-3xl font-bold text-cyan-400">
          RecruitFlow AI
        </h1>

        <p className="text-sm text-slate-400">
          AI Powered Recruitment Platform
        </p>

      </div>

      <button
        onClick={onLogout}
        className="rounded-lg bg-red-500 px-5 py-2 font-semibold transition hover:bg-red-600"
      >
        Logout
      </button>

    </nav>
  );
}