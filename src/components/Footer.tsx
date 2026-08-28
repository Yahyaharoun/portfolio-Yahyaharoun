import Link from "next/link";
import { Github, Linkedin, Facebook, Instagram, Youtube, Mail, Twitter, ArrowUpRight } from "lucide-react";

const socials = [
  { icon: Mail, href: "mailto:harounyahya01@gmail.com", label: "Email" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/yahya-haroun-87a446344", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/yahyaharoun", label: "X (Twitter)" },
  { icon: Github, href: "https://github.com/yahyaharoun", label: "GitHub" },
  { icon: Facebook, href: "https://www.facebook.com/share/1Fqj5n36j7/?mibextid=wwXIfr", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/yahyahaoun", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@yahyaharoun", label: "YouTube" },
];

const footerLinks = [
  { href: "/#about", label: "À propos" },
  { href: "/#projects", label: "Projets" },
  { href: "/blog", label: "Blog" },
  { href: "/#playground", label: "Playground" },
  { href: "/#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-black/10 dark:border-white/10 bg-muted/50 overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
      
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block text-2xl font-black tracking-tighter mb-4 text-foreground">
              YAHYA<span className="text-accent">.</span>
            </Link>
            <p className="text-foreground/70 max-w-md leading-relaxed font-medium">
              Un pied à l'école. Un pied dans le business. Je conçois des solutions digitales performantes et résilientes, avec un focus sur l'Offline-First et la cybersécurité.
            </p>
          </div>

          {/* Links Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Navigation</h4>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center text-foreground/60 transition-colors hover:text-accent font-medium"
                  >
                    {link.label}
                    <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-y-1 translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials Col */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-6">Réseaux</h4>
            <div className="flex flex-wrap gap-4">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center h-10 w-10 rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-foreground/60 transition-all hover:border-accent/50 hover:bg-accent hover:text-white hover:-translate-y-1"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-black/5 dark:border-white/5">
          <p className="text-sm text-foreground/50 font-medium">
            &copy; {new Date().getFullYear()} Yahya Haroun. Tous droits réservés.
          </p>
          <Link href="/admin/login" className="text-xs font-bold uppercase tracking-widest text-foreground/30 hover:text-accent transition-colors">
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
