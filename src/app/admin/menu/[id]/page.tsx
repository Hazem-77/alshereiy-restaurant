export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/client";
import MenuForm from "../MenuForm";

export default async function EditMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }

  const supabase = createClient();
  const { data } = await supabase.from("menu_items").select("*").eq("id", id).single();

  if (!data) {
    redirect("/admin/menu");
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/menu"
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
        >
          ← رجوع
        </Link>
      </div>
      <h1 className="text-2xl font-black text-white mb-2">تعديل الصنف</h1>
      <p className="text-gray-400 text-sm mb-8">{data.name}</p>
      <MenuForm mode="edit" initialData={data} />
    </div>
  );
}
