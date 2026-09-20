"use client";

import { useMenu } from "@/hooks/useMenu";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { MenuItemRow } from "@/lib/menuMapping";
import {
  AlertTriangle,
  CheckCircle2,
  Edit3,
  Loader2,
  Plus,
  Trash2,
  ToggleLeft,
  Utensils,
} from "lucide-react";

export default function DashboardContent() {
  const { menuItems, loading, error, refetch, stats } = useMenu();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled }),
      });
      if (res.ok) {
        refetch();
      } else {
        const data = await res.json();
        alert(data.error || "فشل تحديث الصنف");
      }
    } catch {
      alert("فشل تحديث الصنف");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteConfirm(null);
        refetch();
      } else {
        const data = await res.json();
        alert(data.error || "فشل حذف الصنف");
      }
    } catch {
      alert("فشل حذف الصنف");
    }
  };

  const getStatus = (item: MenuItemRow) => {
    if (!item.enabled)
      return {
        label: "معطل",
        icon: <ToggleLeft className="w-3 h-3" />,
        color: "text-gray-500 bg-gray-500/10",
      };
    if (item.featured)
      return {
        label: "مميز",
        icon: <CheckCircle2 className="w-3 h-3" />,
        color: "text-amber-400 bg-amber-400/10",
      };
    return {
      label: "نشط",
      icon: <CheckCircle2 className="w-3 h-3" />,
      color: "text-emerald-400 bg-emerald-400/10",
    };
  };

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400 text-lg font-bold mb-2">
          خطأ في تحميل البيانات
        </div>
        <p className="text-gray-400 text-sm mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-amber-500 text-black rounded-xl font-bold"
        >
          إعادة تحميل
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white">إدارة القائمة</h1>
          <p className="text-gray-400 text-sm mt-1">
            إدارة جميع أصناف قائمة الطعام
          </p>
        </div>
        <Link
          href="/admin/menu/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 transition-all"
        >
          <Plus className="w-4 h-4" />
          إضافة صنف
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="إجمالي الأصناف"
          value={stats.total}
          icon={<Utensils className="w-5 h-5 text-amber-500" />}
          bg="bg-amber-500/10"
        />
        <StatCard
          label="الأصناف المميزة"
          value={stats.featured}
          icon={<CheckCircle2 className="w-5 h-5 text-amber-500" />}
          bg="bg-amber-500/10"
        />
        <StatCard
          label="معطل"
          value={stats.total - stats.enabled}
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          bg="bg-red-500/10"
        />
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-black text-white">جميع الأصناف</h2>
          <span className="text-xs text-gray-500">{stats.total} صنف</span>
        </div>

        {loading ? (
          <div className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : menuItems.length === 0 ? (
          <div className="p-12 text-center">
            <Utensils className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-gray-400 font-bold">لا توجد أصناف بعد</p>
            <Link
              href="/admin/menu/new"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300"
            >
              <Plus className="w-4 h-4" /> إضافة أول صنف
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-right">
                  <th className="p-4 text-xs font-bold text-gray-500">الصورة</th>
                  <th className="p-4 text-xs font-bold text-gray-500">الاسم</th>
                  <th className="p-4 text-xs font-bold text-gray-500">التصنيف</th>
                  <th className="p-4 text-xs font-bold text-gray-500">السعر</th>
                  <th className="p-4 text-xs font-bold text-gray-500">الحالة</th>
                  <th className="p-4 text-xs font-bold text-gray-500 text-center">
                    إجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => {
                  const status = getStatus(item);
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-4">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 text-xs">
                            صورة
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="text-sm font-bold text-white">
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">
                          {item.description}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-300">
                          {item.category_name}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-bold text-amber-400">
                          {item.price} ج.م
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggle(item.id, item.enabled)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status.color} transition-colors`}
                        >
                          {status.icon}
                          {status.label}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/menu/${item.id}`}
                            className="p-2 text-gray-400 hover:text-amber-400 transition-colors"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#12131a] border border-white/10 rounded-3xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-black text-white">تأكيد الحذف</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              هل أنت متأكد من حذف هذا الصنف؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-black bg-red-500 hover:bg-red-400 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className={`glass-panel rounded-2xl p-5 border border-white/10 ${bg}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-400">{label}</span>
        <span className={`p-2 rounded-xl ${bg}`}>{icon}</span>
      </div>
      <div className="text-3xl font-black text-white mt-2">{value}</div>
    </div>
  );
}
