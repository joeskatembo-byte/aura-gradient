import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CrudSection, Panel } from "@/components/admin/Crud";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatMoney } from "@/lib/slug";

export const Route = createFileRoute("/admin/finances")({
  component: FinanceAdmin,
});

function FinanceAdmin() {
  const { data: donations = [] } = useQuery({
    queryKey: ["admin", "donations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const total = donations.reduce((sum, d) => sum + Number(d.amount ?? 0), 0);

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { k: formatMoney(total), v: "dons annoncés" },
          { k: String(donations.length), v: "annonces de don" },
          { k: formatMoney(donations.length ? total / donations.length : 0), v: "don moyen" },
        ].map((s) => (
          <div key={s.v} className="rounded-3xl border border-border bg-card p-5 shadow-lg">
            <p className="font-display text-3xl font-black instagram-text">{s.k}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </div>

      <CrudSection
        table="finance_projects"
        title="Projets financés"
        subtitle="Chantiers et projets de l'église avec leur budget."
        fields={[
          { name: "title", label: "Titre du projet", required: true },
          { name: "budget_total", label: "Budget total (USD)", type: "number", render: (r) => formatMoney(Number(r["budget_total"] ?? 0)) },
          { name: "budget_raised", label: "Montant récolté (USD)", type: "number", render: (r) => formatMoney(Number(r["budget_raised"] ?? 0)) },
          { name: "status", label: "Statut", type: "select", options: [
            { value: "en_cours", label: "En cours" },
            { value: "termine", label: "Terminé" },
            { value: "a_venir", label: "À venir" },
          ] },
          { name: "description", label: "Description", type: "textarea", hideInTable: true },
          { name: "image_url", label: "Image (URL)", hideInTable: true },
        ]}
      />

      <Panel title="Dons annoncés" subtitle="Historique des annonces de don enregistrées sur le site.">
        {donations.length === 0 ? (
          <p className="py-10 text-sm text-muted-foreground">Aucun don annoncé pour l'instant.</p>
        ) : (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[640px] border-separate border-spacing-y-2 px-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="px-3 pb-1">Donateur</th>
                  <th className="px-3 pb-1">Montant</th>
                  <th className="px-3 pb-1">Moyen</th>
                  <th className="px-3 pb-1">Statut</th>
                  <th className="px-3 pb-1">Date</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d.id} className="bg-muted/40">
                    <td className="rounded-l-2xl px-3 py-3 font-semibold">{d.donor_name ?? "Anonyme"}</td>
                    <td className="px-3 py-3">{formatMoney(Number(d.amount), d.currency ?? "USD")}</td>
                    <td className="px-3 py-3">{d.method}</td>
                    <td className="px-3 py-3">{d.status}</td>
                    <td className="rounded-r-2xl px-3 py-3 text-muted-foreground">{formatDate(d.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
