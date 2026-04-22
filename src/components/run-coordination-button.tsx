"use client";

import { useFormState, useFormStatus } from "react-dom";
import { runCoordinationAnalysis, type AnalyzePostState } from "@/app/posts/actions";

const initialState: AnalyzePostState = {};

function SubmitButton({ hasScore }: { hasScore: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-amber-300/30 bg-amber-500/15 px-4 py-2 text-sm font-medium text-amber-100 transition hover:bg-amber-500/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Analyzing..." : hasScore ? "Re-run Coordination" : "Run Coordination"}
    </button>
  );
}

export function RunCoordinationButton({
  postId,
  hasScore,
}: {
  postId: string;
  hasScore: boolean;
}) {
  const [state, formAction] = useFormState(runCoordinationAnalysis, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="postId" value={postId} />
      <SubmitButton hasScore={hasScore} />
      {state.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
    </form>
  );
}
