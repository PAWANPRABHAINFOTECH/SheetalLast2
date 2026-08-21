# AI + HUMAN DEVELOPER GUIDE — Sheetal Shivalaya Samiti

This guide describes the **current working project** so that another AI builder or a human
developer can continue development safely.

## 1. Frontend architecture
- `src/routes/__root.tsx` — global shell: i18n provider, theme provider, `Header`, `Footer`,
  `FloatingActions` (WhatsApp/Call/Poster), toaster, `<Outlet />`.
- `src/routes/index.tsx` — public home page composed of section components.
- `src/components/home/` — `HeroSlider`, `NoticeTicker`, `TempleTimings`, `NewsSection`
  (विशेष सूचना), `YouTubeSection`, `LiveDarshan`, `GallerySection`, `MembersSection`,
  `Testimonials`, `ContactSection`.
- `src/components/layout/` — `Header` (single white branding row: circular logo, samiti name,
  nav links, दान करें button; language/theme controls collapse into the hamburger on mobile),
  `Footer` (contact info + developer credit).
- `src/components/shared/` — `DonationModal`, `VideoLightbox`, `ImageLightbox`, `MediaInput`,
  `FloatingActions`.
- `src/components/admin/` — `AdminShell` (sidebar + module registry), `CrudSection`
  (generic table/form CRUD driven by a field config), `SiteSettingsSection`.
- `src/components/ui/` — shadcn primitives. Do not hand-edit unless intentionally restyling.

## 2. Backend architecture
- App-internal logic uses `createServerFn` from `@tanstack/react-start`:
  - `src/lib/temple.functions.ts` — content queries/mutations.
  - `src/lib/youtube.functions.ts` — RSS channel sync.
- Files declaring `createServerFn` must stay thin wrappers (imports + exported declarations only);
  helpers go in imported modules or inside the handler.
- `src/start.ts` registers the client-side middleware that attaches the Supabase bearer token.
- Protected server functions use `.middleware([requireSupabaseAuth])`. Never call them from a
  public route loader — call them from components via `useServerFn` inside `useQuery`.

## 3. Database architecture
Migrations: `supabase/migrations/`. Every public table: `CREATE TABLE` → `GRANT` → `ENABLE RLS` → policies.

| Table | Purpose |
| --- | --- |
| `site_settings` | phone, WhatsApp, email, counters, donation/bank details |
| `hero_slides` | home hero slider (exactly 3 shown) |
| `notices` | ticker items, ordered by `sort_order` (क्रमांक) |
| `news` | विशेष सूचना entries |
| `members` | committee members: name, designation, category, photo, mobile + `show_mobile` |
| `temple_timings` | darshan/aarti timings |
| `gallery` | photo gallery |
| `youtube_videos` | `source_type` = `synced` (channel RSS) or `special` (विशेष झलकियां) |
| `advertisements` | पोस्टर floating square slider |
| `testimonials`, `comments` | devotee feedback with Pending/Approved/Rejected approval |
| `live_darshan`, `chairman_messages`, `policies` | supporting content |
| `user_roles` | role storage, read by `has_role()` in RLS policies |

## 4. Authentication
- **Admin Login:** `/admin/login`, email + password, password visibility toggle.
- **Admin Dashboard:** `/admin/dashboard`, heading "शीतल शिवालय समिति", module sidebar.
- **Guarding:** the admin subtree redirects unauthenticated users to the login route; the
  admin role is verified server-side through `user_roles` / `has_role`, never from localStorage.
- **Password reset:** recovery email redirects to the site's own reset page; the flow avoids the
  "PKCE code verifier not found" error by completing exchange on that page before sign-in.
- No anonymous sign-ups. Admin accounts are provisioned via migration/dashboard, not self-serve.

## 5. Routes
| Route | Description |
| --- | --- |
| `/` | public home page |
| `/admin/login` | admin login |
| `/admin/dashboard` | admin panel (all CRUD modules) |
| `/admin/reset-password` | password recovery target |
| `src/routes/api/*` | HTTP endpoints for external callers (public ones under `api/public/*`) |

## 6. Feature notes / business rules
- **YouTube Channel Sync:** no API key. Server parses the RSS feed for
  `https://www.youtube.com/@SheetalShivalayaSamiti` and upserts rows with `source_type='synced'`.
  Synced and special videos must remain strictly separated in both admin and frontend.
- **Videos play inside the site** via `VideoLightbox` (responsive modal) — never redirect to YouTube.
- **विशेष झलकियां:** manually curated `special` rows; heading has no icon.
- **Poster (पोस्टर):** floating square slider from `advertisements`; clicking opens `ImageLightbox`.
- **Gallery / Image upload / External URL:** `MediaInput` supports both a Storage upload and a
  pasted external URL with live preview; both write to the same URL column.
- **Members:** categories include संस्थापक सदस्य and स्थाई कार्यकारिणी; mobile number is optional
  and shown publicly only when `show_mobile` is ON.
- **Notifications (notices):** `sort_order` (क्रमांक) is mandatory, positive integer, admin warns
  on duplicates; frontend orders ascending. The ticker speed is locked (fixed seconds per notice)
  so animation feels identical regardless of item count. No priority system exists — do not re-add it.
- **Aarti / Live Darshan:** buttons use the channel URL; content uses the configured playlist URL.
- **Hindi/English:** all strings go through `src/lib/i18n.tsx` (`t('key')`). Hindi is default;
  use Noto Sans Devanagari / Mukta for Hindi and Inter for English.
- **Dark/Light:** `theme-provider.tsx` toggles a class; colors come from OKLCH tokens in `styles.css`.
- **WhatsApp:** official number +91 831 932 2374; pre-filled message "नमस्कार, शीतल शिवालय समिति".
  Developer credit uses WhatsApp 6262013335.
- **Donation:** modal with QR + bank details, mobile-responsive down to 320px, developer credit at bottom.

## 7. How an AI should safely modify this project
1. Read the existing file before editing it; keep the current structure and naming.
2. Never hardcode colors (`text-white`, `bg-[#...]`) — use the semantic Tailwind tokens.
3. Keep Hindi copy in `i18n.tsx`; don't inline translated strings in components.
4. Add DB changes only through a new migration file with `GRANT` + RLS + policies.
5. Never store roles outside `user_roles`; never trust client-side admin flags.
6. Keep `createServerFn` modules thin; put helpers elsewhere.
7. Touch only the module named in the request — this project is edited in small, targeted changes.
8. Do not reintroduce removed features (notice priority, duplicate YouTube admin section,
   maroon nav strip, Lovable badge).
9. Run the build after changes; verify UI on 320px, 375px and desktop widths.
