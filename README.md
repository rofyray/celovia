# Celovia

A digital "Be My Valentine" invitation experience. Create beautiful, AI-personalized invitations and share them with a unique animated link.

## Features

- **4 Templates** — Classic, Bold, Playful, Minimal
- **AI-Written Messages** — GPT-5 nano crafts poetic, personalized invitation text from your shared memories
- **AI-Generated Art** — OpenAI gpt-image-1.5 creates unique visual art for each invitation
- **Animated Reveal** — Recipients open an animated envelope to discover their invitation
- **One-Tap RSVP** — Heart button with celebration animation

## Quick Start

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Setup

Create `.env.local`:

```
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Database Setup

Create an `invitations` table in Supabase — see `PRD.md` for the full SQL schema.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS 4** + Framer Motion
- **GPT-5 nano** (text) + **gpt-image-1.5** (image)
- **Supabase** (PostgreSQL)
- **Zod** (validation)

## Deploy

Push to GitHub and connect to [Vercel](https://vercel.com) for zero-config deployment.
