import { useEffect, useState } from "react";

/**
 * Effet machine à écrire (style "typed.js") : écrit puis efface chaque phrase.
 */
export function Typed({
  items,
  className,
  typeSpeed = 45,
  backSpeed = 22,
  holdTime = 1800,
}: {
  items: string[];
  className?: string;
  typeSpeed?: number;
  backSpeed?: number;
  holdTime?: number;
}) {
  const list = items.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (list.length === 0) return;
    const full = list[index % list.length];

    if (!deleting && text === full) {
      if (list.length === 1) return;
      const t = setTimeout(() => setDeleting(true), holdTime);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % list.length);
      return;
    }
    const t = setTimeout(
      () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
      deleting ? backSpeed : typeSpeed,
    );
    return () => clearTimeout(t);
  }, [text, deleting, index, list, typeSpeed, backSpeed, holdTime]);

  return (
    <span className={className}>
      <span className="typed">{text}</span>
      <span className="typed-cursor typed-cursor--blink" aria-hidden="true" />
    </span>
  );
}
