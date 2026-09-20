export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/auth-server";
import OfferForm from "../OfferForm";

export default async function NewOfferPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/offers"
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white bg-white/5 border border-white/10 transition-colors"
        >
          ← رجوع
        </Link>
      </div>
      <h1 className="text-2xl font-black text-white mb-2">إضافة عرض جديد</h1>
      <p className="text-gray-400 text-sm mb-8">أضف عرض جديد إلى النظام</p>
      <OfferForm mode="create" />
    </div>
  );
}
