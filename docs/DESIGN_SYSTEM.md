# Risiti design system

Step 2 extends the Step 1 tokens and shadcn/ui primitives. The live component reference is `/w/demo/design-system`. It contains demo-only controls, amounts, list filters, empty/loading feedback, and page patterns; no business data is saved.

## Colour and meaning

The five official colours remain defined once in `src/app/globals.css`:

| Brand token | Value     | Rule                                                         |
| ----------- | --------- | ------------------------------------------------------------ |
| Purple      | `#7249BC` | Primary actions and emphasis; white foreground               |
| Lime        | `#BEDE18` | Selected navigation and accent controls; Deep Ink foreground |
| Deep Ink    | `#1E1A34` | Primary text and navigation                                  |
| Soft White  | `#EEEEED` | App background                                               |
| White       | `#FFFFFF` | Cards, inputs, contrasting text                              |

Use semantic utilities instead of repeating brand hex values. Existing `background`, `foreground`, `muted-foreground`, `primary`, `secondary`, `accent`, `card`, `border`, `input`, and `ring` tokens supply background, text, actions, surfaces, borders, and focus. Step 2 adds:

| Token                                                   | Purpose                                 |
| ------------------------------------------------------- | --------------------------------------- |
| `navigation`, `navigation-foreground`                   | Deep Ink navigation with white text     |
| `navigation-selected`, `navigation-selected-foreground` | Lime selected state with Deep Ink text  |
| `input-background`                                      | White input surface                     |
| `disabled`, `disabled-foreground`                       | Unavailable-control presentation        |
| `success`, `success-surface`                            | Dark green text with pale green surface |
| `warning`, `warning-surface`                            | Dark amber text with pale amber surface |
| `destructive`, `error-surface`                          | Error text with pale red surface        |
| `info`, `info-surface`                                  | Information text with pale blue surface |

Lime is never a text colour on white surfaces. Status badges always contain words; payment states must never rely on colour alone. Preserve visible focus outlines. Status and neutral foreground/surface pairings are selected for readable contrast.

## Typography

Geist remains the only bundled font family through `next/font`. Use tabular numerals for amounts and statistics.

| Utility                | Size             | Purpose                                  |
| ---------------------- | ---------------- | ---------------------------------------- |
| `text-app-display`     | 34–40px          | Workspace hero                           |
| `text-page-heading`    | 26–32px          | Page h1                                  |
| `text-section-heading` | 19–22px          | Section h2                               |
| `text-card-heading`    | 17px             | Card h3                                  |
| `text-app-body`        | 16px             | Explanations and important content       |
| `text-caption`         | 13px             | Hints and descriptions                   |
| `text-metadata`        | 12px             | Navigation labels and secondary metadata |
| `text-amount`          | 24–30px, tabular | Amounts and statistics                   |

`PageHeading` renders an h1 with optional description, eyebrow, and action. `SectionHeading` renders an h2 with optional description/action. The original public `text-display`, `text-heading`, `text-body`, and `eyebrow` utilities remain available to preserve the welcome page. Workspace pages use the new scale, with metadata at least 12px.

`CurrencyAmount` calls `formatUGX` from `src/lib/currency.ts`. It uses `Intl.NumberFormat("en-UG")`, the currency code UGX, and zero decimal places; fractional values round for display. Non-finite values throw. Current financial examples display a Demo amount label. Production money validation and accounting arithmetic are separate future concerns.

## Component reference

| Area       | Components                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Layout     | `AppShell`, `WorkspaceHeader`, `DesktopSidebar`, `MobilePageHeader`, `PageContainer`, `ResponsiveGrid` |
| Navigation | `MobileBottomNavigation`, `DesktopNavigationLinks`, `AppBreadcrumbs`, `WorkspaceSwitcher`              |
| Identity   | Existing `Brand`, `UserAvatar`                                                                         |
| Actions    | Existing shadcn `Button`, `PrimaryButton`, `SecondaryButton`, `IconButton`                             |
| Content    | `AppCard`, `StatCard`, `ActionCard`, `PageHeading`, `SectionHeading`, `CurrencyAmount`                 |
| Fields     | `FormField`, `AppInput`, `AppTextarea`, `AppSelect`, `AppSwitch`, `SearchField`                        |
| Feedback   | `StatusBadge`, `EmptyState`, `LoadingSkeleton`, `ConfirmationDialog`, `FeaturePlaceholder`             |

Wrappers add useful Risiti semantics and styling to existing shadcn/ui/Radix primitives. Keep primitive implementations in `components/ui`; application wrappers belong in `shared`, `layout`, `navigation`, or `feedback`. Use direct imports rather than a global component barrel.

All components import `cn` from `@/lib/utils`. Its configuration registers the semantic typography sizes so class merging preserves both `text-metadata` and a text-colour utility. After generating a new primitive, replace any direct `cn` package import with the shared helper.

- Buttons have a minimum 44px touch target; large buttons are 48px. Primary/secondary wrappers support `loading` and native `disabled`. Loading sets `aria-busy` and disables repeated activation. Use shadcn `Button asChild` for links, and a real button for actions.
- `IconButton` requires a readable `label`. Decorative icons use `aria-hidden`.
- `FormField` creates a unique id, visible label, optional hint, required marker, and readable error. It provides the id and ARIA associations to its App input/select/textarea child through context. Use one control per FormField. Independent controls need an explicit label/id or `aria-label`.
- `AppSelect` uses the shadcn native select for familiar mobile selection and low overhead. Text inputs are 16px to stay readable on phones.
- `AppSwitch` pairs a switch with a clickable label at least 44px high; the switch's transparent hit area is expanded. Keep the whole row available for touch.
- `ConfirmationDialog` composes Radix alert-dialog with title, description, cancel, and confirm. Cancel receives initial focus; the dialog traps focus and restores it to its trigger. Use it for reversible local previews here, not real financial actions.
- AppCard allows overflow so viewport-sticky form actions and focus indicators are not trapped by a clipping ancestor. Decorative hero cards opt into `overflow-hidden` explicitly.
- Empty and loading feedback include accessible descriptions. Skeletons are visual examples or route-loading fallbacks; they do not simulate transaction processing.

## Page patterns

`PageContainer` with `PageHeading` is the standard page. The heading action slot handles pages with a primary action. Additional patterns in `components/layout/page-patterns.tsx` provide:

- `ListPagePattern`: a toolbar slot for a labelled search field and filters, followed by results or an EmptyState.
- `FormPagePattern`: a semantic form with sticky actions that clear mobile navigation and safe areas.
- `DetailPagePattern`: a summary/detail composition that stacks on phones.
- `SettingsPagePattern`: section navigation and content, stacked until wide desktop.
- `ResponsiveGrid`: 2/3/4-column maximum grids starting with one column.
- `EmptyState` and `StatCard` cover empty pages and summary grids.

The interface preview exercises these patterns using component samples rather than business records.

## Responsive navigation and motion

- Base: compact padding and a floating bottom navigation. At 320px, all five labelled destinations have at least 44px targets.
- 640px: larger padding and optional two-column cards.
- 768px: list/detail layouts can use available space; bottom navigation remains visible.
- 1024px: the sidebar replaces the bottom navigation. Desktop breadcrumbs appear. The sidebar can scroll on short displays, with its account area following the navigation.
- 1280px: three/four-column summary grids and side-by-side settings/detail patterns become available. Main content is capped at `max-w-6xl`.

`--mobile-nav-clearance` includes bottom safe-area space and is shared by content padding and sticky actions. The floating nav uses the same safe-area inset; viewport metadata opts into safe-area handling. Active navigation is pathname-based and exposes `aria-current="page"`. Create is prominent in purple, or lime when selected. Secondary workspace routes select More on mobile.

Use short CSS colour/press/hover transitions. Existing reduced-motion rules disable animations and smooth scrolling when requested. No animation library is added. Physical devices and mobile browser chrome should be checked before a real PWA release; viewport emulation cannot certify hardware performance or every safe-area environment.

## Step 4 dashboard composition

Dashboard components in `src/features/dashboard/components/` reuse AppCard, StatCard, CurrencyAmount, SectionHeading, PageHeading, StatusBadge, EmptyState, Button and FormField/App controls. FinancialSummaryCard uses Deep Ink, white text and a lime icon; tabular financial amounts scale from 32px on small phones. Metric cards use a single column at 320px, two from 360px, and four at wide desktop. Bounded bento grids stack on phones and split at wide desktop, keeping the existing sidebar and floating navigation.

DashboardSection provides named semantic regions. QuickActionGrid has large real links with a Planned feature caption. ReceiptListItem and ExpenseListItem are vertical lists, never wide mobile tables. Status badges use Paid, Partially Paid, Unpaid, Voided and Refunded text. Incoming personal receipts and saved expense attachments have separate sections and labels.

FinancialOverviewCard draws small CSS bars around an explicit zero baseline, with net refunds below zero and a full accessible table in a native disclosure. There are no chart animations or chart-library downloads. SpendingCategoryRow uses labelled native progress elements, category amounts, counts and percentages; shape, text and values convey meaning independently of colour. Existing semantic primary/muted/destructive tokens style these views. Empty charts and zero workspaces have explicit text and first-action links. Period/date/branch controls have visible labels, descriptions and 48px native inputs.
