import { Badge } from "@/components/badge";
import { SectionCard } from "@/components/section-card";

type PagePlaceholderProps = {
  title: string;
  description: string;
  bullets: string[];
};

export function PagePlaceholder({ title, description, bullets }: PagePlaceholderProps) {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-2xl p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Phase 1 Placeholder</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">{description}</p>
      </section>

      <SectionCard
        title="Planned Scope"
        subtitle="Frontend-only static scaffolding for this phase"
        rightSlot={<Badge label="No backend yet" tone="green" />}
      >
        <ul className="space-y-2 text-sm text-slate-300">
          {bullets.map((item) => (
            <li key={item} className="rounded-lg border border-cyan-300/15 bg-slate-900/50 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </SectionCard>
    </div>
  );
}
