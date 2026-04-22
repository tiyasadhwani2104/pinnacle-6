import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { DashboardStat } from "@/lib/types";

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const supabase = getSupabaseServerClient();

  const [
    { count: totalPosts, error: postsError },
    { count: highRiskAlerts, error: alertsError },
    { data: averageRiskRows, error: averageError },
    { count: activeCampaigns, error: campaignsError },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase
      .from("analysis_results")
      .select("*", { count: "exact", head: true })
      .gte("final_risk_score", 70),
    supabase.from("analysis_results").select("final_risk_score"),
    supabase.from("campaign_clusters").select("*", { count: "exact", head: true }),
  ]);

  if (postsError) throw postsError;
  if (alertsError) throw alertsError;
  if (averageError) throw averageError;
  if (campaignsError) throw campaignsError;

  const validScores =
    averageRiskRows
      ?.map((row) => row.final_risk_score)
      .filter((score): score is number => typeof score === "number") ?? [];

  const averageRisk =
    validScores.length > 0
      ? (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(1)
      : "0.0";

  return [
    { title: "Total analyzed posts", value: String(totalPosts ?? 0) },
    { title: "High-risk alerts", value: String(highRiskAlerts ?? 0) },
    { title: "Average risk score", value: averageRisk },
    { title: "Active campaigns", value: String(activeCampaigns ?? 0) },
  ];
}
