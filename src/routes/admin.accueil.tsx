import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/accueil")({
  component: AccueilAdmin,
});

function AccueilAdmin() {
  return (
    <CrudSection
      table="hero_content"
      title="Bannière d'accueil"
      subtitle="Les textes de la grande bannière de la page d'accueil : titre, phrases animées, boutons, carte communauté et prochain rendez-vous."
      orderBy="created_at"
      fields={[
        { name: "badge", label: "Petit badge", placeholder: "Église Nouvelle Vie · Kinshasa, RDC" },
        { name: "title_line1", label: "Titre — 1re ligne", required: true, placeholder: "Bienvenue à" },
        { name: "title_line2", label: "Titre — 2e ligne (en couleur)", required: true, placeholder: "la Maison." },
        {
          name: "typed_phrases",
          label: "Phrases animées (séparées par |)",
          type: "textarea",
          hideInTable: true,
          placeholder: "Une famille de foi.|Venez tel que vous êtes.",
        },
        { name: "primary_label", label: "Bouton principal — texte", hideInTable: true, placeholder: "Rejoindre un culte" },
        { name: "primary_href", label: "Bouton principal — lien", hideInTable: true, placeholder: "#actualites" },
        { name: "secondary_label", label: "Bouton secondaire — texte", hideInTable: true, placeholder: "Voir en direct" },
        { name: "secondary_href", label: "Bouton secondaire — lien", hideInTable: true, placeholder: "#mediatheque" },
        { name: "community_image_url", label: "Photo de la communauté", type: "media", hideInTable: true },
        { name: "community_title", label: "Carte communauté — titre", hideInTable: true, placeholder: "Une foi. Plusieurs visages." },
        { name: "community_subtitle", label: "Carte communauté — sous-titre", type: "textarea", hideInTable: true },
        { name: "members_count", label: "Nombre de membres", type: "number", placeholder: "2847" },
        { name: "members_label", label: "Légende du compteur", hideInTable: true, placeholder: "Membres actifs dans la famille" },
        { name: "event_title", label: "Prochain rendez-vous — titre", placeholder: "Nuit d'intercession nationale" },
        { name: "event_detail", label: "Prochain rendez-vous — détail", hideInTable: true, placeholder: "Vendredi 31 juillet · 20h00" },
        { name: "active", label: "Visible sur le site", type: "checkbox", render: (r) => (r["active"] ? "Oui" : "Non") },
      ]}
    />
  );
}
