"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface StackedCardCarouselProps<T> {
  items: T[];
  renderItem: (item: T, index: number, isVisiable: boolean) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  autoPlayInterval?: number; // en millisecondes, ex: 5000. Si 0 ou undefined, pas d'autoplay
}

export function StackedCardCarousel<T>({
  items,
  renderItem,
  keyExtractor,
  autoPlayInterval = 0,
}: StackedCardCarouselProps<T>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Autoplay
  useEffect(() => {
    if (autoPlayInterval > 0 && !isHovered) {
      const timer = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(timer);
    }
  }, [autoPlayInterval, isHovered, nextSlide]);

  // Support clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Gestion du drag (swipe)
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div
      className="relative w-full max-w-4xl mx-auto h-[400px] sm:h-[450px] flex items-center justify-center perspective-[1000px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((item, index) => {
            // Calculer la distance par rapport à l'élément courant
            // pour gérer l'effet circulaire (modulo)
            let distance = index - currentIndex;
            const halfLength = Math.floor(items.length / 2);
            
            if (distance > halfLength) distance -= items.length;
            if (distance < -halfLength) distance += items.length;

            const isVisible = Math.abs(distance) <= 2; // Ne render que 5 éléments max pour la perf
            if (!isVisible) return null;

            const isCenter = distance === 0;
            const isLeft = distance < 0;
            
            // Calcul des valeurs d'animation en fonction de la distance
            const scale = 1 - Math.abs(distance) * 0.1; // 1, 0.9, 0.8...
            const x = distance * 40; // Décalage horizontal (en px ou %)
            const z = -Math.abs(distance) * 50; // Profondeur (perspective)
            const rotateY = distance * -15; // Rotation légère pour l'effet 3D
            const opacity = 1 - Math.abs(distance) * 0.3; // 1, 0.7, 0.4...
            const zIndex = items.length - Math.abs(distance);

            return (
              <motion.div
                key={keyExtractor(item)}
                className="absolute w-[90%] sm:w-[70%] max-w-[500px] h-full flex flex-col justify-center cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, scale: 0.8, x: isLeft ? -100 : 100 }}
                animate={{ 
                  opacity, 
                  scale, 
                  x: `${x}%`,
                  z,
                  rotateY,
                  zIndex,
                }}
                exit={{ opacity: 0, scale: 0.8, x: isLeft ? -100 : 100 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  mass: 1,
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* L'overlay empêche le clic sur les cartes non centrales */}
                <div className={`w-full h-full relative transition-all duration-300 ${!isCenter ? 'pointer-events-none brightness-50 blur-[2px]' : ''}`}>
                  {renderItem(item, index, isCenter)}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Contrôles manuels (Boutons flottants) */}
      <div className="absolute inset-y-0 left-0 right-0 hidden sm:flex items-center justify-between px-2 sm:px-4 pointer-events-none z-50">
        <button
          onClick={prevSlide}
          className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white transition-all hover:bg-black/40 hover:scale-110 focus:outline-none"
          aria-label="Précédent"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white transition-all hover:bg-black/40 hover:scale-110 focus:outline-none"
          aria-label="Suivant"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      
      {/* Pagination (Dots) */}
      <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
        {items.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex ? "w-6 bg-accent" : "w-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Aller à la slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
