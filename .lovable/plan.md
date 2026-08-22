# UI/UX and Video Fixes Plan

1. **Mobile Header Refinement**
   - Update `src/components/layout/Header.tsx` to prevent brand name truncation on mobile.
   - Adjust font sizes and layout to ensure "शीतल शिवालय समिति" fits fully.
   - Move language and theme controls into the mobile hamburger menu when on small screens.

2. **Inline YouTube Video Playback**
   - Implement a responsive video modal/lightbox component.
   - Update `src/components/home/YouTubeSection.tsx` to handle clicks by opening the modal instead of external links.
   - Apply the same playback logic to the "विशेष झलकियां" (Special Highlights) section.

3. **Poster Lightbox**
   - Modify `src/components/home/Advertisements.tsx` (which handles posters) to make images clickable.
   - Use a modal to display the poster in full size with a close button, preserving aspect ratio.

4. **Responsive Donation Modal**
   - Update `src/components/shared/DonationModal.tsx` for better mobile layout.
   - Ensure all elements (QR code, bank details, copy buttons) stack correctly and remain fully visible.
   - Add internal vertical scrolling to prevent content cut-off on small screens.

5. **Verification**
   - Check all changes across multiple viewport widths (320px to 1366px).
   - Ensure smooth transitions and no horizontal overflow.
