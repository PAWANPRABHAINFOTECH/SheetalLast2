# PROJECT ARCHITECTURE — Sheetal Shivalaya Samiti

```text
Browser (React 19 + TanStack Start)
        |
        v
Route layer  (src/routes/*)  -- file-based routing, SSR capable
        |
        v
Server layer (createServerFn in src/lib/*.functions.ts, API routes in src/routes/api/*)
        |
        v
Supabase client (src/integrations/supabase/*)
        |
        +--> PostgreSQL Database (tables + RLS policies + SQL functions)
        +--> Auth (email/password admin login, password reset)
        +--> Storage (member photos, gallery images, posters)
        |
        v
External integrations: YouTube RSS channel feed, WhatsApp deep links, UPI/QR donation
```

## Frontend
- **Framework:** React 19 + TanStack Start v1 (Vite 7).
- **Routing:** file-based, `src/routes/`. `__root.tsx` holds the global shell (Header, Footer, providers, floating actions). `index.tsx` is the public home page. `admin/*` routes hold the admin panel.
- **Styling:** Tailwind CSS v4 configured through `src/styles.css` using `@theme` tokens (OKLCH). Brand palette: Deep Maroon `#7B1113`, Gold `#C99A3A`, Saffron `#D98216`, Ivory `#FFFDF8`.
- **UI kit:** shadcn/ui primitives in `src/components/ui/`.
- **State/data:** TanStack Query. Route loaders use `ensureQueryData` where relevant; components use `useQuery`/`useSuspenseQuery`.
- **Providers:** `src/lib/i18n.tsx` (Hindi/English), `src/lib/theme-provider.tsx` (dark/light).

## Backend
- **Server functions:** `src/lib/temple.functions.ts` (content reads/writes), `src/lib/youtube.functions.ts` (channel RSS sync). Declared with `createServerFn` from `@tanstack/react-start`.
- **Auth middleware:** `src/integrations/supabase/auth-middleware.ts` exposes `requireSupabaseAuth`; the client-side bearer attacher is registered in `src/start.ts`.
- **Privileged access:** `src/integrations/supabase/client.server.ts` (service-role) is loaded only inside handlers, never in client graph.

## Database
- Migrations live in `supabase/migrations/` (chronological SQL). Every public table has explicit `GRANT`s plus RLS enabled.
- Core tables: `members`, `news`, `notices`, `hero_slides`, `gallery`, `temple_timings`, `site_settings`, `live_darshan`, `chairman_messages`, `policies`, `testimonials`, `comments`, `youtube_videos`, `advertisements` (posters), `user_roles`.
- Roles are stored in `user_roles` and checked by the `has_role(uuid, app_role)` SQL function used inside RLS policies. Roles are never stored on profile rows.

## Storage
- Supabase Storage buckets hold uploaded member photos, gallery images and posters. The admin UI (`MediaInput.tsx`) supports either direct upload or an external image URL — both end up in the same `*_url` column.

## External integrations
- **YouTube:** no API key. The channel RSS feed for `@SheetalShivalayaSamiti` is parsed server-side and rows are upserted into `youtube_videos` with `source_type = 'synced'`. Manually curated rows use `source_type = 'special'` (विशेष झलकियां).
- **WhatsApp:** `wa.me` deep links with pre-filled Hindi message.
- **Donations:** static QR image + bank details rendered in `DonationModal.tsx`.
