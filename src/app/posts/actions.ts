"use server";

import { redirect } from "next/navigation";
import { analyzePostWithClassifier } from "@/lib/classifier";
import { analyzeCoordination } from "@/lib/coordination";
import { analyzePostWithGroq } from "@/lib/groq";

export type AnalyzePostState = {
  error?: string;
};

export async function runGroqAnalysis(
  _prevState: AnalyzePostState,
  formData: FormData
): Promise<AnalyzePostState> {
  const postId = String(formData.get("postId") ?? "").trim();

  if (!postId) {
    return { error: "Missing post id." };
  }

  try {
    await analyzePostWithGroq(postId);
  } catch (error) {
    console.error(error);
    return { error: "Groq analysis failed. Check GROQ_API_KEY and try again." };
  }

  redirect(`/posts/${postId}`);
}

export async function runFallbackClassification(
  _prevState: AnalyzePostState,
  formData: FormData
): Promise<AnalyzePostState> {
  const postId = String(formData.get("postId") ?? "").trim();

  if (!postId) {
    return { error: "Missing post id." };
  }

  try {
    await analyzePostWithClassifier(postId);
  } catch (error) {
    console.error(error);
    return {
      error: "Fallback classification failed. Please try again.",
    };
  }

  redirect(`/posts/${postId}`);
}

export async function runCoordinationAnalysis(
  _prevState: AnalyzePostState,
  formData: FormData
): Promise<AnalyzePostState> {
  const postId = String(formData.get("postId") ?? "").trim();

  if (!postId) {
    return { error: "Missing post id." };
  }

  try {
    await analyzeCoordination(postId);
  } catch (error) {
    console.error(error);
    return {
      error: "Coordination analysis failed. Please try again.",
    };
  }

  redirect(`/posts/${postId}`);
}
