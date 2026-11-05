"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import {
  AppInput,
  AppSelect,
  AppTextarea,
  FormField,
} from "@/components/shared/form-controls";
import { SecondaryButton } from "@/components/shared/buttons";
import { detailsSchema } from "@/lib/onboarding";
import {
  businessCategories,
  type SetupDetails,
  type WorkspaceType,
} from "@/types/onboarding";

export type LogoPreview = { url: string; name: string } | null;
export function WorkspaceDetails({
  type,
  defaultValues,
  onValuesChange,
  onContinue,
  logo,
  onLogo,
}: {
  type: WorkspaceType;
  defaultValues: SetupDetails;
  onValuesChange: (values: SetupDetails) => void;
  onContinue: (values: SetupDetails) => void;
  logo: LogoPreview;
  onLogo: (logo: LogoPreview) => void;
}) {
  const form = useForm<SetupDetails>({
    resolver: zodResolver(detailsSchema(type)),
    defaultValues,
  });
  const category = useWatch({ control: form.control, name: "category" });
  const [logoError, setLogoError] = useState("");
  const [optionalOpen, setOptionalOpen] = useState(false);
  const logoInput = useRef<HTMLInputElement>(null);
  const { subscribe } = form;
  useEffect(
    () =>
      subscribe({
        formState: { values: true },
        callback: ({ values }) => onValuesChange(values),
      }),
    [subscribe, onValuesChange],
  );
  const errors = form.formState.errors;
  return (
    <form
      id="setup-details"
      noValidate
      autoComplete="off"
      onSubmit={form.handleSubmit(onContinue, (errors) => {
        if (errors.phone || errors.email || errors.address)
          setOptionalOpen(true);
      })}
      className="space-y-5"
    >
      <FormField
        id="workspace-name"
        label={
          type === "business"
            ? "Business or institution name"
            : "Workspace display name"
        }
        hint="Use a fictional name for this demo."
        error={errors.name?.message}
        required
      >
        <AppInput
          {...form.register("name")}
          maxLength={80}
          placeholder={
            type === "business"
              ? "e.g. Kampala Traders"
              : "e.g. My everyday book"
          }
          autoComplete="off"
        />
      </FormField>
      {type === "business" ? (
        <>
          <FormField
            id="business-category"
            label="Business category"
            hint="A suggestion for your starting point. You can choose any receipt design."
            error={errors.category?.message}
            required
          >
            <AppSelect {...form.register("category")}>
              <option value="">Choose a category</option>
              {businessCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </AppSelect>
          </FormField>
          {category === "other" && (
            <FormField
              id="custom-category"
              label="Your category"
              error={errors.customCategory?.message}
              required
            >
              <AppInput
                {...form.register("customCategory")}
                maxLength={80}
                placeholder="e.g. Community organisation"
              />
            </FormField>
          )}
          <details
            className="rounded-2xl border border-border p-4"
            open={optionalOpen}
            onToggle={(event) => setOptionalOpen(event.currentTarget.open)}
          >
            <summary className="min-h-11 cursor-pointer text-sm font-medium text-primary">
              Optional business details
            </summary>
            <div className="mt-4 space-y-5">
              <p className="text-caption text-muted-foreground">
                These details stay on this screen only. They are cleared when
                you leave or refresh. Made-up details work best.
              </p>
              <FormField
                id="business-phone"
                label="Business phone (optional)"
                error={errors.phone?.message}
              >
                <AppInput
                  {...form.register("phone")}
                  type="tel"
                  inputMode="tel"
                  placeholder="+256 772 123 456"
                  autoComplete="off"
                  maxLength={30}
                />
              </FormField>
              <FormField
                id="business-email"
                label="Business email (optional)"
                error={errors.email?.message}
              >
                <AppInput
                  {...form.register("email")}
                  type="email"
                  inputMode="email"
                  placeholder="hello@example.com"
                  autoComplete="off"
                  maxLength={254}
                />
              </FormField>
              <FormField
                id="business-address"
                label="Location / address (optional)"
                error={errors.address?.message}
              >
                <AppTextarea
                  {...form.register("address")}
                  placeholder="A sample location"
                  autoComplete="off"
                  maxLength={160}
                />
              </FormField>
              <FormField
                id="business-logo"
                label="Business logo (optional)"
                hint="PNG, JPEG, or WebP · Up to 2 MB. Preview only, never uploaded."
                error={logoError || undefined}
              >
                <div className="rounded-2xl border border-dashed border-input p-4">
                  <Upload
                    aria-hidden="true"
                    className="mb-3 size-5 text-primary"
                  />
                  <AppInput
                    type="file"
                    ref={logoInput}
                    accept="image/png,image/jpeg,image/webp"
                    className="h-auto min-h-12 p-2 text-sm file:mr-2 file:h-9 file:rounded-full file:bg-muted file:px-3"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      if (
                        !["image/png", "image/jpeg", "image/webp"].includes(
                          file.type,
                        ) ||
                        file.size > 2 * 1024 * 1024
                      ) {
                        setLogoError(
                          "Choose a PNG, JPEG, or WebP image no larger than 2 MB.",
                        );
                        event.target.value = "";
                        return;
                      }
                      setLogoError("");
                      onLogo({
                        url: URL.createObjectURL(file),
                        name: file.name,
                      });
                    }}
                  />
                  {logo && (
                    <div className="mt-4 flex min-w-0 flex-wrap items-center gap-3">
                      <Image
                        src={logo.url}
                        unoptimized
                        width={64}
                        height={64}
                        alt="Your demo logo preview"
                        className="size-16 rounded-xl border border-border object-contain"
                        onError={() => {
                          setLogoError(
                            "This image could not be previewed. Try another PNG, JPEG, or WebP file.",
                          );
                          onLogo(null);
                          if (logoInput.current) logoInput.current.value = "";
                        }}
                      />
                      <span className="min-w-0 flex-1 break-all text-caption">
                        {logo.name}
                      </span>
                      <SecondaryButton
                        onClick={() => {
                          onLogo(null);
                          if (logoInput.current) logoInput.current.value = "";
                        }}
                      >
                        Remove logo
                      </SecondaryButton>
                    </div>
                  )}
                </div>
              </FormField>
            </div>
          </details>
        </>
      ) : (
        <FormField
          id="personal-purpose"
          label="Primary intended use"
          hint="Choose what this personal space is mainly for."
          error={errors.personalPurpose?.message}
          required
        >
          <AppSelect {...form.register("personalPurpose")}>
            <option value="">Choose an intended use</option>
            <option value="Personal receipts">Personal receipts</option>
            <option value="Household spending">Household spending</option>
            <option value="Freelance activities">Freelance activities</option>
            <option value="Other personal use">Other personal use</option>
          </AppSelect>
        </FormField>
      )}
      <p className="text-caption text-muted-foreground">
        Only your demo workspace name and setup choices are kept in this tab.
        You can start over at any time.
      </p>
    </form>
  );
}
