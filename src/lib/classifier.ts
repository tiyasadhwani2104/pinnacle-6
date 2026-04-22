import { getSupabaseServerClient } from "@/lib/supabase/server";
import { refreshFinalRiskScore } from "@/lib/risk";

type ClassificationResult = {
  label: "phishing" | "disinformation" | "propaganda" | "manipulation" | "benign";
  score: number;
};

function clampProbability(value: number) {
  return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}

function classifyWithFallback(content: string): ClassificationResult {
  const text = content.toLowerCase();

  const phishingSignals = [
    "verify your account",
    "login",
    "log in",
    "password",
    "urgent",
    "click here",
    "confirm identity",
    "secure access",
    "account suspended",
    "expire",
  ];

  const disinfoSignals = [
    "secretly",
    "mainstream channels",
    "hidden memo",
    "official channels cannot be trusted",
    "share this before",
    "rumor",
    "unverified",
  ];

  const propagandaSignals = [
    "traitors",
    "enemy",
    "patriots",
    "betrayed",
    "take back",
    "they are lying",
  ];

  const manipulationSignals = [
    "act now",
    "before it is removed",
    "they do not want you to know",
    "spread this immediately",
    "only this channel",
  ];

  const countMatches = (signals: string[]) =>
    signals.reduce((count, signal) => count + (text.includes(signal) ? 1 : 0), 0);

  const phishing = countMatches(phishingSignals);
  const disinformation = countMatches(disinfoSignals);
  const propaganda = countMatches(propagandaSignals);
  const manipulation = countMatches(manipulationSignals);

  const candidates = [
    { label: "phishing" as const, value: phishing },
    { label: "disinformation" as const, value: disinformation },
    { label: "propaganda" as const, value: propaganda },
    { label: "manipulation" as const, value: manipulation },
  ].sort((a, b) => b.value - a.value);

  const top = candidates[0];

  if (!top || top.value === 0) {
    return {
      label: "benign",
      score: 0.2,
    };
  }

  const score = clampProbability(0.45 + top.value * 0.12);

  return {
    label: top.label,
    score,
  };
}

export async function analyzePostWithClassifier(postId: string) {
  const supabase = getSupabaseServerClient();

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, content")
    .eq("id", postId)
    .single();

  if (postError) throw postError;

  const result = classifyWithFallback(post.content);

  const { error: upsertError } = await supabase.from("analysis_results").upsert(
    {
      post_id: postId,
      hf_label: result.label,
      hf_score: result.score,
    },
    { onConflict: "post_id" }
  );

  if (upsertError) throw upsertError;
  await refreshFinalRiskScore(postId);

  return result;
}
