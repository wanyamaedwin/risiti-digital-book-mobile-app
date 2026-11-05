"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Mail, Phone, ShieldCheck } from "lucide-react";
import {
  accountEntrySchema,
  verificationSchema,
  type AccountEntryValues,
  type EntryMode,
} from "@/lib/entry-validation";
import { AppCard } from "@/components/shared/cards";
import { AppInput, FormField } from "@/components/shared/form-controls";
import { PrimaryButton } from "@/components/shared/buttons";
import { PageHeading } from "@/components/shared/typography";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

const subscribeReady = () => () => {};
function useClientReady() {
  return useSyncExternalStore(
    subscribeReady,
    () => true,
    () => false,
  );
}
const accountDefaults: AccountEntryValues = {
  method: "phone",
  identity: "",
  password: "",
  confirmPassword: "",
};

export function AccountEntry({ mode }: { mode: EntryMode }) {
  const router = useRouter();
  const ready = useClientReady();
  const schema = useMemo(() => accountEntrySchema(mode), [mode]);
  const form = useForm<AccountEntryValues>({
    resolver: zodResolver(schema),
    defaultValues: accountDefaults,
  });
  const [method, setMethod] = useState<"phone" | "email">("phone");
  const [recoveryReady, setRecoveryReady] = useState(false);
  const { reset } = form;
  useLayoutEffect(
    () => () => {
      reset(accountDefaults);
      setMethod("phone");
      setRecoveryReady(false);
    },
    [reset],
  );
  const title =
    mode === "sign-in"
      ? "Good to see you."
      : mode === "create-account"
        ? "A fresh start awaits."
        : "Let's find your way back.";
  const submit = () => {
    // Validation preview only: credentials never leave this component.
    form.reset({ ...accountDefaults, method });
    if (mode === "forgot-password") setRecoveryReady(true);
    else router.push("/verify");
  };
  return (
    <div className="space-y-6">
      <StatusBadge tone="info">Frontend demonstration</StatusBadge>
      <PageHeading
        title={title}
        description={
          mode === "forgot-password"
            ? "Try the recovery entry screen using sample details."
            : mode === "sign-in"
              ? "Preview signing in to Risiti with a phone number or email."
              : "Preview creating your account, then make yourself at home."
        }
      />
      <AppCard className="p-5 sm:p-7">
        <p className="mb-6 rounded-2xl bg-primary/6 p-4 text-caption text-muted-foreground">
          Use made-up details. No account, login session, or recovery message is
          created. Passwords are never saved by this demo.
        </p>
        <form
          noValidate
          autoComplete="off"
          onSubmit={form.handleSubmit(submit)}
          className="space-y-5"
        >
          <fieldset>
            <legend className="mb-2 text-sm font-medium">
              {mode === "forgot-password" ? "Find with" : "Continue with"}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {(["phone", "email"] as const).map((value) => {
                const Icon = value === "phone" ? Phone : Mail;
                return (
                  <label
                    key={value}
                    className={cn(
                      "relative flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border px-3 text-sm transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring",
                      method === value
                        ? "border-primary bg-primary/8 font-medium text-primary"
                        : "border-border bg-card",
                    )}
                  >
                    <input
                      type="radio"
                      name="entry-method"
                      value={value}
                      checked={method === value}
                      onChange={() => {
                        setMethod(value);
                        setRecoveryReady(false);
                        form.reset({ ...accountDefaults, method: value });
                      }}
                      className="sr-only"
                    />
                    <Icon aria-hidden="true" className="size-4" />
                    {value === "phone" ? "Phone" : "Email"}
                  </label>
                );
              })}
            </div>
          </fieldset>
          <FormField
            id={`${mode}-identity`}
            label={method === "phone" ? "Phone number" : "Email address"}
            hint={
              method === "phone"
                ? "Uganda +256 · A 0-prefixed number also works."
                : "Use a sample address, such as hello@example.com."
            }
            error={form.formState.errors.identity?.message}
            required
          >
            <AppInput
              {...form.register("identity")}
              type={method === "phone" ? "tel" : "email"}
              inputMode={method === "phone" ? "tel" : "email"}
              placeholder={
                method === "phone" ? "+256 772 123 456" : "hello@example.com"
              }
              autoComplete="off"
              maxLength={254}
            />
          </FormField>
          {mode !== "forgot-password" && (
            <FormField
              id={`${mode}-password`}
              label="Sample password"
              hint={
                mode === "create-account"
                  ? "At least 8 characters. Use a made-up password."
                  : "Use a made-up password for this preview."
              }
              error={form.formState.errors.password?.message}
              required
            >
              <AppInput
                {...form.register("password")}
                type="password"
                autoComplete="off"
                maxLength={128}
              />
            </FormField>
          )}
          {mode === "create-account" && (
            <FormField
              id="confirm-password"
              label="Confirm sample password"
              error={form.formState.errors.confirmPassword?.message}
              required
            >
              <AppInput
                {...form.register("confirmPassword")}
                type="password"
                autoComplete="off"
                maxLength={128}
              />
            </FormField>
          )}
          {mode === "sign-in" && (
            <Link
              href="/forgot-password"
              className="inline-flex min-h-11 items-center text-sm font-medium text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          )}
          <PrimaryButton
            type="submit"
            disabled={!ready || form.formState.isSubmitting}
            className="w-full bg-lime text-ink hover:bg-lime/90"
          >
            {mode === "forgot-password"
              ? "Preview recovery"
              : mode === "sign-in"
                ? "Preview sign in"
                : "Preview account setup"}
            <ArrowRight aria-hidden="true" />
          </PrimaryButton>
        </form>
        {recoveryReady && (
          <div className="mt-5 rounded-2xl bg-info-surface p-4">
            <p role="status" className="text-sm text-info">
              Recovery preview ready. No message has been sent.
            </p>
            <Link
              href="/verify"
              className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-primary"
            >
              Open verification preview{" "}
              <ArrowRight aria-hidden="true" className="ml-2 size-4" />
            </Link>
          </div>
        )}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "sign-in" ? "New to Risiti? " : "Already exploring? "}
          <Link
            href={mode === "sign-in" ? "/create-account" : "/sign-in"}
            className="inline-flex min-h-11 items-center font-medium text-primary hover:underline"
          >
            {mode === "sign-in" ? "Create account" : "Sign in"}
          </Link>
        </p>
      </AppCard>
      <Link
        href="/onboarding"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
      >
        Skip account preview and try Quick Setup{" "}
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </div>
  );
}

export function VerificationPreview() {
  const router = useRouter();
  const ready = useClientReady();
  const form = useForm<{ code: string }>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: "" },
  });
  const { reset } = form;
  useLayoutEffect(() => () => reset({ code: "" }), [reset]);
  return (
    <div className="space-y-6">
      <StatusBadge tone="info">Verification preview</StatusBadge>
      <PageHeading
        title="One small step."
        description="A preview of how checking your account details could feel."
      />
      <AppCard className="space-y-6 p-5 sm:p-7">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-primary/8 text-primary">
          <ShieldCheck
            aria-hidden="true"
            className="size-8"
            strokeWidth={1.4}
          />
        </span>
        <p className="text-app-body text-muted-foreground">
          No account has been created and no code has been sent. Enter any six
          digits to explore this screen. This does not verify an account.
        </p>
        <form
          noValidate
          autoComplete="off"
          onSubmit={form.handleSubmit(() => {
            form.reset({ code: "" });
            router.push("/onboarding");
          })}
          className="space-y-5"
        >
          <FormField
            id="verification-code"
            label="Sample verification code"
            hint="Six digits, such as 123456. Use a made-up code."
            error={form.formState.errors.code?.message}
            required
          >
            <AppInput
              {...form.register("code")}
              type="text"
              inputMode="numeric"
              maxLength={6}
              autoComplete="off"
              className="text-center text-2xl tracking-[0.4em] tabular-nums"
            />
          </FormField>
          <PrimaryButton
            type="submit"
            disabled={!ready || form.formState.isSubmitting}
            className="w-full bg-lime text-ink hover:bg-lime/90"
          >
            Continue to Quick Setup <ArrowRight aria-hidden="true" />
          </PrimaryButton>
        </form>
        <Link
          href="/sign-in"
          className="inline-flex min-h-11 items-center text-sm font-medium text-primary"
        >
          Back to sign in
        </Link>
      </AppCard>
    </div>
  );
}
