export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import AdminLayout from "@/components/AdminLayout";
import DashboardContent from "./offers/DashboardContent";

export default async function AdminPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      <DashboardContent />
    </AdminLayout>
  );
}
