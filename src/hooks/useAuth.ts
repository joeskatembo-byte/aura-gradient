import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "berger" | "chef_departement" | "fidele";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const qc = useQueryClient();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
      qc.invalidateQueries({ queryKey: ["me"] });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [qc]);

  const userId = session?.user.id;

  const { data: roles = [] } = useQuery({
    queryKey: ["me", "roles", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role, department_id")
        .eq("user_id", userId!);
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["me", "profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const isAdmin = roles.some((r) => r.role === "berger");
  const isLeader = roles.some((r) => r.role === "chef_departement");
  const leadDepartmentId = roles.find((r) => r.role === "chef_departement")?.department_id ?? null;

  return {
    session,
    user: session?.user ?? null,
    userId,
    loading,
    roles,
    profile,
    isAdmin,
    isLeader,
    leadDepartmentId,
    signOut: () => supabase.auth.signOut(),
  };
}
