import { useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

/** Accès générique aux tables (le typage strict est assuré par les policies RLS côté base). */
const db = supabase as unknown as SupabaseClient;

export type FieldType = "text" | "textarea" | "number" | "date" | "select" | "checkbox";

export type Field = {
  name: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  hideInTable?: boolean;
  render?: (row: Row) => string;
};

export type Row = Record<string, unknown> & { id: string };

export function Panel({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-xl sm:p-7">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-black">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function CrudSection({
  table,
  title,
  subtitle,
  fields,
  orderBy = "created_at",
  ascending = false,
  canWrite = true,
  defaults,
}: {
  table: string;
  title: string;
  subtitle?: string;
  fields: Field[];
  orderBy?: string;
  ascending?: boolean;
  canWrite?: boolean;
  defaults?: Record<string, unknown>;
}) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await db.from(table).select("*").order(orderBy, { ascending });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const save = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const { id, ...values } = payload as { id?: string };
      const body = { ...defaults, ...values };
      const res = id ? await db.from(table).update(body).eq("id", id) : await db.from(table).insert(body);
      if (res.error) throw res.error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", table] });
      setEditing(null);
      setCreating(false);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", table] }),
  });

  const columns = useMemo(() => fields.filter((f) => !f.hideInTable).slice(0, 4), [fields]);
  const open = creating || !!editing;

  return (
    <Panel
      title={title}
      subtitle={subtitle}
      action={
        canWrite && (
          <button
            onClick={() => { setEditing(null); setCreating(true); }}
            className="inline-flex items-center gap-2 rounded-full instagram-animated px-4 py-2 text-sm font-bold text-white shadow-lg"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        )
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Chargement…</div>
      ) : rows.length === 0 ? (
        <p className="py-10 text-sm text-muted-foreground">Aucun enregistrement pour l'instant.</p>
      ) : (
        <div className="-mx-2 overflow-x-auto">
          <table className="w-full min-w-[560px] border-separate border-spacing-y-2 px-2 text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                {columns.map((c) => <th key={c.name} className="px-3 pb-1 font-semibold">{c.label}</th>)}
                {canWrite && <th className="px-3 pb-1 text-right font-semibold">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="rounded-2xl bg-muted/40">
                  {columns.map((c) => (
                    <td key={c.name} className="max-w-[260px] truncate px-3 py-3 align-middle first:rounded-l-2xl">
                      {c.render ? c.render(row) : String(row[c.name] ?? "—")}
                    </td>
                  ))}
                  {canWrite && (
                    <td className="rounded-r-2xl px-3 py-3 text-right">
                      <div className="inline-flex gap-2">
                        <button aria-label="Modifier" onClick={() => { setCreating(false); setEditing(row); }} className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-background">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          aria-label="Supprimer"
                          onClick={() => { if (confirm("Supprimer cet élément ?")) remove.mutate(row.id); }}
                          className="grid h-8 w-8 place-items-center rounded-full border border-border text-[color:var(--color-ig-pink)] hover:bg-background"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <RecordForm
          fields={fields}
          initial={editing ?? {}}
          pending={save.isPending}
          error={save.error instanceof Error ? save.error.message : null}
          onCancel={() => { setEditing(null); setCreating(false); }}
          onSubmit={(values) => save.mutate(editing ? { ...values, id: editing.id } : values)}
        />
      )}
    </Panel>
  );
}

const STEP_SIZE = 3;

export function RecordForm({
  fields, initial, onSubmit, onCancel, pending, error, submitLabel = "Enregistrer",
}: {
  fields: Field[];
  initial: Partial<Row>;
  onSubmit: (values: Record<string, unknown>) => void;
  onCancel: () => void;
  pending?: boolean;
  error?: string | null;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const base: Record<string, unknown> = {};
    for (const f of fields) base[f.name] = initial[f.name] ?? (f.type === "checkbox" ? false : "");
    return base;
  });
  const [step, setStep] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const steps = useMemo(() => {
    const chunks: Field[][] = [];
    for (let i = 0; i < fields.length; i += STEP_SIZE) chunks.push(fields.slice(i, i + STEP_SIZE));
    return chunks.length ? chunks : [[]];
  }, [fields]);

  const current = steps[Math.min(step, steps.length - 1)];
  const isLast = step >= steps.length - 1;
  const set = (name: string, v: unknown) => setValues((s) => ({ ...s, [name]: v }));

  const validate = () => {
    for (const f of current) {
      if (f.required && f.type !== "checkbox" && !String(values[f.name] ?? "").trim()) {
        setLocalError(`Le champ « ${f.label} » est obligatoire.`);
        return false;
      }
    }
    setLocalError(null);
    return true;
  };

  const submit = () => {
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = values[f.name];
      if (f.type === "number") payload[f.name] = raw === "" || raw === null ? 0 : Number(raw);
      else if (f.type === "checkbox") payload[f.name] = !!raw;
      else payload[f.name] = raw === "" ? null : raw;
    }
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-lg font-black">{initial.id ? "Modifier" : "Nouvel enregistrement"}</h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Étape {step + 1} / {steps.length}
            </p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Fermer" className="grid h-9 w-9 place-items-center rounded-full border border-border hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-6 flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "instagram-animated" : "bg-muted"}`} />
          ))}
        </div>

        <div key={step} className="grid animate-fade-in gap-4">
          {current.map((f) => (
            <label key={f.name} className="grid gap-1.5 text-sm">
              <span className="font-semibold">{f.label}{f.required && <span className="instagram-text"> *</span>}</span>
              {f.type === "textarea" ? (
                <textarea
                  value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}
                  rows={3} placeholder={f.placeholder}
                  className="rounded-2xl border border-border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-[color:var(--color-ig-purple)]"
                />
              ) : f.type === "select" ? (
                <FancySelect
                  value={String(values[f.name] ?? "")}
                  onChange={(v) => set(f.name, v)}
                  options={f.options ?? []}
                  ariaLabel={f.label}
                />
              ) : f.type === "checkbox" ? (
                <input type="checkbox" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} className="h-5 w-5 accent-[color:var(--color-ig-purple)]" />
              ) : (
                <input
                  type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                  value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}
                  placeholder={f.placeholder}
                  className="rounded-2xl border border-border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-[color:var(--color-ig-purple)]"
                />
              )}
            </label>
          ))}
        </div>

        {(localError || error) && (
          <p className="mt-4 text-sm font-semibold text-[color:var(--color-ig-red)]">{localError ?? error}</p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => { setLocalError(null); step === 0 ? onCancel() : setStep((s) => s - 1); }}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" /> {step === 0 ? "Annuler" : "Retour"}
          </button>

          {isLast ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => validate() && submit()}
              className="inline-flex items-center gap-2 rounded-full instagram-animated px-6 py-2.5 text-sm font-bold text-white shadow-lg disabled:opacity-60"
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />} {submitLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => validate() && setStep((s) => s + 1)}
              className="inline-flex items-center gap-1.5 rounded-full instagram-animated px-6 py-2.5 text-sm font-bold text-white shadow-lg"
            >
              Continuer <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function useDepartmentOptions() {
  const { data = [] } = useQuery({
    queryKey: ["admin", "departments", "options"],
    queryFn: async () => {
      const { data, error } = await supabase.from("departments").select("id, name").order("name");
      if (error) throw error;
      return data ?? [];
    },
  });
  return data.map((d) => ({ value: d.id, label: d.name }));
}
