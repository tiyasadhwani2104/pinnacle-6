import { notFound } from "next/navigation";
import { AnalyzePostButton } from "@/components/analyze-post-button";
import { Badge } from "@/components/badge";
import { RunCoordinationButton } from "@/components/run-coordination-button";
import { RunClassifierButton } from "@/components/run-classifier-button";
import { SectionCard } from "@/components/section-card";
import { formatDateTime, formatScore } from "@/lib/format";
import { getPostById } from "@/lib/posts";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    id: string;
  };
};

function getRiskTone(score: number | null | undefined) {
  if (score == null) return "slate";
  if (score >= 85) return "red";
  if (score >= 70) return "red";
  if (score >= 40) return "cyan";
  return "green";
}

function getRiskLabel(score: number | null | undefined) {
  if (score == null) return "Unknown";
  if (score >= 85) return "Critical";
  if (score >= 70) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export default async function PostDetailPage({ params }: PageProps) {
  try {
    const { post, hashtags, urls } = await getPostById(params.id);
    const hasGroqAnalysis = Boolean(post.analysis_results?.groq_summary);
    const hasClassifierResult = Boolean(post.analysis_results?.hf_label);
    const hasCoordinationScore = Boolean(post.analysis_results?.coordination_score);

    return (
      <div className="space-y-6">
        <section className="glass-panel rounded-2xl p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Post Intelligence View</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">Post Detail</h2>
            </div>
            <p className="text-xs text-slate-400">
              {post.accounts?.handle ?? "Unknown account"} • {formatDateTime(post.created_at)}
            </p>
          </div>

          <p className="mt-4 text-sm text-slate-300">{post.content}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge label={post.source_platform} tone="cyan" />
            <Badge label={post.narrative_label ?? "Unlabeled"} tone="slate" />
            {post.analysis_results?.final_risk_score != null ? (
              <Badge
                label={
                  post.analysis_results.final_risk_score >= 85
                    ? "Critical Risk"
                    : post.analysis_results.final_risk_score >= 70
                      ? "High Risk"
                      : post.analysis_results.final_risk_score >= 40
                        ? "Medium Risk"
                        : "Low Risk"
                }
                tone={
                  post.analysis_results.final_risk_score >= 70
                    ? "red"
                    : post.analysis_results.final_risk_score >= 40
                      ? "cyan"
                      : "green"
                }
              />
            ) : null}
          </div>
        </section>

        <SectionCard title="Action Controls" subtitle="Run analysis modules for this post">
          <div className="grid gap-3 md:grid-cols-3">
            <AnalyzePostButton postId={post.id} hasAnalysis={hasGroqAnalysis} />
            <RunClassifierButton postId={post.id} hasResult={hasClassifierResult} />
            <RunCoordinationButton postId={post.id} hasScore={hasCoordinationScore} />
          </div>
        </SectionCard>

        <SectionCard title="Groq Analysis" subtitle="AI-generated summary and risk assessment">
          {post.analysis_results ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Final Risk</p>
                <p className="mt-1 text-xl font-semibold text-slate-100">
                  {formatScore(post.analysis_results.final_risk_score)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Groq Risk</p>
                <p className="mt-1 text-sm text-slate-200">
                  {formatScore(post.analysis_results.groq_risk_score)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Risk Level</p>
                <div className="mt-1">
                  <Badge
                    label={getRiskLabel(post.analysis_results?.final_risk_score ?? null)}
                    tone={getRiskTone(post.analysis_results?.final_risk_score ?? null)}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-slate-500">Summary</p>
                <p className="mt-1 text-sm text-slate-200">
                  {post.analysis_results.groq_summary ?? "No summary available."}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-slate-500">Explanation</p>
                <p className="mt-1 text-sm text-slate-200">
                  {post.analysis_results.explanation ?? "No explanation available."}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No Groq analysis found yet. Run the analysis button to generate it.
            </p>
          )}
        </SectionCard>

        <SectionCard
          title="Classification Layer"
          subtitle="Fallback classifier now, Hugging Face-ready structure for later"
        >
          {post.analysis_results?.hf_label ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Label</p>
                <p className="mt-1 text-sm text-slate-100">{post.analysis_results.hf_label}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500">Score</p>
                <p className="mt-1 text-sm text-slate-100">
                  {post.analysis_results.hf_score?.toFixed(4) ?? "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">
              No classifier result found yet. Run the classifier button to generate it.
            </p>
          )}
        </SectionCard>

        <SectionCard
          title="Coordination Analysis"
          subtitle="Rule-based coordination detection using shared URLs, hashtags, and narrative reuse"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Coordination Score</p>
              <p className="mt-1 text-xl font-semibold text-slate-100">
                {post.analysis_results?.coordination_score != null
                  ? `${Math.round(post.analysis_results.coordination_score)} / 100`
                  : "Not analyzed"}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Current Narrative</p>
              <p className="mt-1 text-sm text-slate-200">
                {post.narrative_label ?? "No narrative label"}
              </p>
            </div>
          </div>
        </SectionCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard title="Hashtags" subtitle="Linked tags for this post">
            {hashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                  <Badge key={tag} label={tag} tone="green" />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No hashtags linked.</p>
            )}
          </SectionCard>

          <SectionCard title="URLs" subtitle="Linked URLs for this post">
            {urls.length > 0 ? (
              <div className="space-y-2">
                {urls.map((url) => (
                  <p key={url} className="break-all text-sm text-cyan-200">
                    {url}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No URLs linked.</p>
            )}
          </SectionCard>
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}
