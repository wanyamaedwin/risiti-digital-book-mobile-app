# Step 4 dashboard specification

## Scope and routes

This stage implements frontend dashboards with deterministic fictional Ugandan records. It preserves onboarding, public pages, the design system, six roles, the existing workspace shell, notifications dialog and planned destinations. There is no backend, authentication, receipt issuance, payment processing, scanning, PDF creation, export or designer.

| Route              | Experience                                                                    |
| ------------------ | ----------------------------------------------------------------------------- |
| `/w/demo/home`     | Kampala Traders, populated Business Owner, both capabilities                  |
| `/w/personal/home` | My Personal Book, populated Individual, both capabilities                     |
| `/w/sample/home`   | Wakiso Supplies, intentionally empty business, receipt emphasis               |
| `/w/setup/home`    | This tab's completed setup identity and preference; always empty transactions |

The existing workspace switcher includes the personal fixture. Setup still uses its stable route and versioned configuration; no new workspace objects are appended to storage. Without completed setup it retains the existing Quick Setup prompt. All original feature routes remain planned pages. Read-only receipt rows have no pretend detail interaction because there is no detail route; View all receipts links to the existing receipt placeholder.

## Business structure

The existing header supplies workspace avatar/name, branch, switcher, profile and demo notifications. Home adds a personalised greeting, explicit fixed-date demo notice and labelled reporting controls. The Deep Ink financial card shows net money received, gross confirmed incoming, refunds, the selected period/branch and a payment-page link. Four cards show active issued documents, outstanding balances, confirmed incoming payment count and recorded expense value. A compact line adds as-of drafts, partially paid bills and pending reminder counts. Reminder counts are illustrative; nothing is sent.

Six large actions link to New Receipt, Receipt Books, Customers, Record Expense, Payments and Reports, each labelled Planned feature. Responsive receipt/expense lists show payer or merchant, number/category, date, UGX amount, worded payment status, branch and attachment state where applicable. Activity descriptions resolve linked records, with timestamps in Kampala time; the latest eight matching events are shown. A CSS chart and accessible data table show net received over the selected period. There is no profit figure.

## Individual structure

Personal Home has its own spending-oriented composition, not a renamed business dashboard. The primary card defaults to Recorded Spending This Month, with expense count, saved expense attachment count and category count. Both-capabilities and receipt-oriented views also show issued-document count. Spending categories use labelled native progress elements, UGX amounts, counts and percentages. Recent expenses distinguish manual entries from saved receipt attachments.

Scan Receipt, Add Expense, Create a receipt, View Records and Export Expenses link honestly to the existing planned expense/receipt routes. Issued personal receipts have their own section for money collected, separate from receipts received as expense attachments. No fake scan, export, upload or issuance succeeds.

## Preferences and roles

`Workspace.dashboardPreferences.primaryUse` reuses the existing typed `PrimaryUse`: receipts, expenses or both. `configuredWorkspace` maps the validated onboarding choice to this metadata. Dashboard behavior depends on types and role, never the workspace name.

- Receipt emphasis: receipt actions first; business received-money chart/recent receipts; personal money-collected hero and issued receipts first.
- Expense emphasis: expense actions first; business expense metric/category breakdown/recent expenses first; personal spending hero and no issued-receipts section.
- Both: balanced actions and receipt/expense content; personal issued receipts remain a separate section.

These are preferences, not restrictions: other permitted tools stay accessible through the shell and quick actions. Recommended for you and the Step 3 preview shortcuts remain unchanged.

All six existing roles have typed configurations in `lib/preferences.ts`. Business Owner gets BusinessDashboard; Individual gets IndividualDashboard. Manager, Cashier, Accountant and Platform Administrator have conservative restricted future views, without owner financial records or totals. Cashier entry links only to its existing My History placeholder; its navigation remains Home, New Receipt and My History. These are presentation rules, not secure access control. A future backend must independently enforce workspace membership, branch and record scope.

## Models and mock organisation

`types/dashboard.ts` defines DashboardPeriod, DashboardFilter, DashboardMetric, DashboardSummary, DashboardActivity, DashboardQuickAction, ReceiptSummary, ExpenseSummary, PaymentSummary, SpendingCategory, WorkspaceDashboardPreferences and supporting bill/view contracts. Workspace/role/user and onboarding primary-use types are reused.

`data/fixtures.ts` contains normalized branch, customer, bill, payment, receipt, expense and activity collections. Financial rows carry workspace ID, branch ID and ISO timestamp. IDs are stable and amounts are safe integer whole UGX. Fixtures are fictional, not random and never generated from the rendering clock. Activity references real fixture IDs and resolves meaningful descriptions rather than duplicating totals.

The Server Component Home route calls `dataForWorkspace` before passing props across the client boundary, so a dashboard receives only its workspace's records. The shared selector checks workspace/branch again. `emptyDashboardData` is an explicit separate scenario; setup defaults to empty data and never imports populated fixtures into its client adapter.

## Financial rules

`lib/calculations.ts` contains pure selectors and chart series construction. Money display reuses the shared whole-shilling `formatUGX`; metrics reuse StatCard/CurrencyAmount.

| Figure                 | Definition                                                                                                                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Confirmed incoming     | Sum of confirmed incoming payment records dated in the period                                                                                                                            |
| Refunds                | Sum of confirmed outgoing refund records in the period, explicitly linked to a confirmed incoming payment in the same workspace, branch and bill, no earlier than that payment           |
| Money received         | Confirmed incoming minus linked confirmed refunds; can be negative in refund-only periods                                                                                                |
| Payments received      | Count of confirmed incoming payment records in the period, independent of document count                                                                                                 |
| Issued receipts        | Documents issued in the period, excluding drafts and voids effective by the reporting date                                                                                               |
| Recorded expenses      | Recorded outgoing expense amounts in the period; draft expenses are excluded                                                                                                             |
| Saved expense receipts | Number of those recorded expenses with an attachment indicator; not issued receipts                                                                                                      |
| Outstanding            | Sum, across bills existing as of the reporting date, of max(0, bill amount - effective dated adjustments - net settled payments); cancelled bills effective by that date contribute zero |
| Partial bills          | Valid bill with positive settled payment and positive remaining balance as of reporting date                                                                                             |
| Pending reminders      | Outstanding bill with a configured reminder entry; no delivery or scheduling                                                                                                             |
| Draft receipts         | As-of count of draft documents, independent of flow-period filters                                                                                                                       |

All current fixtures use whole non-negative integer amounts with a separate incoming/refund direction. Pending and reversed payment records never count. Partial payments contribute only the amount settled. Credits/discounts are dated bill adjustments, not income. Refunding a valid bill reopens its balance; a cancelled bill stays excluded. Outstanding is a stock as of the reporting date, while payments/documents/expenses are period flows.

Voiding a receipt invalidates its active document count but does not itself reverse money. A separate refund changes cash. A refunded but otherwise valid issued document remains counted and can show Refunded; voids retain their audit history. The same receipt can show Paid before its later effective void date. Receipt rows show actual linked payments net of related refunds as of the reporting date, never the original entire bill amount. No profit or invented revenue recognition is inferred.

The demo models simple settled records, not a production accounting ledger. Refund limits, duplicate event ingestion, full historical status transitions, multi-currency arithmetic and accounting policies need server validation and a separately agreed domain design.

## Dates, branches and chart

The explicit starting reference date is **2026-11-05**, not the browser's current day. All date grouping uses **Africa/Kampala (UTC+3)**. The selected date is an inclusive local calendar day; a UTC record after 21:00 belongs to the following Kampala day. No random or wall-clock-sensitive fixture generation occurs during rendering.

- Today: selected local calendar date.
- This Week: Monday of that date's week through the selected date.
- This Month: first of the selected month through the selected date.

Personal Home offers week/month; Business Home also offers day. A labelled native Reporting date input moves the anchor between valid dates from 2020 through 2099, updating rows, metrics and chart data. All Branches or a specific workspace branch scopes all relevant records and balances together. Header/switcher branch text identifies the workspace's default branch; the reporting scope is explicitly shown by the filters and financial card. No custom-range calendar component existed, so no new calendar/date library is introduced; arbitrary start/end ranges are deferred.

The display filters live only in workspace-keyed React state and may be retained by Next.js Activity on navigation. Reload resets them to the demo default. No additional storage key or financial persistence is added.

Daily chart buckets are four-hour Kampala intervals; week/month points are local calendar days through the selected date. Bars show net confirmed incoming less refunds with an explicit zero baseline and signed UGX values, including negative refunds. All chart points reconcile with the primary received total. The chart has a readable text summary, endpoint labels, scale, zero-data message and an expandable two-column accessible table. Category bars have category names/amounts/percentages and do not depend on colour alone. Charts add no runtime dependency or animation.

## Known fixture totals

For Kampala Traders, all branches, 5 Nov 2026:

| Metric                                     | Expected                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Confirmed incoming                         | UGX 800,000 across 3 payments                                                              |
| Refunds                                    | UGX 75,000, linked to a payment on 4 Nov                                                   |
| Net received                               | UGX 725,000                                                                                |
| Issued receipts                            | 4 (draft excluded; void outside today's issue period)                                      |
| Outstanding                                | UGX 425,000: adjusted partial bill 180,000 + unpaid 180,000 + reversed-payment bill 65,000 |
| Recorded expenses                          | UGX 97,000 across 2 records                                                                |
| Drafts / partial bills / pending reminders | 1 / 1 / 1                                                                                  |
| Main / Nakawa net received                 | UGX 505,000 / UGX 220,000                                                                  |
| Week / month net received                  | UGX 1,150,000 / UGX 1,290,000                                                              |

My Personal Book's month-to-date spending is UGX 164,000 across five expenses, three saved expense receipts and five categories. Its separately issued personal receipt is UGX 60,000 for money collected. Week-to-date spending is UGX 132,000. No personal record appears in business totals or vice versa.

## Empty and error boundaries

Empty sample/setup dashboards show zero balances, zero counts, useful category/chart messages and a prominent first-action link to a planned destination. There are no fictional records presented as belonging to a newly configured workspace. Selecting a period with no matching transactions produces zero period flows and empty recent lists; legitimate earlier unpaid balances can remain because they are as-of stocks. Invalid setup state continues to show Quick Setup, and unknown workspace/feature routes keep the original not-found behavior.

## Validation and integration seams

Preserve all 41 preceding tests. Dashboard foundation tests cover settlement, partial payments, outstanding, credits, pending/reversed exclusions, refunds, voids, active document counts, timezone edges, periods, branches, workspace isolation, empty data, UGX, fixture links, chart reconciliation, all preferences and six role configurations. Browser checks cover both dashboards at 320/360/375/390/428/768/1024/1440px, labelled controls/focus, no overflow, date/branch changes, switching, placeholders, issued-versus-saved records and all six business/personal setup preference combinations. Final validation passed installation, ESLint, strict TypeScript, production build and all 71 tests (41 retained plus 30 dashboard checks). The production dependency audit reports zero vulnerabilities. Results and the local npm cache/temp workaround are recorded in README. Screenshots stay in ignored `.next/validation`.

Real-device Android performance, software keyboard behavior and a formal assistive-technology audit remain unverified. Browser emulation is a layout and interaction check.

Future integration should replace scoped fixture resolution with authenticated, permission-checked repositories; preserve pure calculation contracts with agreed server ledger rules; add loading/error versus empty states for network results; connect existing receipt/expense/payment/report placeholders only when those stages are requested; and replace the notification dialog only after real notification scope is agreed. No API, database, service worker, designer or backend is part of Step 4.
