import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import type { FeatureDefinition } from "@/config/features";
import { icons } from "@/config/icons";
import { workspaceHref } from "@/config/navigation";
import {
  PageContainer,
  MobilePageHeader,
} from "@/components/layout/page-patterns";
import { PageHeading, SectionHeading } from "@/components/shared/typography";
import { AppCard } from "@/components/shared/cards";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";

export function FeaturePlaceholder({
  feature,
  workspaceId,
}: {
  feature: FeatureDefinition;
  workspaceId: string;
}) {
  const Icon = icons[feature.icon];
  return (
    <PageContainer>
      <MobilePageHeader
        title="Your workspace"
        backHref={workspaceHref(workspaceId)}
      />
      <PageHeading
        title={feature.title}
        description={feature.description}
        action={<StatusBadge tone="planned">Planned feature</StatusBadge>}
      />
      <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <AppCard className="relative justify-between overflow-hidden bg-primary p-7 text-white sm:p-9">
          <span className="mb-12 flex size-20 items-center justify-center rounded-3xl border border-white/20 bg-white/10">
            <Icon aria-hidden="true" className="size-9" strokeWidth={1.3} />
          </span>
          <div>
            <p className="mb-3 text-metadata font-medium tracking-widest text-white/80 uppercase">
              The next chapter
            </p>
            <h2 className="text-app-display">
              Good things
              <br />
              take shape here.
            </h2>
            <p className="mt-5 max-w-md text-app-body text-white/85">
              This is a preview of a future Risiti feature. It is not available
              yet, and no records or transactions can be created here.
            </p>
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-12 size-48 rounded-full border-[28px] border-white/5"
          />
        </AppCard>
        <AppCard className="flex flex-col gap-6">
          <SectionHeading description="A look at what is planned for this space.">
            What&apos;s ahead
          </SectionHeading>
          <ul className="space-y-5">
            {feature.planned.map((item) => (
              <li key={item} className="flex items-start gap-3 text-app-body">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/8 text-primary">
                  <Check aria-hidden="true" className="size-3.5" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="border-t border-border pt-5 text-caption text-muted-foreground">
            Future functionality will require workspace permissions and backend
            validation.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-auto self-start rounded-full bg-card"
          >
            <Link href={workspaceHref(workspaceId)}>
              <ArrowLeft aria-hidden="true" />
              Back to Home
            </Link>
          </Button>
        </AppCard>
      </div>
      {feature.icon === "settings" && (
        <AppCard>
          <SectionHeading description="Try the interface controls using sample values. Nothing is saved.">
            Looking for the interface preview?
          </SectionHeading>
          <Button
            asChild
            variant="outline"
            className="mt-5 self-start rounded-full"
          >
            <Link href={workspaceHref(workspaceId, "design-system")}>
              Explore components <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
        </AppCard>
      )}
    </PageContainer>
  );
}
