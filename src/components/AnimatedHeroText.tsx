"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const roles = [
  "Développeur de Progressive Web Apps",
  "Entrepreneur Tech",
  "Passionné IA",
  "Future spécialisation en cybersécurité"
];

export function AnimatedHeroText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 3000); // Change le texte toutes les 3 secondes

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative h-12 sm:h-16 w-full flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ y: 30, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -30, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center text-lg font-medium text-accent sm:text-2xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/60"
        >
          {roles[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
