"use client";

import { useFormState, useFormStatus } from "react-dom";
import { runGroqAnalysis, type AnalyzePostState } from "@/app/posts/actions";

const initialState: AnalyzePostState = {};

function SubmitButton({ hasAnalysis }: { hasAnalysis: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-cyan-300/30 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Analyzing..." : hasAnalysis ? "Re-run Groq Analysis" : "Run Groq Analysis"}
    </button>
  );
}

export function AnalyzePostButton({
  postId,
  hasAnalysis,
}: {
  postId: string;
  hasAnalysis: boolean;
}) {
  const [state, formAction] = useFormState(runGroqAnalysis, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      <SubmitButton hasAnalysis={hasAnalysis} />
      {state.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
    </form>
  );
}
