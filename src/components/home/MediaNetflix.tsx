import { useState } from "react";
import { Heart, Share2, Download, Play } from "lucide-react";
import { media } from "@/data/mock";

type Item = { id: string; title: string; img: string; desc: string };

export function MediaNetflix() {
  return (
    <section id="mediatheque" className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-20">
        <div className="mb-10 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wider instagram-text">Médiathèque</div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl lg:text-4xl">L'histoire de la maison, en images.</h2>
          </div>
          <span className="shrink-0 text-sm text-white/60">Affiches · Photos · Podcasts · Vidéos</span>
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
    <div className="mb-12">
      <h3 className="mb-4 font-display text-lg font-bold sm:text-xl">{title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white/5 transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl">
      <img src={it.img} alt={it.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="font-display text-base font-bold sm:text-lg">{it.title}</div>
        <div className="mt-1 text-xs text-white/70 line-clamp-2 sm:text-sm">{it.desc}</div>
        <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button aria-label="Lire" className="grid h-9 w-9 shrink-0 place-items-center rounded-full instagram-animated">
            <Play className="h-4 w-4 fill-current" />
          </button>
          <button
            aria-label="Aimer"
            onClick={() => setLiked((v) => !v)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/10"
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-current text-ig-pink" : ""}`} />
          </button>
          <button aria-label="Partager" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/10">
            <Share2 className="h-4 w-4" />
          </button>
          <button aria-label="Télécharger" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/10">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
