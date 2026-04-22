"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitIngest, type IngestFormState } from "@/app/ingest/actions";

const initialState: IngestFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-cyan-300/30 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/25 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Saving..." : "Submit Post"}
    </button>
  );
}

export function IngestForm() {
  const [state, formAction] = useFormState(submitIngest, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="platform" className="mb-2 block text-sm font-medium text-slate-200">
            Source Platform
          </label>
          <input
            id="platform"
            name="platform"
            placeholder="e.g. X, Telegram, Email"
            className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            required
          />
        </div>

        <div>
          <label htmlFor="handle" className="mb-2 block text-sm font-medium text-slate-200">
            Account Handle
          </label>
          <input
            id="handle"
            name="handle"
            placeholder="e.g. @alpha_watch"
            className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="content" className="mb-2 block text-sm font-medium text-slate-200">
          Suspicious Content
        </label>
        <textarea
          id="content"
          name="content"
          rows={6}
          placeholder="Paste suspicious text here..."
          className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="narrativeLabel"
          className="mb-2 block text-sm font-medium text-slate-200"
        >
          Narrative Label
        </label>
        <input
          id="narrativeLabel"
          name="narrativeLabel"
          placeholder="e.g. credential-phishing"
          className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="hashtags" className="mb-2 block text-sm font-medium text-slate-200">
            Hashtags
          </label>
          <input
            id="hashtags"
            name="hashtags"
            placeholder="#urgent, #verifyNow"
            className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>

        <div>
          <label htmlFor="urls" className="mb-2 block text-sm font-medium text-slate-200">
            URLs
          </label>
          <input
            id="urls"
            name="urls"
            placeholder="https://example.com, https://example2.com"
            className="w-full rounded-xl border border-cyan-300/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {state.error ? (
        <div className="rounded-xl border border-rose-300/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {state.error}
        </div>
      ) : null}

      <div className="flex items-center justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
