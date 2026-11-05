"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { Workspace } from "@/types/workspace";
import { workspaceHref } from "@/config/navigation";
import {
  PageContainer,
  ResponsiveGrid,
  ListPagePattern,
  FormPagePattern,
  DetailPagePattern,
  SettingsPagePattern,
  MobilePageHeader,
} from "@/components/layout/page-patterns";
import {
  PageHeading,
  SectionHeading,
  CurrencyAmount,
} from "@/components/shared/typography";
import { AppCard, StatCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/status-badge";
import { PrimaryButton, SecondaryButton } from "@/components/shared/buttons";
import {
  FormField,
  AppInput,
  AppTextarea,
  AppSelect,
  AppSwitch,
  SearchField,
} from "@/components/shared/form-controls";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingSkeleton } from "@/components/feedback/loading-skeleton";

const componentSamples = [
  {
    title: "Text inputs",
    category: "controls",
    description: "Clear labels, helpful hints, and readable error messages.",
  },
  {
    title: "Selection controls",
    category: "controls",
    description: "Touch-friendly choices for everyday decisions.",
  },
  {
    title: "Status labels",
    category: "feedback",
    description: "A written label for every state, alongside colour.",
  },
  {
    title: "Empty and loading states",
    category: "feedback",
    description: "Clear feedback while waiting or starting fresh.",
  },
];

export function InterfacePreview({ workspace }: { workspace: Workspace }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [name, setName] = useState(workspace.name);
  const [branch, setBranch] = useState("main");
  const [note, setNote] = useState("");
  const [showCaptions, setShowCaptions] = useState(true);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState("");
  const filtered = componentSamples.filter(
    (item) =>
      (category === "all" || item.category === category) &&
      `${item.title} ${item.description}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError("Use at least two characters for the sample name.");
      setMessage("");
      return;
    }
    setError(undefined);
    setMessage(
      `Preview updated for ${name.trim()}. Demo values stay on this page only.`,
    );
  }
  function reset() {
    setName(workspace.name);
    setBranch("main");
    setNote("");
    setShowCaptions(true);
    setError(undefined);
    setMessage("Sample values reset. No workspace records were changed.");
  }
  return (
    <PageContainer>
      <MobilePageHeader
        title="Interface preview"
        backHref={workspaceHref(workspace.id)}
      />
      <PageHeading
        title="The Risiti details."
        eyebrow="Interface preview"
        description="Try the building blocks of your future workspace. Every amount, field, and action on this page is a demo."
        action={<StatusBadge tone="info">Interactive preview</StatusBadge>}
      />
      <ResponsiveGrid>
        <StatCard
          label="Example amount"
          icon="payments"
          value={<CurrencyAmount amount={125000} />}
          description="Sample display only"
        />
        <StatCard
          label="Sample records"
          icon="receipts"
          value="0"
          description="No financial records"
        />
        <StatCard
          label="Display currency"
          icon="books"
          value="UGX"
          description="Whole Uganda Shillings"
        />
      </ResponsiveGrid>
      <SettingsPagePattern
        navigation={
          <>
            <a
              href="#preview-controls"
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm hover:border-primary"
            >
              Form controls
            </a>
            <a
              href="#preview-list"
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm hover:border-primary"
            >
              Search & filters
            </a>
            <a
              href="#preview-feedback"
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm hover:border-primary"
            >
              Feedback states
            </a>
          </>
        }
      >
        <section id="preview-controls" className="space-y-4">
          <SectionHeading description="These sample values reset when you leave or reload this page.">
            A comfortable place to start
          </SectionHeading>
          <AppCard>
            <FormPagePattern
              label="Sample workspace preferences"
              onSubmit={submit}
              actions={
                <>
                  <ConfirmationDialog
                    trigger={<SecondaryButton>Reset preview</SecondaryButton>}
                    title="Reset sample values?"
                    description="This resets only the fields in this interface preview. No business records are affected."
                    confirmLabel="Reset sample values"
                    onConfirm={reset}
                  />
                  <PrimaryButton type="submit">Apply to preview</PrimaryButton>
                </>
              }
            >
              <FormField
                id="sample-name"
                label="Sample workspace name"
                hint="Try editing this fictional business name."
                error={error}
                required
              >
                <AppInput
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (error) setError(undefined);
                  }}
                  maxLength={100}
                  autoComplete="off"
                />
              </FormField>
              <FormField id="sample-branch" label="Sample branch">
                <AppSelect
                  value={branch}
                  onChange={(event) => setBranch(event.target.value)}
                >
                  <option value="main">Main Branch</option>
                  <option value="second">Second Branch (sample)</option>
                </AppSelect>
              </FormField>
              <FormField
                id="sample-note"
                label="Sample note"
                hint="No personal or financial information is needed."
              >
                <AppTextarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="A note for this preview…"
                  maxLength={500}
                />
              </FormField>
              <FormField
                id="sample-currency"
                label="Currency"
                hint="Uganda Shillings are displayed as whole numbers."
              >
                <AppInput value="UGX — Uganda Shilling" disabled />
              </FormField>
              <AppSwitch
                label="Show sample captions"
                description="Toggle descriptions in the component list below."
                checked={showCaptions}
                onCheckedChange={setShowCaptions}
              />
              <p role="status" className="text-caption text-success">
                {message}
              </p>
            </FormPagePattern>
          </AppCard>
        </section>
        <section id="preview-list" className="space-y-4">
          <SectionHeading description="Search and filter this sample component list.">
            Find your way
          </SectionHeading>
          <ListPagePattern
            toolbar={
              <>
                <SearchField
                  label="Search preview components"
                  placeholder="Search components"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="sm:w-48">
                  <FormField id="preview-category" label="Component category">
                    <AppSelect
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                    >
                      <option value="all">All components</option>
                      <option value="controls">Controls</option>
                      <option value="feedback">Feedback</option>
                    </AppSelect>
                  </FormField>
                </div>
              </>
            }
          >
            <p
              role="status"
              className="mb-3 text-caption text-muted-foreground"
            >
              {filtered.length} sample{" "}
              {filtered.length === 1 ? "component" : "components"}
            </p>
            {filtered.length ? (
              <div className="space-y-3">
                {filtered.map((item) => (
                  <AppCard key={item.title}>
                    <h3 className="text-card-heading">{item.title}</h3>
                    {showCaptions && (
                      <p className="mt-2 text-caption text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </AppCard>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No sample matches"
                description="Try a different search or category."
                icon="help"
                action={
                  <SecondaryButton
                    onClick={() => {
                      setQuery("");
                      setCategory("all");
                    }}
                  >
                    Clear filters
                  </SecondaryButton>
                }
              />
            )}
          </ListPagePattern>
        </section>
        <section id="preview-feedback" className="space-y-4">
          <SectionHeading description="Labels keep meaning clear, even without colour.">
            Clear, at every step
          </SectionHeading>
          <AppCard>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="success">Success</StatusBadge>
              <StatusBadge tone="warning">Needs attention</StatusBadge>
              <StatusBadge tone="error">Error</StatusBadge>
              <StatusBadge tone="info">Information</StatusBadge>
              <StatusBadge tone="planned">Planned</StatusBadge>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton loading>Loading example</PrimaryButton>
              <SecondaryButton disabled>Disabled example</SecondaryButton>
            </div>
          </AppCard>
          <AppCard>
            <LoadingSkeleton label="Loading state example" cards={1} />
          </AppCard>
          <DetailPagePattern
            summary={
              <AppCard>
                <h3 className="text-card-heading">Sample detail</h3>
                <p className="mt-3 text-caption text-muted-foreground">
                  A reusable summary and detail layout. This contains no
                  transaction data.
                </p>
              </AppCard>
            }
          >
            <AppCard>
              <h3 className="text-card-heading">The finer details</h3>
              <p className="mt-3 text-app-body text-muted-foreground">
                Consistent spacing, readable type, and clear feedback belong on
                every page.
              </p>
              <Link
                href={workspaceHref(workspace.id)}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
              >
                Return to your workspace{" "}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </AppCard>
          </DetailPagePattern>
        </section>
      </SettingsPagePattern>
    </PageContainer>
  );
}
