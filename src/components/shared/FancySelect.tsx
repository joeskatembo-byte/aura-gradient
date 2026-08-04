import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string };

type Pos = { top: number; left: number; width: number; maxHeight: number };

/**
 * Menu déroulant personnalisé : le panneau est rendu dans un portail au niveau
 * du document, il passe donc au-dessus de tout autre composant, s'ouvre vers le
 * haut si l'espace manque et n'affiche jamais de barre de défilement visible.
 */
export function FancySelect({
  value,
  onChange,
  options,
  placeholder = "— Choisir —",
  disabled,
  size = "md",
  className = "",
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  className?: string;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const selected = options.find((o) => o.value === value);

  const place = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const gap = 8;
    const margin = 12;
    const below = window.innerHeight - r.bottom - gap - margin;
    const above = r.top - gap - margin;
    const openUp = below < 200 && above > below;
    const maxHeight = Math.max(160, Math.floor(openUp ? above : below));
    const width = Math.max(r.width, 224);
    const left = Math.min(Math.max(margin, r.left), window.innerWidth - width - margin);
    setPos({
      top: openUp ? r.top - gap : r.bottom + gap,
      left,
      width,
      maxHeight,
    });
    if (openUp) {
      // ancrage par le bas : on convertit après mesure du panneau
      requestAnimationFrame(() => {
        const h = panelRef.current?.offsetHeight ?? 0;
        setPos((p) => (p ? { ...p, top: r.top - gap - h } : p));
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (wrapRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onScroll = () => place();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, place]);

  const trigger =
    size === "sm"
      ? "rounded-full px-3 py-1.5 text-xs"
      : "rounded-2xl px-4 py-3 text-sm";

  const panel =
    open && pos && typeof document !== "undefined"
      ? createPortal(
          <ul
            ref={panelRef}
            role="listbox"
            style={{ top: pos.top, left: pos.left, width: pos.width, maxHeight: pos.maxHeight }}
            className="no-scrollbar fixed z-[9999] animate-scale-in overflow-y-auto overscroll-contain rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl"
          >
            {placeholder && (
              <Option
                label={placeholder}
                active={!value}
                onSelect={() => {
                  onChange("");
                  setOpen(false);
                }}
              />
            )}
            {options.map((o) => (
              <Option
                key={o.value}
                label={o.label}
                active={o.value === value}
                onSelect={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              />
            ))}
          </ul>,
          document.body,
        )
      : null;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 border border-border bg-background text-left font-medium outline-none transition-colors hover:bg-muted/60 focus:ring-2 focus:ring-ring disabled:opacity-60 ${trigger}`}
      >
        <span className={`truncate ${selected ? "" : "text-muted-foreground"}`}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {panel}
    </div>
  );
}

function Option({ label, active, onSelect }: { label: string; active: boolean; onSelect: () => void }) {
  return (
    <li role="option" aria-selected={active}>
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${
          active ? "bg-muted font-semibold" : "hover:bg-muted/70"
        }`}
      >
        <span className="whitespace-normal break-words">{label}</span>
        {active && <Check className="h-4 w-4 shrink-0 instagram-text" />}
      </button>
    </li>
  );
}
