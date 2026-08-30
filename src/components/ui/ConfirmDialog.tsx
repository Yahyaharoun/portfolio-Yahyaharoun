"use client";

import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDestructive?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  isLoading = false,
  isDestructive = true,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity"
        onClick={() => !isLoading && onClose()}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f14] shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-300">
        {/* Ligne décorative en haut */}
        <div className={`h-1 w-full ${isDestructive ? 'bg-red-500' : 'bg-accent'}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
              <AlertTriangle size={20} />
            </div>
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
          </div>
          <button
            onClick={() => !isLoading && onClose()}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/40 transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-2">
          <p className="text-sm leading-relaxed text-foreground/70">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 bg-white/5 px-6 py-4">
          <button
            onClick={() => onClose()}
            disabled={isLoading}
            className="w-full sm:w-auto rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-sm font-semibold text-foreground/70 transition-all hover:bg-white/10 hover:text-foreground disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all active:scale-[0.98] disabled:opacity-60 ${
              isDestructive 
                ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]' 
                : 'bg-accent hover:bg-accent/90 shadow-[0_0_20px_rgba(109,93,252,0.3)]'
            }`}
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {!isLoading && isDestructive && <AlertTriangle size={16} />}
            {isLoading ? "Veuillez patienter..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
