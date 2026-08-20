# Implementation Plan - YouTube Sync & Event Floating Slider

Implement YouTube Channel Sync and restore the "Advertisements" system as "आयोजन" (Events) with a floating square slider.

## User Review Required

> [!IMPORTANT]
> The YouTube Sync feature requires a **YouTube Data API v3 Key**. I will provide a placeholder environment variable `YOUTUBE_API_KEY`, which you will need to set in the Lovable secrets manager or your production environment.

- **YouTube Sync**: How many videos should be displayed initially? (Proposed: 4 on desktop, with a "More Videos" button).
- **Events Rotation**: The rotation speed for "आयोजन" will be set to 5 seconds by default. Is this acceptable?

## Proposed Changes

### Database Schema Updates
- Add `youtube_videos` table to store synced video metadata.
- Ensure `advertisements` table supports "आयोजन" requirements (renaming labels in UI only).
- Add `youtube_sync_status` columns to `site_settings`.

```sql
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id TEXT UNIQUE NOT NULL,
    title TEXT,
    thumbnail TEXT,
    published_at TIMESTAMPTZ,
    url TEXT,
    description TEXT,
    channel_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS youtube_channel_url TEXT,
ADD COLUMN IF NOT EXISTS youtube_channel_name TEXT,
ADD COLUMN IF NOT EXISTS youtube_channel_logo TEXT,
ADD COLUMN IF NOT EXISTS youtube_subscriber_count TEXT,
ADD COLUMN IF NOT EXISTS youtube_last_sync_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS youtube_video_count INTEGER DEFAULT 0;

GRANT SELECT ON public.youtube_videos TO anon;
GRANT ALL ON public.youtube_videos TO authenticated;
GRANT ALL ON public.youtube_videos TO service_role;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access youtube_videos" ON public.youtube_videos FOR SELECT USING (true);
CREATE POLICY "Admin full access youtube_videos" ON public.youtube_videos FOR ALL TO authenticated USING (true);
```

### Backend (Server Functions)
- Create `syncYoutubeVideos` server function using YouTube Data API.
- Use `YOUTUBE_API_KEY` environment variable securely.
- Fetch channel details and latest videos, upserting into `youtube_videos`.

### Admin Panel
- **YouTube Section**: Add to `AdminShell.tsx`.
  - Fields for Channel URL, Sync button, status display.
- **"आयोजन" Section**: Update existing "Advertisements" entry in `SECTIONS`.
  - Rename label to "आयोजन".
  - Ensure fields match requirements (Title, Image, URL, display order, active status).

### Frontend - Public Website
- **YouTube Section**: Create `YouTubeSection.tsx`.
  - Responsive grid (4/3/2/1 columns).
  - "More Videos" button with client-side loading.
  - Video cards with thumbnails and play actions.
- **Event Floating Slider**: Create `EventFloatingSlider.tsx`.
  - Fixed floating position (bottom-left or bottom-right, avoiding existing buttons).
  - Square aspect ratio (1/1).
  - Automatic rotation of active "आयोजन" records.
  - Smooth transitions.

## Technical Details

- **YouTube API**: Fetching `search` list by `channelId` and `channels` list for metadata.
- **Caching**: Videos stored in DB to avoid hitting API quotas on every page load.
- **Styling**: Tailwind CSS for responsive grids and floating positioning.
- **I18n**: Add Hindi/English translations for new sections.

## Verification Plan

### Automated Tests
- N/A (Manual verification preferred for UI components).

### Manual Verification
- **Admin**:
  1. Configure YouTube URL and click "Sync".
  2. Verify status updates (logo, count, last sync).
  3. Manage "आयोजन" records (add square image, set active).
- **Public**:
  1. Verify YouTube grid responsiveness.
  2. Test "More Videos" button.
  3. Verify Floating "आयोजन" slider appears, is square, and rotates.
  4. Ensure no interference with WhatsApp/Call buttons.
