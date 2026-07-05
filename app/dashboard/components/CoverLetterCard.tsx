type CoverLetterCardProps = {
  coverLetter: string;
};

export default function CoverLetterCard({
  coverLetter,
}: CoverLetterCardProps) {
  return (
    <div className="rounded-2xl border border-pink-700 bg-slate-900 p-6 shadow-lg">

      <h2 className="mb-4 text-xl font-bold text-pink-400">
        📄 AI Cover Letter
      </h2>

      <div className="max-h-80 overflow-y-auto rounded-lg bg-slate-800 p-4">
        <p className="whitespace-pre-wrap leading-8 text-slate-300">
          {coverLetter}
        </p>
      </div>

    </div>
  );
}