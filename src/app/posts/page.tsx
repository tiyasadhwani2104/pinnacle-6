import Link from "next/link";
import { Badge } from "@/components/badge";
import { SectionCard } from "@/components/section-card";
import { formatDateTime, formatScore, truncateText } from "@/lib/format";
import { getPosts } from "@/lib/posts";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-2xl p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Live Monitoring</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
          Analyzed Posts
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Real posts and linked risk signals loaded from Supabase.
        </p>
      </section>

      <SectionCard title="Posts Feed" subtitle="Latest monitored items in the database">
        {posts.length === 0 ? (
          <p className="text-sm text-slate-400">No posts found yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => {
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
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge label={post.source_platform} tone="cyan" />
                        <Badge label={post.narrative_label ?? "Unlabeled"} tone="slate" />
                      </div>
                      <p className="text-sm text-slate-200">{truncateText(post.content)}</p>
                      <p className="text-xs text-slate-400">
                        {post.accounts?.handle ?? "Unknown account"} •{" "}
                        {formatDateTime(post.created_at)}
                      </p>
                    </div>

                    <div className="min-w-40 space-y-2">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-slate-500">
                          Final Risk
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-100">
                          {formatScore(analysis?.final_risk_score ?? null)}
                        </p>
                      </div>

                      <Badge
                        label={
                          analysis?.final_risk_score == null
                            ? "Unknown"
                            : analysis.final_risk_score >= 85
                              ? "Critical"
                              : analysis.final_risk_score >= 70
                                ? "High"
                                : analysis.final_risk_score >= 40
                                  ? "Medium"
                                  : "Low"
                        }
                        tone={
                          analysis?.final_risk_score == null
                            ? "slate"
                            : analysis.final_risk_score >= 70
                              ? "red"
                              : analysis.final_risk_score >= 40
                                ? "cyan"
                                : "green"
                        }
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </SectionCard>
    </div>
  );
}
