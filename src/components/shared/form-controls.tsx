"use client";

import {
  createContext,
  useContext,
  useId,
  type ComponentProps,
  type ReactNode,
} from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NativeSelect } from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FieldContextValue = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
};
const FieldContext = createContext<FieldContextValue | undefined>(undefined);

export function FormField({
  id: providedId,
  label,
  hint,
  error,
  required,
  children,
}: {
  id?: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const describedBy =
    [hint ? `${id}-hint` : "", error ? `${id}-error` : ""]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <FieldContext
      value={{
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
        required,
      }}
    >
      <div className="min-w-0 space-y-2">
        <Label htmlFor={id} className="text-sm leading-5 font-medium">
          {label}
          {required && (
            <span aria-hidden="true" className="text-destructive">
              {" "}
              *
            </span>
          )}
        </Label>
        {children}
        {hint && (
          <p id={`${id}-hint`} className="text-caption text-muted-foreground">
            {hint}
          </p>
        )}
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="text-caption text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    </FieldContext>
  );
}
export function AppInput({
  className,
  ...props
}: ComponentProps<typeof Input>) {
  const field = useContext(FieldContext);
  return (
    <Input
      {...field}
      {...props}
      className={cn(
        "h-12 rounded-xl bg-input-background px-3 text-base disabled:bg-disabled disabled:opacity-100",
        className,
      )}
    />
  );
}
export function AppTextarea({
  className,
  ...props
}: ComponentProps<typeof Textarea>) {
  const field = useContext(FieldContext);
  return (
    <Textarea
      {...field}
      {...props}
      className={cn(
        "min-h-28 rounded-xl bg-input-background p-3 text-base disabled:bg-disabled disabled:opacity-100",
        className,
      )}
    />
  );
}
export function AppSelect({
  className,
  ...props
}: ComponentProps<typeof NativeSelect>) {
  const field = useContext(FieldContext);
  return (
    <NativeSelect
      {...field}
      {...props}
      className={cn(
        "w-full [&_select]:h-12 [&_select]:rounded-xl [&_select]:bg-input-background [&_select]:px-3 [&_select]:pr-9 [&_select]:text-base [&_select:disabled]:bg-disabled",
        className,
      )}
    />
  );
}
export function AppSwitch({
  label,
  description,
  id: providedId,
  className,
  ...props
}: Omit<ComponentProps<typeof Switch>, "children"> & {
  label: string;
  description?: string;
}) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <div className="flex min-h-11 items-center justify-between gap-5">
      <Label
        htmlFor={id}
        className="flex min-h-11 flex-1 flex-col items-start justify-center gap-1 text-sm leading-5"
      >
        {label}
        {description && (
          <span
            id={`${id}-description`}
            className="text-caption font-normal text-muted-foreground"
          >
            {description}
          </span>
        )}
      </Label>
      <Switch
        {...props}
        id={id}
        aria-describedby={description ? `${id}-description` : undefined}
        className={cn("after:-inset-y-3", className)}
      />
    </div>
  );
}
export function SearchField({
  label = "Search",
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "type"> & { label?: string }) {
  const generatedId = useId();
  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <Label htmlFor={props.id ?? generatedId} className="sr-only">
        {label}
      </Label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
      />
      <AppInput
        {...props}
        id={props.id ?? generatedId}
        type="search"
        className="rounded-full pl-11"
      />
    </div>
  );
}
