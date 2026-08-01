import { useState, type ReactNode } from "react";
import { Check, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";

export type StepField = {
  name: string;
  label: string;
  type?: "text" | "tel" | "textarea" | "date" | "select" | "number" | "password" | "checkbox" | "url";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  hidden?: (values: FormValues) => boolean;
};

export type FormStep = { title: string; subtitle?: string; fields: StepField[] };
export type FormValues = Record<string, string | boolean>;

export function StepForm({
  steps,
  values,
  onChange,
  onSubmit,
  submitting,
  submitLabel = "Valider",
  success,
  successNode,
}: {
  steps: FormStep[];
  values: FormValues;
  onChange: (next: FormValues) => void;
  onSubmit: () => void;
  submitting?: boolean;
  submitLabel?: string;
  success?: boolean;
  successNode?: ReactNode;
}) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const current = steps[step];
  const visibleFields = current.fields.filter((f) => !f.hidden?.(values));

  const validate = () => {
    for (const f of visibleFields) {
      if (f.required && !String(values[f.name] ?? "").trim()) {
        setError(`Le champ « ${f.label} » est obligatoire.`);
        return false;
      }
    }
    setError(null);
    return true;
  };

  if (success) {
    return (
      <div className="animate-fade-in py-10 text-center">
        <span className="mx-auto grid h-20 w-20 animate-scale-in place-items-center rounded-full instagram-animated text-white">
          <Check className="h-10 w-10" />
        </span>
        {successNode ?? <p className="mt-6 text-lg font-semibold">C'est envoyé, merci !</p>}
      </div>
    );
  }

  return (
    <div>
      {/* Progression */}
      <div className="mb-6 flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.title} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? "instagram-animated" : "bg-muted"
              }`}
            />
            <p className={`mt-2 hidden text-[11px] font-semibold uppercase tracking-wide sm:block ${i === step ? "instagram-text" : "text-muted-foreground"}`}>
              {s.title}
            </p>
          </div>
        ))}
      </div>

      <div key={step} className="animate-fade-in">
        <h3 className="font-display text-xl font-bold sm:text-2xl">{current.title}</h3>
        {current.subtitle && <p className="mt-1 text-sm text-muted-foreground">{current.subtitle}</p>}

        <div className="mt-5 grid gap-4">
          {visibleFields.map((f) => (
            <Field key={f.name} field={f} value={values[f.name]} onChange={(v) => onChange({ ...values, [f.name]: v })} />
          ))}
        </div>
      </div>

      {error && <p className="mt-4 rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="mt-7 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Retour
        </button>

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={() => validate() && setStep((s) => s + 1)}
            className="inline-flex items-center gap-1.5 rounded-full instagram-animated px-6 py-2.5 text-sm font-semibold text-white shadow-lg"
          >
            Continuer <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            disabled={submitting}
            onClick={() => validate() && onSubmit()}
            className="inline-flex items-center gap-2 rounded-full instagram-animated px-6 py-2.5 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitLabel}
          </button>
        )}
      </div>
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
}: {
  field: StepField;
  value: string | boolean | undefined;
  onChange: (v: string | boolean) => void;
}) {
  const base =
    "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-ring";

  if (field.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 accent-[color:var(--color-ig-purple)]"
        />
        <span className="text-sm font-medium">{field.label}</span>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {field.label} {field.required && <span className="instagram-text">*</span>}
      </span>
      {field.type === "textarea" ? (
        <textarea
          rows={4}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      ) : field.type === "select" ? (
        <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={base}>
          <option value="">— Choisir —</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={field.type ?? "text"}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      )}
      {field.hint && <span className="mt-1 block text-xs text-muted-foreground">{field.hint}</span>}
    </label>
  );
}

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 animate-fade-in bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[92vh] w-full max-w-xl animate-scale-in overflow-y-auto rounded-t-3xl border border-border bg-card p-6 shadow-2xl sm:rounded-3xl sm:p-8">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1.5 instagram-animated" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            {eyebrow && <p className="text-xs font-bold uppercase tracking-widest instagram-text">{eyebrow}</p>}
            <h2 className="font-display text-2xl font-black">{title}</h2>
          </div>
          <button
            aria-label="Fermer"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
