<div align="center">

# BAHAR STUDIO

_Photography that's worth keeping._

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

## Overview

A photography studio portfolio built on patience and craft. Every frame is composed with intention, selected with care, and refined by hand.

[View the live site &rarr;](https://studiobahar.com)

---

## Tech Stack

| Layer | Tools |
| --- | --- |
| **Framework** | Next.js 16.2, React 19.2, TypeScript 5.7 |
| **Styling** | Tailwind CSS 4.0, CSS custom properties (`@theme` directives in `src/styles/globals.css`) |
| **Animation** | GSAP 3.14 (ScrollTrigger, SplitText, Flip), Lenis 1.3 |
| **CMS** | Sanity 5.16, next-sanity 12.0 |
| **State** | Zustand 5.0 |
| **Utilities** | Zod 3.24 (validation), Nodemailer 8.0 via iCloud SMTP (email), Sharp 0.34 (image processing), Lucide React (icons) |
| **Testing** | Vitest 4.1 (unit/component), Playwright 1.58 (e2e) |

---

## Getting Started

```bash
git clone https://github.com/Bamyani1/bahar-studio.git
cd bahar-studio
npm install
```

Copy the environment template:

```bash
cp .env.example .env.local
```

Required variables:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset (default: `production`) |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version |
| `SANITY_API_TOKEN` | Sanity write token |
| `SANITY_READ_TOKEN` | Sanity viewer token |
| `ICLOUD_SMTP_USER` | iCloud SMTP mailbox for contact form |
| `ICLOUD_SMTP_PASS` | iCloud app-specific password |
| `CONTACT_EMAIL` | Verified sender/inbox address |
| `CONTACT_DELIVERY_MODE` | Set to `stub` for local dev (skips email sending) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT` | Enable cookie consent banner (`true`/`false`) |

```bash
npm run dev
```

---

## Project Structure

```
src/
├── app/
│   ├── (site)/           # Main site routes (/, /about, /work, /contact, etc.)
│   ├── (studio)/         # Sanity CMS admin at /studio
│   └── contact/          # Contact form server action
├── components/
│   ├── animations/       # GSAP-powered animation components
│   ├── layout/           # Header, Footer, MobileMenu, TransitionOverlay
│   ├── landing/          # Homepage sections
│   ├── sections/         # Reusable page sections
│   └── ui/               # Primitive UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities, animation presets, content runtime
├── providers/            # GSAP/Lenis initialization
├── sanity/               # CMS client, queries, schemas
├── stores/               # Zustand UI state
├── styles/               # Design tokens and global styles
└── types/                # TypeScript type definitions

tests/
├── unit/                 # Vitest unit tests
├── component/            # React component tests
├── e2e/                  # Playwright e2e tests
└── setup/                # Test configuration
```

---

## Architecture

- **Server Components by default** — `"use client"` only when the component needs browser APIs, state, effects, or event handlers.
- **Tailwind CSS 4.0** — design tokens defined via `@theme` directives in `src/styles/globals.css`. There is no `tailwind.config.js`.
- **Named animation presets** — all animations use presets from `src/lib/animations.ts` and easings from `src/lib/easings.ts`. GSAP plugins are imported from `src/lib/gsap.ts`.
- **Smooth scroll** — Lenis synced to the GSAP ticker in `src/providers/Providers.tsx`. Respects `prefers-reduced-motion`.
- **Content runtime policy** — controlled by `CONTENT_RUNTIME_MODE` env var:
  - `local` (default in dev): soft-fallback to placeholder data when Sanity is unreachable
  - `preview` (Vercel preview deploys): same soft-fallback behavior
  - `production`: fails loudly via `ContentUnavailableError`
  - `e2e`: uses checked-in fixture data
- **Sanity CMS** — embedded studio at `/studio` with schemas in `src/sanity/schemas/`.

---

## Design Tokens

The "Darkroom Moss" palette and all visual values are defined as CSS custom properties inside the `@theme` block in `src/styles/globals.css`:

| Category | Examples |
| --- | --- |
| **Colors** | `--color-background` (#242820), `--color-surface` (#303528), `--color-primary` (#c97b2a), `--color-text` (#e8dfd4), `--color-muted` (#8a9878) |
| **Typography** | `--font-display` (Cormorant Garamond), `--font-body` (Inter), `--text-xs` through `--text-hero` |
| **Spacing** | `--space-1` (4px) through `--space-64` (256px) |
| **Motion** | `--duration-instant` (100ms) through `--duration-hero` (3500ms), `--ease-out`, `--ease-in-out`, `--ease-out-expo` |
| **Z-Index** | `--z-grain` (2) through `--z-cursor` (100) |
| **Layout** | `--max-width` (1440px), `--header-height` (80px), `--container-padding-x` (32px) |

> Source of truth: `src/styles/globals.css`

---

## Pages

| Page | Route | Description |
| --- | --- | --- |
| Home | `/` | Choreographed hero sequence, curated collections grid, exhibition feature |
| Work | `/work` | Filterable archive of collections across categories |
| Album | `/work/[slug]` | Individual collection — hero, narrative, gallery |
| About | `/about` | Brand manifesto, team, creative approach |
| Process | `/process` | Multi-phase creative timeline |
| Contact | `/contact` | Portrait, form with Zod validation, studio details |
| Privacy | `/privacy` | Privacy policy |
| Terms | `/terms` | Terms of service |
| Studio | `/studio` | Admin-only Sanity CMS. Excluded from `robots.txt`. |

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript check (`tsc --noEmit`) |
| `npm run test:unit` | Vitest unit/component tests |
| `npm run test:e2e` | Playwright e2e suite (port 3101) |
| `npm run test:e2e:consent` | Playwright cookie consent suite (port 3102) |
| `npm run test:e2e:all` | Both e2e suites |
| `npm run test` | Unit tests + all e2e |
| `npm run verify` | Full pipeline: lint → type-check → unit → e2e → build |
| `npm run images:validate` | Validate source image structure |
| `npm run images:process` | Optimize images from `pictures/` into `public/images/` |

---

## Testing

**Unit and component tests** run with Vitest in a jsdom environment (`tests/unit/`, `tests/component/`).

**E2E tests** run with Playwright on Chromium:
- Main suite on `127.0.0.1:3101` with `CONTENT_RUNTIME_MODE=e2e` and `CONTACT_DELIVERY_MODE=stub`
- Cookie consent suite on port 3102 with `NEXT_PUBLIC_ENABLE_COOKIE_CONSENT=true`

E2E tests use checked-in fixture data, so they don't depend on live Sanity state.

```bash
npm run verify
```

---

&copy; 2026 Bahar Studio
