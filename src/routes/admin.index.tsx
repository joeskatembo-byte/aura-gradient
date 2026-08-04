import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Panel, useDepartmentOptions } from "@/components/admin/Crud";
import { FancySelect } from "@/components/shared/FancySelect";
import { useAuth } from "@/hooks/useAuth";
import { formatDate } from "@/lib/slug";

export const Route = createFileRoute("/admin/")({
  component: MembersAdmin,
});

type RoleValue = "berger" | "chef_departement" | "fidele";
const roleLabels: Record<RoleValue, string> = {
  berger: "Berger (admin)",
  chef_departement: "Chef de département",
  fidele: "Fidèle",
};

function MembersAdmin() {
  const qc = useQueryClient();
  const { isAdmin } = useAuth();
  const departments = useDepartmentOptions();
  const [search, setSearch] = useState("");

  const { data: profiles = [] } = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: roles = [] } = useQuery({
    queryKey: ["admin", "user_roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: counts } = useQuery({
    queryKey: ["admin", "counts"],
    queryFn: async () => {
      const tables = ["prayer_requests", "appointments", "contact_messages", "testimonies"] as const;
      const entries = await Promise.all(
        tables.map(async (t) => {
          const { count } = await supabase.from(t).select("id", { count: "exact", head: true });
          return [t, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<(typeof tables)[number], number>;
    },
  });

  const setRole = useMutation({
    mutationFn: async ({ userId, role, departmentId }: { userId: string; role: RoleValue; departmentId: string | null }) => {
      const del = await supabase.from("user_roles").delete().eq("user_id", userId);
      if (del.error) throw del.error;
      const ins = await supabase.from("user_roles").insert({ user_id: userId, role, department_id: departmentId });
      if (ins.error) throw ins.error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "user_roles"] }),
  });

  const setDepartment = useMutation({
    mutationFn: async ({ id, departmentId }: { id: string; departmentId: string | null }) => {
      const { error } = await supabase.from("profiles").update({ department_id: departmentId }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "profiles"] }),
  });

  const filtered = profiles.filter((p) =>
    `${p.first_name} ${p.last_name} ${p.commune ?? ""} ${p.phone ?? ""}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { k: String(profiles.length), v: "fidèles inscrits" },
          { k: String(departments.length), v: "départements" },
          { k: String(counts?.prayer_requests ?? 0), v: "demandes de prière" },
          { k: String(counts?.appointments ?? 0), v: "rendez-vous" },
          { k: String(counts?.contact_messages ?? 0), v: "messages reçus" },
        ].map((s) => (
          <div key={s.v} className="rounded-3xl border border-border bg-card p-5 shadow-lg">
            <p className="font-display text-3xl font-black instagram-text">{s.k}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.v}</p>
          </div>
        ))}
      </div>

      <Panel
        title="Fidèles"
        subtitle="Contrôle des membres, de leur département de service et de leurs rôles."
        action={
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un membre…"
            className="w-56 rounded-full border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--color-ig-purple)]"
          />
        }
      >
        {filtered.length === 0 ? (
          <p className="py-10 text-sm text-muted-foreground">Aucun fidèle enregistré pour l'instant.</p>
        ) : (
          <div className="-mx-2 overflow-x-auto">
            <table className="w-full min-w-[820px] border-separate border-spacing-y-2 px-2 text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-widest text-muted-foreground">
                  <th className="px-3 pb-1">Membre</th>
                  <th className="px-3 pb-1">Contact</th>
                  <th className="px-3 pb-1">Adresse</th>
                  <th className="px-3 pb-1">Département</th>
                  <th className="px-3 pb-1">Rôle</th>
                  <th className="px-3 pb-1">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const role = (roles.find((r) => r.user_id === p.id)?.role ?? "fidele") as RoleValue;
                  return (
                    <tr key={p.id} className="bg-muted/40">
                      <td className="rounded-l-2xl px-3 py-3 font-semibold">{p.last_name} {p.first_name}</td>
                      <td className="px-3 py-3">{p.phone ?? "—"}</td>
                      <td className="max-w-[200px] truncate px-3 py-3">{[p.commune, p.avenue, p.parcelle].filter(Boolean).join(" · ") || "—"}</td>
                      <td className="px-3 py-3">
                        <FancySelect
                          size="sm"
                          className="min-w-[9rem]"
                          ariaLabel="Département"
                          placeholder="Aucun"
                          value={p.department_id ?? ""}
                          options={departments}
                          onChange={(v) => setDepartment.mutate({ id: p.id, departmentId: v || null })}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <FancySelect
                          size="sm"
                          className="min-w-[9rem]"
                          ariaLabel="Rôle"
                          placeholder=""
                          disabled={!isAdmin}
                          value={role}
                          options={(Object.keys(roleLabels) as RoleValue[]).map((r) => ({ value: r, label: roleLabels[r] }))}
                          onChange={(v) => setRole.mutate({ userId: p.id, role: v as RoleValue, departmentId: p.department_id })}
                        />
                      </td>

                      <td className="rounded-r-2xl px-3 py-3 text-muted-foreground">{formatDate(p.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}
