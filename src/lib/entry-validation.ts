import { z } from "zod";

export function normalizeUgandaPhone(value: string): string {
  const digits = value.replace(/[\s()-]/g, "");
  if (/^0\d{9}$/.test(digits)) return `+256${digits.slice(1)}`;
  if (/^256\d{9}$/.test(digits)) return `+${digits}`;
  return digits;
}
export const ugandaPhoneSchema = z
  .string()
  .max(30)
  .refine(
    (value) => /^\+256\d{9}$/.test(normalizeUgandaPhone(value)),
    "Enter a Ugandan number, such as +256 772 123 456 or 0772 123 456.",
  );
export type EntryMode = "sign-in" | "create-account" | "forgot-password";
export function accountEntrySchema(mode: EntryMode) {
  return z
    .object({
      method: z.enum(["phone", "email"]),
      identity: z.string().trim().max(254),
      password: z.string().max(128),
      confirmPassword: z.string().max(128),
    })
    .superRefine((values, context) => {
      const contact =
        values.method === "phone"
          ? ugandaPhoneSchema.safeParse(values.identity)
          : z.email("Enter a valid email address.").safeParse(values.identity);
      if (!contact.success)
        context.addIssue({
          code: "custom",
          path: ["identity"],
          message: contact.error.issues[0].message,
        });
      if (
        mode !== "forgot-password" &&
        values.password.length < (mode === "create-account" ? 8 : 1)
      )
        context.addIssue({
          code: "custom",
          path: ["password"],
          message:
            mode === "create-account"
              ? "Use at least 8 characters for this sample password."
              : "Enter a sample password.",
        });
      if (
        mode === "create-account" &&
        values.password !== values.confirmPassword
      )
        context.addIssue({
          code: "custom",
          path: ["confirmPassword"],
          message: "The sample passwords do not match.",
        });
    });
}
export type AccountEntryValues = z.infer<ReturnType<typeof accountEntrySchema>>;
export const verificationSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, "Enter six digits to try the verification preview."),
});
