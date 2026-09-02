import { createFileRoute } from "@tanstack/react-router";
import { CrudSection, useDepartmentOptions } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/actualites")({
  component: NewsAdmin,
});

function NewsAdmin() {
  const departments = useDepartmentOptions();

  return (
    <CrudSection
      table="announcements"
      title="Actualités de l'église"
      subtitle="Les annonces affichées dans le carrousel « En direct » de la page d'accueil."
      orderBy="published_at"
      fields={[
        { name: "title", label: "Titre de l'actualité", required: true, placeholder: "Séminaire jeunesse" },
        { name: "category", label: "Catégorie", type: "select", required: true, options: [
          { value: "communique", label: "Communiqué" },
          { value: "evenement", label: "Événement" },
          { value: "anniversaire", label: "Anniversaire" },
          { value: "urgent", label: "Urgent" },
        ] },
        { name: "letter", label: "Lettre du badge", placeholder: "E", hint: "Initiale affichée dans le cercle dégradé (ex : E pour Église entière)." },
        { name: "content", label: "Contenu de l'annonce", type: "textarea", required: true, hideInTable: true },
        { name: "department_id", label: "Département concerné", type: "select", options: departments, hideInTable: true },
        { name: "published_at", label: "Date de publication", type: "date", render: (r) => new Date(String(r["published_at"])).toLocaleDateString("fr-FR") },
      ]}
    />
  );
}
