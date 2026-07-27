import { createFileRoute } from "@tanstack/react-router";
import { ProgramsSchedule } from "@/components/about/ProgramsSchedule";

export const Route = createFileRoute("/a-propos/programmes")({
  head: () => ({
    meta: [
      { title: "Programmes & horaires — Église Nouvelle Vie" },
      { name: "description", content: "Horaires des cultes et des départements jour par jour, plus les activités des semaines à venir à Kinshasa." },
      { property: "og:title", content: "Programmes & horaires — Église Nouvelle Vie" },
      { property: "og:description", content: "Cultes, veillées, camps et séminaires : tout le programme hebdomadaire de l'église en un coup d'œil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProgramsSchedule />,
});
