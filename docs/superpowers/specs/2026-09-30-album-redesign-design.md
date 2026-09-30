# Album pages redesign

**Goal:** photos dominate. Keep the moss palette, Cormorant + Inter, page transitions,
JSON-LD, metadata, LQIP, series detection and prev/next logic.

## `/work/[slug]`

1. **Hero** (`AlbumHero`): `h-svh`, image = `heroImage` if it has a source, else `coverImage`.
   Painted at once (no `ImageReveal` / `data-animate` on the image). Crop =
   `objectPosition` → hotspot → center; phones use `mobileObjectPosition` first. Title,
   meta line and series switcher bottom-left, as today.
2. **Story band** (`AlbumStory`): narrative (else description) on the left; a `<dl>` with
   category, year, location, "N photographs" (+ "1 film") on the right. `FadeIn`, no
   word scrub.
3. **Gallery** (`AlbumGallery`, client): justified rows, 8px gaps, container padding.
   - Row partition from `justifyRows()` (DP over aspect ratios parsed from the asset ref;
     cost = squared distance from a target row height in width units). Desktop target
     0.48, ≤4 per row, max height 0.55. Phone target 0.72, ≤3 per row, max 1.25.
   - Pure CSS: items `flex: <ar> 1 0`, `aspect-ratio: <ar>`; breakpoint-specific
     line breaks and centering spacers. Server-rendered, no layout shift.
   - Width capped at `170svh` so a row never outgrows the screen.
   - Film (`AlbumFilm`): own dark band after ~60% of photos; height ≤ 85svh (the
     Milestone film is vertical). Plays muted only while ≥50% visible, never under
     Reduce Motion, stays paused once the viewer pauses it. Rendered for video-only albums.
   - Every tile is a `<button>` opening the viewer.
4. **Viewer** (`AlbumLightbox`, portal): full-screen contained photo on near-black,
   "05 / 14" counter, caption if any. ← → keys, swipe, Esc, close button; wraps at the
   ends. `useFocusTrap` (restores focus to the tile), Lenis stopped + body locked,
   neighbours pre-rendered hidden so they are cached.
5. **End nav** (`AlbumNav`): prev/next as two large cover cards (eyebrow with
   "Previous · 03 / 11" or wrap label, big title), "All work" between them on desktop,
   below them on phones. With no neighbours, only "All work".

## `/work`

`WorkIndex`: header "Work" (h1) + "11 collections" (singular-safe). Two columns on
desktop, right column offset ~14vw; **column-first** order (albums 1..k left, k+1..n
right, k chosen to balance heights) so DOM, focus and phone order all equal archive
order. Covers at natural aspect, portraits capped to 4:5 with the crop position.
Title + "Category · N photographs" under each cover; whole card is one link with a
visible focus ring and a slow hover zoom. First cover in each column is `priority`;
LQIP for all covers. Phone: one column. Empty state kept.

## Removed

`WorkChapters`, `FolioGallery`, `.folio-*` / `.chapter-panel-deferred` CSS and the
matching noscript selectors.

## Data

`SanityImage` gains `objectPosition`, `mobileObjectPosition`, `hotspot`. New helpers in
`image-url.ts`: `imageAspectRatio`, `imagePositions`, `getAlbumHeroImage`.
`getFolioImages` excludes the resolved hero; the GROQ `imageCount` uses
`coalesce(heroImage, coverImage)` to match.

## Tests

Unit: `justifyRows`, image helpers, `getFolioImages` with a missing hero.
Component: lightbox keys, counter, close, focus restore. E2E: index → album → viewer
(→, Esc) → All work; update typography + hero-animation selectors. Screenshots at
1440×900 and 390×844.

## Checklist

- [x] Types + helpers + unit tests
- [x] `justifyRows` + unit tests
- [x] `AlbumHero` rewrite
- [x] `AlbumStory`
- [x] `AlbumGallery` + `AlbumFilm`
- [x] `AlbumLightbox` + component test
- [x] `AlbumNav` restyle
- [x] Album page wiring (video-only albums)
- [x] `WorkIndex` + page wiring
- [x] Remove old components + CSS
- [x] E2E updates
- [x] Lint, types, unit, e2e, build; screenshot review desktop + phone
