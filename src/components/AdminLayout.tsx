"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Gift,
  Plus,
  Settings,
  LogOut,
  Flame,
  Utensils,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/auth";

const navLinks = [
  { href: "/admin", icon: <LayoutDashboard className="w-4 h-4" />, label: "لوحة التحكم" },
  { href: "/admin/offers", icon: <Gift className="w-4 h-4" />, label: "العروض" },
  { href: "/admin/offers/new", icon: <Plus className="w-4 h-4" />, label: "إضافة عرض" },
  { href: "/admin/menu", icon: <Utensils className="w-4 h-4" />, label: "القائمة" },
  { href: "/admin/menu/new", icon: <Plus className="w-4 h-4" />, label: "إضافة صنف" },
  { href: "/admin/settings", icon: <Settings className="w-4 h-4" />, label: "إعدادات الموقع" },
];

function AdminNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && !pathname.startsWith("/admin/login")) {
      router.replace("/admin/login");
    }
  }, [loading, user, router, pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
    <div className="min-h-screen bg-[#0b0c10]">
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden fixed top-3 right-3 z-50 p-2.5 bg-[#0e0f14]/90 backdrop-blur-md rounded-xl border border-white/10 text-white"
        aria-label="فتح القائمة"
      >
        <Menu className="w-5 h-5" />
      </button>

      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 right-0 bottom-0 z-50 bg-[#0e0f14] border-l border-white/10 flex flex-col
          w-72 sm:w-80 lg:w-64
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          lg:flex
        `}
      >
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 left-4 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="إغلاق القائمة"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pt-14 lg:pt-6 border-b border-white/10">
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span>مطعم الشريعى</span>
          </h1>
          <p className="text-xs text-amber-400/80 mt-1">لوحة التحكم الإدارية</p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navLinks.map((link) => (
            <AdminNavLink key={link.href} {...link} />
          ))}
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

      <main className="flex-1 min-h-screen lg:mr-64">{children}</main>
    </div>
  );
}
