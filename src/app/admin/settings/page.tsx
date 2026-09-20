export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/client";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }

  const supabase = createClient();
  const { data } = await supabase
    .from("site_config")
    .select("*")
    .eq("id", "00000000-0000-0000-0000-000000000001")
    .single();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-black text-white mb-2">إعدادات الموقع</h1>
      <p className="text-gray-400 text-sm mb-8">
        تعديل بيانات المطعم ومحتوى الموقع
      </p>
      <SettingsForm initialData={data} />
    </div>
  );
}
