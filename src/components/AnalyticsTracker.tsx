"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Ne pas tracker les routes admin
    if (pathname.startsWith("/admin")) return;
    
    // Éviter de tracker plusieurs fois la même page (ex: strict mode)
    if (trackedPath.current === pathname) return;
    trackedPath.current = pathname;

    fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_path: pathname }),
      // keepalive pour s'assurer que la requête part même si on navigue vite
      keepalive: true,
    }).catch(err => console.error("Analytics error:", err));

  }, [pathname]);

  return null;
}
