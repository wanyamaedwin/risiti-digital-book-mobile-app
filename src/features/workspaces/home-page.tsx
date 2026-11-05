import Link from "next/link";
import { ArrowUpRight, ArrowRight, Sprout } from "lucide-react";
import {
  PageContainer,
  ResponsiveGrid,
} from "@/components/layout/page-patterns";
import { PageHeading, SectionHeading } from "@/components/shared/typography";
import { ActionCard, AppCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/status-badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { workspaceHref } from "@/config/navigation";
import { roleLabels, type DemoUser, type Workspace } from "@/types/workspace";

export function WorkspaceHomePage({
  workspace,
  user,
}: {
  workspace: Workspace;
  user: DemoUser;
}) {
  return (
    <PageContainer>
      <PageHeading
        eyebrow={`${workspace.name} · ${workspace.branch}`}
        title={`Welcome, ${user.name.split(" ")[0]}.`}
        description="A little clarity for your everyday. Let's start with a fresh page."
        action={<StatusBadge tone="planned">Demo workspace</StatusBadge>}
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <AppCard className="relative overflow-hidden border-0 bg-primary p-6 text-white sm:p-8">
          <div className="relative z-10 max-w-lg">
            <p className="mb-5 text-metadata font-medium tracking-[0.12em] text-white/80 uppercase">
              Your business. Your next chapter.
            </p>
            <h2 className="text-app-display">
              Small beginnings.
              <br />
              Big possibilities.
            </h2>
            <p className="mt-5 max-w-sm text-app-body text-white/85">
              Explore your new Risiti workspace. This demo is a first look at
              the spaces we&apos;re building for your business.
            </p>
            <Button
              asChild
              className="mt-7 self-start rounded-full bg-lime text-ink hover:bg-lime/90"
            >
              <Link href={workspaceHref(workspace.id, "receipt-books")}>
                Meet your receipt books <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <Sprout
            aria-hidden="true"
            className="absolute -right-8 -bottom-9 size-64 rotate-[-15deg] text-white/8"
            strokeWidth={0.7}
          />
        </AppCard>
        <AppCard className="justify-between gap-7">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-card-heading">Your workspace</h2>
            <span
              aria-hidden="true"
              className="flex size-10 items-center justify-center rounded-2xl bg-primary/8 text-sm font-semibold text-primary"
            >
              {workspace.initials}
            </span>
          </div>
          <dl className="space-y-4 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Business</dt>
              <dd className="font-medium">{workspace.name}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Branch</dt>
              <dd>{workspace.branch}</dd>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <dt className="text-muted-foreground">Your role</dt>
              <dd>{roleLabels[workspace.role]}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-muted-foreground">Currency</dt>
              <dd className="font-medium">UGX</dd>
            </div>
          </dl>
          <p className="border-t border-border pt-4 text-caption text-muted-foreground">
            Fictional business · Sample account
            <br />
            No live records or connected services.
          </p>
        </AppCard>
      </div>
      <section className="space-y-4" aria-labelledby="explore-title">
        <SectionHeading
          id="explore-title"
          description="A first look at what's on the way."
        >
          A place for your everyday
        </SectionHeading>
        <ResponsiveGrid>
          <ActionCard
            title="Create a receipt"
            description="The first step towards a simpler sale."
            icon="create"
            href={workspaceHref(workspace.id, "receipts/new")}
          />
          <ActionCard
            title="Keep receipts together"
            description="An organised home for your records."
            icon="receipts"
            href={workspaceHref(workspace.id, "receipts")}
          />
          <ActionCard
            title="Understand expenses"
            description="Make room for a clearer spending picture."
            icon="expenses"
            href={workspaceHref(workspace.id, "expenses")}
          />
        </ResponsiveGrid>
      </section>
      <section className="space-y-4" aria-labelledby="activity-title">
        <SectionHeading
          id="activity-title"
          action={
            <Link
              href={workspaceHref(workspace.id, "more")}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Explore all spaces{" "}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          }
        >
          A fresh start
        </SectionHeading>
        <EmptyState
          title="Your story is still unwritten"
          description="There are no live records in this demo. Receipt issuance and financial activity will be introduced in a later step."
          icon="books"
        />
      </section>
      <Link
        href={workspaceHref(workspace.id, "design-system")}
        className="flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-primary/30 px-5 py-4 text-sm text-primary transition-colors hover:bg-primary/5"
      >
        <span>
          Curious about the details? Explore the Risiti interface preview.
        </span>
        <ArrowUpRight aria-hidden="true" className="size-5" />
      </Link>
    </PageContainer>
  );
}
