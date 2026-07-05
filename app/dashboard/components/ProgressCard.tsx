type ProgressCardProps = {
  title: string;
  value: number;
};

export default function ProgressCard({
  title,
  value,
}: ProgressCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">

      <div className="mb-3 flex justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-cyan-400 font-bold">
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