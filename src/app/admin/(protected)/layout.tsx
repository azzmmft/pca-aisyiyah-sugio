import { redirect } from "next/navigation";
import AdminSidebar from "../component/AdminSidebar";
import { getCurrentAdmin } from "@/lib/auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F5F0E4]">
      <AdminSidebar />

      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}