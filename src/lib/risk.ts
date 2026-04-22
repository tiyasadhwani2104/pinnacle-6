import { getSupabaseServerClient } from "@/lib/supabase/server";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export function computeFinalRiskScore(
  groqRisk: number | null | undefined,
  hfScore: number | null | undefined,
  coordinationScore: number | null | undefined
) {
  const normalizedGroq = groqRisk ?? 0;
  const normalizedHF = (hfScore ?? 0) * 100;
  const normalizedCoordination = coordinationScore ?? 0;

  const rawScore = 0.45 * normalizedGroq + 0.35 * normalizedHF + 0.2 * normalizedCoordination;

  const score = Math.max(0, Math.min(100, Math.round(rawScore)));

  let level: RiskLevel = "Low";

  if (score >= 85) {
    level = "Critical";
  } else if (score >= 70) {
    level = "High";
  } else if (score >= 40) {
    level = "Medium";
  }

  return { score, level };
}

export async function refreshFinalRiskScore(postId: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("analysis_results")
    .select("groq_risk_score, hf_score, coordination_score")
    .eq("post_id", postId)
    .single();

  if (error) throw error;

  const result = computeFinalRiskScore(data.groq_risk_score, data.hf_score, data.coordination_score);

  const { error: updateError } = await supabase
    .from("analysis_results")
    .update({ final_risk_score: result.score })
    .eq("post_id", postId);

  if (updateError) throw updateError;

  return result;
}
