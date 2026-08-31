"use client";

type Props = {
  loading: boolean;
  onAnalyze: () => void;
  onFileChange: (file: File | null) => void;
};

export default function UploadCard({
  loading,
  onAnalyze,
  onFileChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-theme-border-card bg-theme-bg-secondary p-8 shadow-xl shadow-[var(--shadow-card)]">

      <h2 className="text-2xl font-bold text-theme-text">
        Upload Resume
      </h2>

      <p className="mt-2 text-theme-text-secondary">
        PDF or DOCX • Max 10MB
      </p>

      <input
        type="file"
        accept=".pdf,.docx"
        className="mt-6 block w-full rounded-lg border border-theme-border-input bg-theme-card-hover p-3 text-theme-text"
        onChange={(e) =>
          onFileChange(e.target.files?.[0] ?? null)
        }
      />

      <button
        onClick={onAnalyze}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-theme-accent py-3 font-bold text-[#0F172A] transition hover:bg-theme-accent-hover"
      >
        {loading ? "Analyzing Resume..." : "Analyze Resume"}
      </button>

    </div>
  );
}