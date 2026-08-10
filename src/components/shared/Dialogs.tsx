import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Check, Loader2, OctagonAlert } from "lucide-react";

function Overlay({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div className="fixed inset-0 z-[120] grid place-items-center bg-black/40 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-2xl">{children}</div>
    </div>,
    document.body,
  );
}

export function ConfirmDeleteDialog({
  open,
  title = "Supprimer cet élément ?",
  description = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est définitive.",
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
  pending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <Overlay>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[color:var(--color-ig-pink)]/15">
        <OctagonAlert className="h-7 w-7 text-[color:var(--color-ig-pink)]" />
      </div>
      <h3 className="mt-5 font-display text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-border px-5 py-3 text-sm font-semibold hover:bg-muted"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={onConfirm}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[color:var(--color-ig-pink)] px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-60"
        >
          {pending && <Loader2 className="h-4 w-4 animate-spin" />} {confirmLabel}
        </button>
      </div>
    </Overlay>
  );
}

export function SuccessDialog({
  open,
  title = "Suppression réussie",
  description = "L'élément a bien été supprimé.",
  closeLabel = "Fermer",
  onClose,
}: {
  open: boolean;
  title?: string;
  description?: string;
  closeLabel?: string;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <Overlay>
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full instagram-animated shadow-lg">
        <Check className="h-7 w-7 text-white" />
      </div>
      <h3 className="mt-5 font-display text-xl font-black">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full rounded-2xl bg-muted px-5 py-3 text-sm font-semibold hover:bg-muted/70"
      >
        {closeLabel}
      </button>
    </Overlay>
  );
}
