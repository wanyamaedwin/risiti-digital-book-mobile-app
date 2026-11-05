import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Brand } from "@/components/brand";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="bg-ink text-white">
        <div className="page-container flex min-h-24 items-center justify-between gap-5 py-5">
          <Link
            href="/"
            aria-label="Risiti Digital Book home"
            className="rounded-lg"
          >
            <Brand />
          </Link>
          <nav
            aria-label="Main navigation"
            className="flex items-center gap-8 text-sm font-medium"
          >
            <a
              href="#welcome"
              aria-current="page"
              className="hidden min-h-11 items-center border-b-2 border-lime sm:inline-flex"
            >
              Welcome
            </a>
            <a
              href="#about"
              className="inline-flex min-h-11 items-center gap-2 text-white/80 transition-colors hover:text-lime"
            >
              Our approach{" "}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </nav>
          <Link
            href="/w/demo/home"
            className="hidden min-h-11 items-center gap-2 rounded-full bg-lime px-5 text-sm font-semibold text-ink transition-colors hover:bg-lime/90 md:inline-flex"
          >
            Explore demo <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="page-container flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <Brand compact />
          <p className="text-sm text-muted-foreground">
            A fresh page. A world of possibility.
          </p>
          <a
            href="#welcome"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Back to the top{" "}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </a>
        </div>
      </footer>
    </>
  );
}
