export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import DashboardContent from "./DashboardContent";

export default async function AdminDashboard() {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }

  return <DashboardContent />;
}
