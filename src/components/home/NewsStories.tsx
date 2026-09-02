import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { news as mockNews } from "@/data/mock";
import { ChevronLeft, ChevronRight } from "lucide-react";

const db = supabase as unknown as SupabaseClient;

type NewsItem = { id: string; title: string; content: string; dept: string; date: string; time: string };

function fromAnnouncement(a: Record<string, unknown>): NewsItem {
  const d = new Date(String(a["published_at"] ?? Date.now()));
  return {
    id: String(a["id"]),
    title: String(a["title"]),
    content: String(a["content"]),
    dept: String(a["letter"] ?? "E"),
    date: d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }).toUpperCase(),
    time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
  };
}

export function NewsStories() {
  const [i, setI] = useState(0);
  const [key, setKey] = useState(0);

  const { data } = useQuery({
    queryKey: ["announcements", "home"],
    queryFn: async () => {
      const { data, error } = await db
        .from("announcements")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []).map((a) => fromAnnouncement(a as Record<string, unknown>));
    },
  });

  const items: NewsItem[] = data && data.length > 0 ? data : mockNews;
  const safeI = i % items.length;

  useEffect(() => {
    const t = setTimeout(() => {
      setI((v) => (v + 1) % items.length);
      setKey((k) => k + 1);
    }, 6000);
    return () => clearTimeout(t);
  }, [i, items.length]);

  const item = items[safeI];
  const next = () => { setI((v) => (v + 1) % items.length); setKey(k => k + 1); };
  const prev = () => { setI((v) => (v - 1 + items.length) % items.length); setKey(k => k + 1); };

  return (
    <section id="actualites" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider instagram-text">En direct</div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Actualités de l'église</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prev} aria-label="Précédent" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={next} aria-label="Suivant" className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card">
        {/* progress bars */}
        <div className="flex gap-1 p-3">
          {news.map((_, k) => (
            <div key={k} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                key={`${k}-${key}`}
                className={`h-full instagram-animated ${k < i ? "w-full" : k === i ? "story-progress-bar" : "w-0"}`}
              />
            </div>
          ))}
        </div>

        <div key={i} className="grid grid-cols-1 gap-6 p-6 md:grid-cols-[auto_1fr] md:gap-8 md:p-10 animate-fade-in">
          <div className="flex items-center gap-4 md:flex-col md:items-start">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-full instagram-animated p-[3px] sm:h-20 sm:w-20">
                <div className="grid h-full w-full place-items-center rounded-full bg-background">
                  <span className="font-display text-xl font-black instagram-text sm:text-2xl">{item.dept}</span>
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 rounded-full instagram-animated px-2 py-0.5 text-[10px] font-bold text-white">LIVE</span>
            </div>
            <div className="md:mt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.date} · {item.time}</div>
              <div className="mt-1 text-sm font-semibold instagram-text">Département {item.dept === "E" ? "Église entière" : item.dept}</div>
            </div>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl">{item.title}</h3>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{item.content}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {news.map((n, k) => (
                <button key={n.id} onClick={() => { setI(k); setKey(x => x + 1); }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${k === i ? "instagram-animated text-white" : "border border-border hover:bg-muted"}`}>
                  {n.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
