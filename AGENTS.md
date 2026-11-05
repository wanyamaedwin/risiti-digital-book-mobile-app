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
- This phase is frontend-only. Do not add authentication, dashboards, receipt tools, backend services, Supabase, payments, AI, or business management without a new user request.
- Use Tailwind CSS v4's CSS-first tokens in `src/app/globals.css`; there is no legacy Tailwind configuration file. Keep the PostCSS integration in `postcss.config.mjs`.
- Preserve all five official Risiti colours. Use semantic tokens for components; pair lime with Deep Ink for readable text.
- Use Geist for interface text and headings. Introduce Satoshi only when its font files and a suitable licence are supplied and verified.
- Keep `components.json` configured for Tailwind v4, Lucide, and the existing import aliases. Reuse and adapt the shadcn/ui button and card components in `src/components/ui/`.
- Use `page-container`, `text-display`, `text-heading`, `text-body`, and `eyebrow` for consistent layout and typography.
- Design mobile first, checking 320px and 360px widths as well as desktop. Avoid horizontal scrolling, heavy animation, unnecessary client JavaScript, and large assets.
- Provide semantic HTML, real link destinations, visible keyboard focus, accessible names, 44px touch targets for primary actions, and reduced-motion support.
- Keep the shared header/footer in `src/components/app-shell.tsx`; keep the R. placeholder in the brand component and icon assets consistent.
- `src/app/manifest.ts` provides metadata only. Do not describe the app as offline-capable until a service worker and its lifecycle have been implemented and verified.
- Before delivery run `npm install`, `npm run lint`, `npm run typecheck`, and `npm run build`. Fix failures and report any external setup limitations accurately.
- Update README.md when commands, prerequisites, structure, or scope change. Never delete or overwrite Git metadata.
