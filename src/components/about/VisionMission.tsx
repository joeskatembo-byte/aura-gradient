import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { visionSteps as fallbackSteps } from "@/data/about";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Compass, Target, Heart, ArrowRight, RotateCcw } from "lucide-react";

const icons = { flame: Flame, compass: Compass, target: Target, heart: Heart };

const db = supabase as unknown as SupabaseClient;

type VisionStep = { question: string; label: string; answer: string; icon: string };

function useVisionSteps(): readonly VisionStep[] {
  const { data } = useQuery({
    queryKey: ["vision_steps"],
    queryFn: async () => {
      const { data, error } = await db
        .from("vision_steps")
        .select("question, label, answer, icon")
        .eq("active", true)
        .order("position");
      if (error) throw error;
      return (data ?? []) as unknown as VisionStep[];
    },
  });
  return data && data.length > 0 ? data : fallbackSteps;
}

export function VisionMission() {
  const [step, setStep] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const visionSteps = useVisionSteps();

  const isRevealed = revealed.includes(step);
  const safeStep = Math.min(step, visionSteps.length - 1);
  const current = visionSteps[safeStep];
  const Icon = icons[current.icon as keyof typeof icons] ?? Flame;

  return (
    <section id="vision" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <header className="mb-10 text-center">
          <span className="inline-block rounded-full instagram-gradient-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Vision & mission
          </span>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl md:text-5xl">
            Quatre questions, <span className="instagram-text">quatre convictions</span>
          </h2>
        </header>

        {/* progress */}
        <div className="mx-auto mb-8 flex max-w-md items-center gap-2">
          {visionSteps.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setStep(i)}
              aria-label={s.label}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "instagram-animated" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full instagram-animated opacity-20 blur-3xl"
          />

          <div key={step} className="animate-fade-in">
            <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
              <span
                className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl instagram-animated text-white transition-transform duration-500 ${
                  isRevealed ? "scale-100 rotate-0" : "scale-95 -rotate-6"
                }`}
              >
                <Icon className="h-7 w-7" />
              </span>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Étape {step + 1} / {visionSteps.length} — {current.label}
                </p>
                <h3 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">{current.question}</h3>

                <div
                  className={`grid transition-all duration-700 ${
                    isRevealed ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <p className="overflow-hidden text-base leading-relaxed text-muted-foreground sm:text-lg">
                    {current.answer}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {!isRevealed ? (
                    <button
                      onClick={() => setRevealed((r) => [...r, step])}
                      className="inline-flex items-center gap-2 rounded-full instagram-animated px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                    >
                      Découvrir <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : step < visionSteps.length - 1 ? (
                    <button
                      onClick={() => setStep((s) => s + 1)}
                      className="inline-flex items-center gap-2 rounded-full instagram-animated px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-105"
                    >
                      Question suivante <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setStep(0);
                        setRevealed([]);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
                    >
                      <RotateCcw className="h-4 w-4" /> Recommencer
                    </button>
                  )}
                  {step > 0 && (
                    <button
                      onClick={() => setStep((s) => s - 1)}
                      className="rounded-full border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      Précédent
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
