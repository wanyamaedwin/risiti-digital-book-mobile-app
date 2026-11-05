import type { ReactNode } from "react";
import { Pencil } from "lucide-react";
import {
  businessCategories,
  primaryUseLabels,
  type OnboardingDraft,
  type OnboardingStep,
} from "@/types/onboarding";
import { needsReceiptBook } from "@/lib/onboarding";
import { templateSelectionLabel } from "@/data/receipt-templates";

export function SetupReview({
  draft,
  onEdit,
}: {
  draft: OnboardingDraft;
  onEdit: (step: OnboardingStep) => void;
}) {
  function row(label: string, value: ReactNode, step: OnboardingStep) {
    return (
      <div className="flex min-w-0 items-start justify-between gap-3 border-b border-border/70 py-4 last:border-0">
        <div className="min-w-0">
          <dt className="text-caption text-muted-foreground">{label}</dt>
          <dd className="mt-1 break-words text-base font-medium">{value}</dd>
        </div>
        <button
          type="button"
          aria-label={`Edit ${label.toLowerCase()}`}
          onClick={() => onEdit(step)}
          className="flex min-h-11 shrink-0 items-center gap-1 rounded-full px-3 text-caption font-medium text-primary hover:bg-primary/6"
        >
          <Pencil aria-hidden="true" className="size-3.5" />
          Edit
        </button>
      </div>
    );
  }
  return (
    <>
      <dl>
        {row(
          "Workspace type",
          draft.workspaceType === "business"
            ? "Business / Institution"
            : "Personal Use",
          "type",
        )}
        {row("Workspace name", draft.name, "details")}
        {draft.workspaceType === "business"
          ? row(
              "Business category",
              draft.category === "other"
                ? draft.customCategory
                : businessCategories.find(
                    (category) => category.id === draft.category,
                  )?.label,
              "details",
            )
          : row("Personal purpose", draft.personalPurpose, "details")}
        {row(
          "Main intended use",
          draft.primaryUse
            ? primaryUseLabels[draft.primaryUse]
            : "Choose an option",
          "use",
        )}
        {needsReceiptBook(draft) &&
          row(
            "Receipt design",
            templateSelectionLabel(draft.template),
            "template",
          )}
      </dl>
      <p className="mt-6 rounded-2xl bg-primary/6 p-4 text-caption text-muted-foreground">
        Finishing prepares a demo in this tab. No account or live workspace is
        created, and no receipt will be issued. Your design choice is a draft
        you can change later.
      </p>
    </>
  );
}
