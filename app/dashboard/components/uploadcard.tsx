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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

      <h2 className="text-2xl font-bold text-white">
        Upload Resume
      </h2>

      <p className="mt-2 text-slate-400">
        PDF or DOCX • Max 10MB
      </p>

      <input
        type="file"
        accept=".pdf,.docx"
        className="mt-6 block w-full rounded-lg border border-slate-700 bg-slate-800 p-3 text-white"
        onChange={(e) =>
          onFileChange(e.target.files?.[0] ?? null)
        }
      />

      <button
        onClick={onAnalyze}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-cyan-500 py-3 font-bold text-white transition hover:bg-cyan-600"
      >
        {loading ? "Analyzing Resume..." : "Analyze Resume"}
      </button>

    </div>
  );
}