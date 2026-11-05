import { ArrowUpRight, Sparkles } from "lucide-react";

/** Lightweight decorative CSS artwork. */
export function BookArtwork() {
  return (
    <div aria-hidden="true" className="book-scene">
      <div className="book-orbit book-orbit-outer" />
      <div className="book-orbit book-orbit-inner" />
      <span className="absolute top-8 right-7 text-primary/60 sm:top-14 sm:right-10">
        <Sparkles className="size-7" strokeWidth={1.3} />
      </span>
      <span className="absolute bottom-16 left-5 size-3 rounded-full bg-lime sm:left-8" />
      <div className="digital-book">
        <div className="book-cover">
          <div className="flex items-center justify-between border-b border-white/20 pb-4 text-[10px] font-medium tracking-[0.18em] uppercase">
            <span>Risiti Digital Book</span>
            <ArrowUpRight className="size-4" />
          </div>
          <span className="book-monogram">
            R<span className="text-lime">.</span>
          </span>
          <div className="flex items-end justify-between">
            <span className="text-xl leading-tight font-medium tracking-tight">
              Your next
              <br />
              chapter.
            </span>
            <span className="flex size-10 items-center justify-center rounded-full bg-lime text-ink">
              <ArrowUpRight className="size-5" />
            </span>
          </div>
        </div>
      </div>
      <div className="book-caption">
        <span className="size-2 rounded-full bg-primary" /> Less paper. More
        possibility.
      </div>
    </div>
  );
}
