import { Badge } from "@/components/badge";
import { SectionCard } from "@/components/section-card";
import { formatDateTime } from "@/lib/format";
import { getSupabaseServerClient } from "@/lib/supabase/server";

function truncateHash(hash: string, start = 12, end = 8) {
  if (!hash) return "N/A";
  if (hash.length <= start + end + 3) return hash;
  return `${hash.slice(0, start)}...${hash.slice(-end)}`;
}

export default async function AuditPage() {
  const supabase = getSupabaseServerClient();

  const { data: rows, error } = await supabase
    .from("audit_chain")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    throw new Error("Failed to load audit chain.");
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Integrity Ledger</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">Audit Trail</h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Tamper-evident event records for ingestion, analysis, coordination, and campaign
              state transitions.
            </p>
          </div>
          <Badge label="Immutable-style chain view" tone="cyan" />
        </div>
      </section>

      <SectionCard title="Recent Audit Events" subtitle="Most recent records first">
        {!rows || rows.length === 0 ? (
          <p className="text-sm text-slate-400">No audit events recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {rows.map((row) => (
              <div key={row.id} className="rounded-xl border border-cyan-300/15 bg-slate-900/50 p-4">
                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{row.event_type}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDateTime(row.created_at)}</p>
                  </div>
                  <Badge label="Chain Event" tone="green" />
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border border-slate-700/40 bg-slate-950/40 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Payload Hash</p>
                    <p className="mt-1 break-all font-mono text-xs text-cyan-200" title={row.payload_hash}>
                      {truncateHash(row.payload_hash)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-700/40 bg-slate-950/40 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Previous Hash</p>
                    <p className="mt-1 break-all font-mono text-xs text-cyan-200" title={row.previous_hash ?? "N/A"}>
                      {row.previous_hash ? truncateHash(row.previous_hash) : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-700/40 bg-slate-950/40 p-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Current Hash</p>
                    <p className="mt-1 break-all font-mono text-xs text-cyan-200" title={row.current_hash}>
                      {truncateHash(row.current_hash)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
