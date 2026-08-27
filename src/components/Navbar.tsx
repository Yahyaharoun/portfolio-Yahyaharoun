"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Github, Linkedin, Twitter, Lock } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/#hero", label: "Accueil" },
  { href: "/#about", label: "À propos" },
  { href: "/#projects", label: "Projets" },
  { href: "/#playground", label: "Playground" },
  { href: "/#experiences", label: "Expériences" },
  { href: "/#gallery", label: "Galerie" },
  { href: "/#blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Scroll spy logic
      if (pathname === "/") {
        const sections = links.map(link => link.href.replace("/#", ""));
        let currentSection = "";
        
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom >= 150) {
              currentSection = section;
              break;
            }
          }
        }
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setOpen(false);
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", href);
        }
      }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "py-3 bg-background/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
          : "py-6 bg-transparent border-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2 flex-shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-110 group-hover:bg-accent/20">
            <span className="font-bold text-lg tracking-tighter">YH</span>
          </div>
          <span className="font-bold tracking-tight text-foreground transition-colors group-hover:text-accent whitespace-nowrap text-sm sm:text-base">
            Yahya Haroun
          </span>
        </Link>

        {/* Desktop Menu - Centered */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-6 py-2 backdrop-blur-md lg:flex lg:items-center lg:gap-8 shadow-sm">
          {links.map((link) => {
            const isHash = link.href.startsWith("/#");
            const targetId = link.href.replace("/#", "");
            
            const isActive = isHash && pathname === "/" 
              ? activeSection === targetId 
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="relative text-sm font-medium transition-colors"
              >
                <span className={`relative z-10 ${isActive ? "text-accent" : "text-foreground/70 hover:text-foreground"}`}>
                  {link.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute -inset-x-3 -inset-y-2 z-0 rounded-full bg-accent/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <button
            className="lg:hidden text-foreground focus:outline-none flex items-center justify-center gap-2 h-10 px-3 rounded-full bg-black/5 dark:bg-white/5 border border-white/10 dark:border-white/10 z-50 relative flex-shrink-0 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
            <span className="text-sm font-medium pr-1">{open ? "Fermer" : "Menu"}</span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu (Premium Fullscreen Blur) */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-background/80 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex h-full flex-col px-6 pt-24 pb-8 overflow-y-auto">
              
              {/* Header inside menu */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <span className="font-bold text-xl tracking-tighter">YH</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-foreground text-lg">Yahya Haroun</h2>
                    <p className="text-xs text-foreground/50">Développeur PWA</p>
                  </div>
                </div>
                <ThemeToggle />
              </motion.div>

              {/* Navigation Links */}
              <ul className="flex flex-col gap-2 flex-1">
                {links.map((link, i) => {
                  const isHash = link.href.startsWith("/#");
                  const targetId = link.href.replace("/#", "");
                  const isActive = isHash && pathname === "/" 
                    ? activeSection === targetId 
                    : pathname.startsWith(link.href);

                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                        className={`flex items-center rounded-2xl px-6 py-4 text-lg font-medium transition-colors ${
                          isActive ? "bg-accent/10 text-accent" : "text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              {/* Footer inside menu (Admin + Socials) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-auto pt-8 flex flex-col gap-6"
              >
                <Link
                  href="/admin/login"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-6 py-4 text-sm font-semibold text-foreground transition-all hover:bg-black/10 dark:hover:bg-white/10 active:scale-95"
                >
                  <Lock size={16} className="text-accent" />
                  Administration
                </Link>
                
                <div className="flex justify-center gap-6 text-foreground/50">
                  <a href="https://github.com/yahyaharoun" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><Github size={20} /></a>
                  <a href="https://www.linkedin.com/in/yahya-haroun-87a446344" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><Linkedin size={20} /></a>
                  <a href="https://x.com/yhyhaoun" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors"><Twitter size={20} /></a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
