"use client";

import { useState } from "react";
import { Mail, Handshake, CheckCircle2, Paperclip, ChevronDown, ChevronUp, Trash2, MailOpen, AlertTriangle, X, Loader2 } from "lucide-react";
import { toggleMessageReadStatus, deleteMessage } from "@/app/admin/actions";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function MessageRow({ item }: { item: any }) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const isMessage = item._type === 'message';

  const timeAgo = (dateStr: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "À l'instant";
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)} h`;
    return `Il y a ${Math.floor(seconds / 86400)} j`;
  };

  async function handleToggleRead(e: React.MouseEvent, targetState: boolean) {
    e.stopPropagation();
    if (item.is_read === targetState) return;
    await toggleMessageReadStatus(item.id, item._type, targetState);
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteMessage(item.id, item._type);
    } catch (err) {
      alert("Erreur lors de la suppression");
      setLoading(false);
    }
  }

  async function handleRowClick() {
    // Navigate to detail page
    router.push(`/admin/messages/${item.id}?type=${item._type}`);
  }

  return (
    <>
      <div 
        className={`group flex items-center gap-4 rounded-2xl border p-4 sm:p-5 bg-black/20 backdrop-blur-md transition-all cursor-pointer ${
          !item.is_read ? 'border-accent/30 shadow-[0_0_15px_rgba(109,93,252,0.1)] hover:bg-black/40' : 'border-white/5 hover:border-white/10 hover:bg-white/5'
        }`}
        onClick={handleRowClick}
      >
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold ${
          isMessage ? 'bg-accent/20 text-accent' : 'bg-amber-500/20 text-amber-500'
        }`}>
          {isMessage ? <Mail size={20} /> : <Handshake size={20} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className={`text-base truncate ${!item.is_read ? 'font-bold text-white' : 'font-medium text-foreground/80'}`}>
              {item.name}
            </h3>
            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full hidden sm:inline-flex ${
              isMessage ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
            }`}>
              {isMessage ? 'Contact' : 'Partenariat'}
            </span>
            <span className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold rounded-full ${
              item.is_read ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-white/10 text-white border border-white/20'
            }`}>
              {item.is_read ? 'Lu' : 'Nouveau'}
            </span>
            <span className="ml-auto text-xs text-foreground/40 whitespace-nowrap hidden sm:block">
              {timeAgo(item.created_at)}
            </span>
          </div>
          
          <p className={`text-sm truncate ${!item.is_read ? 'text-foreground/90 font-medium' : 'text-foreground/60'}`}>
            {item.message}
          </p>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => handleToggleRead(e, !item.is_read)}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/5 text-foreground/70 transition-colors hover:bg-white/10 hover:text-foreground"
            title={`Marquer comme ${item.is_read ? "non lu" : "lu"}`}
          >
            {item.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
            className="flex items-center justify-center h-8 w-8 rounded-lg bg-red-500/10 text-red-500 transition-colors hover:bg-red-500 hover:text-white"
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-background p-6 shadow-[0_0_50px_rgba(0,0,0,0.5)] dark:bg-[#0a0a0f]"
            >
              <button 
                onClick={() => setShowConfirm(false)}
                className="absolute right-4 top-4 text-foreground/40 hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">Supprimer le message ?</h3>
                <p className="mb-8 text-sm text-foreground/60">
                  Ce message de <span className="font-semibold text-foreground">{item.name}</span> sera définitivement supprimé.
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-muted/50 px-4 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50 border border-black/5 dark:border-white/5"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-red-500 px-4 py-3.5 text-sm font-semibold text-white transition-all hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      "Supprimer"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
