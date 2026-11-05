import type { Metadata } from "next";
import { VerificationPreview } from "@/features/account/account-entry";
export const metadata: Metadata = { title: "Verification preview" };
export default function Page() {
  return <VerificationPreview />;
}
