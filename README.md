# शीतल शिवालय समिति — Sheetal Shivalaya Samiti

Official website of **शीतल शिवालय समिति**, Mandideep, District Raisen (M.P.).
This repository is the **complete, editable master source code** for the live site:
public temple pages plus a secure Hindi admin panel.

Companion documents:
- [`AI-HUMAN-DEVELOPER-GUIDE.md`](./AI-HUMAN-DEVELOPER-GUIDE.md) — feature-by-feature guide
- [`PROJECT-ARCHITECTURE.md`](./PROJECT-ARCHITECTURE.md) — layers and data flow
- [`ENVIRONMENT-SETUP.md`](./ENVIRONMENT-SETUP.md) — environment variables and Supabase setup

## Purpose

A premium, mobile-first Hindi religious website providing darshan/aarti timings, notices,
news, hero slider, photo gallery, committee member directory, YouTube channel videos,
posters, devotee feedback, contact details and an online donation window — all editable
by non-technical committee members through the admin panel.

## Technology stack

- React 19 + **TanStack Start v1** (file-based routing, SSR, server functions)
- Vite 7
- Tailwind CSS v4 (`src/styles.css`, `@theme` OKLCH tokens) + shadcn/ui
- TanStack Query for data fetching
- Supabase — PostgreSQL, Auth, Storage, RLS
- TypeScript throughout

Brand palette: Deep Maroon `#7B1113`, Gold `#C99A3A`, Saffron `#D98216`, Ivory `#FFFDF8`.
Fonts: Noto Sans Devanagari / Mukta (Hindi), Inter (English).

## Installation

```bash
npm install            # or bun install / pnpm install
cp .env.example .env   # then fill in your Supabase values
```

## Local development

```bash
npm run dev            # http://localhost:8080
```

## Database

All schema, grants, RLS policies and SQL functions are in `supabase/migrations/`.

```bash
npx supabase link --project-ref <your-ref>
npx supabase db push
```

## Build

```bash
npm run build          # production build
npm start              # serve the built app
```

## Production deployment

Node.js 20+ host (Hostinger Node hosting, VPS, or any Node/edge platform):

1. Upload the project (or `git clone`), run `npm install`.
2. Set the environment variables from `.env.example` in the host's dashboard.
3. Run `npm run build`.
4. Point the Node application entry point at the generated server output
   (`.output/server/index.mjs`) or run `npm start`.
5. Ensure HTTPS and add `<your-domain>/admin/reset-password` to Supabase auth redirect URLs.

## Project structure

```text
src/
  routes/          file-based routes (public + /admin)
  components/      home, layout, admin, shared, ui
  lib/             server functions, i18n, theme provider, utils
  integrations/    Supabase clients + auth middleware
  assets/          images
  styles.css       Tailwind v4 theme tokens
public/            static assets, favicon
supabase/          config.toml + migrations/
```

---

Designed & Developed by **PAWANPRABHA INFOTECH** — WhatsApp: 6262013335
