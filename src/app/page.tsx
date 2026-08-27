export const dynamic = "force-dynamic";

import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { PlaygroundSection } from "@/components/home/PlaygroundSection";
import { ExperiencesSection } from "@/components/home/ExperiencesSection";
import { GallerySection } from "@/components/home/GallerySection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { ContactSection } from "@/components/home/ContactSection";

export const metadata = {
  title: "Yahya Haroun — Développeur SaaS & Cybersécurité",
  description: "Portfolio de Yahya Haroun, expert en développement d'applications SaaS et PWA Offline-First.",
};

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <PlaygroundSection />
      <ExperiencesSection />
      <GallerySection />
      <BlogPreviewSection />
      <ContactSection />
    </main>
  );
}
