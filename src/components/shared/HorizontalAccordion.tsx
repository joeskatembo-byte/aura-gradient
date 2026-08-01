import { useState } from "react";
import { Plus } from "lucide-react";

export type AccordionItem = { q: string; a: string };

export function HorizontalAccordion({ items, height = 360 }: { items: AccordionItem[]; height?: number }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <>
      <div className="hidden gap-3 md:flex" style={{ height }}>
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <button
              key={f.q}
              onClick={() => setOpen(isOpen ? null : i)}
              style={{ flexGrow: isOpen ? 5 : 1 }}
              className={`group relative overflow-hidden rounded-3xl border text-left transition-all duration-700 ease-out ${
                isOpen ? "border-transparent instagram-gradient-soft" : "border-border bg-card hover:bg-muted"
              }`}
            >
              <div className="flex h-full w-full">
                <div className={`flex w-16 shrink-0 flex-col items-center justify-between border-r py-6 ${isOpen ? "border-white/20" : "border-border"}`}>
                  <span className={`font-display text-lg font-black ${isOpen ? "instagram-text" : "text-muted-foreground"}`}>
                    0{i + 1}
                  </span>
                  <Plus className={`h-5 w-5 transition-transform duration-500 ${isOpen ? "rotate-[135deg] instagram-text" : ""}`} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center p-6">
                  {isOpen ? (
                    <div className="animate-fade-in">
                      <h3 className="font-display text-xl font-bold sm:text-2xl">{f.q}</h3>
                      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{f.a}</p>
                    </div>
                  ) : (
                    <h3 className="rotate-180 whitespace-nowrap text-sm font-semibold text-muted-foreground [writing-mode:vertical-rl]">
                      {f.q}
                    </h3>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 md:hidden">
        {items.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className={`overflow-hidden rounded-2xl border ${isOpen ? "border-transparent instagram-gradient-soft" : "border-border bg-card"}`}>
              <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center gap-3 p-4 text-left">
                <span className={`font-display text-sm font-black ${isOpen ? "instagram-text" : "text-muted-foreground"}`}>0{i + 1}</span>
                <span className="flex-1 font-semibold">{f.q}</span>
                <Plus className={`h-5 w-5 transition-transform duration-500 ${isOpen ? "rotate-[135deg] instagram-text" : ""}`} />
              </button>
              {isOpen && <div className="animate-fade-in px-4 pb-4 text-sm text-muted-foreground">{f.a}</div>}
            </div>
          );
        })}
      </div>
    </>
  );
}
