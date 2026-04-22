import { getSupabaseServerClient } from "@/lib/supabase/server";

function normalizeCommaSeparated(input: string) {
  return Array.from(
    new Set(
      input
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  );
}

export function normalizeHashtags(input: string) {
  return normalizeCommaSeparated(input).map((tag) =>
    tag.startsWith("#") ? tag : `#${tag}`
  );
}

export function normalizeUrls(input: string) {
  return normalizeCommaSeparated(input);
}

export async function findOrCreateAccount(platform: string, handle: string) {
  const supabase = getSupabaseServerClient();

  const { data: existing, error: existingError } = await supabase
    .from("accounts")
    .select("id")
    .eq("platform", platform)
    .eq("handle", handle)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing.id;

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      platform,
      handle,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function ensureHashtagIds(tags: string[]) {
  const supabase = getSupabaseServerClient();

  const ids: string[] = [];

  for (const tag of tags) {
    const { data: existing, error: existingError } = await supabase
      .from("hashtags")
      .select("id")
      .eq("tag", tag)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    const { data, error } = await supabase
      .from("hashtags")
      .insert({ tag })
      .select("id")
      .single();

    if (error) throw error;
    ids.push(data.id);
  }

  return ids;
}

export async function ensureUrlIds(urls: string[]) {
  const supabase = getSupabaseServerClient();

  const ids: string[] = [];

  for (const url of urls) {
    const { data: existing, error: existingError } = await supabase
      .from("urls")
      .select("id")
      .eq("url", url)
      .maybeSingle();

    if (existingError) throw existingError;

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    const { data, error } = await supabase
      .from("urls")
      .insert({ url })
      .select("id")
      .single();

    if (error) throw error;
    ids.push(data.id);
  }

  return ids;
}

export async function linkPostHashtags(postId: string, hashtagIds: string[]) {
  if (hashtagIds.length === 0) return;

  const supabase = getSupabaseServerClient();

  const rows = hashtagIds.map((hashtagId) => ({
    post_id: postId,
    hashtag_id: hashtagId,
  }));

  const { error } = await supabase.from("post_hashtags").insert(rows);

  if (error) throw error;
}

export async function linkPostUrls(postId: string, urlIds: string[]) {
  if (urlIds.length === 0) return;

  const supabase = getSupabaseServerClient();

  const rows = urlIds.map((urlId) => ({
    post_id: postId,
    url_id: urlId,
  }));

  const { error } = await supabase.from("post_urls").insert(rows);

  if (error) throw error;
}
