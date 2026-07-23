import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/home/Header";
import { HeroBento } from "@/components/home/HeroBento";
import { NewsStories } from "@/components/home/NewsStories";
import { TieredCards } from "@/components/home/TieredCards";
import { TestimoniesStack } from "@/components/home/TestimoniesStack";
import { MediaNetflix } from "@/components/home/MediaNetflix";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { Footer } from "@/components/home/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Église Nouvelle Vie — Une maison de foi au cœur de la RDC" },
      { name: "description", content: "Bienvenue à la maison. Cultes, séminaires, intercession, médias et communauté au service d'une foi vivante en République Démocratique du Congo." },
      { property: "og:title", content: "Église Nouvelle Vie — Une maison de foi au cœur de la RDC" },
      { property: "og:description", content: "Une seule église, plusieurs nations. Rejoignez notre communauté à Kinshasa et vivez la foi en action." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <HeroBento />
        <NewsStories />
        <TieredCards />
        <TestimoniesStack />
        <MediaNetflix />
        <FaqAccordion />
      </main>
      <Footer />
    </div>
  );
}
