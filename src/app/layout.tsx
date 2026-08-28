import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import ServiceWorkerUnregister from "@/components/ServiceWorkerUnregister";
import { ThemeProvider } from "@/components/ThemeProvider";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Yahya Haroun — Développeur Full Stack & Cybersécurité",
  description: "Portfolio de Yahya Haroun. Création d'applications web, SaaS et solutions numériques hors-ligne pour les commerçants africains.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Yahya Haroun",
  },
};

export const viewport: Viewport = {
  themeColor: "#1F2329",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} bg-background font-sans text-foreground antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ServiceWorkerUnregister />
          <AnalyticsTracker />
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

