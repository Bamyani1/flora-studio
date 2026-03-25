<div align="center">

# SAFFRON STUDIOS

_Photography that's worth keeping._

<!-- Replace with a full-width screenshot of the homepage -->

![Saffron Studios](screenshots/hero.png)

![Next.js 16](https://img.shields.io/badge/Next.js-16.2-0B0C0E?style=flat-square&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.2-0B0C0E?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-0B0C0E?style=flat-square&logo=typescript)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4.0-0B0C0E?style=flat-square&logo=tailwindcss)
![GSAP](https://img.shields.io/badge/GSAP-3.14-0B0C0E?style=flat-square&logo=greensock)
![Lenis](https://img.shields.io/badge/Lenis-1.3-0B0C0E?style=flat-square)
![Sanity](https://img.shields.io/badge/Sanity-5.16-0B0C0E?style=flat-square&logo=sanity)
![Zustand](https://img.shields.io/badge/Zustand-5.0-0B0C0E?style=flat-square)

</div>

---

## The Vision

A photography studio built on patience and craft. We believe the best images aren't found — they're cultivated. Every frame is composed with intention, selected with care, and refined by hand.

[View the live site &rarr;](https://saffronstudios.com)

---

## The Copper Coast Palette

_Rooted in place, not trends — the weathered metals of trade routes, Atlantic stone, and desert light._

![Tar](https://img.shields.io/badge/Tar-0B0C0E?style=flat-square&color=0B0C0E)
![Gunmetal](https://img.shields.io/badge/Gunmetal-181A1E?style=flat-square&color=181A1E)
![Sandbar](https://img.shields.io/badge/Sandbar-E8E2D8?style=flat-square&color=E8E2D8)
![Salt Air](https://img.shields.io/badge/Salt_Air-7C8088?style=flat-square&color=7C8088)
![Verdigris Copper](https://img.shields.io/badge/Verdigris_Copper-BA7038?style=flat-square&color=BA7038)
![North Sea](https://img.shields.io/badge/North_Sea-5C90A4?style=flat-square&color=5C90A4)

#### Core Colors

| Color                | Hex       | Role                                      |
| -------------------- | --------- | ----------------------------------------- |
| **Tar**              | `#0B0C0E` | Primary background, depth                 |
| **Gunmetal**         | `#181A1E` | Secondary background, panels, cards       |
| **Sandbar**          | `#E8E2D8` | Primary text on dark, body copy           |
| **Salt Air**         | `#7C8088` | Muted text, captions, metadata            |
| **Verdigris Copper** | `#BA7038` | Warm accent, emphasis, calls-to-action    |
| **North Sea**        | `#5C90A4` | Cool accent, links, secondary interactive |

#### Extended Tones

| Color         | Hex       | Role                                 |
| ------------- | --------- | ------------------------------------ |
| **Deep Tar**  | `#070809` | Deepest background, maximum contrast |
| **Mid Dark**  | `#12141A` | Borders, dividers                    |
| **Warm Sand** | `#D4C8B8` | Secondary text, subtle elements      |
| **Ivory**     | `#F2EDE6` | Light backgrounds, print contexts    |

_Every color references a place — the depth of ancient trade routes, grey of Atlantic stone, warmth of desert light._

> Source: `src/styles/globals.css` — CSS custom properties implement these as `--color-tar`, `--color-gunmetal`, etc.

---

## Typography

### BerlingskeSerif — Display

The studio's display typeface. A serif with quiet authority — used for headlines, the wordmark, and navigation. Locally loaded in Light (300) and Regular (400) weights.

_Commercial license, Playtype._

### Inter — Body

Variable-weight sans-serif (100–900) for body text, UI, metadata, and captions. Loaded as a single variable font file for optimal performance.

_Open source, Google Fonts._

#### Type Scale

| Element | Size | Weight        | Line-Height |
| ------- | ---- | ------------- | ----------- |
| H1      | 96px | Regular (400) | 1.1         |
| H2      | 64px | Regular (400) | 1.15        |
| H3      | 48px | Medium (500)  | 1.2         |
| Body    | 18px | Regular (400) | 1.6         |
| Caption | 14px | Regular (400) | 1.5         |

> Source: `src/lib/fonts.ts`

---

## Design Tokens

_All visual values flow from CSS custom properties — a single source of truth._

<details>
<summary>View design tokens</summary>

<br>

**Colors** — semantic mappings

```css
--background-primary: var(--color-tar);
--background-secondary: var(--color-gunmetal);
--text-primary: var(--color-sandbar);
--text-secondary: var(--color-salt-air);
--accent-warm: var(--color-verdigris-copper);
--accent-cool: var(--color-north-sea);
```

**Typography**

```css
--font-display: "Berlingske Serif", "Georgia", serif;
--font-body: "Inter", "system-ui", "-apple-system", sans-serif;
--text-hero: 8rem; /* 128px */
--text-hero-mobile: 3.5rem; /* 56px */
--text-body: 1rem; /* 16px */
```

**Spacing** — base unit 4px

```css
--space-1: 0.25rem; /* 4px */
--space-2: 0.5rem; /* 8px */
--space-4: 1rem; /* 16px */
--space-8: 2rem; /* 32px */
--space-16: 4rem; /* 64px */
--space-32: 8rem; /* 128px */
--space-64: 16rem; /* 256px */
--section-padding-y: 8rem;
--container-padding-x: 2rem;
```

**Motion**

```css
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 400ms;
--duration-slow: 800ms;
--duration-cinematic: 1200ms;
--duration-hero: 3500ms;

--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
```

</details>

> Source: `src/styles/globals.css`

---

## Architecture

Cinematic quality extends to code. The architecture prioritizes clarity, performance, and intentional structure.

**Key decisions:**

- **Server Components by default** — Client Components only when browser APIs, state, or interactivity are required
- **Named animation presets** — all animations reference presets in `lib/animations.ts`, never inline GSAP configs
- **Design tokens as source of truth** — all visual values come from CSS custom properties in `globals.css`
- **Smooth scroll** — Lenis synced to GSAP ticker (lerp: 0.06, duration: 1.4) for perfect scroll-animation alignment
- **Headless CMS** — Sanity with embedded studio at `/studio` for content management

**Component architecture:**

- **Layout:** Header, Footer, MobileMenu, TransitionOverlay, RouteChrome, BackToTop, ScrollIndicator
- **Animations:** TextReveal, FadeIn, ImageReveal, ClipReveal, ParallaxSection, MagneticButton
- **Sections:** Hero, CuratedCollections, FilterableGrid, ExhibitionFeature, StartAStory, AlbumHero, HorizontalScrollGallery
- **UI:** Button, Input, Textarea, Select, InlineContactForm

---

## Pages

| Page    | Route          | Description                                                               |
| ------- | -------------- | ------------------------------------------------------------------------- |
| Home    | `/`            | Choreographed hero sequence, curated collections grid, exhibition feature |
| Work    | `/work`        | Filterable archive of collections across categories                       |
| Album   | `/work/[slug]` | Individual collection — hero, narrative, horizontal scroll gallery        |
| About   | `/about`       | Brand manifesto, team, creative approach                                  |
| Process | `/process`     | Multi-phase creative timeline                                             |
| Contact | `/contact`     | Portrait, form with Zod validation, studio details                        |
| Studio  | `/studio`      | Embedded Sanity CMS                                                       |

<!-- Replace with screenshots of key pages -->

![Home](screenshots/home.png)
![Work](screenshots/work.png)
![About](screenshots/about.png)

---

## The Stack

**Core Framework**
Next.js 16.2 · React 19.2 · TypeScript 5.7

**Animation & Motion**
GSAP 3.14 (ScrollTrigger, SplitText, Flip) · Framer Motion 12.37 (LazyMotion) · Lenis 1.3

**Styling**
Tailwind CSS 4.0 · CSS Custom Properties

**CMS & Data**
Sanity 5.16 · next-sanity 12.0

**State**
Zustand 5.0

**Utilities**
Zod 3.24 (validation) · Resend 4.0 (email) · Sharp 0.34 (image optimization) · Lucide React (icons)

---

## Getting Started

```bash
git clone https://github.com/Bamyani1/saffron-studios.git
cd saffron-studios
npm install
```

Create a `.env.local` from the example:

```bash
cp .env.example .env.local
```

```
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-11
SANITY_API_READ_TOKEN=your_read_token

# Email (Resend)
RESEND_API_KEY=re_your_api_key
CONTACT_EMAIL=hello@saffronstudios.com

# Site
NEXT_PUBLIC_SITE_URL=https://saffronstudios.com
```

```bash
npm run dev
```

---

> _Crafted with intention. Every pixel, every frame._

---

&copy; 2026 Saffron Studios
