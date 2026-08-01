
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.leads_department(uuid) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.leads_department(uuid) TO authenticated, service_role;

DROP POLICY "Responsables traitent les prières" ON public.prayer_requests;
CREATE POLICY "Responsables traitent les prières" ON public.prayer_requests FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.leads_department(NULL))
  WITH CHECK (public.is_admin() OR public.leads_department(NULL));
