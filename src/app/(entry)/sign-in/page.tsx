import type { Metadata } from "next";
import { AccountEntry } from "@/features/account/account-entry";
export const metadata: Metadata = { title: "Sign in preview" };
export default function Page() {
  return <AccountEntry mode="sign-in" />;
}
