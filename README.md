<div align="center">

# FLORA STUDIO

_Photography that's worth keeping._

![Next.js 16](https://img.shields.io/badge/Next.js-16.2-0B0C0E?style=flat-square&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.2-0B0C0E?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-0B0C0E?style=flat-square&logo=typescript)
![Tailwind 4](https://img.shields.io/badge/Tailwind-4.0-0B0C0E?style=flat-square&logo=tailwindcss)
![GSAP](https://img.shields.io/badge/GSAP-3.14-0B0C0E?style=flat-square&logo=greensock)
![Lenis](https://img.shields.io/badge/Lenis-1.3-0B0C0E?style=flat-square)
![Sanity](https://img.shields.io/badge/Sanity-5.16-0B0C0E?style=flat-square&logo=sanity)
![Zustand](https://img.shields.io/badge/Zustand-5.0-0B0C0E?style=flat-square)

[**View the live site &rarr;**](https://floraohio.com)

</div>

---

## Overview

A photography studio portfolio built on patience and craft. Every frame is composed with intention, selected with care, and refined by hand. The site pairs a cinematic, GSAP-choreographed hero with an editorial gallery engine and a headless Sanity CMS that the studio can update without touching code.

---

## Tech Stack

| Layer         | Tools                                                                              |
| ------------- | ---------------------------------------------------------------------------------- |
| **Framework** | Next.js 16.2 (App Router, Server Components), React 19.2, TypeScript 5.7           |
| **Styling**   | Tailwind CSS 4.0 with `@theme` design tokens                                       |
| **Motion**    | GSAP 3.14 (ScrollTrigger, SplitText, Flip), Lenis 1.3 smooth scroll                |
| **CMS**       | Sanity 5.16 with an embedded studio at `/studio`, next-sanity 12.0                 |
| **State**     | Zustand 5.0                                                                        |
| **Forms**     | Server Actions + Zod validation + Nodemailer (iCloud SMTP)                         |
| **Media**     | Sharp image pipeline, Next.js Image with AVIF/WebP                                 |
| **Testing**   | Vitest (unit + component), Playwright (e2e + cookie consent)                       |
| **Infra**     | Vercel, GitHub Actions CI, Vercel Analytics & Speed Insights                       |

---

## Highlights

- **Cinematic hero** — a GSAP-choreographed sequence with SplitText line reveals, ScrollTrigger-driven parallax, and a custom image rotator that respects `prefers-reduced-motion`.
- **Editorial gallery engine** — a single `FolioGallery` component renders 11 layout types (panoramic, editorial-left/right, staggered-pair, trio-mosaic, full-bleed, diptych, and more) with orientation-aware image sequencing.
- **Headless content with graceful fallback** — a content runtime auto-detects local, preview, and production modes; Sanity fetch failures fall back to typed placeholders in development and fail loudly in production via a dedicated `ContentUnavailableError`.
- **Server Actions only** — every mutation goes through a typed Server Action. No REST or GraphQL API routes anywhere in the codebase.
- **Embedded studio** — Sanity Studio ships inside the Next.js app at `/studio` with schema-validated content types and live preview.
- **Design tokens as source of truth** — color, typography, spacing, motion, and layout values live as CSS custom properties inside a single `@theme` block. There is no `tailwind.config.js`.
- **Named animation presets** — every GSAP animation is declared in a central registry with a required `reducedMotionFallbacks` entry, so reduced-motion support is enforced at the preset level rather than per usage.
- **Full test coverage** — 71 unit/component tests, 23 Playwright e2e tests, and a separate cookie-consent e2e suite. CI runs the full gate on every push.
- **Security-first headers** — strict Content-Security-Policy, HSTS with preload, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` configured in `vercel.json`.
- **Performance-tuned** — Lighthouse mobile scores: home 74 / 91 / 96 / 100, gallery 75 / 96 / 96 / 100, contact 75 / 100 / 96 / 100 (performance / a11y / best practices / SEO).

---

## Architecture

- **Server Components by default.** `"use client"` is only used where browser APIs, state, or event handlers are required.
- **Smooth scroll** is driven by Lenis, synchronized with the GSAP ticker in a root provider and fully reduced-motion aware.
- **Content runtime modes** are controlled by the `CONTENT_RUNTIME_MODE` environment variable: `local` (soft fallback to placeholders), `preview` (draft content from Sanity), `production` (fails loudly via `ContentUnavailableError`), and `e2e` (checked-in fixture data for deterministic tests).
- **Route groups** cleanly separate `(site)` for public pages from `(studio)` for the embedded Sanity CMS.
- **Validation** uses Zod for both the contact form and Sanity content schemas.
- **SEO & metadata** are centralized: a single `baseMetadata` export and JSON-LD builders for `LocalBusiness`, `ImageGallery`, `Person`, and `BreadcrumbList`.

---

## Design System

The _Darkroom Moss_ palette and every visual value are defined as CSS custom properties inside the `@theme` block in `src/styles/globals.css`:

| Category       | Examples                                                                                       |
| -------------- | ---------------------------------------------------------------------------------------------- |
| **Colors**     | `#242820` background, `#303528` surface, `#c97b2a` primary, `#e8dfd4` text, `#8a9878` muted    |
| **Typography** | Cormorant Garamond display, Inter body                                                         |
| **Motion**     | Durations from `100ms` instant to `3500ms` hero, with `ease-out-expo` for signature reveals    |
| **Layout**     | 1440px max width, 80px header, 32px container padding                                          |

---

## Pages

| Page    | Route          | Description                                                               |
| ------- | -------------- | ------------------------------------------------------------------------- |
| Home    | `/`            | Choreographed hero sequence, curated collections grid, exhibition feature |
| Work    | `/work`        | Filterable archive of collections across categories                       |
| Album   | `/work/[slug]` | Individual collection — hero, narrative, and editorial gallery            |
| About   | `/about`       | Brand manifesto, team, creative approach                                  |
| Process | `/process`     | Multi-phase creative timeline                                             |
| Contact | `/contact`     | Portrait, Zod-validated form via Server Action, studio details            |
| Studio  | `/studio`      | Embedded Sanity CMS for content editing                                   |

---

<div align="center">

[**floraohio.com &rarr;**](https://floraohio.com)

&copy; 2026 Flora Studio

</div>
