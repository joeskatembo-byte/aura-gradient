import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CalendarHeart, HandHeart, Loader2, Mail, Phone, Trash2, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Panel } from "@/components/admin/Crud";
import { FancySelect } from "@/components/shared/FancySelect";
import { ConfirmDeleteDialog, SuccessDialog } from "@/components/shared/Dialogs";
import { formatDate } from "@/lib/slug";

const db = supabase as unknown as SupabaseClient;

export const Route = createFileRoute("/admin/messages")({
  component: MessagesAdmin,
});

type Row = Record<string, unknown> & { id: string };

const statusOptions = [
  { value: "nouveau", label: "Nouveau" },
  { value: "en_cours", label: "En cours" },
  { value: "traite", label: "Traité" },
  { value: "rejete", label: "Rejeté" },
];

const statusStyles: Record<string, string> = {
  nouveau: "bg-[color:var(--color-ig-pink)]/15 text-[color:var(--color-ig-pink)]",
  en_cours: "bg-amber-500/15 text-amber-600",
  traite: "bg-emerald-500/15 text-emerald-600",
  rejete: "bg-muted text-muted-foreground",
};

function MessagesAdmin() {
  return (
    <div className="grid gap-6">
      <RequestList
        table="prayer_requests"
        title="Demandes de prière"
        subtitle="Chaque sujet confié par les fidèles, avec tout son contenu."
        icon={HandHeart}
        bodyKey="details"
      />
      <RequestList
        table="appointments"
        title="Rendez-vous avec le pasteur"
        subtitle="Motifs, dates souhaitées et coordonnées des demandeurs."
        icon={CalendarHeart}
        bodyKey="details"
        extra={(r) => (r["preferred_date"] ? `Date souhaitée : ${formatDate(String(r["preferred_date"]))}` : null)}
      />
      <RequestList
        table="contact_messages"
        title="Messages du formulaire de contact"
        subtitle="Questions administratives, partenariats et demandes diverses."
        icon={Mail}
        bodyKey="message"
      />
    </div>
  );
}

function RequestList({
  table,
  title,
  subtitle,
  icon: Icon,
  bodyKey,
  extra,
}: {
  table: string;
  title: string;
  subtitle: string;
  icon: typeof Mail;
  bodyKey: string;
  extra?: (row: Row) => string | null;
}) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await db.from(table).select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await db.from(table).update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", table] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", table] });
      setPendingDelete(null);
      setDeleted(true);
    },
  });

  const visible = filter ? rows.filter((r) => String(r["status"]) === filter) : rows;

  return (
    <Panel
      title={title}
      subtitle={subtitle}
      action={
        <FancySelect
          size="sm"
          value={filter}
          onChange={setFilter}
          options={statusOptions}
          placeholder="Tous les statuts"
          ariaLabel="Filtrer par statut"
          className="w-48"
        />
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
        </div>
      ) : visible.length === 0 ? (
        <p className="py-10 text-sm text-muted-foreground">Aucune demande pour l'instant.</p>
      ) : (
        <ul className="grid gap-4">
          {visible.map((r) => {
            const status = String(r["status"] ?? "nouveau");
            const anonymous = Boolean(r["anonymous"]);
            const name = anonymous ? "Anonyme" : String(r["full_name"] ?? "Non précisé");
            const body = String(r[bodyKey] ?? "").trim();
            const note = extra?.(r);
            return (
              <li key={r.id} className="card-lift rounded-2xl border border-border bg-background/60 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-display text-base font-black">
                      <Icon className="h-4 w-4 shrink-0 instagram-text" />
                      {String(r["subject"] ?? "Sans objet")}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><UserRound className="h-3.5 w-3.5" /> {name}</span>
                      {r["phone"] ? (
                        <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {String(r["phone"])}</span>
                      ) : null}
                      <span>{formatDate(String(r["created_at"]))}</span>
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles[status] ?? statusStyles["nouveau"]}`}>
                    {statusOptions.find((s) => s.value === status)?.label ?? status}
                  </span>
                </div>

                <p className="mt-4 whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-sm leading-relaxed">
                  {body || "Aucun contenu fourni."}
                </p>
                {note && <p className="mt-2 text-xs font-semibold instagram-text">{note}</p>}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <FancySelect
                    size="sm"
                    value={status}
                    onChange={(v) => v && setStatus.mutate({ id: r.id, status: v })}
                    options={statusOptions}
                    placeholder="Statut"
                    ariaLabel="Changer le statut"
                    className="w-44"
                  />
                  <button
                    aria-label="Supprimer"
                    onClick={() => setPendingDelete(r.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-[color:var(--color-ig-pink)] transition-colors hover:bg-muted"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDeleteDialog
        open={!!pendingDelete}
        pending={remove.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && remove.mutate(pendingDelete)}
      />
      <SuccessDialog
        open={deleted}
        title="Suppression effectuée"
        description="La demande a bien été supprimée."
        onClose={() => setDeleted(false)}
      />
    </Panel>
  );
}
