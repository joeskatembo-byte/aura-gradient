import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/vision")({
  component: VisionAdmin,
});

const iconOptions = [
  { value: "flame", label: "Flamme" },
  { value: "compass", label: "Boussole" },
  { value: "target", label: "Cible" },
  { value: "heart", label: "Cœur" },
];

function VisionAdmin() {
  return (
    <CrudSection
      table="vision_steps"
      title="Vision & Mission"
      subtitle="Les questions « Quatre questions, quatre convictions » de la page À propos."
      orderBy="position"
      ascending
      fields={[
        { name: "question", label: "Question", required: true, placeholder: "Quelle est notre raison d'être ?" },
        { name: "label", label: "Libellé court", required: true, placeholder: "Notre raison d'être" },
        { name: "answer", label: "Réponse", type: "textarea", required: true, hideInTable: true },
        { name: "icon", label: "Icône", type: "select", options: iconOptions, hideInTable: true },
        { name: "position", label: "Ordre d'affichage", type: "number", placeholder: "1" },
        { name: "active", label: "Visible sur le site", type: "checkbox", render: (r) => (r["active"] ? "Oui" : "Non") },
      ]}
    />
  );
}
