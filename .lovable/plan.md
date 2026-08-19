# Language Switcher Implementation Plan

Add a compact Hindi/English language switcher to the website header to allow users to toggle between languages for the static UI interface.

## User Review Required

> [!IMPORTANT]
> - The language switcher will only translate **static UI text** (navigation labels, buttons, headings, form labels).
> - **Dynamic content** from the database (notices, temple history, member names, news content) will remain in the language it was entered (primarily Hindi).

## Proposed Changes

### Internationalization Setup
- Create `src/lib/i18n.ts` to manage language state and provide translation mappings for UI strings.
- Use `localStorage` to persist the user's language preference across sessions.
- Provide a `useLanguage` hook or a simple context to access the current language and a translation function `t()`.

### Header Integration
- Add a compact language switcher in `src/components/layout/Header.tsx`.
- The switcher will feature a small Globe icon and a text label ("हिन्दी" / "English").
- It will be placed naturally within the existing header layout (e.g., near the donation button on desktop, and within the mobile menu on smaller screens).

### Component Translations
Update the following components to use the new translation system for their labels:
- `Header.tsx`: Navigation links ("Home", "About", etc.) and "Donate" button.
- `Footer.tsx`: Section headings and quick links.
- `NoticeTicker.tsx`: "Important Notice" label.
- `NewsSection.tsx`: "Updates", "Important News", and "Read More" labels.
- `FeaturedMembers.tsx`: "Key Officials" heading and "View All" button.
- `AboutTempleSection.tsx`: "Devotee Connection" label.
- `QuickActions.tsx`: Action labels.
- `ContactPage`: Form labels and success/error messages.

### Technical Details
- **State Management**: A simple `useState` initialized from `localStorage` will be used in a context provider at the root level.
- **Icon**: Use the `Languages` or `Globe` icon from `lucide-react`.
- **Performance**: Static translations are extremely lightweight and won't affect performance.
- **Admin Panel**: No changes will be made to the Admin Panel as requested.

## Verification Plan

### Manual Verification
- Toggle between Hindi and English in the header.
- Confirm that all UI labels update immediately without a page refresh.
- Refresh the page and confirm the selected language persists.
- Check both desktop and mobile layouts for visual consistency.
