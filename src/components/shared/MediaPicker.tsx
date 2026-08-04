import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/**
 * Sélecteur de média : l'utilisateur choisit un fichier dans sa galerie
 * (photo, vidéo, audio). Le fichier est envoyé dans le stockage de
 * l'application puis l'adresse du fichier est renvoyée au formulaire.
 */
export function MediaPicker({
  value,
  onChange,
  accept = "image/*",
  label = "Choisir dans ma galerie",
}: {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isImage = /\.(png|jpe?g|webp|gif|avif)/i.test(value) || value.startsWith("data:image");

  const pick = async (file: File) => {
    setError(null);
    if (file.size > 20 * 1024 * 1024) {
      setError("Fichier trop lourd (20 Mo maximum).");
      return;
    }
    setBusy(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Connectez-vous pour envoyer un fichier.");
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${auth.user.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("medias").upload(path, file, { upsert: false, contentType: file.type });
      if (up.error) throw up.error;
      const signed = await supabase.storage.from("medias").createSignedUrl(path, TEN_YEARS);
      if (signed.error) throw signed.error;
      onChange(signed.data.signedUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Envoi impossible.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void pick(f);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-background p-2.5">
          {isImage ? (
            <img src={value} alt="Aperçu du média sélectionné" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
          ) : (
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl instagram-gradient-soft">
              <ImagePlus className="h-5 w-5 instagram-text" />
            </span>
          )}
          <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">Média enregistré</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted"
          >
            Remplacer
          </button>
          <button
            type="button"
            aria-label="Retirer le média"
            onClick={() => onChange("")}
            className="grid h-8 w-8 place-items-center rounded-full border border-border hover:bg-muted"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background px-4 py-5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {busy ? "Envoi en cours…" : label}
        </button>
      )}

      {error && <p className="text-xs font-semibold text-[color:var(--color-ig-red)]">{error}</p>}
    </div>
  );
}
