import { useState } from "react";
import { timeline } from "@/data/about";
import { useReveal } from "@/hooks/useReveal";
import { Sparkles } from "lucide-react";

export function StoryTimeline() {
  const [active, setActive] = useState(0);

  return (
    <section id="histoire" className="relative overflow-hidden py-20 sm:py-28">
      {/* Backdrop "archive" vector — changes with the active year */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {timeline.map((t, i) => (
          <div
            key={t.year}
            className={`absolute inset-0 bg-gradient-to-br ${t.tone} transition-opacity duration-700 ${
              i === active ? "opacity-[0.14]" : "opacity-0"
            }`}
          />
        ))}
        <svg className="absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden>
          <defs>
            <pattern id="grid-hist" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M48 0H0V48" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-hist)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <header className="mb-12 max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full instagram-gradient-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Notre histoire
          </span>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
            Un <span className="instagram-text">voyage</span> de foi, année après année
          </h2>
          <p className="mt-3 text-muted-foreground">
            Survolez ou touchez une date : l'archive correspondante se révèle en fond.
          </p>
        </header>

        <ol className="relative grid gap-4">
          <span aria-hidden className="absolute left-[10px] top-2 bottom-2 w-px instagram-animated sm:left-[14px]" />
          {timeline.map((t, i) => (
            <TimelineRow
              key={t.year}
              entry={t}
              index={i}
              active={i === active}
              onActivate={() => setActive(i)}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function TimelineRow({
  entry,
  index,
  active,
  onActivate,
}: {
  entry: (typeof timeline)[number];
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const { ref, visible } = useReveal<HTMLLIElement>(0.4);

  return (
    <li
      ref={ref}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      style={{ transitionDelay: `${index * 60}ms` }}
      className={`group relative cursor-pointer rounded-2xl border pl-10 pr-4 py-5 outline-none transition-all duration-500 sm:pl-16 sm:pr-6 sm:py-6 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${
        active
          ? "border-transparent bg-card shadow-2xl ring-1 ring-primary/30"
          : "border-border/70 bg-card/50 hover:bg-card"
      } focus-visible:ring-2 focus-visible:ring-ring`}
    >
      <span
        aria-hidden
        className={`absolute left-0 top-7 grid h-5 w-5 place-items-center rounded-full transition-transform duration-500 sm:left-1 sm:h-7 sm:w-7 ${
          active ? "instagram-animated scale-110" : "bg-muted"
        }`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-background" />
      </span>

      <div className="grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-6">
        <span
          className={`font-display text-2xl font-black tabular-nums transition-colors sm:text-3xl ${
            active ? "instagram-text" : "text-muted-foreground"
          }`}
        >
          {entry.year}
        </span>
        <div className="min-w-0">
          <h3 className="text-lg font-bold sm:text-xl">{entry.title}</h3>
          <div
            className={`grid transition-all duration-500 ${
              active ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <p className="overflow-hidden text-sm leading-relaxed text-muted-foreground">{entry.text}</p>
          </div>
        </div>
      </div>
    </li>
  );
}
