# Aegis-LLM

Cloud-based threat intelligence dashboard focused on AI-assisted phishing, propaganda, disinformation, and hostile influence operations.

## Project Phases (1 to 10)

- **Phase 1 - Frontend Shell:** Next.js app shell, sidebar/topbar, placeholder pages, cyber theme.
- **Phase 2 - Database Setup:** Supabase schema + seed data for posts, analysis, campaigns, audit chain.
- **Phase 3 - Live Data Wiring:** Supabase-connected dashboard and posts/detail pages with real data.
- **Phase 4 - Ingest Flow:** Manual ingest form with server action and relational inserts.
- **Phase 5 - Groq Analysis:** Run Groq analysis per post and persist Groq outputs.
- **Phase 6 - Fallback Classifier:** Lightweight classifier layer (HF-compatible structure, no paid endpoint required).
- **Phase 7 - Final Risk Scoring:** Weighted final score and risk levels (Low/Medium/High/Critical).
- **Phase 8 - Coordination Detection:** SQL-based coordination scoring + campaign cluster updates.
- **Phase 9 - Audit Integrity Foundations:** Audit chain support and event visibility foundation.
- **Phase 10 - UI Polish:** Demo-ready dashboard/pages with improved hierarchy, spacing, and consistency.

## Phase 1 Scope

- Next.js 14 App Router frontend
- Responsive dashboard shell (sidebar + topbar)
- Placeholder pages:
  - `/`
  - `/ingest`
  - `/posts`
  - `/campaigns`
  - `/audit`
- Static placeholder UI only (no backend, no auth, no database, no API integrations)

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
copy .env.example .env.local
```

3. Start development server:

```bash
npm run dev
```

4. Open:

[http://localhost:3000](http://localhost:3000)

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Notes

- This phase intentionally uses static dummy data.
- No Supabase/Groq/Hugging Face integration is included yet.

## Phase 2 Database Setup

- Run `supabase/schema.sql` first.
- Run `supabase/seed.sql` second.
- Use the Supabase SQL Editor.
