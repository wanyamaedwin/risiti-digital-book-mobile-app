import type { IconName } from "@/config/icons";
import type { Role } from "@/types/workspace";

export type NavigationId =
  | "home"
  | "create"
  | "receipts"
  | "receipt-books"
  | "expenses"
  | "payments"
  | "customers"
  | "catalog"
  | "reports"
  | "staff"
  | "branches"
  | "settings"
  | "more"
  | "history";
export type NavigationGroup = "Overview" | "Business" | "Management";
export type NavigationItem = {
  id: NavigationId;
  label: string;
  path: string;
  icon: IconName;
  group: NavigationGroup;
};

export const navigation: readonly NavigationItem[] = [
  { id: "home", label: "Home", path: "home", icon: "home", group: "Overview" },
  {
    id: "create",
    label: "New Receipt",
    path: "receipts/new",
    icon: "create",
    group: "Overview",
  },
  {
    id: "receipts",
    label: "Receipts",
    path: "receipts",
    icon: "receipts",
    group: "Overview",
  },
  {
    id: "receipt-books",
    label: "Receipt Books",
    path: "receipt-books",
    icon: "books",
    group: "Overview",
  },
  {
    id: "expenses",
    label: "Expenses",
    path: "expenses",
    icon: "expenses",
    group: "Overview",
  },
  {
    id: "payments",
    label: "Payments",
    path: "payments",
    icon: "payments",
    group: "Business",
  },
  {
    id: "customers",
    label: "Customers",
    path: "customers",
    icon: "customers",
    group: "Business",
  },
  {
    id: "catalog",
    label: "Products & Services",
    path: "catalog",
    icon: "catalog",
    group: "Business",
  },
  {
    id: "reports",
    label: "Reports",
    path: "reports",
    icon: "reports",
    group: "Business",
  },
  {
    id: "staff",
    label: "Staff",
    path: "staff",
    icon: "staff",
    group: "Management",
  },
  {
    id: "branches",
    label: "Branches",
    path: "branches",
    icon: "branches",
    group: "Management",
  },
  {
    id: "settings",
    label: "Settings",
    path: "settings",
    icon: "settings",
    group: "Management",
  },
  {
    id: "history",
    label: "My History",
    path: "receipts/history",
    icon: "history",
    group: "Overview",
  },
  {
    id: "more",
    label: "More",
    path: "more",
    icon: "more",
    group: "Management",
  },
];

// Presentation only. These lists NEVER grant permissions or replace backend checks.
export const roleNavigation: Record<Role, readonly NavigationId[]> = {
  business_owner: [
    "home",
    "create",
    "receipts",
    "receipt-books",
    "expenses",
    "payments",
    "customers",
    "catalog",
    "reports",
    "staff",
    "branches",
    "settings",
    "more",
  ],
  manager: [
    "home",
    "create",
    "receipts",
    "receipt-books",
    "expenses",
    "customers",
    "catalog",
    "reports",
    "staff",
    "branches",
    "settings",
    "more",
  ],
  cashier: ["home", "create", "history"],
  accountant: [
    "home",
    "receipts",
    "receipt-books",
    "expenses",
    "payments",
    "reports",
    "settings",
    "more",
  ],
  individual: ["home", "create", "receipts", "expenses", "settings", "more"],
  platform_administrator: ["home", "settings", "more"],
};
export const navigationGroups: readonly NavigationGroup[] = [
  "Overview",
  "Business",
  "Management",
];
export function getNavigationForRole(role: Role): NavigationItem[] {
  return navigation.filter((item) => roleNavigation[role].includes(item.id));
}
export function getMobileNavigation(role: Role): NavigationItem[] {
  const ids: readonly NavigationId[] =
    role === "cashier"
      ? ["home", "create", "history"]
      : ["home", "create", "receipts", "expenses", "more"];
  const allowed = getNavigationForRole(role);
  return ids.flatMap((id) => allowed.filter((item) => item.id === id));
}
export function workspaceHref(workspaceId: string, path = "home"): string {
  return `/w/${encodeURIComponent(workspaceId)}/${path}`;
}
export function isNavigationActive(
  pathname: string,
  workspaceId: string,
  item: NavigationItem,
  mobile = false,
): boolean {
  const base = workspaceHref(workspaceId, item.path);
  if (mobile && item.id === "more") {
    return !["home", "receipts", "expenses"].some(
      (path) =>
        pathname === workspaceHref(workspaceId, path) ||
        pathname.startsWith(`${workspaceHref(workspaceId, path)}/`),
    );
  }
  if (
    item.id === "receipts" &&
    pathname === workspaceHref(workspaceId, "receipts/new")
  )
    return false;
  return (
    pathname === base || (item.id !== "home" && pathname.startsWith(`${base}/`))
  );
}
