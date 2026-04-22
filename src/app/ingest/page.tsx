import { IngestForm } from "@/components/ingest-form";
import { SectionCard } from "@/components/section-card";

export default function IngestPage() {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-2xl p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">New Intake</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
          Ingest Suspicious Content
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Submit suspicious posts, messages, or narratives into the monitoring pipeline for
          storage and later analysis.
        </p>
      </section>

      <SectionCard
        title="Manual Submission"
        subtitle="Store suspicious content, hashtags, and URLs in Supabase"
      >
        <IngestForm />
      </SectionCard>
    </div>
  );
}
