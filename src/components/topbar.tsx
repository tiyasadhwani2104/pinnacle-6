"use client";

type TopbarProps = {
  title: string;
  onOpenSidebar: () => void;
};

export function Topbar({ title, onOpenSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-cyan-300/20 bg-slate-950/70 px-4 py-3 backdrop-blur md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-300/25 text-cyan-200 md:hidden"
            aria-label="Open navigation menu"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-300/80">Aegis Operations</p>
            <h1 className="text-lg font-semibold text-slate-100">{title}</h1>
          </div>
        </div>
        <span className="rounded-full border border-emerald-300/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200">
          Frontend Phase 1
        </span>
      </div>
    </header>
  );
}
