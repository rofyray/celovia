# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Running the App

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type-check
pnpm typecheck
```

## Post-Implementation Verification

After completing any code changes, **always** run both commands to catch errors early:

```bash
pnpm lint
pnpm typecheck
```

There are no tests configured. Linting is available via `pnpm lint` and type-checking via `pnpm typecheck`.

## Environment Variables

Required in `.env.local`:
- `OPENAI_API_KEY` — OpenAI API key (used for GPT-5 nano message generation)
- `GOOGLE_AI_API_KEY` — Google AI API key (used for Gemini 2.5 Flash image generation)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key (server-side only)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key (client-side)
- `NEXT_PUBLIC_BASE_URL` — Public URL for shareable links (defaults to `http://localhost:3000`)

## Architecture

**Celovia** is a Next.js 15 (App Router) application that creates AI-personalized Valentine's Day invitations. Two user flows:

- **Creator flow** (`/create`): Multi-step form (template → details → style → AI-generated preview → shareable link). Saves to Supabase.
- **Recipient flow** (`/v/[token]`): Animated envelope opens to reveal personalized invitation with RSVP button.

### Key directories

```
src/
  app/              # Next.js App Router pages and API routes
  components/
    create/          # Creator flow step components
    recipient/       # Recipient flow components (envelope, card, celebration)
    ui/              # Shared UI components
  lib/
    genai.ts         # Google GenAI (Gemini) client
    openai.ts        # OpenAI client
    supabase.ts      # Supabase client (server + browser)
    schemas.ts       # Zod validation schemas
    templates.ts     # Template definitions (classic, bold, playful, minimal)
  types/
    index.ts         # TypeScript types
```

### AI Integration

- **Message generation**: GPT-5 nano with structured JSON output via `/api/generate-message`
- **Image generation**: Gemini 2.5 Flash via `/api/generate-image`, returns base64 data URL

### Database

Supabase (PostgreSQL) with a single `invitations` table. See `PRD.md` for full schema.

### API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/generate-message` | POST | AI message generation |
| `/api/generate-image` | POST | AI image generation |
| `/api/invitations` | POST | Save invitation |
| `/api/invitations/[token]` | GET | Fetch invitation by token |
| `/api/invitations/[token]/rsvp` | POST | Record RSVP |
