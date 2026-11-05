# Risiti Digital Book

A frontend-only starting point for Risiti, with a responsive welcome page and a reusable design foundation. Built directly in the repository root.

Risiti is intended as a customisable digital receipt book PWA for Ugandan businesses, institutions, and individuals. This initial version implements only the frontend foundation described below.

## Requirements

- Node.js 22 or newer (Node.js 24 LTS recommended)
- npm (included with Node.js)
- A modern browser; use an up-to-date Chrome on Android for Tailwind CSS v4 support

## Install and develop

```bash
npm install
npm run dev
```

Open http://localhost:3000. Edit `src/app/page.tsx` to update the welcome page.

No environment variables, accounts, API keys, database, or backend services are required.

## Validate and run production

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

`typecheck` generates Next.js route types before running TypeScript in strict mode. ESLint runs separately from the production build. For repeatable installs from the committed lockfile, use `npm ci`.

## Stack

- Next.js 16 App Router and React 19
- Strict TypeScript, `src/` layout, and `@/*` imports
- Tailwind CSS v4 with its official PostCSS integration
- shadcn/ui (Radix Nova preset), Radix primitives, and Lucide icons
- ESLint with Next.js Core Web Vitals and TypeScript rules

The setup follows the [official Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation) and [shadcn/ui Next.js guide](https://ui.shadcn.com/docs/installation/next).

## Project structure

```text
src/app/                 App Router layout, welcome page, global CSS, metadata, manifest
src/components/          Shared app shell, Risiti brand, decorative book artwork
src/components/ui/       Editable shadcn/ui button and card primitives
src/lib/utils.ts         Shared class-name utility
public/icons/            Android, maskable, and Apple app icons
components.json          shadcn/ui configuration for Tailwind v4 and @/* aliases
postcss.config.mjs       Tailwind v4 PostCSS integration
AGENTS.md                Project conventions for future coding work
```

## Design foundation

Brand colours are CSS variables in `src/app/globals.css`, mapped to semantic shadcn/ui tokens and Tailwind utilities:

| Colour         | Value     | Usage                              |
| -------------- | --------- | ---------------------------------- |
| Primary Purple | `#7249BC` | Primary actions and brand emphasis |
| Accent Lime    | `#BEDE18` | Highlights with Deep Ink text      |
| Deep Ink       | `#1E1A34` | Navigation and primary text        |
| Soft White     | `#EEEEED` | Page background                    |
| White          | `#FFFFFF` | Cards and contrasting text         |

Geist is used for interface text and headings through `next/font`, which self-hosts the font in production. Geist is the chosen heading fallback; no Satoshi font files or licence are bundled. The initial build downloads Geist from Google Fonts, so internet access is required at build time.

Reusable typography utilities are `text-display`, `text-heading`, `text-body`, and `eyebrow`. Use `page-container` for consistent responsive page widths. Use the button and card primitives from `@/components/ui/`. Primary buttons have 44px minimum height; large buttons have 48px height. Focus indicators, a skip link, scalable text, and reduced-motion preferences are supported. Decorative artwork uses CSS and SVG without large image downloads or an animation library.

Add another shadcn/ui primitive with:

```bash
npx shadcn add <component>
```

Review generated changes and retain the Risiti tokens and mobile touch targets.

## PWA foundation and scope

`src/app/manifest.ts` serves `/manifest.webmanifest`, including standalone display, brand colours, and 192px/512px icons. A separate maskable icon and Apple touch icon are included. Metadata includes the app title, description, viewport, and theme colour.

This is a manifest foundation, not a complete offline PWA: there is no service worker, offline cache, push notification support, or custom install prompt. Production PWA capabilities require HTTPS (localhost is allowed for local testing).

Only the welcome page is implemented. Authentication, dashboards, receipts, designers, business management, backend services, Supabase, payments, and AI features are intentionally out of scope.

## Windows certificate troubleshooting

If a trusted corporate certificate causes npm or the font download to fail, Node.js 24 can use the Windows system trust store. In PowerShell, run this before installation or build:

```powershell
$env:NODE_OPTIONS = "--use-system-ca"
```

Keep certificate verification enabled.

## Initial validation

The initial setup passed `npm install`, ESLint with zero warnings, strict TypeScript checks, and a production build. Chromium checks covered 320, 360, 390, 768, and 1440px widths, working section links, keyboard skip navigation, reduced-motion styles, metadata, manifest, and icon responses. No horizontal overflow or browser errors were found. Real Android hardware testing has not been performed.

At initialization, `npm audit --omit=dev` reported zero production vulnerabilities. The full audit reported 13 development-tooling advisories (2 low, 11 moderate) through shadcn and ESLint transitive dependencies. A compatible `npm audit fix` did not resolve them; its proposed forced changes downgrade the requested tooling, so those changes were not applied.

Source repository: [wanyamaedwin/risiti-digital-book-mobile-app](https://github.com/wanyamaedwin/risiti-digital-book-mobile-app).
