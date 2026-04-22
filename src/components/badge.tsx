type BadgeTone = "cyan" | "green" | "red" | "slate";

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  cyan: "bg-cyan-500/15 text-cyan-200 border-cyan-300/30",
  green: "bg-emerald-500/15 text-emerald-200 border-emerald-300/30",
  red: "bg-rose-500/15 text-rose-200 border-rose-300/30",
  slate: "bg-slate-500/15 text-slate-200 border-slate-300/30",
};

export function Badge({ label, tone = "slate" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {label}
    </span>
  );
}
