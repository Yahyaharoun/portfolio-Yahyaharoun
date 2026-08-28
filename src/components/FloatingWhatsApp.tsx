"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";

export function FloatingWhatsApp() {
  const whatsappNumber = "000000000"; // Replace with actual number
  const whatsappMessage = encodeURIComponent("Bonjour Yahya, je vous contacte depuis votre portfolio.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("whatsapp_click")}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-20 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-2xl hover:shadow-[#25D366]/30 transition-all duration-300"
      aria-label="Contactez-moi sur WhatsApp"
    >
      <MessageCircle size={28} />
      
      {/* Pulse Effect */}
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-75 animate-ping"></span>
    </motion.a>
  );
}
