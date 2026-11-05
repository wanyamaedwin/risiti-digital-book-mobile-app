import {
  ArrowDown,
  ArrowUpRight,
  Feather,
  MoveUpRight,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { BookArtwork } from "@/components/book-artwork";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const principles = [
  {
    number: "01",
    icon: Feather,
    title: "Keep it simple.",
    description:
      "Less clutter. More breathing room. We believe the everyday should feel effortless.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Think everyday.",
    description:
      "Small screens. Big ambitions. Designed with your phone and your day in mind.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Make room to grow.",
    description:
      "Every great idea starts somewhere. This is the first page of our story.",
  },
];

export default function Home() {
  return (
    <>
      <section
        id="welcome"
        aria-labelledby="welcome-title"
        className="page-container grid items-center gap-4 pt-12 pb-14 sm:pt-16 lg:grid-cols-[1.12fr_1fr] lg:gap-12 lg:pt-20 lg:pb-20"
      >
        <div className="animate-enter">
          <p className="eyebrow mb-7 flex items-center gap-3">
            <span className="size-2 rounded-full bg-primary" /> Welcome to
            Risiti
          </p>
          <h1 id="welcome-title" className="text-display">
            Good things
            <br />
            start with a<br />
            <span className="text-primary">fresh page.</span>
          </h1>
          <p className="text-body mt-7 max-w-md">
            Meet Risiti Digital Book. A simpler, more thoughtful way forward for
            your everyday business. Our story is just beginning.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#about">
                Meet Risiti <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#spirit">
                The Risiti spirit <ArrowDown aria-hidden="true" />
              </a>
            </Button>
          </div>
          <p className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" /> A new
            beginning. Thoughtfully built.
          </p>
          <Link
            href="/w/demo/home"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Explore the demo workspace{" "}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <BookArtwork />
      </section>
      <section
        id="about"
        aria-labelledby="about-title"
        className="page-container border-t border-border pt-12 pb-14 sm:pt-16 sm:pb-20"
      >
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-3">A little less complicated</p>
            <h2 id="about-title" className="text-heading">
              Built around real life.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-muted-foreground">
            A few simple beliefs, at the heart of everything we&apos;re
            building.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map(({ number, icon: Icon, title, description }) => (
            <Card key={number} className="py-0 shadow-none">
              <CardContent className="p-6 sm:p-7">
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    <Icon
                      aria-hidden="true"
                      className="size-5"
                      strokeWidth={1.6}
                    />
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section
        id="spirit"
        aria-labelledby="spirit-title"
        className="page-container pb-14 sm:pb-20"
      >
        <div className="relative overflow-hidden rounded-3xl bg-ink px-7 py-10 text-white sm:px-12 sm:py-12">
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow mb-4 text-lime">The Risiti spirit</p>
            <h2 id="spirit-title" className="text-heading">
              Big ambitions.
              <br />
              One page at a time.
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-white/70">
              Here&apos;s to new ideas, small beginnings, and the people who
              keep moving forward. Welcome to our next chapter.
            </p>
          </div>
          <MoveUpRight
            aria-hidden="true"
            className="absolute -right-6 bottom-0 size-48 text-lime/10 sm:right-8 sm:size-64 lg:text-lime"
            strokeWidth={0.8}
          />
        </div>
      </section>
    </>
  );
}
