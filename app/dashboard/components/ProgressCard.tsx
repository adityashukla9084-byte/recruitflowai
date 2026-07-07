type ProgressCardProps = {
  title: string;
  value: number;
};

export default function ProgressCard({
  title,
  value,
}: ProgressCardProps) {
  return (
    <div className="rounded-2xl border border-theme-border-card bg-theme-bg-secondary p-5 shadow-lg shadow-[var(--shadow-card)]">

      <div className="mb-3 flex justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-theme-accent font-bold">
          {value}%
        </span>
      </div>

      <div className="h-3 rounded-full bg-slate-700">

        <div
          className="h-3 rounded-full bg-cyan-500 transition-all duration-700"
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}