import { getSupabaseServerClient } from "@/lib/supabase/server";
import { refreshFinalRiskScore } from "@/lib/risk";
import type { GroqAnalysis } from "@/lib/types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-20b";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

type RawPost = {
  id: string;
  content: string;
  source_platform: string;
  narrative_label: string | null;
  accounts: { handle: string; platform: string }[] | { handle: string; platform: string } | null;
};

export async function analyzePostWithGroq(postId: string) {
  const supabase = getSupabaseServerClient();

  const { data: postRaw, error: postError } = await supabase
    .from("posts")
    .select(
      `
        id,
        content,
        source_platform,
        narrative_label,
        accounts (
          handle,
          platform
        )
      `
    )
    .eq("id", postId)
    .single();

  if (postError) throw postError;
  if (!process.env.GROQ_API_KEY) {
    throw new Error("Missing GROQ_API_KEY.");
  }

  const post = postRaw as unknown as RawPost;
  const account = pickOne(post.accounts);

  const systemPrompt = `
You are a national-security content risk analyst for a student demo system called Aegis-LLM.

Classify the submitted text for possible malicious AI-assisted influence or phishing risk.
Return only structured data.
Be cautious, realistic, and do not overclaim.
Score each category from 0 to 100.
Set narrative_label to a short kebab-case label.
Set risk_score from 0 to 100.
extracted_entities should be a short array of notable entities, themes, or targets mentioned in the text.
`;

  const response = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: JSON.stringify({
            post_id: post.id,
            source_platform: post.source_platform,
            account_handle: account?.handle ?? "unknown",
            current_narrative_label: post.narrative_label,
            content: post.content,
          }),
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "aegis_llm_analysis",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              category_scores: {
                type: "object",
                additionalProperties: false,
                properties: {
                  phishing: { type: "number" },
                  propaganda: { type: "number" },
                  extremist_content: { type: "number" },
                  disinformation: { type: "number" },
                  manipulation: { type: "number" },
                },
                required: [
                  "phishing",
                  "propaganda",
                  "extremist_content",
                  "disinformation",
                  "manipulation",
                ],
              },
              narrative_label: { type: "string" },
              explanation: { type: "string" },
              risk_score: { type: "number" },
              extracted_entities: {
                type: "array",
                items: { type: "string" },
              },
            },
            required: [
              "summary",
              "category_scores",
              "narrative_label",
              "explanation",
              "risk_score",
              "extracted_entities",
            ],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq request failed: ${response.status} ${errorText}`);
  }

  const payload = await response.json();
  const content = payload?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq returned an empty response.");
  }

  const analysis = JSON.parse(content) as GroqAnalysis;
  const groqRisk = clampScore(analysis.risk_score);

  const { error: upsertError } = await supabase.from("analysis_results").upsert(
    {
      post_id: postId,
      groq_summary: analysis.summary,
      groq_risk_score: groqRisk,
      explanation: analysis.explanation,
    },
    { onConflict: "post_id" }
  );

  if (upsertError) throw upsertError;
  await refreshFinalRiskScore(postId);

  const { error: postUpdateError } = await supabase
    .from("posts")
    .update({ narrative_label: analysis.narrative_label || post.narrative_label })
    .eq("id", postId);

  if (postUpdateError) throw postUpdateError;

  return analysis;
}
