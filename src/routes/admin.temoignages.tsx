import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/temoignages")({
  component: TemoignagesAdmin,
});

function TemoignagesAdmin() {
  return (
    <CrudSection
      table="testimonies"
      title="Témoignages"
      subtitle="Validez, modifiez et illustrez les témoignages affichés sur la page d'accueil."
      orderBy="created_at"
      fields={[
        { name: "display_name", label: "Nom affiché", required: true, placeholder: "Grace Kabasele" },
        { name: "content", label: "Témoignage", type: "textarea", required: true, hideInTable: true },
        { name: "photo_url", label: "Photo", type: "media", hideInTable: true },
        { name: "published", label: "Publié sur le site", type: "checkbox", render: (r) => (r["published"] ? "Oui" : "Non") },
      ]}
    />
  );
}
