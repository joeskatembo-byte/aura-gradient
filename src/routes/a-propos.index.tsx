import { createFileRoute } from "@tanstack/react-router";
import { StoryTimeline } from "@/components/about/StoryTimeline";
import { VisionMission } from "@/components/about/VisionMission";
import { LeadershipCards } from "@/components/about/LeadershipCards";

export const Route = createFileRoute("/a-propos/")({
  head: () => ({
    meta: [
      { title: "Notre histoire, vision & leadership — Église Nouvelle Vie" },
      { name: "description", content: "Frise chronologique de l'église, vision et mission révélées pas à pas, et biographies du conseil d'administration et des fondateurs à Kinshasa." },
      { property: "og:title", content: "Notre histoire, vision & leadership — Église Nouvelle Vie" },
      { property: "og:description", content: "De la première cellule de prière en 1998 à une communauté de 9 200 fidèles : découvrez l'histoire, la vision et les serviteurs de l'église." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutHistory,
});

function AboutHistory() {
  return (
    <>
      <StoryTimeline />
      <VisionMission />
      <LeadershipCards />
    </>
  );
}
