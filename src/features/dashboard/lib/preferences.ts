import type { Role, Workspace } from "../../../types/workspace";
import type { DashboardQuickAction } from "../types/dashboard";

// Presentation policy only, not authorization. Future roles get conservative entry views.
export const dashboardRoleViews: Record<
  Role,
  {
    view: "business" | "personal" | "restricted";
    organizationFinancials: boolean;
  }
> = {
  business_owner: { view: "business", organizationFinancials: true },
  manager: { view: "restricted", organizationFinancials: false },
  cashier: { view: "restricted", organizationFinancials: false },
  accountant: { view: "restricted", organizationFinancials: false },
  individual: { view: "personal", organizationFinancials: false },
  platform_administrator: { view: "restricted", organizationFinancials: false },
};
export function dashboardEmphasis(workspace: Workspace) {
  return workspace.dashboardPreferences?.primaryUse ?? "both";
}
export function quickActions(workspace: Workspace): DashboardQuickAction[] {
  const use = dashboardEmphasis(workspace);
  const personal = workspace.kind === "personal";
  const actions: DashboardQuickAction[] = personal
    ? [
        {
          label: "Scan Receipt",
          path: "expenses",
          icon: "receipts",
          emphasis: use !== "receipts",
        },
        {
          label: "Add Expense",
          path: "expenses",
          icon: "expenses",
          emphasis: use !== "receipts",
        },
        {
          label: "Create a receipt",
          path: "receipts/new",
          icon: "create",
          emphasis: use !== "expenses",
        },
        { label: "View Records", path: "expenses", icon: "history" },
        { label: "Export Expenses", path: "expenses", icon: "reports" },
      ]
    : [
        {
          label: "New Receipt",
          path: "receipts/new",
          icon: "create",
          emphasis: use !== "expenses",
        },
        { label: "Receipt Books", path: "receipt-books", icon: "books" },
        { label: "Customers", path: "customers", icon: "customers" },
        {
          label: "Record Expense",
          path: "expenses",
          icon: "expenses",
          emphasis: use !== "receipts",
        },
        { label: "Payments", path: "payments", icon: "payments" },
        { label: "Reports", path: "reports", icon: "reports" },
      ];
  return actions.sort(
    (a, b) => Number(Boolean(b.emphasis)) - Number(Boolean(a.emphasis)),
  );
}
