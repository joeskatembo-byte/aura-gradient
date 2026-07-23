import { useState } from "react";
import { Heart, Share2, Download, Play } from "lucide-react";
import { media } from "@/data/mock";

type Item = { id: string; title: string; img: string; desc: string };

export function MediaNetflix() {
  return (
    <section id="mediatheque" className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider instagram-text">Médiathèque</div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl">L'histoire de la maison, en images.</h2>
          </div>
          <span className="text-sm text-white/60">Affiches · Photos · Podcasts · Vidéos</span>
        </div>

        {(Object.keys(media) as (keyof typeof media)[]).map((cat) => (
          <Row key={cat} title={cat} items={media[cat]} />
        ))}
      </div>
    </section>
  );
}

function Row({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="mb-10">
      <h3 className="mb-3 font-display text-xl font-bold">{title}</h3>
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:px-0">
        {items.map((it) => (
          <MediaCard key={it.id} it={it} />
        ))}
      </div>
    </div>
  );
}

function MediaCard({ it }: { it: Item }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="group relative aspect-[3/4] w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl bg-white/5 sm:w-[240px] transition-transform duration-300 hover:scale-[1.04] hover:z-10">
      <img src={it.img} alt={it.title} loading="lazy" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="font-display text-base font-bold">{it.title}</div>
        <div className="mt-1 text-xs text-white/70 line-clamp-2">{it.desc}</div>
        <div className="mt-3 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button aria-label="Lire" className="grid h-8 w-8 place-items-center rounded-full instagram-animated"><Play className="h-3.5 w-3.5" /></button>
          <button aria-label="Aimer" onClick={() => setLiked((v) => !v)} className="grid h-8 w-8 place-items-center rounded-full border border-white/30 hover:bg-white/10">
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-current text-[color:var(--color-ig-pink)]" : ""}`} />
          </button>
          <button aria-label="Partager" className="grid h-8 w-8 place-items-center rounded-full border border-white/30 hover:bg-white/10"><Share2 className="h-3.5 w-3.5" /></button>
          <button aria-label="Télécharger" className="grid h-8 w-8 place-items-center rounded-full border border-white/30 hover:bg-white/10"><Download className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}
