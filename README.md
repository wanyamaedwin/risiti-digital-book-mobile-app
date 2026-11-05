# Risiti Digital Book

A frontend-only foundation for Risiti, with the original welcome page, a responsive demo workspace shell, a reusable design system, demo account entry, guided Quick Setup, and business/personal demonstration dashboards. Step 4 extends the existing project directly in the repository root.

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

Open http://localhost:3000 for the welcome page or http://localhost:3000/w/demo/home for the demo workspace. The welcome page is in `src/app/(public)/page.tsx`.

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
- Zod and React Hook Form with the Zod resolver for account/setup validation

The setup follows the [official Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation) and [shadcn/ui Next.js guide](https://ui.shadcn.com/docs/installation/next).

## Project structure

```text
src/app/(public)/         Original welcome page and public layout
src/app/(entry)/          Account entry previews and guided Quick Setup
src/app/w/[workspaceId]/  Shared workspace layout and small route files
src/components/ui/        Editable shadcn/ui primitives
src/components/layout/    Workspace shell, header, sidebar, and page patterns
src/components/navigation/ Pathname-aware navigation and breadcrumbs
src/components/shared/    Buttons, cards, fields, type, amounts, badges, avatars
src/components/feedback/  Placeholders, empty/loading states, confirmation dialog
src/features/workspaces/  Workspace switcher, home, More, interface preview
src/features/dashboard/   Dashboard components, scoped fixtures, selectors, types, filters
src/features/account/     Demo-only account forms and branded entry layout
src/features/onboarding/  Wizard, conditional details, templates, tab draft store
src/config/               Typed navigation, role presentation, features, icons
src/data/                 Fictional users and workspaces
src/types/                Workspace-scoped roles and fixture types
src/lib/                  Class-name helper and whole-shilling UGX formatter
public/icons/             Android, maskable, and Apple app icons
tests/                    Playwright browser and foundation regression checks
docs/                     Design system and frontend architecture
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

The welcome page, workspace UI foundation, account entry previews, and guided Quick Setup are implemented. Business feature destinations are explicitly labelled planned placeholders. Business and personal dashboards now derive figures from fictional records. Real authentication, receipt issuance, designers, backend services, Supabase, payments, and AI features remain out of scope.

## Step 3 account entry and Quick Setup

Use Get Started on the welcome page or open `/onboarding`. Account form previews are at `/sign-in`, `/create-account`, `/verify`, and `/forgot-password`. Explore Demo always enters the existing demo workspace without an account.

The shared wizard supports Business / Institution and Personal Use, conditional details, three intended-use choices, nine optional receipt designs, editable review, and explicit demo success. Expense-only setup skips receipt designs. Any category can use any design, start blank, or customise later.

Only the fictional workspace name and non-sensitive setup choices are retained in a versioned sessionStorage draft for this tab. Optional contact details and logo previews are in memory only and clear on refresh/leaving. Passwords and verification codes are never stored or sent. Start Over clears the draft. Completion reuses `/w/setup/home`, showing the chosen name and recommended shortcuts through the existing workspace shell. Refreshing does not generate additional workspaces or receipts.

Use made-up details. No account, online workspace, authentication session, or receipt is created. See [Onboarding flow](docs/ONBOARDING_FLOW.md) for exact routes, validation, template definitions, storage boundaries, demo behavior, and future integration points.

## Step 4 dashboards

Business Home includes net money received, issued-document counts, outstanding bill balances, confirmed payment counts, recorded expenses, recent receipts/activity, and lightweight chart data. Personal Home separates outgoing expense receipts from receipts issued for money collected, with spending totals, categories and personal shortcuts. Use the existing workspace menu to switch between the populated business, populated personal, and empty sample experiences.

Demo records use **5 November 2026** as an explicit fixed reporting date in **Africa/Kampala**. Today means the selected date; week starts Monday and month starts on day one, ending on that selected date. The labelled period, date and business branch controls recalculate visible figures, records and chart data. Outstanding amounts are as of the selected date, across all valid bills rather than just bills created in that period. Nothing is saved or sent by these filters.

Setup choices control emphasis for Issue Receipts, Record Expenses or Both; other permitted tools remain accessible. Completed `/w/setup` configurations always get empty data, never seeded business/personal transactions. All create, scan, export, payment and report actions lead to explicitly planned pages; no backend operation happens. Existing notifications remain a demo dialog. Other role dashboards use conservative future-view configurations and never inherit owner financial visibility; frontend presentation is not secure authorization.

See [Dashboard specification](docs/DASHBOARD_SPECIFICATION.md) for models, rules, demo totals, date boundaries, empty states and integration points. No runtime dependencies were added for dashboards; charts use CSS and accessible tables.

## Workspace routes

- `/w/demo/home`: populated Business Owner dashboard for Kampala Traders.
- `/w/personal/home`: distinct personal spending and issued-receipt dashboard.
- `/w/sample/home`: empty Wakiso Supplies business dashboard.
- `/w/setup/home`: honest empty business/personal dashboard using completed setup preferences.
- `/w/demo/receipts`, `/w/demo/receipt-books`, `/w/demo/expenses`, `/w/demo/payments`, `/w/demo/customers`, `/w/demo/catalog`, `/w/demo/reports`, `/w/demo/staff`, `/w/demo/branches`, `/w/demo/settings`: planned-feature pages.
- `/w/demo/receipts/new`: future receipt creation placeholder; no issuance or financial workflow.
- `/w/demo/more`: complete workspace navigation on mobile.
- `/w/demo/design-system`: interactive component and page-pattern preview. No values are persisted.
- `/w/demo/receipts/history`: scoped-history placeholder for the future Cashier navigation foundation.

`/w/demo` redirects to Home. A second fictional workspace at `/w/sample/home` demonstrates switching without hard-coded layout identity. Unknown workspaces and unknown features show the Next.js not-found page.

Below 1024px, navigation floats above the bottom safe area and offers Home, Create, Receipts, Expenses, and More. At 1024px and wider, a grouped Deep Ink sidebar replaces it. Active states follow the pathname. Main content and sticky form actions reserve the same safe-area clearance as the navigation.

The active demo role is Business Owner. Other typed roles provide navigation presentation only. Cashier navigation is limited to Home, New Receipt, and My History. No role is authenticated or enforced; backend workspace and record-level permission checks are required before real data is introduced.

See [Design system](docs/DESIGN_SYSTEM.md) for tokens and components and [Frontend architecture](docs/FRONTEND_ARCHITECTURE.md) for routes, roles, fixtures, and future integration boundaries.

## Browser regression checks

```bash
npx playwright install chromium --no-shell
npm run build
npm run test:e2e
```

Playwright is a development dependency. The suite starts a production server on port 3210 and uses full Chromium (no separate headless-shell download). Close any process already occupying that port first. Tests run with one browser worker and screenshots on failure to limit resource usage; add `-- --trace=on` to the test command when detailed tracing is needed. It checks all eight requested widths, navigation and planned routes, workspace switching, keyboard focus and dialogs, local form validation, filters, reduced motion, and the public welcome page. Regression checks also cover Cashier navigation and UGX formatting. Screenshots and failure artifacts are written under the Git-ignored `.next/` directory. Safe-area values are included in CSS; browser emulation does not replace tests on physical Android devices.

## Windows certificate troubleshooting

If a trusted corporate certificate causes npm or the font download to fail, Node.js 24 can use the Windows system trust store. In PowerShell, run this before installation or build:

```powershell
$env:NODE_OPTIONS = "--use-system-ca"
```

Keep certificate verification enabled.

## Validation history

Step 4 passed `npm install`, ESLint with zero warnings, strict TypeScript checks, production build (84 generated pages), and all **71 tests**: 41 preserved regressions plus 12 dashboard calculation/contract tests and 18 dashboard browser checks. Both populated dashboards were checked at 320, 360, 375, 390, 428, 768, 1024 and 1440px without horizontal overflow or page runtime errors. Browser checks verify filters and chart values, branch/date changes, workspace switching, all quick-action destinations, empty sample/setup views and all six setup preference combinations. Visual review covered both dashboards on mobile and desktop; the primary amount was moved ahead of filters on phones. A workspace-switch assertion was corrected to account for Next.js Activity retaining hidden pages. Production dependency audit reports zero vulnerabilities; installation still reports 13 existing development-tooling advisories. No runtime dependencies were added. Physical Android performance/keyboard testing and a formal screen-reader audit remain unperformed.

Step 3 passed installation, ESLint with zero warnings, strict TypeScript checks, production build, and all 41 regression tests (the original 18 plus 23 account/setup checks). Browser checks covered 320, 360, 375, 390, 428, 768, 1024, and 1440px, plus short keyboard-like viewports. They verify business/personal setup, optional/custom fields, local logo validation, template/scratch/deferral choices, review/edit, refresh restoration, Start Over, duplicate completion, storage unavailability, credential handling, and existing public/workspace navigation. A corrected optional-details panel and explicit Next.js Activity cleanup preserve step progress while clearing memory-only information after leaving a route. Production audit still reports zero vulnerabilities; the existing 13 development-tooling advisories remain. Physical Android/keyboard testing has not been performed.

Step 2 passed installation, ESLint with zero warnings, strict TypeScript checks, production build, and all 18 browser/foundation regression tests. The suite covers all eight requested widths. Visual review caught and fixed semantic typography being dropped by class merging and a narrow navigation-label fit issue at 320px. Functional text/surface colour pairs were also checked against a 4.5:1 contrast target.

Concurrent traced Chromium runs intermittently stalled in this Windows environment; the complete suite passed with one worker and tracing off, now the defaults. The system temporary drive was also nearly full, so browser temporary files were redirected to the repository drive for validation. Step 4 also redirected npm cache/logs after the system drive reported ENOSPC; this avoids deleting user files. If your temporary drive is short of space, use this in the current PowerShell session before running browser checks:

```powershell
New-Item -ItemType Directory -Path .next/browser-tmp -Force | Out-Null
$env:TEMP = (Resolve-Path .next/browser-tmp).Path
$env:TMP = $env:TEMP
$env:npm_config_cache = Join-Path $PWD ".next/npm-cache"
npm run test:e2e
```

The initial setup passed `npm install`, ESLint with zero warnings, strict TypeScript checks, and a production build. Chromium checks covered 320, 360, 390, 768, and 1440px widths, working section links, keyboard skip navigation, reduced-motion styles, metadata, manifest, and icon responses. No horizontal overflow or browser errors were found. Real Android hardware testing has not been performed.

At initialization, `npm audit --omit=dev` reported zero production vulnerabilities. The full audit reported 13 development-tooling advisories (2 low, 11 moderate) through shadcn and ESLint transitive dependencies. A compatible `npm audit fix` did not resolve them; its proposed forced changes downgrade the requested tooling, so those changes were not applied.

Source repository: [wanyamaedwin/risiti-digital-book-mobile-app](https://github.com/wanyamaedwin/risiti-digital-book-mobile-app).
