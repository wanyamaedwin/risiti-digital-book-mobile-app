"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  CircleCheck,
  ReceiptText,
  RotateCcw,
  UserRound,
  Wallet,
} from "lucide-react";
import { AppCard } from "@/components/shared/cards";
import { PrimaryButton, SecondaryButton } from "@/components/shared/buttons";
import { PageHeading } from "@/components/shared/typography";
import { StatusBadge } from "@/components/shared/status-badge";
import { ConfirmationDialog } from "@/components/feedback/confirmation-dialog";
import { ChoiceCard } from "@/features/onboarding/choice-card";
import { TemplatePicker } from "@/features/onboarding/template-picker";
import {
  WorkspaceDetails,
  type LogoPreview,
} from "@/features/onboarding/workspace-details";
import { SetupReview } from "@/features/onboarding/setup-review";
import {
  finishOnboarding,
  goToOnboardingStep,
  startOnboardingOver,
  updateOnboardingDraft,
  useOnboardingDraft,
} from "@/features/onboarding/draft-store";
import {
  draftDetails,
  firstIncompleteStep,
  onboardingSteps,
} from "@/lib/onboarding";
import {
  primaryUseLabels,
  type OnboardingStep,
  type SetupDetails,
  type StarterTemplateId,
} from "@/types/onboarding";
import { cn } from "@/lib/utils";

const stepTitles: Record<OnboardingStep, string> = {
  type: "A space that feels like you.",
  details: "Make yourself at home.",
  use: "What brings you to Risiti?",
  template: "Your book. Your starting point.",
  review: "Looking good. Shall we begin?",
  success: "Your next chapter is ready.",
};
const stepLabels: Record<OnboardingStep, string> = {
  type: "Your space",
  details: "Your details",
  use: "Your plans",
  template: "Your book",
  review: "Review",
  success: "Ready",
};

export function OnboardingWizard() {
  const { state, storageAvailable } = useOnboardingDraft();
  const { draft, step, completed } = state;
  const [logo, setLogo] = useState<LogoPreview>(null);
  const logoUrl = logo?.url;
  useEffect(
    () => () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    },
    [logoUrl],
  );
  const [transientDetails, setTransientDetails] = useState<SetupDetails | null>(
    null,
  );
  const [detailsEpoch, setDetailsEpoch] = useState(0);
  // Next.js Activity preserves hidden pages. Explicitly clear memory-only data
  // on route deactivation, while ordinary wizard step changes keep it intact.
  useLayoutEffect(
    () => () => {
      setTransientDetails(null);
      setLogo(null);
      setDetailsEpoch((epoch) => epoch + 1);
    },
    [],
  );
  const heading = useRef<HTMLDivElement>(null);
  const steps = onboardingSteps(draft);
  const index = steps.indexOf(step);
  const selectedTemplate =
    draft.template && draft.template.mode !== "later"
      ? draft.template.templateId
      : null;
  const onDetailsChange = useCallback((values: SetupDetails) => {
    setTransientDetails(values);
    updateOnboardingDraft({
      name: values.name,
      category: values.category,
      customCategory: values.customCategory,
      personalPurpose: values.personalPurpose,
    });
  }, []);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [step]);
  function next(nextStep: OnboardingStep) {
    goToOnboardingStep(nextStep);
  }
  function reset() {
    setTransientDetails(null);
    setLogo(null);
    startOnboardingOver();
  }
  function selectTemplate(id: StarterTemplateId) {
    updateOnboardingDraft({
      template:
        id === "blank"
          ? { mode: "blank", templateId: "blank" }
          : { mode: "template", templateId: id },
    });
  }

  if (completed && step === "success")
    return (
      <div className="space-y-6">
        <StatusBadge tone="info">Demo setup complete</StatusBadge>
        <div ref={heading} tabIndex={-1} className="rounded-xl">
          <PageHeading
            title={stepTitles.success}
            description="A fresh page, with your name on it."
          />
        </div>
        <AppCard className="items-center space-y-6 p-6 text-center sm:p-9">
          <span className="flex size-20 items-center justify-center rounded-full bg-lime text-ink">
            <CircleCheck
              aria-hidden="true"
              className="size-10"
              strokeWidth={1.4}
            />
          </span>
          <div>
            <h2 className="text-section-heading">Welcome to {draft.name}.</h2>
            <p className="mt-4 text-app-body text-muted-foreground">
              Your demo workspace is ready in this tab. Explore the existing
              Risiti experience with your chosen name and recommended shortcuts.
            </p>
          </div>
          <p className="text-caption text-muted-foreground">
            No account, online workspace, or receipt has been created.
          </p>
          <Link
            href="/w/setup/home"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-ink hover:bg-lime/90"
          >
            Open my demo workspace{" "}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <SecondaryButton onClick={() => next("review")}>
            Review my choices
          </SecondaryButton>
        </AppCard>
        <ConfirmationDialog
          trigger={
            <SecondaryButton className="gap-2">
              <RotateCcw aria-hidden="true" />
              Start Over
            </SecondaryButton>
          }
          title="Start over?"
          description="This clears the demo setup choices saved in this tab. Your current setup preview will be reset."
          confirmLabel="Start over"
          onConfirm={reset}
        />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <StatusBadge tone="info">Quick Setup · Demo</StatusBadge>
        <ConfirmationDialog
          trigger={
            <SecondaryButton className="px-3 text-caption">
              <RotateCcw aria-hidden="true" />
              Start Over
            </SecondaryButton>
          }
          title="Start over?"
          description="This clears this tab's demo setup choices and the details currently on this page."
          confirmLabel="Start over"
          onConfirm={reset}
        />
      </div>
      <div aria-label="Setup progress">
        <p
          className="mb-3 text-caption font-medium text-muted-foreground"
          aria-live="polite"
        >
          Step {Math.max(0, index) + 1} of {steps.length} · {stepLabels[step]}
        </p>
        <ol className="flex gap-2">
          {steps.map((item, position) => (
            <li
              key={item}
              aria-current={item === step ? "step" : undefined}
              className="min-w-0 flex-1"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full",
                  position <= index ? "bg-primary" : "bg-border",
                )}
              />
              <span className="sr-only">
                {position + 1}. {stepLabels[item]}
                {position < index
                  ? " completed"
                  : item === step
                    ? " current step"
                    : ""}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div ref={heading} tabIndex={-1} className="rounded-xl">
        <PageHeading
          title={stepTitles[step]}
          description={
            step === "type"
              ? "Choose how you'd like to start. You can change your mind along the way."
              : step === "details"
                ? "Just a few details. Keep it simple and use sample information."
                : step === "use"
                  ? "We'll put useful shortcuts within easy reach. All other approved features stay available."
                  : step === "template"
                    ? "Any business can choose any design. Your starter book is optional and can be customised later."
                    : "Take a quick look. You can edit any choice before finishing."
          }
        />
      </div>
      {!storageAvailable && (
        <p
          role="status"
          className="rounded-2xl bg-warning-surface p-4 text-caption text-warning"
        >
          Your browser cannot save a draft in this tab. You can still finish the
          demo while this page stays open.
        </p>
      )}
      <AppCard
        className={cn(
          "p-5 sm:p-7",
          step === "template" &&
            "border-0 bg-transparent p-0 shadow-none sm:p-0",
        )}
      >
        {step === "type" && (
          <fieldset>
            <legend className="sr-only">Choose workspace type</legend>
            <div className="grid gap-4">
              <ChoiceCard
                name="workspace-type"
                value="business"
                title="Business / Institution"
                description="I issue receipts or manage payments for a business or organisation."
                icon={Building2}
                selected={draft.workspaceType === "business"}
                onSelect={() =>
                  updateOnboardingDraft({ workspaceType: "business" })
                }
              />
              <ChoiceCard
                name="workspace-type"
                value="personal"
                title="Personal Use"
                description="I want to create receipts or organise my personal expenses."
                icon={UserRound}
                selected={draft.workspaceType === "personal"}
                onSelect={() =>
                  updateOnboardingDraft({ workspaceType: "personal" })
                }
              />
            </div>
          </fieldset>
        )}
        {step === "details" && draft.workspaceType && (
          <WorkspaceDetails
            key={`${draft.workspaceType}:${detailsEpoch}`}
            type={draft.workspaceType}
            defaultValues={{
              ...draftDetails(draft),
              ...(transientDetails ?? {}),
            }}
            onValuesChange={onDetailsChange}
            onContinue={(values) => {
              onDetailsChange(values);
              next("use");
            }}
            logo={logo}
            onLogo={setLogo}
          />
        )}
        {step === "use" && (
          <fieldset>
            <legend className="sr-only">What will you use Risiti for?</legend>
            <div className="grid gap-4">
              {(
                [
                  {
                    value: "receipts",
                    icon: ReceiptText,
                    description:
                      "Create, share and keep records of payments you receive.",
                  },
                  {
                    value: "expenses",
                    icon: Wallet,
                    description: "Keep track of receipts and money you spend.",
                  },
                  {
                    value: "both",
                    icon: BookOpen,
                    description:
                      "Manage receipts you issue and expenses you record.",
                  },
                ] as const
              ).map((option) => (
                <ChoiceCard
                  key={option.value}
                  name="primary-use"
                  value={option.value}
                  title={primaryUseLabels[option.value]}
                  description={option.description}
                  icon={option.icon}
                  selected={draft.primaryUse === option.value}
                  onSelect={() =>
                    updateOnboardingDraft({ primaryUse: option.value })
                  }
                />
              ))}
            </div>
          </fieldset>
        )}
        {step === "template" && (
          <TemplatePicker
            selectedId={selectedTemplate}
            onSelect={selectTemplate}
          />
        )}
        {step === "review" && <SetupReview draft={draft} onEdit={next} />}
      </AppCard>
      <div className="entry-actions sticky z-20 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border bg-card p-4 shadow-sm">
        <SecondaryButton
          disabled={index <= 0}
          onClick={() => next(steps[Math.max(0, index - 1)])}
          className="gap-2 px-4"
        >
          <ArrowLeft aria-hidden="true" />
          Back
        </SecondaryButton>
        {step === "type" && (
          <PrimaryButton
            disabled={!draft.workspaceType}
            onClick={() => next("details")}
            className="bg-lime text-ink hover:bg-lime/90"
          >
            Continue <ArrowRight aria-hidden="true" />
          </PrimaryButton>
        )}
        {step === "details" && (
          <PrimaryButton
            form="setup-details"
            type="submit"
            className="bg-lime text-ink hover:bg-lime/90"
          >
            Continue <ArrowRight aria-hidden="true" />
          </PrimaryButton>
        )}
        {step === "use" && (
          <PrimaryButton
            disabled={!draft.primaryUse}
            onClick={() =>
              next(draft.primaryUse === "expenses" ? "review" : "template")
            }
            className="bg-lime text-ink hover:bg-lime/90"
          >
            Continue <ArrowRight aria-hidden="true" />
          </PrimaryButton>
        )}
        {step === "template" && (
          <>
            <PrimaryButton
              disabled={!selectedTemplate}
              onClick={() => next("review")}
              className="bg-lime text-ink hover:bg-lime/90"
            >
              Use Template <Check aria-hidden="true" />
            </PrimaryButton>
            <div className="flex w-full flex-wrap gap-x-5 gap-y-1 border-t border-border pt-2">
              <button
                type="button"
                onClick={() => {
                  updateOnboardingDraft({
                    template: { mode: "blank", templateId: "blank" },
                  });
                  next("review");
                }}
                className="min-h-11 text-sm font-medium text-primary hover:underline"
              >
                Start From Scratch
              </button>
              <button
                type="button"
                onClick={() => {
                  updateOnboardingDraft({ template: { mode: "later" } });
                  next("review");
                }}
                className="min-h-11 text-sm font-medium text-primary hover:underline"
              >
                Customise Later
              </button>
            </div>
          </>
        )}
        {step === "review" && (
          <PrimaryButton
            onClick={() => {
              if (!finishOnboarding()) next(firstIncompleteStep(draft));
            }}
            disabled={completed}
            className="bg-lime text-ink hover:bg-lime/90"
          >
            Finish Setup <Check aria-hidden="true" />
          </PrimaryButton>
        )}
      </div>
      <p className="text-caption text-muted-foreground">
        Your name and choices stay in this browser tab when storage is
        available. Optional contact details and logo previews stay on this page
        only. No information is synced to an account.
      </p>
    </div>
  );
}
