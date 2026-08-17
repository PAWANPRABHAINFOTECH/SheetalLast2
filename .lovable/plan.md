# Implementation Plan - Shital Shivalaya Samiti Temple Website

Build a premium, modern, Hindi religious temple website for **Shital Shivalaya Samiti** with a full backend (Lovable Cloud) and Admin Panel.

## User Review Required

> [!IMPORTANT]
> - **Visual Direction**: The design will use Deep Maroon (#7B1113), Antique Gold (#C99A3A), and Saffron (#D98216) based on the uploaded logo.
> - **Language**: Primary content will be in Hindi as requested.
> - **Admin Access**: A secure `/admin` route will be created for content management.

## Proposed Changes

### 1. Database Schema (Lovable Cloud)
Create a comprehensive schema to support all editable content:
- `site_settings`: Global config (site name, contact, social links, logo, bank details, donation QR).
- `hero_slides`: Home page slider (image, title, active status, order).
- `notices`: Scrolling ticker (text, link, priority, dates).
- `advertisements`: Event/sponsor slider (image, title, description, dates).
- `news`: Temple news/updates (title, image, date, full description).
- `gallery`: Photos categorized by type (temple, puja, meetings, etc.).
- `members`: Committee structure with categories (Protector, Officer, etc.).
- `chairman_messages`: Editable message from the president.
- `temple_information`: About section and history.
- `temple_timings`: Aarti and Darshan schedule.
- `live_darshan`: Video/YouTube URL management.
- `contact_enquiries`: Storage for submitted contact forms.
- `policies`: Editable Privacy, Terms, and Refund policies.

### 2. Frontend Development (React + Tailwind)
- **Design System**: Implementation of the specified palette with ivory backgrounds, gold borders, and subtle mandala patterns.
- **Components**:
  - `Header`: Responsive with logo, navigation, and persistent call/donate buttons.
  - `NoticeTicker`: Horizontally scrolling Hindi notifications.
  - `HeroSlider`: Premium image transition with spiritual animations.
  - `DonationModal`: Premium popup with QR code and bank details.
  - `ContactForm`: Validated form in Hindi.
  - `MemberGrid`: Organized display of committee members.
- **Pages**:
  - `Home`: Full layout as specified (Hero -> Quick Actions -> About -> Timings -> News -> Ads -> Chairman -> Location -> Gallery -> Donation).
  - `About`, `History`, `News`, `Gallery`, `Live Darshan`, `Members`, `Contact`.
  - `Policies`: Dedicated pages for Privacy, Terms, and Refunds.

### 3. Admin Panel (/admin)
- **Authentication**: Secure login using Lovable Cloud Auth.
- **Dashboard**: Overview of site activity (enquiries, news count, active notices).
- **CRUD Interfaces**: Easy-to-use forms for every database table:
  - Image uploads to Lovable Cloud Storage.
  - Video duration validation (30s limit for live darshan).
  - Reordering functionality for sliders and members.
  - Toggle switches for active/inactive content.

### 4. SEO & Performance
- Full meta tags for Hindi SEO.
- Open Graph tags for social sharing.
- Optimized image loading (lazy loading + Cloudflare resizing).

## Technical Details
- **Framework**: React 19 + TanStack Start.
- **Styling**: Tailwind CSS v4.
- **Backend**: Lovable Cloud (Supabase) for Auth, DB, and Storage.
- **Typography**: Noto Sans Devanagari for Hindi, Inter for English.
- **Icons**: Lucide React for standard icons, custom SVG separators for temple aesthetic.

## Constraints & Considerations
- **Content Claims**: Wording like "बताया जाता है" will be used for religious/historical claims as requested.
- **No Hard-coding**: All site data (phone numbers, bank details, schedules) will be fetched from the database.
- **Fallback UX**: Sections will display placeholder messages (e.g., "अभी कोई समाचार उपलब्ध नहीं है") if data is missing.
