"use client";

type NavbarProps = {
  onLogout: () => void;
};

export default function Navbar({ onLogout }: NavbarProps) {
  return (
    <nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-theme-border-card px-4 md:px-8 py-5">

      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-theme-accent break-words">
          RecruitFlow AI
        </h1>

        <p className="text-xs md:text-sm text-theme-text-secondary">
          AI Powered Recruitment Platform
        </p>
      </div>

      <button
        onClick={onLogout}
        className="w-full md:w-auto rounded-lg bg-red-500 px-5 py-2 font-semibold transition hover:bg-red-600"
      >
        Logout
      </button>

    </nav>
  );
}