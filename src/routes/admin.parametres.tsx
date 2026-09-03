import { createFileRoute } from "@tanstack/react-router";
import { CrudSection } from "@/components/admin/Crud";

export const Route = createFileRoute("/admin/parametres")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  return (
    <CrudSection
      table="site_settings"
      title="Paramètres généraux"
      subtitle="Identité de l'église, coordonnées et réseaux sociaux affichés dans le pied de page et sur tout le site."
      orderBy="created_at"
      ascending
      fields={[
        { name: "church_name", label: "Nom de l'église", required: true, placeholder: "Église Nouvelle Vie" },
        { name: "tagline", label: "Phrase de présentation", type: "textarea", hideInTable: true },
        { name: "address", label: "Adresse", placeholder: "Av. de la Foi, Kinshasa, RDC" },
        { name: "phone", label: "Téléphone", placeholder: "+243 000 000 000" },
        { name: "email", label: "Adresse e-mail", placeholder: "contact@nouvellevie.cd" },
        { name: "schedule_main", label: "Horaires principaux", hideInTable: true, placeholder: "Dimanche 09h00 & 17h00" },
        { name: "facebook_url", label: "Lien Facebook", hideInTable: true, placeholder: "https://facebook.com/..." },
        { name: "instagram_url", label: "Lien Instagram", hideInTable: true, placeholder: "https://instagram.com/..." },
        { name: "youtube_url", label: "Lien YouTube", hideInTable: true, placeholder: "https://youtube.com/..." },
        { name: "whatsapp_url", label: "Lien WhatsApp", hideInTable: true, placeholder: "https://wa.me/..." },
        { name: "twitter_url", label: "Lien X (Twitter)", hideInTable: true, placeholder: "https://x.com/..." },
      ]}
    />
  );
}
