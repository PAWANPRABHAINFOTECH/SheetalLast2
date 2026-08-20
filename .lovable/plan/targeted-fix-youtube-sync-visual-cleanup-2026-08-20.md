# Targeted Fix: YouTube Sync & Visual Cleanup

## 1. Remove Duplicate Admin Section
- Remove the lower `youtube_sync` entry from `SECTIONS` in `src/components/admin/AdminShell.tsx`.
- The main sync control will remain via `YoutubeAdminSettings` which is already included in the `AdminShell` render logic for the `youtube_sync` active ID.

## 2. Fix Frontend YouTube Video Display
- Investigate why `useYoutubeVideos("synced")` is returning empty when sync reports success.
- **Potential Issue:** The `syncYoutubeVideos` server function upserts records, but the public RLS policy might be filtering them incorrectly or the `source_type` might not be matched exactly.
- **Verification:** I will trigger a sync in the Admin Panel to ensure records are populated with `source_type = 'synced'` and `is_active = true`.
- Ensure `src/components/home/YouTubeSection.tsx` correctly handles the data returned by `useYoutubeVideos("synced")`.

## 3. Visual Text Edit
- Remove the star icon (`⭐`) from the "विशेष झलकियां" heading in `src/components/home/YouTubeSection.tsx`.

## Technical Details
- **File:** `src/components/admin/AdminShell.tsx` - Remove redundant CRUD configuration for `youtube_sync`.
- **File:** `src/components/home/YouTubeSection.tsx` - Remove `⭐` and ensure grid rendering for synced videos is robust.
- **Data Flow:** Verify `source_type` consistency between sync logic (`src/lib/youtube.functions.ts`) and fetch logic (`src/lib/temple.functions.ts`).
