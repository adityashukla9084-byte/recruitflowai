type SalaryCardProps = {
  salary: string;
};

export default function SalaryCard({ salary }: SalaryCardProps) {
  return (
    <div className="bg-theme-card border border-theme-border rounded-2xl p-4.5 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:scale-[1.02] hover:-translate-y-0.5 relative overflow-hidden group cursor-default">
      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-theme-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <span className="text-[11px] font-bold uppercase tracking-widest text-theme-text-muted block mb-2 select-none">
        Estimated Salary
      </span>
      <p
        className="text-xl font-bold leading-none text-theme-text select-all"
        style={{
          fontFamily: "var(--font-geist-mono), monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {salary}
      </p>
    </div>
  );
}
