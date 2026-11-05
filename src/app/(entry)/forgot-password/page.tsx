import type { Metadata } from "next";
import { AccountEntry } from "@/features/account/account-entry";
export const metadata: Metadata = { title: "Recovery preview" };
export default function Page() {
  return <AccountEntry mode="forgot-password" />;
}
