"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-10" />;
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-foreground/70 transition-all hover:bg-black/10 dark:hover:bg-white/10 hover:text-foreground focus:outline-none border border-black/5 dark:border-white/5 overflow-hidden group shadow-sm"
      aria-label="Changer de thème"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <motion.div
          initial={false}
          animate={{
            y: isDark ? 30 : 0,
            opacity: isDark ? 0 : 1,
            rotate: isDark ? 90 : 0,
            scale: isDark ? 0.5 : 1
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="absolute"
        >
          <Sun size={20} className="text-amber-500" />
        </motion.div>
        
        <motion.div
          initial={false}
          animate={{
            y: isDark ? 0 : -30,
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 0 : -90,
            scale: isDark ? 1 : 0.5
          }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="absolute"
        >
          <Moon size={20} className="text-accent" />
        </motion.div>
      </div>
    </button>
  );
}
