# YouTube RSS Sync Implementation Plan

Replace the existing YouTube Data API synchronization with a no-API solution using public RSS/Atom feeds.

## Changes

### Backend
- **RSS Parsing**: Use `fast-xml-parser` to process the YouTube Atom feed.
- **Channel Resolution**: Implement a robust server-side resolver that extracts the `channelId` from handles (`@handle`), custom URLs, or standard channel links by scraping the public YouTube page for canonical metadata.
- **Sync Logic**: 
    - Fetch `https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID` server-side.
    - Extract video ID, title, thumbnail (from `media:group`), and timestamps.
    - Upsert into `public.youtube_videos` table using `youtube_id` to prevent duplicates.
    - Return a specific message indicating the number of new videos found.
- **Dependency Removal**: Remove all references and requirements for `YOUTUBE_API_KEY`.

### Admin Panel
- **Settings UI**:
    - Retain the channel link input.
    - Update the sync button to handle the new return data (`newCount`).
    - Display sync status: Connected channel name, URL, last sync timestamp, and total videos.
- **Validation**: Show a Hindi error message if the channel ID cannot be resolved.

### Frontend
- **Preservation**: Keep the existing responsive video grid (4/3/2/1 layout) and "More Videos" functionality.
- **Data Integrity**: Ensure the public view continues to render real synced videos without any design changes.

## Technical Details
- **RSS Feed**: `https://www.youtube.com/feeds/videos.xml?channel_id=UC...`
- **Channel ID Discovery Regex**: `/"browseId":"(UC[a-zA-Z0-9_-]{22})"/`
- **Unique Constraint**: `youtube_id` in `public.youtube_videos` table.
- **Environment**: No longer requires `YOUTUBE_API_KEY` in Lovable secrets.
