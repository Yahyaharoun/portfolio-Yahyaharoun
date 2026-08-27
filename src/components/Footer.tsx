import Link from "next/link";
import { Github, Linkedin, Facebook, Instagram, Youtube, Mail, Twitter } from "lucide-react";

const socials = [
  { icon: Mail, href: "mailto:harounyahya01@gmail.com", label: "Email" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/yahya-haroun-87a446344?utm_source=share_via&utm_content=profile&utm_medium=member_ios", label: "LinkedIn" },
  { icon: Twitter, href: "https://twitter.com/yahyaharoun", label: "X (Twitter)" },
  { icon: Github, href: "https://github.com/yahyaharoun", label: "GitHub" },
  { icon: Facebook, href: "https://www.facebook.com/share/1Fqj5n36j7/?mibextid=wwXIfr", label: "Facebook" },
  { icon: Instagram, href: "https://www.instagram.com/yahyahaoun?igsi=b3l1c2lkdWhibnl2&utm_source=qr", label: "Instagram" },
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
    <footer className="border-t border-black/10 dark:border-white/10 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground/50 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex flex-wrap justify-center items-center gap-4">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noreferrer"
                aria-label={label}
                className="text-foreground/40 transition-all hover:text-accent hover:scale-110"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>

          {/* Copyright & Admin */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex flex-col xl:flex-row items-center gap-1.5 xl:gap-2 text-sm text-foreground/60 text-center font-medium">
              <span className="text-foreground font-semibold">Yahya Haroun</span>
              <span className="hidden xl:inline text-foreground/30">|</span>
              <span className="text-foreground/50">Étudiant en informatique • Développeur PWA • Futur spécialiste en cybersécurité</span>
            </div>
            <Link href="/admin/login" className="text-xs text-foreground/25 hover:text-foreground/50 transition-colors">
              Administration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
