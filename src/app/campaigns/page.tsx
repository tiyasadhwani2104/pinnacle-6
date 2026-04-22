import { Badge } from "@/components/badge";
import { SectionCard } from "@/components/section-card";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function CampaignsPage() {
  const supabase = getSupabaseServerClient();

  const { data: campaigns, error } = await supabase
    .from("campaign_clusters")
    .select("*")
    .order("coordination_score", { ascending: false });

  if (error) {
    throw new Error("Failed to load campaign clusters.");
  }

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-2xl p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Live Clusters</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
          Campaign Clusters
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Rule-based coordination clusters built from repeated URLs, hashtags, and narratives.
        </p>
      </section>

      <SectionCard title="Detected Campaigns" subtitle="Live records from Supabase">
        {!campaigns || campaigns.length === 0 ? (
          <p className="text-sm text-slate-400">No campaign clusters detected yet.</p>
        ) : (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="rounded-xl border border-cyan-300/15 bg-slate-900/50 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-100">{campaign.cluster_name}</h3>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge label={campaign.narrative_label ?? "No narrative"} tone="slate" />
                        {campaign.repeated_hashtag ? (
                          <Badge label={campaign.repeated_hashtag} tone="green" />
                        ) : null}
                      </div>

                      <div className="rounded-lg border border-slate-700/40 bg-slate-950/40 p-3">
                        <p className="text-xs uppercase tracking-wider text-slate-500">Repeated URL</p>
                        <p className="mt-1 break-all text-sm text-cyan-200">
                          {campaign.repeated_url ?? "No repeated URL stored."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Coordination Score
                    </p>
                    <p className="mt-1 text-xl font-semibold text-slate-100">
                      {Math.round(campaign.coordination_score)} / 100
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
