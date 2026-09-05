import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2, Plus, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { testimonies as mockTestimonies } from "@/data/mock";
import { initialsOf, formatDate } from "@/lib/slug";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/shared/StepForm";

type Card = { id: string; name: string; initials: string; content: string; date: string; likes: number; photo?: string | null };

export function TestimoniesStack() {
  const qc = useQueryClient();
  const { userId } = useAuth();
  const [offset, setOffset] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ["public", "testimonies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonies")
        .select("id, display_name, content, likes_count, created_at, photo_url")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });

  const cards: Card[] = useMemo(() => {
    if (data && data.length) {
      return data.map((t) => ({
        id: t.id,
        name: t.display_name,
        initials: initialsOf(t.display_name),
        content: t.content,
        date: formatDate(t.created_at),
        likes: t.likes_count ?? 0,
      }));
    }
    return mockTestimonies.map((t) => ({ ...t, id: String(t.id) }));
  }, [data]);

  const like = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) return;
      const { error } = await supabase.from("testimony_likes").insert({ testimony_id: id, user_id: userId });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["public", "testimonies"] }),
  });

  const order = cards.map((_, i) => (i + offset) % cards.length);
  const cycle = () => setOffset((o) => o + 1);

  const toggleLike = (id: string) => {
    if (liked[id]) return;
    setLiked((l) => ({ ...l, [id]: true }));
    like.mutate(id);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider instagram-text">Action de grâce</div>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ce que Dieu fait chez nous.</h2>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-full instagram-animated px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:opacity-95"
        >
          <Plus className="h-4 w-4" /> Témoigner
        </button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
        <div className="relative mx-auto h-[340px] w-full max-w-lg">
          {order.map((cardIndex, index) => {
            const t = cards[cardIndex];
            if (!t) return null;
            const isTop = index === order.length - 1;
            const depth = order.length - 1 - index;
            return (
              <button
                key={t.id}
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

      {open && <TestimonyModal onClose={() => setOpen(false)} />}
    </section>
  );
}

function TestimonyModal({ onClose }: { onClose: () => void }) {
  const { profile } = useAuth();
  const [name, setName] = useState(profile ? `${profile.first_name} ${profile.last_name}`.trim() : "");
  const [content, setContent] = useState("");
  const [done, setDone] = useState(false);

  const send = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("testimonies").insert({ display_name: name, content, published: false });
      if (error) throw error;
    },
    onSuccess: () => setDone(true),
  });

  return (
    <Modal open title="Partager mon témoignage" onClose={onClose}>
      {done ? (
        <p className="text-sm text-muted-foreground">
          Merci ! Votre témoignage a été transmis au secrétariat. Il sera publié après validation.
        </p>
      ) : (
        <form
          onSubmit={(e) => { e.preventDefault(); send.mutate(); }}
          className="grid gap-4"
        >
          <label className="grid gap-1.5 text-sm">
            <span className="font-semibold">Votre nom</span>
            <input
              value={name} onChange={(e) => setName(e.target.value)} required
              className="rounded-2xl border border-border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-[color:var(--color-ig-purple)]"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-semibold">Ce que Dieu a fait</span>
            <textarea
              value={content} onChange={(e) => setContent(e.target.value)} required rows={5}
              className="rounded-2xl border border-border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-[color:var(--color-ig-purple)]"
            />
          </label>
          {send.error instanceof Error && <p className="text-sm font-semibold text-[color:var(--color-ig-red)]">{send.error.message}</p>}
          <button disabled={send.isPending} className="inline-flex items-center justify-center gap-2 rounded-full instagram-animated px-6 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-60">
            {send.isPending && <Loader2 className="h-4 w-4 animate-spin" />} Envoyer
          </button>
        </form>
      )}
    </Modal>
  );
}
