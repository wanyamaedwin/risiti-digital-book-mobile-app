"use client";

import { createContext, useContext, type ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageContainer } from "@/components/layout/page-patterns";
import { EmptyState } from "@/components/feedback/empty-state";
import { AppCard } from "@/components/shared/cards";
import { SectionHeading } from "@/components/shared/typography";
import { Button } from "@/components/ui/button";
import { WorkspaceHomePage } from "@/features/workspaces/home-page";
import { MorePage } from "@/features/workspaces/more-page";
import { InterfacePreview } from "@/features/workspaces/interface-preview";
import { useOnboardingDraft } from "@/features/onboarding/draft-store";
import { configuredWorkspace, needsReceiptBook } from "@/lib/onboarding";
import { templateSelectionLabel } from "@/data/receipt-templates";
import { primaryUseLabels, type OnboardingDraft } from "@/types/onboarding";
import type { DemoUser, Workspace } from "@/types/workspace";
import { workspaceHref } from "@/config/navigation";

const SetupWorkspaceContext = createContext<{
  workspace: Workspace;
  draft: OnboardingDraft;
} | null>(null);

/** Only /w/setup uses this client adapter; both existing fixture shells stay server-composed. */
export function SetupWorkspaceBridge({
  children,
  fallbackWorkspace,
  workspaces,
  user,
}: {
  children: ReactNode;
  fallbackWorkspace: Workspace;
  workspaces: readonly Workspace[];
  user: DemoUser;
}) {
  const { state } = useOnboardingDraft();
  const workspace = state.completed
    ? configuredWorkspace(state.draft)
    : fallbackWorkspace;
  return (
    <SetupWorkspaceContext
      value={state.completed ? { workspace, draft: state.draft } : null}
    >
      <AppShell
        workspace={workspace}
        workspaces={state.completed ? [...workspaces, workspace] : workspaces}
        user={user}
      >
        {state.completed ? (
          children
        ) : (
          <PageContainer>
            <EmptyState
              title="A fresh page is waiting"
              description="Finish Quick Setup in this tab to see your chosen demo name and shortcuts. Your existing demo workspaces are always available."
              icon="books"
              action={
                <Button
                  asChild
                  className="rounded-full bg-lime text-ink hover:bg-lime/90"
                >
                  <Link href="/onboarding">
                    Open Quick Setup <ArrowUpRight aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
          </PageContainer>
        )}
      </AppShell>
    </SetupWorkspaceContext>
  );
}
function RecommendedShortcuts({ draft }: { draft: OnboardingDraft }) {
  return (
    <AppCard className="gap-4 border-primary/25 bg-primary/4">
      <SectionHeading description="Demo shortcuts based on your setup. All other approved spaces stay available.">
        Recommended for you
      </SectionHeading>
      <p className="text-caption text-muted-foreground">
        {draft.primaryUse && primaryUseLabels[draft.primaryUse]}
        {needsReceiptBook(draft) &&
          ` · Design draft: ${templateSelectionLabel(draft.template)}`}
      </p>
      <div className="flex flex-wrap gap-3">
        {needsReceiptBook(draft) && (
          <Button
            asChild
            className="rounded-full bg-lime text-ink hover:bg-lime/90"
          >
            <Link href={workspaceHref("setup", "receipts/new")}>
              Explore receipt preview <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        )}
        {draft.primaryUse !== "receipts" && (
          <Button asChild variant="outline" className="rounded-full bg-card">
            <Link href={workspaceHref("setup", "expenses")}>
              Explore expenses preview <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        )}
        <Link
          href="/onboarding"
          className="inline-flex min-h-11 items-center px-2 text-sm font-medium text-primary hover:underline"
        >
          Change setup choices
        </Link>
      </div>
    </AppCard>
  );
}
export function SetupHomeBridge({ user }: { user: DemoUser }) {
  const context = useContext(SetupWorkspaceContext);
  if (!context) return null;
  return (
    <WorkspaceHomePage
      workspace={context.workspace}
      user={user}
      recommendations={<RecommendedShortcuts draft={context.draft} />}
    />
  );
}
export function SetupMoreBridge() {
  const context = useContext(SetupWorkspaceContext);
  return context ? <MorePage workspace={context.workspace} /> : null;
}
export function SetupInterfaceBridge() {
  const context = useContext(SetupWorkspaceContext);
  return context ? <InterfacePreview workspace={context.workspace} /> : null;
}
