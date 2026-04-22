export function PlaceholderChart() {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-100">Threat Trend (Placeholder)</h2>
        <p className="mt-1 text-sm text-slate-400">
          Static preview for campaign and risk trend visualization.
        </p>
      </div>
      <div className="relative h-48 overflow-hidden rounded-xl border border-cyan-300/20 bg-slate-900/70">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(56,189,248,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(56,189,248,0.08)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <div className="absolute bottom-0 left-0 h-[42%] w-full bg-gradient-to-r from-cyan-500/30 via-emerald-400/25 to-cyan-500/35" />
        <div className="absolute bottom-[28%] left-[8%] h-2 w-2 rounded-full bg-cyan-300" />
        <div className="absolute bottom-[45%] left-[28%] h-2 w-2 rounded-full bg-emerald-300" />
        <div className="absolute bottom-[33%] left-[48%] h-2 w-2 rounded-full bg-cyan-300" />
        <div className="absolute bottom-[54%] left-[68%] h-2 w-2 rounded-full bg-emerald-300" />
        <div className="absolute bottom-[40%] left-[86%] h-2 w-2 rounded-full bg-cyan-300" />
      </div>
    </div>
  );
}
