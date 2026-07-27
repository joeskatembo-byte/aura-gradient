import { createFileRoute } from "@tanstack/react-router";
import { DepartmentsExplorer } from "@/components/about/DepartmentsExplorer";

export const Route = createFileRoute("/a-propos/departements")({
  head: () => ({
    meta: [
      { title: "Nos départements — Église Nouvelle Vie" },
      { name: "description", content: "Louange, jeunesse, intercession, évangélisation, œuvres sociales et école du dimanche : vision, horaires, responsables et contacts de chaque département." },
      { property: "og:title", content: "Nos départements — Église Nouvelle Vie" },
      { property: "og:description", content: "Découvrez les équipes de l'église : mission, horaires habituels et urgents, responsables et actualités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <DepartmentsExplorer />,
});
