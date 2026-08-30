"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { GalleryItem } from "@/types";
import { Camera, ArrowRight, Play, X } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { StackedCardCarousel } from "@/components/ui/StackedCardCarousel";

const defaultGallery: GalleryItem[] = [
  {
    id: "gal1",
    title: "Hackathon 2023",
    description: null,
    category: null,
    media_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    media_type: "image",
    is_published: true,
  },
  {
    id: "gal2",
    title: "Conférence Tech",
    description: null,
    category: null,
    media_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    media_type: "image",
    is_published: true,
  },
  {
    id: "gal3",
    title: "Formation DevSecOps",
    description: null,
    category: null,
    media_url: "https://images.unsplash.com/photo-1517048676732-d65bc937f952",
    media_type: "image",
    is_published: true,
  }
];

export function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      const supabase = createClient();
      try {
        const { data } = await supabase
          .from("gallery")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true })
          .limit(6);
          
        if (data && data.length > 0) {
          setItems(data as GalleryItem[]);
        } else {
          setItems(defaultGallery);
        }
      } catch (error) {
        console.error("Erreur Gallery:", error);
        setItems(defaultGallery);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  return (
    <section id="gallery" className="mx-auto max-w-6xl px-6 py-32 scroll-mt-20 relative">
      <div className="mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div className="max-w-2xl text-left">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6"
          >
            <Camera size={16} />
            <span>Moments & Événements</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4"
          >
            Galerie
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            className="mt-4 h-1 w-20 rounded-full bg-accent/50 mb-6 origin-left"
          ></motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 sm:text-lg"
          >
            Quelques moments capturés lors de conférences, de formations ou sur le terrain.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <Link href="/gallery" className="group flex items-center justify-center gap-3 rounded-full bg-foreground text-background px-8 py-4 font-bold text-sm uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(109,93,252,0.15)] hover:shadow-accent/30">
            Explorer galerie
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10 mt-10 min-h-[400px]">
        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          </div>
        ) : (
          <StackedCardCarousel
            items={items}
            keyExtractor={(i) => i.id}
            autoPlayInterval={5000}
            renderItem={(item, index, isVisible) => {
              return (
                <div 
                  className={`relative flex h-[350px] sm:h-[400px] w-full flex-col justify-between overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl transition-all duration-500 cursor-pointer
                    ${isVisible ? 'ring-2 ring-accent/30' : ''}
                  `}
                  onClick={() => {
                    if (isVisible) setSelectedImage(item);
                  }}
                >
                  {item.media_type === "image" ? (
                    <Image
                      src={item.media_url}
                      alt={item.title ?? "Photo"}
                      fill
                      className="object-cover transition-transform duration-700"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <video src={item.media_url} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                          <Play size={24} className="text-white ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80"></div>
                  
                  {item.title && (
                    <div className="absolute inset-x-0 bottom-0 p-8">
                      <h3 className="text-2xl font-bold text-white drop-shadow-md mb-2">{item.title}</h3>
                      {isVisible && (
                        <p className="text-accent text-sm font-medium flex items-center gap-2">
                          Cliquez pour agrandir <ArrowRight size={14} />
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            }}
          />
        )}
      </div>

      {/* Modal pour afficher l'image en grand */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
              onClick={() => setSelectedImage(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-5xl h-[85vh] flex flex-col items-center justify-center pointer-events-none"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute right-4 top-4 sm:right-10 sm:top-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors pointer-events-auto z-20"
              >
                <X size={24} />
              </button>
              
              <div className="relative w-full h-full rounded-2xl overflow-hidden pointer-events-auto flex flex-col">
                {selectedImage.media_type === "image" ? (
                  <div className="relative w-full flex-grow">
                    <Image
                      src={selectedImage.media_url}
                      alt={selectedImage.title ?? "Photo agrandie"}
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full flex-grow flex items-center justify-center bg-black/50">
                    <video 
                      src={selectedImage.media_url} 
                      controls 
                      autoPlay
                      className="max-h-full max-w-full rounded-xl"
                    />
                  </div>
                )}
                
                {selectedImage.title && (
                  <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-center text-xl sm:text-2xl font-bold text-white">{selectedImage.title}</h3>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
