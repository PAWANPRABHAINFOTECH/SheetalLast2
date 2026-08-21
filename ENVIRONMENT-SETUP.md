# ENVIRONMENT SETUP — Sheetal Shivalaya Samiti

## 1. Required variables

| Variable | Scope | Used in | Purpose |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | browser + build | `src/integrations/supabase/client.ts` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | browser | `src/integrations/supabase/client.ts` | Publishable/anon key (safe to expose) |
| `VITE_SUPABASE_PROJECT_ID` | tooling | scripts / CLI | Project reference id |
| `SUPABASE_URL` | server | server functions, auth middleware | Same URL for server runtime |
| `SUPABASE_PUBLISHABLE_KEY` | server | `auth-middleware.ts` | Anon key for user-scoped server calls |
| `SUPABASE_SERVICE_ROLE_KEY` | server ONLY | `client.server.ts` | Privileged admin operations. Never ship to the browser |

Copy `.env.example` to `.env` and fill in real values. `.env` is git-ignored.

## 2. Local setup

```bash
npm install          # or bun install / pnpm install
cp .env.example .env # fill in your Supabase values
npm run dev          # http://localhost:8080
```

Environment variables are read at call time inside server-function handlers — never at module scope.

## 3. Supabase configuration

1. Create a Supabase project (or reuse the existing one).
2. Apply migrations in order:
   ```bash
   npx supabase link --project-ref <your-ref>
   npx supabase db push
   ```
   All schema, RLS policies, grants and SQL functions live in `supabase/migrations/`.
3. Auth: enable Email/Password. Disable anonymous sign-ups. Set the Site URL and add
   `<your-domain>/admin/reset-password` to the allowed redirect URLs so admin password
   recovery links land on the temple site.
4. Storage: create the public buckets used for member photos, gallery images and posters,
   and keep read policies public / write policies admin-only.
5. Grant admin: insert a row into `public.user_roles` with `role = 'admin'` for the admin
   user's `auth.users.id`.

## 4. Production setup

```bash
npm run build        # production build
npm start            # run the built server (node preset)
```

Set the same environment variables in your hosting provider's dashboard
(Hostinger / Node host / Cloudflare). Do **not** bake secrets into the bundle;
only `VITE_*` values are inlined at build time and those must stay publishable.

## 5. Deployment requirements

- Node.js 20+ runtime for the server build.
- HTTPS domain (required for Supabase auth redirects and PWA-style behaviour).
- The service-role key must exist only in the server environment.
