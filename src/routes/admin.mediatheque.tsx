import { createFileRoute } from "@tanstack/react-router";
import { CrudSection, useDepartmentOptions } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/mediatheque")({
  component: MediaAdmin,
});

function MediaAdmin() {
  const departments = useDepartmentOptions();

  return (
    <div className="grid gap-6">
      <CrudSection
        table="media_items"
        title="Médiathèque"
        subtitle="Affiches, photos, podcasts et vidéos affichés sur la page d'accueil."
        fields={[
          { name: "title", label: "Titre", required: true },
          { name: "category", label: "Catégorie", type: "select", required: true, options: [
            { value: "Affiches", label: "Affiches" },
            { value: "Photos", label: "Photos" },
            { value: "Podcasts", label: "Podcasts" },
            { value: "Vidéos", label: "Vidéos" },
          ] },
          { name: "description", label: "Description courte" },
          { name: "thumbnail_url", label: "Image de couverture", type: "media", accept: "image/*" },
          { name: "media_url", label: "Fichier média (photo, vidéo ou audio)", type: "media", accept: "image/*,video/*,audio/*", hideInTable: true },
          { name: "story", label: "Histoire liée au média", type: "textarea", hideInTable: true },
          { name: "department_id", label: "Département", type: "select", options: departments, hideInTable: true },
        ]}
      />

      <CrudSection
        table="testimonies"
        title="Témoignages"
        subtitle="Modérez les témoignages : cochez « publié » pour les afficher sur l'accueil."
        fields={[
          { name: "display_name", label: "Nom affiché", required: true },
          { name: "content", label: "Témoignage", type: "textarea", required: true },
          { name: "published", label: "Publié", type: "checkbox", render: (r) => (r["published"] ? "Oui" : "Non") },
          { name: "photo_url", label: "Photo", type: "media", accept: "image/*", hideInTable: true },
        ]}
      />
    </div>
  );
}
