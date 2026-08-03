import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Share2, Download, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { media as mockMedia } from "@/data/mock";

type Item = { id: string; title: string; img: string; desc: string; url?: string | null };

const CATEGORIES = ["Affiches", "Photos", "Podcasts", "Vidéos"] as const;

export function MediaNetflix() {
  const { data } = useQuery({
    queryKey: ["public", "media_items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media_items")
        .select("id, title, description, category, media_url, thumbnail_url")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const grouped = useMemo(() => {
    const base: Record<string, Item[]> = {};
    for (const cat of CATEGORIES) {
      const fallback = (mockMedia as Record<string, Item[]>)[cat] ?? [];
      const rows = (data ?? []).filter((m) => m.category === cat);
      base[cat] = rows.length
        ? rows.map((m, i) => ({
            id: m.id,
            title: m.title,
            desc: m.description ?? "",
            img: m.thumbnail_url || fallback[i % Math.max(fallback.length, 1)]?.img || "",
            url: m.media_url,
          }))
        : fallback;
    }
    return base;
  }, [data]);

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

        {CATEGORIES.map((cat) =>
          grouped[cat]?.length ? <Row key={cat} title={cat} items={grouped[cat]} /> : null,
        )}
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
      {it.img ? (
        <img src={it.img} alt={it.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      ) : (
        <div className="h-full w-full instagram-animated opacity-70" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <div className="font-display text-base font-bold sm:text-lg">{it.title}</div>
        <div className="mt-1 text-xs text-white/70 line-clamp-2 sm:text-sm">{it.desc}</div>
        <div className="mt-4 flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <a
            href={it.url || undefined}
            target={it.url ? "_blank" : undefined}
            rel="noreferrer"
            aria-label="Lire"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full instagram-animated"
          >
            <Play className="h-4 w-4 fill-current" />
          </a>
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
