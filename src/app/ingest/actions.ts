"use server";

import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  ensureHashtagIds,
  ensureUrlIds,
  findOrCreateAccount,
  linkPostHashtags,
  linkPostUrls,
  normalizeHashtags,
  normalizeUrls,
} from "@/lib/ingest";

export type IngestFormState = {
  error?: string;
};

export async function submitIngest(
  _prevState: IngestFormState,
  formData: FormData
): Promise<IngestFormState> {
  const platform = String(formData.get("platform") ?? "").trim();
  const handle = String(formData.get("handle") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const narrativeLabel = String(formData.get("narrativeLabel") ?? "").trim();
  const hashtagsInput = String(formData.get("hashtags") ?? "").trim();
  const urlsInput = String(formData.get("urls") ?? "").trim();

  if (!platform || !handle || !content) {
    return {
      error: "Platform, account handle, and suspicious content are required.",
    };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return {
      error: "Supabase environment variables are missing on the server.",
    };
  }

  try {
    const accountId = await findOrCreateAccount(platform, handle);
    const supabase = getSupabaseServerClient();

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        account_id: accountId,
        source_platform: platform,
        content,
        narrative_label: narrativeLabel || null,
      })
      .select("id")
      .single();

    if (postError) throw postError;

    const hashtags = normalizeHashtags(hashtagsInput);
    const urls = normalizeUrls(urlsInput);

    const hashtagIds = await ensureHashtagIds(hashtags);
    const urlIds = await ensureUrlIds(urls);

    await linkPostHashtags(post.id, hashtagIds);
    await linkPostUrls(post.id, urlIds);

    redirect(`/posts/${post.id}`);
  } catch (error) {
    console.error(error);

    return {
      error: "Failed to save the post. Please check your values and try again.",
    };
  }
}
