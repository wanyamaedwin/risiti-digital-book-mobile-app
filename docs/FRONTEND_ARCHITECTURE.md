# Risiti frontend architecture

## Scope and rendering

Step 2 is a frontend foundation: a demo shell, design system, typed navigation, and explicit future-feature pages. There is no authentication, authorization enforcement, backend integration, persistence, receipt issuance, payment processing, scanning, PDF generation, or service worker.

The root layout owns Geist, global CSS, viewport, and basic metadata. `app/(public)/layout.tsx` uses the original public AppShell, preserving the welcome page outside the workspace shell. `app/w/[workspaceId]/layout.tsx` resolves a fictional workspace and composes the new workspace AppShell. Both share the root layout, so the original manifest and icons remain global.

Layouts and route pages are Server Components by default. Pathname-aware navigation, workspace menus, dialogs, form controls, and the interface preview are small Client Components. User and workspace props are serializable typed fixtures. There are no network calls for business data.

## Routes

| Route under `/w/[workspaceId]`                                           | Implementation                                                          |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------- |
| `/`                                                                      | Redirect to workspace Home                                              |
| `/home`                                                                  | Demo introduction, workspace details, planned entry points, empty state |
| `/more`                                                                  | Role-aware navigation cards grouped by section                          |
| `/design-system`                                                         | Local-only component and pattern preview                                |
| `/receipts`, `/receipt-books`, `/expenses`, `/payments`                  | FeaturePlaceholder                                                      |
| `/customers`, `/catalog`, `/reports`, `/staff`, `/branches`, `/settings` | FeaturePlaceholder                                                      |
| `/receipts/new`                                                          | Explicit future receipt-creation placeholder                            |
| `/receipts/history`                                                      | Future personally scoped cashier-history placeholder                    |

Known feature paths are configured in `src/config/features.ts` and resolved by `[...feature]/page.tsx`. Unknown feature paths call `notFound`; the catch-all does not fabricate generic working pages. Specific Home, More, and interface-preview routes take precedence. Route files only resolve params, metadata, and page composition.

Route params are awaited per the installed Next.js version. Known workspaces and feature paths are generated with `generateStaticParams`. Pathname consumers have Suspense boundaries to support unknown dynamic params under Cache Components and Partial Prefetching. Those framework options remain enabled. Invalid workspace IDs return not-found UI before fixture content is rendered.

## Roles and navigation

`types/workspace.ts` defines Business Owner, Manager, Cashier, Accountant, Individual, and Platform Administrator roles. The role belongs to the workspace membership fixture, not globally to the user. `config/navigation.ts` contains typed item definitions, groups, role presentation lists, URL construction, mobile selection, and active-state helpers. Icon identifiers resolve through the explicit Lucide map in `config/icons.ts`.

The Business Owner demo has the requested Overview, Business, and Management groups. Mobile navigation uses Home, Create, Receipts, Expenses, and More; Create links to `/receipts/new`. Desktop uses the sidebar and a New receipt entry point. More selects secondary pages on mobile, while nested creation selects only Create rather than Receipts.

Cashier navigation contains exactly Home, New Receipt, and My History. It does not include workspace-wide records, reports, expenses, payments, staff, or management. Platform Administrator does not automatically inherit owner financial visibility. These are preliminary frontend navigation lists, not finalized product permission policies.

**Hiding navigation is not access control.** All known demo feature URLs remain directly addressable because they contain no live data. No authentication or security boundary is implied by a role list. A future backend must validate membership, workspace, branch, role, and record scope for every read and mutation. Cashier history must be limited to that user's permitted records. Do not reuse a presentation filter as an authorization function.

## Mock data and workspace switching

`data/demo.ts` contains a fictional user with an `example.com` email, Kampala Traders (`demo`, Main Branch, Business Owner, UGX), and Wakiso Supplies (`sample`, Wakiso Branch, Business Owner, UGX). Both are marked demo. The switcher links to each workspace's Home; identity comes from route-resolved fixture props. No global store, cookies, localStorage, remote service, or persistence is used.

The Home page contains no fake sales totals or transaction feed. Only the interface preview shows a labelled sample UGX amount to exercise CurrencyAmount and StatCard. Search and filters operate on sample component descriptions, not fake business records. Form validation, switches, reset confirmation, and result messages affect only local React state. Values reset on leaving/reloading the page.

## Reusable UI boundaries

```text
components/ui/            shadcn/ui and Radix primitives
components/layout/        Workspace shell, headers, sidebar, and page patterns
components/navigation/    Pathname-aware navigation and breadcrumbs
components/shared/        Semantic controls, cards, type, status, avatars
components/feedback/      Empty/loading, confirmation, planned features
features/workspaces/      Workspace-specific page compositions and switcher
config/                   Navigation, feature descriptions, explicit icon map
data/                     Typed mock fixtures
types/                    Roles and workspace/user contracts
lib/                      Shared currency and class-name utilities
tests/                    Browser interactions and foundation regression checks
```

The existing `components/app-shell.tsx` remains the public shell; `components/layout/app-shell.tsx` is the workspace shell. Their names express the same broad pattern but they do not render together. Public links and metadata are preserved.

## Validation

Run `npm install`, `npm run lint`, `npm run typecheck`, `npm run build`, then `npm run test:e2e`. The Playwright suite serves the production build on port 3210 with one worker and optional tracing. Full Chromium is installed separately with `npx playwright install chromium --no-shell`; no production dependency is added for browser tooling. README.md documents the temporary-storage workaround used on this Windows machine.

Coverage includes the requested 320, 360, 375, 390, 428, 768, 1024, and 1440px widths; navigation visibility/selection; 44px mobile destinations; content clearance; all feature routes; workspace switching; dialog keyboard focus and restoration; labels and errors; local search/filter/switch behavior; reduced motion; invalid routes; and the original public page and manifest. Foundation checks cover role isolation, known route destinations, nested active states, and whole-shilling currency formatting. Screenshots/failure artifacts live under `.next/` and stay out of Git.

This does not replace manual accessibility review, physical Android testing, or performance checks on a real low-cost device. Functional colour pairs and focus states should be rechecked when tokens change. Browser emulation tests layout, not hardware performance.

## Future integration boundaries

Step 3 requires a separately agreed scope. Future work may replace fixture resolution with authenticated workspace membership, introduce scoped data repositories and permission checks, and connect real feature pages. Keep navigation URLs workspace-scoped, business state outside generic UI primitives, amounts validated before persistence, and errors distinguishable from empty results. Do not add these services during Step 2.

The manifest remains a PWA metadata foundation. Offline caches, service-worker update/lifecycle handling, real installation flows, EFRIS, and subscriptions require separate implementation and validation. No financial operation is currently possible.
