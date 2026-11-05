import type { DemoUser, Workspace } from "@/types/workspace";

export const currentUser: DemoUser = {
  id: "demo-user",
  name: "Amina Namusoke",
  initials: "AN",
  email: "amina@example.com",
};

export const availableWorkspaces: readonly Workspace[] = [
  {
    id: "demo",
    name: "Kampala Traders",
    initials: "KT",
    branch: "Main Branch",
    currency: "UGX",
    role: "business_owner",
    isDemo: true,
  },
  {
    id: "sample",
    name: "Wakiso Supplies",
    initials: "WS",
    branch: "Wakiso Branch",
    currency: "UGX",
    role: "business_owner",
    isDemo: true,
  },
];

export function getWorkspace(id: string): Workspace | undefined {
  if (id === "setup") return setupWorkspace;
  return availableWorkspaces.find((workspace) => workspace.id === id);
}

/** Stable demo destination; identity is overlaid from this tab after setup. */
export const setupWorkspace: Workspace = {
  id: "setup",
  name: "My demo workspace",
  initials: "MD",
  branch: "Demo setup",
  currency: "UGX",
  role: "business_owner",
  isDemo: true,
};
