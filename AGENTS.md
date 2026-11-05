<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Risiti project conventions

- Work in this repository root. Keep application code in `src/`; use the `@/*` alias.
- Use npm and commit `package-lock.json`. Node.js 24 LTS is recommended; Node.js 22+ is supported.
- Read the relevant installed Next.js guides before changes. Follow App Router conventions and current deprecation notices.
- Keep TypeScript strict. Prefer explicit types, avoid `any`, and do not bypass build or lint errors.
- Prefer Server Components. Add `"use client"` only where browser state or interactivity needs it.
- Step 3 is frontend-only: existing design system/shell, sample account entry, guided setup, and planned feature placeholders. Do not add real authentication, functional dashboards, receipt issuance, backend services, Supabase, payments, AI, or business management without a new user request.
- Use Tailwind CSS v4's CSS-first tokens in `src/app/globals.css`; there is no legacy Tailwind configuration file. Keep the PostCSS integration in `postcss.config.mjs`.
- Preserve all five official Risiti colours. Use semantic tokens for components; pair lime with Deep Ink for readable text.
- Use Geist for interface text and headings. Introduce Satoshi only when its font files and a suitable licence are supplied and verified.
- Keep `components.json` configured for Tailwind v4, Lucide, and the existing import aliases. Reuse and adapt the shadcn/ui button and card components in `src/components/ui/`.
- Use `page-container`, `text-display`, `text-heading`, `text-body`, and `eyebrow` for consistent layout and typography.
- Design mobile first, checking 320px and 360px widths as well as desktop. Avoid horizontal scrolling, heavy animation, unnecessary client JavaScript, and large assets.
- Provide semantic HTML, real link destinations, visible keyboard focus, accessible names, 44px touch targets for primary actions, and reduced-motion support.
- Keep the public header/footer in `src/components/app-shell.tsx` and its route group in `src/app/(public)/`. The workspace AppShell is in `src/components/layout/app-shell.tsx`; do not wrap public pages in the workspace shell. Keep the R. placeholder and icon assets consistent.
- `src/app/manifest.ts` provides metadata only. Do not describe the app as offline-capable until a service worker and its lifecycle have been implemented and verified.
- Before delivery run `npm install`, `npm run lint`, `npm run typecheck`, and `npm run build`. Fix failures and report any external setup limitations accurately.
- Update README.md when commands, prerequisites, structure, or scope change. Never delete or overwrite Git metadata.
- Keep workspace routes under `/w/[workspaceId]`. Await route params and validate the workspace against fixtures until a real workspace data source is explicitly requested.
- Keep navigation and role lists in `src/config/navigation.ts`. Role visibility is presentation, never authorization. Cashier navigation must remain limited to Home, New Receipt, and My History; future record access must be checked by the backend within the workspace and user scope.
- Keep demo fixtures in `src/data/demo.ts`. Never hard-code mock workspace identity in layout components. All financial examples must be labelled demo and use the shared whole-shilling UGX formatter.
- Reuse shadcn/ui primitives through small semantic wrappers. FormField supplies labels, descriptions, and error associations to the App form controls. Do not add financial persistence to the interface preview.
- Import `cn` from `@/lib/utils`, including in generated primitives. The helper registers semantic typography sizes so text-colour utilities do not remove them.
- The mobile/desktop breakpoint is 1024px. Main content and sticky form actions share `--mobile-nav-clearance`; keep bottom safe-area spacing intact. Never show the bottom nav and desktop sidebar simultaneously.
- Use the workspace typography utilities documented in `docs/DESIGN_SYSTEM.md`; important text and metadata must be at least 12px. Preserve the existing public display scale.
- Keep `usePathname` consumers inside Suspense boundaries for unknown dynamic params with Cache Components; generate known demo route params at build time.
- For workspace or component changes, run `npm run test:e2e` after a production build. Test files live in `tests/`; browser installation instructions are in README.md. Inspect all eight documented viewport widths and preserve keyboard focus behavior.
- Do not use `npm audit fix --force`, weaken certificate validation, change Git remotes, or push code unless the user explicitly authorizes those actions for the current task.
- Keep account entry and Quick Setup in `src/app/(entry)/`, outside both workspace navigation and the public landing layout. Use lime with Deep Ink for their primary actions; preserve existing brand tokens and shells.
- Use Zod and React Hook Form for account/detail validation. Account entry and verification are clearly labelled previews; never claim an account was created, a code was sent, or a user was authenticated.
- Keep password, OTP, phone, email, address, and logo data out of onboarding storage. Credentials stay only in form memory. Only allowlisted fictional display/setup configuration may enter the versioned `risiti:onboarding:v1` sessionStorage key.
- Keep one shared conditional wizard and typed states in `src/types/onboarding.ts`. Expense-only setup skips the book step. Preserve Back/Continue, validated restoration, Start Over, and idempotent completion. Never create records in a completion effect.
- Reuse `src/data/receipt-templates.ts` and `src/types/receipt-template.ts`. Categories suggest but never restrict template selection. Keep financial system fields distinguishable from configurable display fields. Do not implement the full designer or issue receipts here.
- `/w/setup` adapts this tab's completed draft into the existing shell. Keep fixture demos intact, preserve role-scoped presentation, and do not infer permissions or login from a completed draft.
- Run the original 18 regression tests and the additional account/onboarding tests after a build. Test the documented eight viewport widths, short viewports, keyboard interactions, storage exclusions, restoration, reset, and both workspace journeys. See `docs/ONBOARDING_FLOW.md`.
- Cache Components retains hidden pages with React Activity. Keep explicit layout-effect cleanup for account credentials and wizard contacts/logo; changing wizard steps must retain those optional details, while leaving the route must clear them. Read the installed `preserving-ui-state.md` guide before changing this behavior.
