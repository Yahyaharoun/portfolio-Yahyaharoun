import { cookies } from "next/headers";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get("admin_token")?.value;

  // Le middleware protege deja /admin/*, mais /admin/login doit s'afficher sans sidebar.
  // Comme ce layout s'applique aussi a /admin/login, on affiche une version nue si pas de session (ou token).
  if (!token) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden p-4 pt-16 md:p-8 md:pt-8 custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
