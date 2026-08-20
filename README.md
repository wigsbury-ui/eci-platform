# Ellesmere College International (ECI) Platform

Next.js 16 + Supabase platform for the ECI public site and password-controlled portals.

## What is included

- **Public site** — partner-facing homepage (network, partnership models, markets, services, contact)
- **`/growth`** — investors, agents and rainmakers conversion page (`/investors` and `/agents` redirect here)
- **Investor portal** — opportunity, markets, documents, next steps
- **Agent portal** — briefing, toolkit, referrals
- **School portal** — documents, calendar, messaging
- **Team / super-admin portal** (`/team`) — schools, people, documents, calendar, messaging, pipeline, settings
- **First-party chatbot** — `/api/chat` RAG over in-repo knowledge; optional self-hosted `LLM_BASE_URL`

## Setup

```bash
npm install
cp .env.example .env.local   # after creating the example file
npm run dev
```

### Environment

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
LLM_BASE_URL=          # optional OpenAI-compatible self-hosted endpoint
LLM_API_KEY=           # optional
LLM_MODEL=             # optional
```

Without Supabase env vars, public pages work and portals open in **preview mode** with demo data.

Apply SQL in [`supabase/migrations/001_foundation.sql`](supabase/migrations/001_foundation.sql) in your Supabase project.

## Branding

Public imagery includes assets from [ellesmere.com](https://www.ellesmere.com) / Finalsite CDN and [ellesmerecollegeriyadh.com](https://ellesmerecollegeriyadh.com), plus generated campus visuals for Middle East expansion storytelling. Crest used from the Riyadh site brand pack.
