import Link from "next/link";
import { ArrowUpRight, BookOpen, Check, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { Brand } from "@/components/brand";

export function EntryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="entry-shell min-h-dvh">
      <a href="#entry-main" className="skip-link">
        Skip to content
      </a>
      <header className="border-b border-border/60 bg-card px-4 sm:px-8">
        <div className="mx-auto flex min-h-20 max-w-6xl items-center justify-between gap-3 py-3">
          <Link
            href="/"
            aria-label="Risiti welcome page"
            className="rounded-xl"
          >
            <Brand compact />
          </Link>
          <Link
            href="/w/demo/home"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-3 text-caption font-medium text-ink hover:border-primary sm:px-5"
          >
            Explore Demo <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl items-start gap-8 px-4 py-7 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <aside className="hidden lg:sticky lg:top-8 lg:block">
          <div className="relative overflow-hidden rounded-[2rem] bg-primary p-9 text-white">
            <p className="mb-8 text-metadata font-medium tracking-[0.16em] uppercase">
              Make room for possibility
            </p>
            <h2 className="text-app-display">
              Your next chapter
              <br />
              starts here.
            </h2>
            <p className="mt-5 text-app-body text-white/85">
              A little less paperwork.
              <br />A little more space to grow.
            </p>
            <div
              aria-hidden="true"
              className="relative mx-auto my-12 flex aspect-square w-60 max-w-full items-center justify-center rounded-full border border-white/20"
            >
              <div className="flex h-48 w-36 -rotate-12 flex-col justify-between rounded-2xl border-l-8 border-ink/20 bg-white p-5 text-primary shadow-xl">
                <BookOpen className="size-9" strokeWidth={1.3} />
                <span className="text-5xl font-semibold tracking-tighter">
                  R<span className="text-ink">.</span>
                </span>
                <div className="flex justify-end">
                  <span className="flex size-9 items-center justify-center rounded-full bg-lime text-ink">
                    <Check className="size-5" />
                  </span>
                </div>
              </div>
              <Sparkles
                className="absolute top-0 right-1 size-7 text-white/70"
                strokeWidth={1.4}
              />
            </div>
            <p className="text-caption text-white/85">
              Thoughtfully simple. Made for your everyday.
            </p>
          </div>
          <p className="mt-5 text-caption text-muted-foreground">
            Frontend demonstration · Use made-up details.
          </p>
        </aside>
        <main id="entry-main" tabIndex={-1} className="min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
