type SalaryCardProps = {
  salary: string;
};

export default function SalaryCard({
  salary,
}: SalaryCardProps) {
  return (
    <div className="rounded-2xl border border-green-700 bg-theme-bg-secondary p-6 shadow-lg shadow-[var(--shadow-card)]">

      <h2 className="text-xl font-bold text-green-400">
        💰 Estimated Salary
      </h2>

      <h1 className="mt-6 text-5xl font-bold text-theme-text">
        {salary}
      </h1>

    </div>
  );
}