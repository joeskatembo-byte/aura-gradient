import { motion } from "framer-motion";

/**
 * Apparition lettre par lettre (Staggered Letter Reveal) :
 * chaque lettre glisse du bas (y: 100% -> 0) avec un décalage de 0.04s.
 * Les espaces entre les mots sont préservés.
 */
export function StaggeredText({
  text,
  className,
  letterClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** Classe appliquée à chaque lettre (ex. dégradé : background-clip ne traverse pas les spans imbriqués). */
  letterClassName?: string;
  delay?: number;
}) {
  const words = text.split(" ").filter((w) => w.length > 0);

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.04, delayChildren: delay },
    },
  };

  const letter = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate="visible"
      aria-label={text}
    >
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split("").map((ch, li) => (
            <span key={li} className="inline-block overflow-hidden align-bottom">
              <motion.span variants={letter} className="inline-block will-change-transform">
                {ch}
              </motion.span>
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </motion.span>
  );
}
