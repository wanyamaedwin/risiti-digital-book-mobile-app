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
  return availableWorkspaces.find((workspace) => workspace.id === id);
}
