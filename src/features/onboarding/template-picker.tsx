import { starterTemplates } from "@/data/receipt-templates";
import type { StarterTemplateId } from "@/types/onboarding";
import type { StarterReceiptTemplate } from "@/types/receipt-template";
import { ChoiceCard } from "@/features/onboarding/choice-card";

export function TemplatePreview({
  template,
}: {
  template: StarterReceiptTemplate;
}) {
  return (
    <span
      aria-hidden="true"
      className="my-4 block rounded-2xl border border-border bg-white p-4"
    >
      <span className="flex items-center justify-between gap-2">
        <span className="text-xl font-semibold text-primary">R.</span>
        <span className="text-metadata text-muted-foreground">Demo design</span>
      </span>
      <span className="mt-3 block h-1.5 w-3/4 rounded bg-ink/15" />
      <span className="mt-2 block h-1.5 w-1/2 rounded bg-ink/10" />
      <span className="mt-4 grid grid-cols-2 gap-3 border-y border-border py-3">
        {template.defaultFields.slice(0, 4).map((field) => (
          <span key={field.id} className="h-1.5 rounded bg-primary/15" />
        ))}
      </span>
      <span className="mt-3 ml-auto block h-2 w-1/3 rounded bg-primary/30" />
    </span>
  );
}
export function TemplatePicker({
  selectedId,
  onSelect,
}: {
  selectedId: StarterTemplateId | null;
  onSelect: (id: StarterTemplateId) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">Choose a receipt design</legend>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2">
        {starterTemplates.map((template) => (
          <ChoiceCard
            key={template.id}
            name="starter-template"
            value={template.id}
            title={template.name}
            description={template.description}
            selected={selectedId === template.id}
            onSelect={() => onSelect(template.id)}
          >
            <TemplatePreview template={template} />
            <span className="mt-auto text-caption text-muted-foreground">
              <span className="font-medium text-ink">Suggested fields: </span>
              {template.defaultFields
                .filter((field) => field.source === "display")
                .map((field) => field.label)
                .join(", ") ||
                "Start with receipt number, date, and total. Add your own fields later."}
            </span>
          </ChoiceCard>
        ))}
      </div>
    </fieldset>
  );
}
