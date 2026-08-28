"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

export function FloatingNavigation() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed right-6 bottom-24 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {scrollY > 300 && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="group flex h-12 w-12 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-lg hover:bg-accent hover:border-accent text-foreground hover:text-white transition-all duration-300"
            aria-label="Remonter en haut"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.button>
        )}
      </AnimatePresence>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={scrollToBottom}
        className="group flex h-12 w-12 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-lg hover:bg-accent hover:border-accent text-foreground hover:text-white transition-all duration-300"
        aria-label="Descendre en bas"
      >
        <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform duration-300" />
      </motion.button>
    </div>
  );
}
