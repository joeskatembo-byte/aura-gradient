
CREATE POLICY "Membres lisent les medias" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'medias');
CREATE POLICY "Membres envoient des medias" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'medias' AND owner = auth.uid());
CREATE POLICY "Auteur modifie son media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'medias' AND (owner = auth.uid() OR public.is_admin())) WITH CHECK (bucket_id = 'medias');
CREATE POLICY "Auteur supprime son media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'medias' AND (owner = auth.uid() OR public.is_admin()));
