import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption = { value: string; label: string };

/**
 * Menu déroulant personnalisé : panneau flottant arrondi, survol doux,
 * coche sur l'option sélectionnée (style référence).
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
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const trigger =
    size === "sm"
      ? "rounded-full px-3 py-1.5 text-xs"
      : "rounded-2xl px-4 py-3 text-sm";

  return (
    <div ref={ref} className={`relative ${className}`}>
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

      {open && (
        <ul
          role="listbox"
          className="absolute z-[120] mt-2 max-h-64 w-full min-w-[13rem] animate-scale-in overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-2xl"
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
        </ul>
      )}
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
        <span className="truncate">{label}</span>
        {active && <Check className="h-4 w-4 shrink-0 instagram-text" />}
      </button>
    </li>
  );
}
