"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FloatingNavigation } from "./FloatingNavigation";
import { FloatingWhatsApp } from "./FloatingWhatsApp";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      <div className={!isAdmin ? "min-h-screen" : ""}>
        {children}
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingNavigation />}
      {!isAdmin && <FloatingWhatsApp />}
    </>
  );
}

