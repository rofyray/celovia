# Celovia — Product Requirements Document

> A digital "Be My Valentine" invitation experience. Create beautiful, AI-personalized invitations and share them with a unique link.

---

## Overview

Celovia lets anyone create a personalized Valentine's invitation in minutes. The creator fills in memories, picks a template, and AI generates a poetic message and custom image. The recipient opens an animated envelope, reads the invitation, and RSVPs — all from a single shareable link.

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 (App Router) + TypeScript | SSR/SSG, Vercel-native |
| **Styling** | Tailwind CSS 4 + Framer Motion | Rapid styling, animation |
| **AI Text** | GPT-5 nano (`gpt-5-nano`) | Structured output, cheap |
| **AI Image** | Gemini 2.5 Flash (`gemini-2.5-flash-image`) | Free tier, fast |
| **Database** | Supabase (PostgreSQL) | Free tier, RLS, Vercel integration |
| **ORM** | `@supabase/supabase-js` | Type-safe, SSR-friendly |
| **Validation** | Zod | TypeScript-native schemas |
| **Deployment** | Vercel | Zero-config Next.js hosting |
| **Package Manager** | pnpm | Fast, disk-efficient |

---

## Environment Variables (`.env.local`)

```
OPENAI_API_KEY=               # GPT-5 nano
GOOGLE_AI_API_KEY=            # Gemini 2.5 Flash
NEXT_PUBLIC_SUPABASE_URL=     # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=    # Supabase service role (server-side)
NEXT_PUBLIC_SUPABASE_ANON_KEY=# Supabase anon key (client-side)
NEXT_PUBLIC_BASE_URL=         # Public URL for shareable links
```

---

## Database Schema

```sql
CREATE TABLE invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  template_id TEXT NOT NULL DEFAULT 'classic',
  memories JSONB NOT NULL,
  hints TEXT,
  style_config JSONB DEFAULT '{}',
  generated_message TEXT,
  generated_image_url TEXT,
  access_token TEXT UNIQUE NOT NULL,
  rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'accepted', 'declined')),
  rsvp_message TEXT,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON invitations(access_token);

CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_invitation ON analytics_events(invitation_id) WHERE invitation_id IS NOT NULL;
```

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page — hero, value prop, CTA |
| `/create` | Multi-step invitation builder |
| `/v/[token]` | Recipient — animated reveal + RSVP |
| `/v/[token]/accepted` | Post-RSVP celebration |

---

## API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/generate-message` | POST | GPT-5 nano → poetic invitation text |
| `/api/generate-image` | POST | Gemini → invitation visual |
| `/api/invitations` | POST | Save invitation, return token |
| `/api/invitations/[token]` | GET | Fetch invitation by token |
| `/api/invitations/[token]/rsvp` | POST | Record RSVP |

---

## AI Integration

### GPT-5 nano — Message Generation
- Model: `gpt-5-nano`
- Structured output with JSON schema
- Output shape:
  ```json
  {
    "message": "2-4 paragraph poetic invitation",
    "tagline": "Short romantic tagline",
    "storyArc": "Brief narrative summary"
  }
  ```
- Tone: warm, poetic, modern romantic — never cheesy

### Gemini 2.5 Flash — Image Generation
- Model: `gemini-2.5-flash-image` via `@google/genai`
- Prompt per template style
- Extract base64 from `response.candidates[0].content.parts[].inlineData.data`
- Upload to Supabase Storage, store public URL
- Fallback: CSS gradient placeholder

---

## Analytics

Server-side event logging via a fire-and-forget `logEvent()` helper in `src/lib/analytics.ts`. Events are stored in the `analytics_events` table and never block the request.

### Event Types

| Event | Fired From | Properties |
|-------|-----------|------------|
| `message_generated` | `/api/generate-message` | `templateId`, `memoriesCount` |
| `image_generated` | `/api/generate-image` | `templateId` |
| `invitation_created` | `/api/invitations` (POST) | `templateId` |
| `invitation_opened` | `/api/invitations/[token]` (GET) | — |
| `rsvp_submitted` | `/api/invitations/[token]/rsvp` (POST) | `rsvpStatus` |

### How it works

- `logEvent()` accepts `eventType`, optional `invitationId`, optional `properties`, and an optional `NextRequest`
- When a `request` is passed, IP (from `x-forwarded-for` / `x-real-ip`) and user-agent are auto-enriched into `properties`
- The insert runs as a detached promise — errors are logged to console but never surface to the client

---

## User Flows

### Creator Flow (`/create`)

1. **Choose Template** — Grid of 4 templates: classic, bold, playful, minimal
2. **Personal Details** — Sender/recipient names, 3 memories, hints textarea
3. **Style Customization** — Color palette, font, layout toggle
4. **Preview & Generate** — AI generates message + image, full preview shown
5. **Share** — Save to DB, display shareable link, copy-to-clipboard

### Recipient Flow (`/v/[token]`)

1. **Envelope Animation** — Framer Motion entrance
2. **Invitation Card** — AI image + personalized message
3. **Story Arc** — Animated narrative summary
4. **RSVP** — Heart button with confetti
5. **Celebration** — Floating hearts, stored in DB

---

## Templates

| ID | Name | Aesthetic | Tone |
|----|------|-----------|------|
| `classic` | Classic | Elegant pastels, soft shadows | Timeless romantic |
| `bold` | Bold | Deep reds, golds, dramatic | Passionate, confident |
| `playful` | Playful | Bright colors, illustrations | Fun, lighthearted |
| `minimal` | Minimal | Clean typography, whitespace | Understated, modern |

---

## Implementation Phases

1. ~~**Scaffolding** — Next.js init, deps, folder structure, delete old code~~ ✅
2. ~~**Landing Page** — Root layout, hero, fonts, responsive~~ ✅
3. ~~**Creator Flow** — Multi-step form, Zod validation, state management~~ ✅
4. ~~**AI Integration** — API routes for text + image generation~~ ✅
5. ~~**Database** — Supabase CRUD routes~~ ✅
6. ~~**Recipient Experience** — Animated reveal, RSVP, confetti~~ ✅
7. ~~**Polish** — Responsive audit, SEO, error boundaries, deploy config~~ ✅
8. ~~**Analytics** — Event logging across all API routes, `analytics_events` table~~ ✅
