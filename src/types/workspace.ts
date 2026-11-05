export const roleLabels = {
  business_owner: "Business Owner",
  manager: "Manager",
  cashier: "Cashier",
  accountant: "Accountant",
  individual: "Individual",
  platform_administrator: "Platform Administrator",
} as const;

export type Role = keyof typeof roleLabels;
export type Workspace = {
  id: string;
  name: string;
  initials: string;
  branch: string;
  currency: "UGX";
  role: Role;
  isDemo: true;
  kind?: "business" | "personal";
};
export type DemoUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
};
