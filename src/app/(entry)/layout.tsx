import type { ReactNode } from "react";
import { EntryLayout } from "@/features/account/entry-layout";

export default function Layout({ children }: { children: ReactNode }) {
  return <EntryLayout>{children}</EntryLayout>;
}
