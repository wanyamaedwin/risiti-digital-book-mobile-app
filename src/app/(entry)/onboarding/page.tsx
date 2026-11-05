import type { Metadata } from "next";
import { OnboardingWizard } from "@/features/onboarding/onboarding-wizard";
export const metadata: Metadata = { title: "Quick Setup" };
export default function Page() {
  return <OnboardingWizard />;
}
