# Plan: Header and Ticker Correction

Fix the Header and Important Notice Ticker to match branding requirements, ensuring proper layout, administrative control, and visual polish.

## User Review Required

> [!IMPORTANT]
> The logo will be clipped to a circle using CSS. If the source image has critical details in the extreme corners, they will be hidden.

## Ticker & Header Implementation

### 1. Database & Ticker
- Reorganize `src/routes/index.tsx` so `NoticeTicker` is the absolute first element.
- Update `NoticeTicker` with a premium slim design (height ~40px) and a fixed "🔔 महत्वपूर्ण सूचना" label.
- Implement smooth, continuous CSS marquee animation without gaps.
- Ensure the ticker only shows active, priority-ordered notices from the database.

### 2. Header Layout & Design
- **Logo**: Apply `border-radius: 50%` and `aspect-ratio: 1/1` to the logo container in `Header.tsx` to force a circular appearance and hide square corners.
- **Branding**: Display the committee name and location next to the circular logo.
- **Contact Details**: Add clickable Phone, WhatsApp, and Email items to the header on desktop (right side of logo) and mobile (compact icons).
- **Social Links**: Integrate social media icons near contact details on desktop and within the mobile menu.
- **Responsiveness**: Ensure a clean stack on mobile with no horizontal overflow.

### 3. Integration
- Connect all contact details in the Header to values from `site_settings`.
- Ensure proper Z-indexing so the sticky Header and Ticker interact correctly.

## Technical Details
- CSS Animation for ticker: `translateX(0)` to `translateX(-50%)` for continuous loop.
- Tailwind `rounded-full` and `overflow-hidden` for circular logo.
- `site_settings` fields used: `phone`, `whatsapp`, `email`, `address`, `location_text`.
- `social_links` used for YouTube, Instagram, and Facebook icons.
