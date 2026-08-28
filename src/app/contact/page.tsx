"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Phone, Mail, MapPin, Github, Linkedin,
  Facebook, Instagram, Youtube,
  Copy, Check, ExternalLink, Send
} from "lucide-react";
import ContactForm from "@/components/ContactForm";

// SVG Officiel WhatsApp
const WhatsAppIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.029 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const EMAIL = "yahyaharoun.657@gmail.com";
const PHONE = "+227 690722465";
const WHATSAPP = "227690722465";
const LOCATION = "Yaounde- Cameroun";

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/yahyaharoun", color: "hover:text-[#6e5494]" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/yahya-haroun-87a446344?utm_source=share_via&utm_content=profile&utm_medium=member_ios", color: "hover:text-[#0A66C2]" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1Fqj5n36j7/?mibextid=wwXIfr", color: "hover:text-[#1877f2]" },
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/yahyahaoun?igsi=b3l1c2lkdWhibnl2&utm_source=qr", color: "hover:text-[#e1306c]" },
  { icon: Youtube, label: "YouTube", href: "https://youtube.com/@yahyaharoun", color: "hover:text-[#ff0000]" },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg text-foreground/40 hover:text-accent hover:bg-accent/10 transition-all"
      aria-label="Copier"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
    </button>
  );
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground mb-4">
          Travaillons ensemble
        </h1>
        <p className="mx-auto max-w-xl text-foreground/70 sm:text-lg">
          Disponible pour des projets freelance, des collaborations et des opportunités de full-time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Left: Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-4"
        >
          {/* Info Cards */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-muted p-6">
            <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-4">Contact direct</h2>

            {/* Phone */}
            <div className="flex items-center justify-between gap-3 py-3 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs text-foreground/50">Téléphone</p>
                  <p className="text-sm font-medium text-foreground">{PHONE}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <a href={`tel:${PHONE}`} className="p-2 rounded-lg text-foreground/40 hover:text-accent hover:bg-accent/10 transition-all" aria-label="Appeler">
                  <Phone size={16} />
                </a>
                <CopyButton value={PHONE} />
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between gap-3 py-3 border-b border-black/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-xs text-foreground/50">Email</p>
                  <p className="text-sm font-medium text-foreground truncate max-w-[160px]">{EMAIL}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <a href={`mailto:${EMAIL}`} className="p-2 rounded-lg text-foreground/40 hover:text-accent hover:bg-accent/10 transition-all" aria-label="Envoyer un email">
                  <Send size={16} />
                </a>
                <CopyButton value={EMAIL} />
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 pt-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-accent">
                <MapPin size={16} />
              </div>
              <div>
                <p className="text-xs text-foreground/50">Localisation</p>
                <p className="text-sm font-medium text-foreground">{LOCATION}</p>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${WHATSAPP}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-green-500 transition-all hover:bg-green-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <WhatsAppIcon size={20} />
            <span className="font-medium">Écrire sur WhatsApp</span>
            <ExternalLink size={14} className="opacity-50 transition-transform group-hover:translate-x-0.5" />
          </a>

          {/* Social Links */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-muted p-6">
            <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wider mb-4">Réseaux sociaux</h2>
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 rounded-xl border border-black/10 dark:border-white/10 px-3 py-2.5 text-sm text-foreground/70 transition-all hover:scale-105 active:scale-95 ${color}`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-3 rounded-2xl border border-black/10 dark:border-white/10 bg-muted p-8"
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">Envoyer un message</h2>
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
}

