# Ellesmere College International (ECI) Platform

Next.js 16 + Supabase platform for the ECI public site and password-controlled portals.

## What is included

- **Public site**, homepage, `/schools`, `/investors`, `/agents`
- **`/growth`**, redirects to `/investors`
- **Investor / agent / school / team portals**, password-controlled workspaces

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
SUPABASE_SERVICE_ROLE_KEY=   # required for document intake + draft generation
ANTHROPIC_API_KEY=           # required for Generate draft
LLM_MODEL=claude-sonnet-4-6  # optional; do not use retired claude-sonnet-4-20250514
LLM_BASE_URL=                # optional OpenAI-compatible self-hosted endpoint
```

Without Supabase env vars, public pages work and portals open in **preview mode** with demo data.

Apply SQL in [`supabase/migrations/001_foundation.sql`](supabase/migrations/001_foundation.sql) in your Supabase project.

## Branding

Public imagery includes assets from [ellesmere.com](https://www.ellesmere.com) / Finalsite CDN and [ellesmerecollegeriyadh.com](https://ellesmerecollegeriyadh.com), plus generated campus visuals for Middle East expansion storytelling. Crest used from the Riyadh site brand pack.
