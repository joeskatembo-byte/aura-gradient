import { useState } from "react";
import { Heart, Plus, Quote } from "lucide-react";
import { testimonies } from "@/data/mock";

export function TestimoniesStack() {
  const [order, setOrder] = useState(testimonies.map((t) => t.id));
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const cycle = () => setOrder((o) => [...o.slice(1), o[0]]);
  const toggleLike = (id: number) => setLiked((l) => ({ ...l, [id]: !l[id] }));

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider instagram-text">Action de grâce</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ce que Dieu fait chez nous.</h2>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full instagram-animated px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95">
          <Plus className="h-4 w-4" /> Témoigner
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="relative mx-auto h-[340px] w-full max-w-lg">
          {order.map((id, index) => {
            const t = testimonies.find((x) => x.id === id)!;
            const isTop = index === order.length - 1;
            const depth = order.length - 1 - index;
            return (
              <button
                key={id}
                onClick={isTop ? cycle : undefined}
                style={{
                  transform: `translateY(${depth * -14}px) rotate(${depth * -3}deg) scale(${1 - depth * 0.04})`,
                  zIndex: index,
                }}
                className={`absolute inset-0 rounded-3xl border border-border bg-card p-6 text-left shadow-xl transition-all duration-500 sm:p-8 ${
                  isTop ? "cursor-pointer hover:shadow-2xl" : "pointer-events-none opacity-90"
                }`}
              >
                <Quote className="h-6 w-6 instagram-text" />
                <p className="mt-4 font-display text-lg font-semibold leading-snug sm:text-xl">« {t.content} »</p>
                <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full instagram-animated font-bold text-white">{t.initials}</span>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.date}</div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(t.id); }}
                    className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-sm font-semibold hover:bg-muted"
                  >
                    <Heart className={`h-4 w-4 ${liked[t.id] ? "fill-current text-[color:var(--color-ig-pink)]" : ""}`} />
                    {t.likes + (liked[t.id] ? 1 : 0)}
                  </button>
                </div>
              </button>
            );
          })}
        </div>

        <div className="hidden max-w-xs md:block">
          <p className="text-sm text-muted-foreground">
            Touchez la carte pour révéler le témoignage suivant. Chaque histoire est un feu qui rallume le nôtre.
          </p>
          <button onClick={cycle} className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-muted">
            Témoignage suivant
          </button>
        </div>
      </div>
    </section>
  );
}
