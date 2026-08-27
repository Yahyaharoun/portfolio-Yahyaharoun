"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Save, Plus, Trash2, Eye, LayoutTemplate, LayoutPanelLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { CVDocument } from "@/lib/cv/CVDocument";

// Chargement dynamique du PDFViewer uniquement côté client (pas de SSR)
const PDFViewer = dynamic(() => import("@react-pdf/renderer").then(mod => mod.PDFViewer), {
  ssr: false,
  loading: () => <div className="flex h-full w-full items-center justify-center bg-muted/50 rounded-2xl border border-black/10 dark:border-white/10"><div className="animate-spin rounded-full h-8 w-8 border-2 border-accent border-t-transparent" /></div>
});

export default function CVAdminPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  // Données de base
  const [profile, setProfile] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  // CV Data state
  const [cvId, setCvId] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState<{ category: string; items: string[] }[]>([]);
  const [languages, setLanguages] = useState<{ name: string; level: string }[]>([]);
  const [education, setEducation] = useState<{ title: string; institution: string; year: string }[]>([]);
  const [customSections, setCustomSections] = useState<{ title: string; content: string }[]>([]);

  // UI State
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch Profile
      const { data: profileData } = await supabase.from("profiles").select("*").limit(1).single();
      if (profileData) setProfile(profileData);

      // 2. Fetch CV Data
      const { data: cvData } = await supabase.from("cv_data").select("*").limit(1).single();
      if (cvData) {
        setCvId(cvData.id);
        setSummary(cvData.summary || "");
        setSkills(cvData.skills || []);
        setLanguages(cvData.languages || []);
        setEducation(cvData.education || []);
        setCustomSections(cvData.custom_sections || []);
      }

      // 3. Fetch Experiences & Projects for Preview
      const { data: expData } = await supabase.from("experiences").select("*").eq("is_published", true).in("type", ["entreprise", "stage", "projet"]).order("start_date", { ascending: false });
      if (expData) setExperiences(expData);

      const { data: projData } = await supabase.from("projects").select("*, technologies:project_technologies(technology:technologies(*))").eq("is_published", true).eq("is_featured", true).order("sort_order", { ascending: true });
      if (projData) {
        setProjects(projData.map(p => ({
          ...p,
          technologies: p.technologies?.map((pt: any) => pt.technology) || []
        })));
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        summary,
        skills,
        languages,
        education,
        custom_sections: customSections,
        is_active: true,
        full_name: "Yahya Haroun",
        professional_title: "Développeur Full Stack",
      };

      if (cvId) {
        await supabase.from("cv_data").update(payload).eq("id", cvId);
      } else {
        const { data } = await supabase.from("cv_data").insert(payload).select().single();
        if (data) setCvId(data.id);
      }
      
      setMessage("CV mis à jour avec succès.");
    } catch (err) {
      console.error(err);
      setMessage("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // --- Helpers pour modifier les listes ---
  const addSkillCategory = () => setSkills([...skills, { category: "", items: [] }]);
  const removeSkillCategory = (idx: number) => setSkills(skills.filter((_, i) => i !== idx));
  const updateSkillCategory = (idx: number, val: string) => {
    const newSkills = [...skills];
    newSkills[idx].category = val;
    setSkills(newSkills);
  };
  const updateSkillItems = (idx: number, val: string) => {
    const newSkills = [...skills];
    newSkills[idx].items = val.split(",").map(s => s.trim()).filter(Boolean);
    setSkills(newSkills);
  };

  const addLanguage = () => setLanguages([...languages, { name: "", level: "" }]);
  const removeLanguage = (idx: number) => setLanguages(languages.filter((_, i) => i !== idx));
  const updateLanguage = (idx: number, field: "name" | "level", val: string) => {
    const newLangs = [...languages];
    newLangs[idx][field] = val;
    setLanguages(newLangs);
  };

  const addEducation = () => setEducation([...education, { title: "", institution: "", year: "" }]);
  const removeEducation = (idx: number) => setEducation(education.filter((_, i) => i !== idx));
  const updateEducation = (idx: number, field: "title" | "institution" | "year", val: string) => {
    const newEdu = [...education];
    newEdu[idx][field] = val;
    setEducation(newEdu);
  };

  const addCustomSection = () => setCustomSections([...customSections, { title: "", content: "" }]);
  const removeCustomSection = (idx: number) => setCustomSections(customSections.filter((_, i) => i !== idx));
  const updateCustomSection = (idx: number, field: "title" | "content", val: string) => {
    const newSec = [...customSections];
    newSec[idx][field] = val;
    setCustomSections(newSec);
  };

  // Objet cvData construit à la volée pour l'aperçu temps réel
  const liveCvData = {
    full_name: profile?.full_name || "Yahya Haroun",
    professional_title: profile?.title || "Développeur Full Stack",
    summary,
    skills,
    languages,
    education,
    custom_sections: customSections,
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col lg:flex-row gap-6 p-6">
      
      {/* SECTION FORMULAIRE */}
      <div className={`flex-1 overflow-y-auto pr-2 space-y-8 pb-20 ${showPreview ? 'lg:w-1/2' : 'w-full'}`}>
        <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-4 border-b border-black/5 dark:border-white/5">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion du CV</h1>
            <p className="text-sm text-foreground/60 mt-1">Données personnalisées et configuration.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowPreview(!showPreview)} 
              className="hidden lg:flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-2 font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              {showPreview ? <LayoutPanelLeft size={16} /> : <LayoutTemplate size={16} />}
              {showPreview ? "Cacher Aperçu" : "Afficher Aperçu"}
            </button>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90"
            >
              {saving ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={16} />}
              Enregistrer
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent font-medium">
            {message}
          </div>
        )}

        {/* Résumé */}
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-muted p-6">
          <h2 className="text-lg font-bold mb-4">Résumé Professionnel</h2>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-background px-4 py-3 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Votre profil en quelques lignes..."
          />
        </div>

        {/* Formations (Education) */}
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-muted p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Formations</h2>
            <button onClick={addEducation} className="flex items-center gap-1 text-sm text-accent font-medium hover:underline">
              <Plus size={16} /> Ajouter
            </button>
          </div>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-background p-4 rounded-xl border border-black/5 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                  <input
                    type="text"
                    value={edu.title}
                    onChange={(e) => updateEducation(idx, "title", e.target.value)}
                    placeholder="Titre (ex: Master Cybersécurité)"
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                    placeholder="Établissement"
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => updateEducation(idx, "year", e.target.value)}
                    placeholder="Année (ex: 2023 - 2025)"
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <button onClick={() => removeEducation(idx)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {education.length === 0 && <p className="text-sm text-foreground/50">Aucune formation ajoutée.</p>}
          </div>
        </div>

        {/* Compétences (Skills) */}
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-muted p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Compétences Techniques</h2>
            <button onClick={addSkillCategory} className="flex items-center gap-1 text-sm text-accent font-medium hover:underline">
              <Plus size={16} /> Ajouter une catégorie
            </button>
          </div>
          <div className="space-y-4">
            {skills.map((skillGroup, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-background p-4 rounded-xl border border-black/5 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <input
                    type="text"
                    value={skillGroup.category}
                    onChange={(e) => updateSkillCategory(idx, e.target.value)}
                    placeholder="Catégorie (ex: Frontend, DevOps...)"
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none font-bold text-accent"
                  />
                  <input
                    type="text"
                    value={skillGroup.items.join(", ")}
                    onChange={(e) => updateSkillItems(idx, e.target.value)}
                    placeholder="Compétences séparées par des virgules (ex: React, Next.js, Vue)"
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <button onClick={() => removeSkillCategory(idx)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {skills.length === 0 && <p className="text-sm text-foreground/50">Aucune compétence ajoutée.</p>}
          </div>
        </div>

        {/* Langues (Languages) */}
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-muted p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Langues</h2>
            <button onClick={addLanguage} className="flex items-center gap-1 text-sm text-accent font-medium hover:underline">
              <Plus size={16} /> Ajouter
            </button>
          </div>
          <div className="space-y-4">
            {languages.map((lang, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-background p-4 rounded-xl border border-black/5 dark:border-white/5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <input
                    type="text"
                    value={lang.name}
                    onChange={(e) => updateLanguage(idx, "name", e.target.value)}
                    placeholder="Langue (ex: Anglais)"
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                  <input
                    type="text"
                    value={lang.level}
                    onChange={(e) => updateLanguage(idx, "level", e.target.value)}
                    placeholder="Niveau (ex: Courant, C1)"
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <button onClick={() => removeLanguage(idx)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {languages.length === 0 && <p className="text-sm text-foreground/50">Aucune langue ajoutée.</p>}
          </div>
        </div>
        
        {/* Données Personnalisées (Custom Sections) */}
        <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-muted p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-accent">Données Personnalisées</h2>
              <p className="text-xs text-foreground/60">Objectif, Hobbies, Citations... affichés en bas du CV.</p>
            </div>
            <button onClick={addCustomSection} className="flex items-center gap-1 text-sm text-accent font-medium hover:underline">
              <Plus size={16} /> Ajouter
            </button>
          </div>
          <div className="space-y-4">
            {customSections.map((section, idx) => (
              <div key={idx} className="flex gap-4 items-start bg-background p-4 rounded-xl border border-black/5 dark:border-white/5">
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateCustomSection(idx, "title", e.target.value)}
                    placeholder="Titre de la section (ex: Centres d'intérêt)"
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none font-bold"
                  />
                  <textarea
                    value={section.content}
                    onChange={(e) => updateCustomSection(idx, "content", e.target.value)}
                    placeholder="Contenu..."
                    rows={3}
                    className="w-full rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                </div>
                <button onClick={() => removeCustomSection(idx)} className="text-red-500 p-2 hover:bg-red-500/10 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            {customSections.length === 0 && <p className="text-sm text-foreground/50">Aucune donnée personnalisée.</p>}
          </div>
        </div>

      </div>

      {/* SECTION APERÇU PDF */}
      {showPreview && (
        <div className="hidden lg:block w-1/2 h-full bg-muted/30 rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden sticky top-0">
          <PDFViewer width="100%" height="100%" className="border-none" showToolbar={false}>
            <CVDocument 
              profile={profile || {}}
              cvData={liveCvData}
              experiences={experiences}
              projects={projects}
            />
          </PDFViewer>
        </div>
      )}

    </div>
  );
}
