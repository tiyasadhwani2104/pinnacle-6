"use client";

import { useFormState, useFormStatus } from "react-dom";
import { runFallbackClassification, type AnalyzePostState } from "@/app/posts/actions";

const initialState: AnalyzePostState = {};

function SubmitButton({ hasResult }: { hasResult: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Classifying..." : hasResult ? "Re-run Classifier" : "Run Classifier"}
    </button>
  );
}

export function RunClassifierButton({
  postId,
  hasResult,
}: {
  postId: string;
  hasResult: boolean;
}) {
  const [state, formAction] = useFormState(runFallbackClassification, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      <SubmitButton hasResult={hasResult} />
      {state.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
    </form>
  );
}
