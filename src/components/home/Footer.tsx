import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Youtube, Twitter, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const s = useSiteSettings();
  const [firstWord, ...rest] = s.church_name.split(" ");

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-xl instagram-animated text-white font-black">{s.church_name.charAt(0)}</span>
              <span className="font-display text-xl font-bold">{firstWord} <span className="instagram-text">{rest.join(" ")}</span></span>
            </Link>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">{s.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                { Icon: Facebook, href: s.facebook_url || "#", label: "Facebook" },
                { Icon: Instagram, href: s.instagram_url || "#", label: "Instagram" },
                { Icon: Youtube, href: s.youtube_url || "#", label: "YouTube" },
                { Icon: MessageCircle, href: s.whatsapp_url || "#", label: "WhatsApp" },
                { Icon: Twitter, href: s.twitter_url || "#", label: "X" },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border transition hover:instagram-animated hover:text-white hover:border-transparent">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Navigation</div>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:instagram-text">Accueil</Link></li>
              <li><Link to="/a-propos" className="hover:instagram-text">À propos</Link></li>
              <li><Link to="/don" className="hover:instagram-text">Don</Link></li>
              <li><Link to="/contact" className="hover:instagram-text">Contact</Link></li>
              <li><Link to="/inscription" className="hover:instagram-text">Inscription</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</div>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 instagram-text" /> {s.address}</li>
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 shrink-0 instagram-text" /> {s.phone}</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 instagram-text" /> {s.email}</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 h-px instagram-animated opacity-70" />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} {s.church_name}. Tous droits réservés.</span>
          <span>Fait avec foi en RDC 🇨🇩</span>
        </div>
      </div>
    </footer>
  );
}
