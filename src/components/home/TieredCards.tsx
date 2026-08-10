import { Link } from "@tanstack/react-router";
import { LifeBuoy, BookOpenText, CalendarClock, ArrowRight } from "lucide-react";
import { meditation } from "@/data/mock";
import { Typed } from "@/components/shared/Typed";

export function TieredCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="mb-8 text-center">
        <div className="text-xs font-semibold uppercase tracking-wider instagram-text">L'appel de Christ</div>
        <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Un pas vers Lui, aujourd'hui.</h2>
        <p className="mx-auto mt-3 min-h-[3.5rem] max-w-2xl text-muted-foreground">
          <Typed items={[
            "Vous n'êtes pas seul. Peu importe où vous en êtes, il y a toujours une main tendue et une Parole vivante pour vous relever.",
            "Une prière, un conseil, une famille : tout commence par un pas.",
            "Venez tel que vous êtes, repartez transformé.",
          ]} />
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3 md:items-center">
        <Card
          icon={LifeBuoy}
          title="Besoin d'aide ?"
          body="Un fardeau trop lourd ? Ne portez rien seul. Nos équipes d'écoute et d'intercession sont là, dans la confidentialité et l'amour."
          cta={{ label: "Écrivez-nous", href: "/contact" }}
        />

        <Card
          featured
          icon={BookOpenText}
          title="À méditer"
          top={
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full instagram-animated px-3 py-1 text-xs font-bold text-white">{meditation.book}</span>
              <span className="text-sm font-semibold instagram-text">{meditation.ref}</span>
            </div>
          }
          body={meditation.message}
          footer={
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full instagram-animated text-sm font-bold text-white">{meditation.initial}</span>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{meditation.author}</span>
            </div>
          }
        />

        <Card
          icon={CalendarClock}
          title="Rendez-vous"
          body="Un temps privilégié avec le pasteur ou un serviteur. Discutez, priez, recevez conseil et onction pour votre marche."
          cta={{ label: "Prendre rendez-vous", href: "/contact" }}
        />
      </div>
    </section>
  );
}

function Card({
  icon: Icon, title, body, cta, featured, top, footer,
}: {
  icon: any; title: string; body: string;
  cta?: { label: string; href: string }; featured?: boolean;
  top?: React.ReactNode; footer?: React.ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 sm:p-8
        ${featured
          ? "border-transparent instagram-gradient-soft md:-translate-y-4 md:scale-[1.03] shadow-2xl shadow-primary/10 ring-1 ring-primary/20"
          : "border-border bg-card card-lift"}`}
    >
      {featured && <div className="absolute inset-x-0 top-0 h-1 instagram-animated" />}
      {top}
      <div className={`mb-4 grid h-12 w-12 place-items-center rounded-2xl ${featured ? "instagram-animated text-white" : "bg-muted text-primary group-hover:instagram-animated group-hover:text-white"} transition-all`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-xl font-bold sm:text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p>
      {cta && (
        <Link to={cta.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold instagram-text hover:gap-3 transition-all">
          {cta.label} <ArrowRight className="h-4 w-4 text-primary" />
        </Link>
      )}
      {footer}
    </div>
  );
}
