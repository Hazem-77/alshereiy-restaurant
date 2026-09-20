"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  Plus,
  Settings,
  LogOut,
  Flame,
  Utensils,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith("/admin/login")) {
      router.replace("/admin/login");
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center">
        <div className="text-amber-500 font-bold text-xl animate-pulse">
          جاري التحميل...
        </div>
      </div>
    );
  }

  if (!user && !pathname.startsWith("/admin/login")) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex">
      <aside className="w-64 bg-[#0e0f14] border-r border-white/10 flex flex-col fixed inset-y-0 right-0 z-40">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>مطعم الشريعى</span>
          </h1>
          <p className="text-xs text-amber-400/80 mt-1">لوحة التحكم الإدارية</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <AdminNavLink href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="لوحة التحكم" />
          <AdminNavLink href="/admin/offers" icon={<Gift className="w-4 h-4" />} label="العروض" />
          <AdminNavLink href="/admin/offers/new" icon={<Plus className="w-4 h-4" />} label="إضافة عرض" />
          <AdminNavLink href="/admin/menu" icon={<Utensils className="w-4 h-4" />} label="القائمة" />
          <AdminNavLink href="/admin/menu/new" icon={<Plus className="w-4 h-4" />} label="إضافة صنف" />
          <AdminNavLink href="/admin/settings" icon={<Settings className="w-4 h-4" />} label="إعدادات الموقع" />
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل خروج</span>
          </button>
          <div className="mt-3 text-xs text-gray-500 text-center truncate">
            {user?.email}
          </div>
        </div>
      </aside>

      <main className="flex-1 mr-64 min-h-screen">{children}</main>
    </div>
  );
}

function AdminNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-300 hover:text-amber-400 hover:bg-amber-500/5 rounded-xl transition-colors"
    >
      <span className="text-amber-500/70">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
