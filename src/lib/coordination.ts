import { getSupabaseServerClient } from "@/lib/supabase/server";
import { refreshFinalRiskScore } from "@/lib/risk";

type CoordinationResult = {
  coordinationScore: number;
  repeatedUrl: string | null;
  repeatedHashtag: string | null;
  repeatedNarrative: string | null;
};

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type UrlRow = {
  url_id: string;
  urls: { url: string } | { url: string }[] | null;
};

type HashtagRow = {
  hashtag_id: string;
  hashtags: { tag: string } | { tag: string }[] | null;
};

export async function analyzeCoordination(postId: string): Promise<CoordinationResult> {
  const supabase = getSupabaseServerClient();

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("id, narrative_label, created_at")
    .eq("id", postId)
    .single();

  if (postError) throw postError;

  const { data: postUrlsRaw, error: urlsError } = await supabase
    .from("post_urls")
    .select("url_id, urls(url)")
    .eq("post_id", postId);

  if (urlsError) throw urlsError;

  const { data: postHashtagsRaw, error: hashtagsError } = await supabase
    .from("post_hashtags")
    .select("hashtag_id, hashtags(tag)")
    .eq("post_id", postId);

  if (hashtagsError) throw hashtagsError;

  const postUrls = (postUrlsRaw ?? []) as unknown as UrlRow[];
  const postHashtags = (postHashtagsRaw ?? []) as unknown as HashtagRow[];

  let repeatedUrlCount = 0;
  let repeatedHashtagCount = 0;
  let repeatedNarrativeCount = 0;

  let repeatedUrl: string | null = null;
  let repeatedHashtag: string | null = null;

  for (const row of postUrls) {
    const { count } = await supabase
      .from("post_urls")
      .select("*", { count: "exact", head: true })
      .eq("url_id", row.url_id);

    if ((count ?? 0) > repeatedUrlCount) {
      repeatedUrlCount = count ?? 0;
      repeatedUrl = pickOne(row.urls)?.url ?? null;
    }
  }

  for (const row of postHashtags) {
    const { count } = await supabase
      .from("post_hashtags")
      .select("*", { count: "exact", head: true })
      .eq("hashtag_id", row.hashtag_id);

    if ((count ?? 0) > repeatedHashtagCount) {
      repeatedHashtagCount = count ?? 0;
      repeatedHashtag = pickOne(row.hashtags)?.tag ?? null;
    }
  }

  if (post.narrative_label) {
    const { count } = await supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("narrative_label", post.narrative_label);

    repeatedNarrativeCount = count ?? 0;
  }

  const coordinationScore = clampScore(
    Math.max(0, repeatedUrlCount - 1) * 18 +
      Math.max(0, repeatedHashtagCount - 1) * 12 +
      Math.max(0, repeatedNarrativeCount - 1) * 10
  );

  const { error: upsertError } = await supabase.from("analysis_results").upsert(
    {
      post_id: postId,
      coordination_score: coordinationScore,
    },
    { onConflict: "post_id" }
  );

  if (upsertError) throw upsertError;

  if (coordinationScore > 0) {
    const clusterName = post.narrative_label
      ? `Cluster - ${post.narrative_label}`
      : repeatedUrl
        ? `Cluster - ${repeatedUrl}`
        : "Cluster - suspicious-coordination";

    const { error: clusterError } = await supabase.from("campaign_clusters").upsert(
      {
        cluster_name: clusterName,
        narrative_label: post.narrative_label,
        repeated_url: repeatedUrl,
        repeated_hashtag: repeatedHashtag,
        coordination_score: coordinationScore,
      },
      { onConflict: "cluster_name" }
    );

    if (clusterError) throw clusterError;
  }

  await refreshFinalRiskScore(postId);

  return {
    coordinationScore,
    repeatedUrl,
    repeatedHashtag,
    repeatedNarrative: post.narrative_label,
  };
}
