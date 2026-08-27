"use client";

import Image from "next/image";
import Link from "next/link";
import { Pencil, ExternalLink } from "lucide-react";
import DeleteEntityButton from "./DeleteEntityButton";
import TogglePublishButton from "./TogglePublishButton";

export type AdminEntityColumn = {
  key: string;
  label: string;
  type?: "text" | "status" | "date" | "url" | "category";
  format?: (value: any, item: any) => React.ReactNode;
};

export type AdminEntityConfig = {
  table: string; // Supabase table name
  titleKey: string; // The property representing the title/name
  descriptionKey?: string; // The property for description
  imageKey?: string; // The property for thumbnail image
  publishKey?: string; // The property representing is_published (if applicable)
  editPath: string; // Base path for editing (e.g. "/admin/projects?edit=")
  externalLinkKey?: string; // URL to view live
  emptyMessage: string;
};

export default function AdminEntityList({
  items,
  config,
  columns
}: {
  items: any[];
  config: AdminEntityConfig;
  columns?: AdminEntityColumn[];
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "termine": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "en_cours": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "archive": return "bg-foreground/10 text-foreground/70 border-foreground/20";
      default: return "bg-foreground/10 text-foreground/70 border-foreground/20";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "termine": return "Terminé";
      case "en_cours": return "En cours";
      case "archive": return "Archivé";
      default: return status;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {items?.map((item) => (
        <div
          key={item.id}
          className="group flex flex-col sm:flex-row gap-4 overflow-hidden rounded-2xl border border-white/10 bg-muted/30 backdrop-blur-sm p-4 transition-all hover:border-white/20 hover:bg-white/5"
        >
          {/* Image Thumbnail */}
          {config.imageKey && (
            <div className="relative h-40 sm:h-32 w-full sm:w-48 shrink-0 overflow-hidden rounded-xl bg-black/20">
              {item[config.imageKey] ? (
                <Image src={item[config.imageKey]} alt={item[config.titleKey] || "Image"} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-foreground/20">Sans image</div>
              )}
              
              {config.publishKey && (
                <div className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-lg ${item[config.publishKey] ? "bg-accent/80 text-white" : "bg-black/80 text-foreground/60 border border-white/10"}`}>
                  {item[config.publishKey] ? "Publié" : "Brouillon"}
                </div>
              )}
            </div>
          )}

          {/* Contenu et Actions */}
          <div className="flex flex-1 flex-col py-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-foreground line-clamp-1">{item[config.titleKey]}</h3>
                
                {columns && columns.length > 0 && (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {columns.map((col, idx) => (
                      <div key={idx} className="flex items-center">
                        {col.type === "status" && item[col.key] && (
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(item[col.key])}`}>
                            {getStatusLabel(item[col.key])}
                          </span>
                        )}
                        {col.type === "category" && item[col.key] && (
                          <span className="text-xs font-medium text-foreground/70 bg-black/20 px-2 py-0.5 rounded-full">
                            {item[col.key]}
                          </span>
                        )}
                        {col.type === "text" && item[col.key] && (
                          <span className="text-xs text-foreground/50 truncate max-w-[150px]">
                            {item[col.key]}
                          </span>
                        )}
                        {col.format && col.format(item[col.key], item)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {config.publishKey && (
                   <TogglePublishButton table={config.table} id={item.id} isPublished={item[config.publishKey]} />
                )}
                <Link
                  href={`${config.editPath}${item.id}`}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-foreground/60 transition-colors hover:bg-accent hover:text-white"
                  title="Modifier"
                >
                  <Pencil size={14} />
                </Link>
                <DeleteEntityButton table={config.table} id={item.id} title={item[config.titleKey]} />
              </div>
            </div>

            {config.descriptionKey && item[config.descriptionKey] && (
              <p className="mt-3 text-sm text-foreground/70 line-clamp-2">
                {item[config.descriptionKey]}
              </p>
            )}

            {config.externalLinkKey && item[config.externalLinkKey] && (
              <a href={item[config.externalLinkKey]} target="_blank" rel="noopener noreferrer" className="mt-auto flex items-center gap-1.5 text-xs font-medium text-accent hover:underline w-fit pt-4 sm:pt-0">
                <ExternalLink size={12} /> Voir le lien externe
              </a>
            )}
          </div>
        </div>
      ))}

      {(!items || items.length === 0) && (
        <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
          <p className="text-foreground/60">{config.emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
