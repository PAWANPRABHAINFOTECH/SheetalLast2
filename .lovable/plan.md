# Admin Panel Modules Activation Plan

Enable and verify all requested modules in the Admin Dashboard and ensure they are properly reflected on the public website.

## Admin Dashboard Modules
The following modules are already defined in `SECTIONS` within `src/components/admin/AdminShell.tsx`. I will verify their functionality and ensure they handle data correctly.

- **Notice/Ticker**: `notices` table (already in sidebar).
- **Hero Slider**: `hero_slides` table (already in sidebar).
- **Gallery**: `gallery` table (already in sidebar).
- **News**: `news` table (already in sidebar).
- **Members/Committee**: `members` table (already in sidebar).
- **Live Darshan**: `live_darshan` table (already in sidebar).
- **Donations**: Controlled via `site_settings` in "Website Settings" (already in sidebar).

## Implementation Details

### 1. Verification of Admin Sidebar
Confirm all modules are visible and functional in the Admin Panel sidebar.

### 2. Public Site Integration Check
Ensure the frontend components correctly consume the data managed through the Admin Panel:
- `NoticeTicker.tsx`
- `HeroSlider.tsx`
- `GalleryPreview.tsx`
- `NewsSection.tsx`
- `FeaturedMembers.tsx`
- `LiveDarshan.tsx`
- `DonationModal.tsx` (using `site_settings`)

### 3. Data Seeding & Fallback
Ensure that if no data is present, the site displays professional placeholders rather than empty sections.

## Verification
- Use Playwright to log in as admin and verify navigation to each section.
- Verify that saving a new record in a section (e.g., a new Notice) is reflected on the home page.
