# Plan: Unified YouTube System (RSS Sync + Special Videos)

Redesign the YouTube system to support both an automatic RSS sync section and a manual "Special Videos" section using a single database table.

## User Review Required

> [!IMPORTANT]
> - I will modify the existing `youtube_videos` table to add a `source_type` (synced/special) and `is_active` field.
> - The RSS Sync will now correctly report the number of *new* videos retrieved and ensure they are visible on the frontend.
> - A new "Special Videos" section will be added to the Admin Panel and the Home Page.

## Technical Details

### 1. Database Schema (Supabase Migration)
- Add `source_type` column to `youtube_videos` (text: 'synced' | 'special').
- Add `is_active` column to `youtube_videos` (boolean, default true).
- Add `display_order` column to `youtube_videos` (integer, default 0).
- Update existing records to `source_type = 'synced'`.

### 2. Backend Logic (`src/lib/youtube.functions.ts`)
- Refactor `syncYoutubeVideos`:
  - Fetch RSS feed.
  - Correctly count new videos (actual database insertion check).
  - Explicitly set `source_type = 'synced'`.
  - Fix any issues with channel ID resolution if found (verification step).
- Add `addSpecialVideo` (or use CrudSection for special videos).

### 3. Admin Panel UI
- **`src/components/admin/YoutubeAdminSettings.tsx`**: Update to show sync statistics correctly and keep the "Synced" videos list separate.
- **`src/components/admin/AdminShell.tsx`**:
  - Keep "यूट्यूब चैनल" (Channel Sync).
  - Add "विशेष वीडियो" (Special Videos) as a new CRUD section targeting the same table but filtered by `source_type = 'special'`.

### 4. Frontend Home Page
- **`src/components/home/YouTubeSection.tsx`**:
  - Split into two visual sub-sections or two separate components if needed.
  - Section 1: "नवीनतम वीडियो" (Synced).
  - Section 2: "विशेष वीडियो" (Special).
- **`src/lib/temple.functions.ts`**: Update `getYoutubeVideos` to allow filtering by type or fetch both.

## Verification Plan

### Automated Checks
- `bunx vitest` (if available) for the RSS parsing logic.
- Verify Supabase types generation after migration.

### Manual Verification
- Test "Sync" in Admin: Check if it reports the correct number of videos.
- Test "Add Special Video": Add a link, verify it appears in the Special section and NOT the synced section.
- Public Frontend: Verify two distinct sections are visible and layout is responsive.
