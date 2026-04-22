import Link from "next/link";
import { Badge } from "@/components/badge";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { formatDateTime, truncateText } from "@/lib/format";
import { getDashboardStats } from "@/lib/dashboard";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = getSupabaseServerClient();
  const stats = await getDashboardStats();
  const [{ data: recentPosts }, { data: campaigns }, { data: auditRows }] = await Promise.all([
    supabase
      .from("posts")
      .select(
        `
          id,
          content,
          source_platform,
          created_at,
          narrative_label,
          accounts(handle),
          analysis_results(final_risk_score)
        `
      )
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("campaign_clusters")
      .select("*")
      .order("coordination_score", { ascending: false })
      .limit(4),
    supabase
      .from("audit_chain")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-2xl p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Operational Overview</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Aegis-LLM Threat Intelligence Console
            </h2>
            <p className="mt-3 max-w-3xl text-sm text-slate-300">
              Cloud-based detection, scoring, coordination analysis, and tamper-evident logging
              for AI-assisted phishing, propaganda, and disinformation campaigns.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge label="Live Supabase Data" tone="cyan" />
            <Badge label="Groq Enabled" tone="green" />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            delta="Live from Supabase"
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard title="Recent Posts" subtitle="Latest monitored content">
            {!recentPosts || recentPosts.length === 0 ? (
              <p className="text-sm text-slate-400">No recent posts found.</p>
            ) : (
              <div className="space-y-4">
                {recentPosts.map((post) => {
                  const account = Array.isArray(post.accounts) ? post.accounts[0] : post.accounts;
                  const analysis = Array.isArray(post.analysis_results)
                    ? post.analysis_results[0]
                    : post.analysis_results;

                  return (
                    <Link
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="block rounded-xl border border-cyan-300/15 bg-slate-900/50 p-4 transition hover:border-cyan-300/35 hover:bg-slate-900/80"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <Badge label={post.source_platform} tone="cyan" />
                            <Badge label={post.narrative_label ?? "Unlabeled"} tone="slate" />
                          </div>
                          <p className="text-sm text-slate-200">{truncateText(post.content, 120)}</p>
                          <p className="text-xs text-slate-400">
                            {account?.handle ?? "Unknown"} • {formatDateTime(post.created_at)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500">Risk</p>
                          <p className="mt-1 text-lg font-semibold text-slate-100">
                            {analysis?.final_risk_score != null
                              ? `${Math.round(analysis.final_risk_score)} / 100`
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Top Campaigns" subtitle="Highest coordination scores">
          {!campaigns || campaigns.length === 0 ? (
            <p className="text-sm text-slate-400">No campaign clusters found.</p>
          ) : (
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-xl border border-cyan-300/15 bg-slate-900/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{campaign.cluster_name}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {campaign.narrative_label ?? "No narrative label"}
                      </p>
                    </div>
                    <Badge label={`${Math.round(campaign.coordination_score)} / 100`} tone="green" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </section>

      <SectionCard title="Latest Audit Events" subtitle="Recent tamper-evident log entries">
        {!auditRows || auditRows.length === 0 ? (
          <p className="text-sm text-slate-400">No audit events recorded yet.</p>
        ) : (
          <div className="space-y-4">
            {auditRows.map((row) => (
              <div key={row.id} className="rounded-xl border border-cyan-300/15 bg-slate-900/50 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{row.event_type}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatDateTime(row.created_at)}</p>
                  </div>
                  <Badge label="Audit Logged" tone="cyan" />
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
