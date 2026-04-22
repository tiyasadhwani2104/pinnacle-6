type StatCardProps = {
  title: string;
  value: string;
  delta: string;
};

export function StatCard({ title, value, delta }: StatCardProps) {
  const isPositive = delta.startsWith("+");

  return (
    <article className="glass-panel rounded-2xl p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-100">{value}</p>
      <p
        className={`mt-2 text-xs font-medium ${
          isPositive ? "text-emerald-300" : "text-cyan-300"
        }`}
      >
        {delta} vs last period
      </p>
    </article>
  );
}
