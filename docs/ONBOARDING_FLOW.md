# Account entry and Quick Setup

Step 3 is a frontend demonstration. There is no real registration, account verification, login session, recovery delivery, online workspace creation, receipt issuance, payment processing, or backend integration.

## Routes and journeys

| Route              | Purpose                                                                      |
| ------------------ | ---------------------------------------------------------------------------- |
| `/`                | Existing welcome page, Get Started, sign-in preview, and existing demo entry |
| `/sign-in`         | Phone/email sign-in form preview                                             |
| `/create-account`  | Phone/email registration form preview                                        |
| `/forgot-password` | Contact validation and recovery preview; no delivery                         |
| `/verify`          | Six-digit verification UI demonstration; no identity check                   |
| `/onboarding`      | Shared conditional Quick Setup wizard, review, and success                   |
| `/w/setup/home`    | Existing workspace experience with this tab's completed demo configuration   |
| `/w/demo/home`     | Existing Kampala Traders demo; always available without setup                |

Account entry and setup use the `(entry)` route group's lightweight branded layout, outside the public and workspace shells. They never show workspace bottom navigation. Each route has basic page metadata. The existing welcome route and Step 2 workspace routes remain available.

The account journey is entry form → verification preview → Quick Setup. Quick Setup can also be opened directly. Explore Demo links bypass account and setup previews and enter the existing workspace.

## Account forms and validation

Zod schemas live in `src/lib/entry-validation.ts`. React Hook Form with the Zod resolver manages form values, errors, submit handling, and invalid-field focus. Shared FormField/App controls provide labels, hints, and associated error text.

- Phone UI supports `+256` plus nine digits, `256` plus nine digits, and a local 0-prefixed ten-digit number. Spaces, parentheses, and hyphens are accepted. This validates formatting only, not ownership, deliverability, or a carrier.
- Email uses Zod's email format validation.
- Sign-in requires a sample password. Create account requires at least eight characters and matching confirmation. Inputs have bounded lengths.
- Verification accepts exactly six digits as a visual demonstration. Any six-digit value advances; no real code is sent, checked, stored, or reused.
- Recovery validates the selected contact and displays an explicit message that no message was sent.
- All credentials remain in form memory and are reset before moving on. No contact, password, or code is included in a route, draft storage, request, cookie, or account session. Submit controls are disabled in server-rendered account forms until hydration to prevent a native pre-hydration submission.

The UI asks for made-up details and labels the experience as a frontend demonstration. It never claims to have created or authenticated an account. Browser password-manager behavior is outside app storage; form autocomplete is disabled for these sample fields.

## Wizard state and transitions

Types are in `src/types/onboarding.ts`: WorkspaceType, BusinessCategory, PrimaryUse, TemplateSelection, OnboardingDraft, OnboardingStep, and the versioned OnboardingState envelope. The shared step sequence is:

1. `type`: Business / Institution or Personal Use. Continue requires a selection.
2. `details`: conditional fields, using one shared details form.
3. `use`: Issue Receipts, Record Expenses, or Both. Continue requires a selection.
4. `template`: only for receipt issuing or Both. Templates, scratch, and deferral are all available.
5. `review`: summary with edit controls for previous choices.
6. `success`: explicit demo completion with a link into the existing workspace.

Expense-only setup skips `template`, so its progress is four steps rather than five. Back uses the current conditional step list. Review edits revisit the corresponding step and retain prior choices. Switching intended use changes the next step and recommendations; it does not hide other approved features.

Business details require a 2–80 character workspace name and a category. All eleven requested category suggestions are available; Other requires a custom category of at least two characters. Phone, email, address, and logo are optional. If a phone or email is entered, its format must be valid. Personal details require a display name and primary intended use, without business categories or registration details.

Optional fields are disclosed on request to keep the initial form short. Field values remain available through Back/Continue within the currently mounted wizard. Names and saved configuration are bounded and validated again when restoring a draft. Corrupt, unknown-version, unknown-field, or invalid completion data cannot skip required steps.

The receipt-design step allows Use Template, Start From Scratch (Blank Receipt Book), or Customise Later. No receipt book or receipt is issued. Review shows only configuration relevant to the chosen workspace type and intended use.

## Local storage and privacy boundaries

The small external store in `features/onboarding/draft-store.ts` uses React's `useSyncExternalStore`; no state library is added. It persists one strict versioned object under the sessionStorage key `risiti:onboarding:v1`:

```text
version: 1
draft: workspaceType, name, category, customCategory,
       personalPurpose, primaryUse, template
step: type | details | use | template | review | success
completed: boolean
```

Only the fictional workspace name and non-sensitive display/setup choices belong in this object. The UI explains that these choices remain in the tab. Do not use real confidential information. sessionStorage ordinarily lasts for the browser tab; browser session restoration can preserve it. It is neither an account nor secure storage. localStorage, cookies, server storage, and cross-device synchronization are not used.

Phone, email, address, uploaded file names, logo blobs/URLs, passwords, and verification codes are excluded from the persisted schema. Optional contact details and logo previews survive step navigation only while the wizard stays mounted, and clear on leaving or refresh. A refreshed draft restores its saved name, choices, and safe current step, with contact fields blank and no logo.

Next.js Cache Components preserves hidden route state using React Activity. Account forms explicitly reset credentials in layout-effect cleanup. The wizard clears transient contacts/logo and changes the details-form key on route deactivation, so browser Back cannot restore that memory-only contact data. Moving between steps inside the same wizard preserves it until the user leaves the route.

If sessionStorage access fails, the wizard continues in memory and displays a notice that restoration is unavailable. Start Over requires confirmation, removes this key, clears in-memory contacts and logo, and returns to the type step. Invalid stored data is treated as a fresh draft rather than trusted configuration.

Logo uploads accept PNG, JPEG, or WebP up to 2 MB. A local object URL provides the preview; no file is uploaded. Object URLs are revoked on replacement/removal and wizard unmount. Unsupported types, oversized files, and decode failures receive readable feedback.

Completion is synchronous and idempotent. Finish Setup validates completeness, normalizes the active draft, and marks the same object complete. The fixed `/w/setup` destination is reused. There is no array of newly created workspaces and no completion effect that can duplicate records on refresh or repeated clicks. Expense-only completion removes any stale receipt-design choice. Personal completion removes business category fields.

## Template definitions

`types/receipt-template.ts` and `data/receipt-templates.ts` define all nine requested starter designs. Each has a unique ID, name, description, category recommendations, ordered default sections, ordered fields, required/optional flags, field types, and sample preview data.

Supported field types are text, number, date, dropdown, and checkbox. Reserved financial fields are explicitly marked `source: system`, with stable system keys for receipt number, issue date, and total amount, and `configurable: false`. Display fields are separately marked configurable, with optional dropdown choices. This distinction prepares a future designer without implementing its editing, calculation, numbering, issuance, or persistence logic.

Category recommendations never restrict available designs. Blank includes only the essential reserved fields; users can add their own display fields in a future designer. The mini previews are decorative layout samples labelled Demo design, not issued receipts. Draft selection stores a template ID/mode; definitions resolve from the shared typed registry. The sample fixture date and amounts are static demo data.

## Workspace integration

`/w/setup` is a known demo route. A small client adapter resolves this tab's completed configuration and passes it into the existing AppShell. The shell and fixture-based demos are not replaced. The adapter supplies the chosen workspace name, initials, branch label, and a Business Owner or Individual demo role. The existing home, More, and interface-preview compositions are reused.

Recommended Home shortcuts reflect receipt issuing, expense recording, or Both, with links to existing planned-feature pages. Other approved features stay available. Change setup choices returns to the saved setup. Step 4 now uses these choices to show an empty business/personal dashboard; no seeded transactions are assigned to this configured workspace. Without a valid completed draft, `/w/setup` directs the user to Quick Setup.

Navigation roles remain presentation only. No authentication or permission enforcement is implied. Optional logo/contact previews are intentionally not projected into the workspace or persisted. The setup workspace is offered in its own switcher without mutating the global fixture list or duplicating it.

## Responsive and accessibility checks

Entry/setup use single-column mobile content, a bounded desktop container with an optional branded panel, labelled native radio choices, visible selected text/check marks, screen-reader progress, and sticky actions above safe-area insets. Step transitions focus the new heading. Error text is associated with inputs; invalid fields receive focus. Confirmation uses the existing Radix-based dialog. Motion follows the global reduced-motion preference.

Viewport metadata includes `interactive-widget=resizes-content` so supported browsers can resize content around the software keyboard. See the [Chrome viewport guidance](https://developer.chrome.com/blog/viewport-resize-behavior/) for the behavior and browser limitations. The app does not disable zoom.

Browser checks cover the requested eight widths, reduced-height keyboard-like viewports, selections, forms, templates, review, completion, privacy/storage boundaries, logo preview, reset, interrupted setup, and existing demo navigation. The original eighteen regression tests are retained. Emulated short viewports do not certify actual software-keyboard or hardware behavior; physical Android testing remains a separate release check.

## Future integration

Real authentication must replace sample validation with an explicitly selected provider, real verification/recovery flows, secure session handling, and backend permission checks. Successful authentication must not be inferred from this demo's form or completed flag.

Real workspace persistence will need authenticated membership, server-side validation, duplicate/idempotency handling, scoped permissions, and a deliberate migration from draft configuration. Contact and logo uploads need an explicit storage/privacy design. A future Universal No-Code Receipt Designer can reuse the template types while preserving financial system invariants. No part of that backend, designer, or issuance engine is implemented in Step 3.
