"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { 
  LayoutDashboard, 
  FolderKanban, 
  History, 
  Image as ImageIcon, 
  FileText, 
  BarChart3, 
  Mail, 
  Handshake, 
  Menu,
  X,
  LogOut,
  BookOpen
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/experiences", label: "Expériences", icon: History },
  { href: "/admin/gallery", label: "Galerie", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: BookOpen },
  { href: "/admin/cv", label: "CV", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Bouton Hamburger (Mobile uniquement) */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 rounded-lg bg-black/50 p-2 text-foreground backdrop-blur-md md:hidden border border-white/10"
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay sombre pour fermer le tiroir sur mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar principale (Fixe sur Desktop, Tiroir sur Mobile) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-background/95 backdrop-blur-xl p-6 transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between md:block">
          <p className="text-lg font-bold text-foreground">Administration</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
          {navItems.map((item) => {
            // L'item est actif si son href correspond exactement au pathname,
            // ou si pathname commence par href/ (pour englober /admin/projects/new par ex)
            // Attention au cas particulier de "/admin" qui matcherait tout.
            const isActive = 
              item.href === "/admin" 
                ? pathname === "/admin" 
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-accent/10 text-accent" 
                    : "text-foreground/70 hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-accent" />
                )}
                <item.icon size={18} className={isActive ? "text-accent" : "text-foreground/50 group-hover:text-foreground/70"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Mini Bloc Profil & Déconnexion en bas */}
        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent border border-accent/30 font-bold">
              YH
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground">Yahya Haroun</span>
              <span className="text-xs text-foreground/50">Administrateur</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
