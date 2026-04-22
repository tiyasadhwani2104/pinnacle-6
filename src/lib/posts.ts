import { getSupabaseServerClient } from "@/lib/supabase/server";
import type { PostDetail, PostListItem } from "@/lib/types";

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type RawPostListRow = Omit<PostListItem, "accounts" | "analysis_results"> & {
  accounts: NonNullable<PostListItem["accounts"]>[] | NonNullable<PostListItem["accounts"]> | null;
  analysis_results:
    | { final_risk_score: number | null }[]
    | { final_risk_score: number | null }
    | null;
};

type RawPostDetail = Omit<PostDetail, "accounts" | "analysis_results"> & {
  accounts: NonNullable<PostDetail["accounts"]>[] | NonNullable<PostDetail["accounts"]> | null;
  analysis_results:
    | NonNullable<PostDetail["analysis_results"]>[]
    | NonNullable<PostDetail["analysis_results"]>
    | null;
};

type RawPostHashtagRow = {
  hashtags: { tag: string }[] | { tag: string } | null;
};

type RawPostUrlRow = {
  urls: { url: string }[] | { url: string } | null;
};

export async function getPosts() {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id,
        source_platform,
        content,
        narrative_label,
        created_at,
        accounts (
          handle,
          platform
        ),
        analysis_results (
          final_risk_score
        )
      `
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as RawPostListRow[]).map((row) => ({
    ...row,
    accounts: pickOne(row.accounts),
    analysis_results: pickOne(row.analysis_results),
  }));
}

export async function getPostById(id: string) {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        id,
        source_platform,
        content,
        narrative_label,
        created_at,
        accounts (
          handle,
          platform
        ),
        analysis_results (
          groq_summary,
          groq_risk_score,
          hf_label,
          hf_score,
          coordination_score,
          final_risk_score,
          explanation
        )
      `
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const { data: hashtags, error: hashtagsError } = await supabase
    .from("post_hashtags")
    .select(
      `
        hashtags (
          tag
        )
      `
    )
    .eq("post_id", id);

  if (hashtagsError) throw hashtagsError;

  const { data: urls, error: urlsError } = await supabase
    .from("post_urls")
    .select(
      `
        urls (
          url
        )
      `
    )
    .eq("post_id", id);

  if (urlsError) throw urlsError;

  const rawPost = data as unknown as RawPostDetail;

  return {
    post: {
      ...rawPost,
      accounts: pickOne(rawPost.accounts),
      analysis_results: pickOne(rawPost.analysis_results),
    },
    hashtags: ((hashtags ?? []) as unknown as RawPostHashtagRow[])
      .map((row) => pickOne(row.hashtags)?.tag)
      .filter(Boolean) as string[],
    urls: ((urls ?? []) as unknown as RawPostUrlRow[])
      .map((row) => pickOne(row.urls)?.url)
      .filter(Boolean) as string[],
  };
}
