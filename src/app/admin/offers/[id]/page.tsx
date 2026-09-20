export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import { createClient } from "@/lib/supabase/client";
import OfferForm from "../OfferForm";
import type { Offer } from "@/lib/offerUtils";

export default async function EditOfferPage({
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
  const { data } = await supabase.from("offers").select("*").eq("id", id).single();

  if (!data) {
    redirect("/admin/offers");
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/offers"
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
        >
          ← رجوع
        </Link>
      </div>
      <h1 className="text-2xl font-black text-white mb-2">تعديل العرض</h1>
      <p className="text-gray-400 text-sm mb-8">{data.title}</p>
      <OfferForm mode="edit" initialData={data as Offer} />
    </div>
  );
}
