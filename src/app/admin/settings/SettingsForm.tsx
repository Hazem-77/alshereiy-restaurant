"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft, CheckCircle2, Plus, Trash2 } from "lucide-react";

interface SettingsFormProps {
  initialData: Record<string, unknown> | null;
}

interface HeroStat {
  value: string;
  label: string;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    if (initialData) {
      for (const [key, value] of Object.entries(initialData)) {
        base[key] = value !== null && value !== undefined ? String(value) : "";
      }
    }
    return base;
  });

  const [heroStats, setHeroStats] = useState<HeroStat[]>(() => {
    try {
      const stats = initialData?.hero_stats;
      if (stats) {
        const parsed = JSON.parse(
          typeof stats === "string" ? stats : JSON.stringify(stats),
        );
        if (Array.isArray(parsed)) {
          return parsed.map((s: { value?: string; label?: string }) => ({
            value: s.value ?? "",
            label: s.label ?? "",
          }));
        }
      }
    } catch {
      // ignore parse errors
    }
    return [];
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleStatsChange = (
    index: number,
    field: "value" | "label",
    value: string,
  ) => {
    setHeroStats((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setSuccess(false);
  };

  const addStat = () => {
    setHeroStats((prev) => [...prev, { value: "", label: "" }]);
    setSuccess(false);
  };

  const removeStat = (index: number) => {
    setHeroStats((prev) => prev.filter((_, i) => i !== index));
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const heroStatsJson = JSON.stringify(heroStats);

    const body: Record<string, unknown> = { ...formData, hero_stats: heroStatsJson };

    try {
      const res = await fetch("/api/site-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ");
        return;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch {
      setError("حدث خطأ في الشبكة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> تم الحفظ بنجاح
        </div>
      )}

      {/* Restaurant Info */}
      <section className="glass-panel rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-black text-white mb-4">معلومات المطعم</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">اسم المطعم *</label>
            <input
              type="text"
              value={formData.name ?? ""}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">الاسم المختصر</label>
            <input
              type="text"
              value={formData.short_name ?? ""}
              onChange={(e) => handleChange("short_name", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">الوصف التعريفي</label>
            <textarea
              value={formData.tagline ?? ""}
              onChange={(e) => handleChange("tagline", e.target.value)}
              rows={2}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all resize-y"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">الوصف الكامل</label>
            <textarea
              value={formData.description ?? ""}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all resize-y"
            />
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="glass-panel rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-black text-white mb-4">القسم الرئيسي (Hero)</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">الشارة</label>
            <input
              type="text"
              value={formData.hero_badge ?? ""}
              onChange={(e) => handleChange("hero_badge", e.target.value)}
              placeholder="🔥 طعم يستحق التجربة"
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">العنوان</label>
            <input
              type="text"
              value={formData.hero_title ?? ""}
              onChange={(e) => handleChange("hero_title", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">العنوان المميز</label>
            <input
              type="text"
              value={formData.hero_highlight ?? ""}
              onChange={(e) => handleChange("hero_highlight", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">الوصف</label>
            <textarea
              value={formData.hero_description ?? ""}
              onChange={(e) => handleChange("hero_description", e.target.value)}
              rows={2}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all resize-y"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">زر الدعوة الأول</label>
              <input
                type="text"
                value={formData.hero_primary_cta ?? ""}
                onChange={(e) => handleChange("hero_primary_cta", e.target.value)}
                placeholder="اطلب الآن عبر واتساب"
                className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5">زر الدعوة الثاني</label>
              <input
                type="text"
                value={formData.hero_secondary_cta ?? ""}
                onChange={(e) => handleChange("hero_secondary_cta", e.target.value)}
                placeholder="استكشف قائمة الطعام"
                className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Hero Stats */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2">الإحصائيات</label>
            <div className="space-y-3">
              {heroStats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatsChange(index, "value", e.target.value)}
                    placeholder="القيمة"
                    className="flex-1 bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatsChange(index, "label", e.target.value)}
                    placeholder="الوصف"
                    className="flex-1 bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-2.5 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => removeStat(index)}
                    className="p-2.5 text-gray-400 hover:text-red-400 transition-colors"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addStat}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-amber-400 hover:bg-amber-500/10 transition-colors"
            >
              <Plus className="w-4 h-4" />
              إضافة إحصائية
            </button>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="glass-panel rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-black text-white mb-4">التواصل</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">الهاتف</label>
            <input
              type="text"
              value={formData.contact_phone ?? ""}
              onChange={(e) => handleChange("contact_phone", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">عرض الهاتف</label>
            <input
              type="text"
              value={formData.contact_phone_display ?? ""}
              onChange={(e) => handleChange("contact_phone_display", e.target.value)}
              placeholder="0120 - 869 - 6419"
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">واتساب</label>
            <input
              type="text"
              value={formData.contact_whatsapp ?? ""}
              onChange={(e) => handleChange("contact_whatsapp", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">عرض واتساب</label>
            <input
              type="text"
              value={formData.contact_whatsapp_display ?? ""}
              onChange={(e) => handleChange("contact_whatsapp_display", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-400 mb-1.5">العنوان</label>
            <input
              type="text"
              value={formData.contact_address ?? ""}
              onChange={(e) => handleChange("contact_address", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">المدينة</label>
            <input
              type="text"
              value={formData.contact_city ?? ""}
              onChange={(e) => handleChange("contact_city", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">الدولة</label>
            <input
              type="text"
              value={formData.contact_country ?? ""}
              onChange={(e) => handleChange("contact_country", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">رابط الخريطة</label>
            <input
              type="text"
              value={formData.contact_google_maps_url ?? ""}
              onChange={(e) => handleChange("contact_google_maps_url", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">أوقات العمل - الأيام</label>
            <input
              type="text"
              value={formData.contact_opening_hours_days ?? ""}
              onChange={(e) => handleChange("contact_opening_hours_days", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">أوقات العمل - الساعات</label>
            <input
              type="text"
              value={formData.contact_opening_hours_hours ?? ""}
              onChange={(e) => handleChange("contact_opening_hours_hours", e.target.value)}
              placeholder="من الساعة 12:30 ظهراً حتى 2:30 صباحاً"
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="glass-panel rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-black text-white mb-4">وسائل التواصل الاجتماعي</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">فيسبوك</label>
            <input
              type="text"
              value={formData.social_facebook ?? ""}
              onChange={(e) => handleChange("social_facebook", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">إنستغرام</label>
            <input
              type="text"
              value={formData.social_instagram ?? ""}
              onChange={(e) => handleChange("social_instagram", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">تيك توك</label>
            <input
              type="text"
              value={formData.social_tiktok ?? ""}
              onChange={(e) => handleChange("social_tiktok", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Ordering */}
      <section className="glass-panel rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-black text-white mb-4">الطلب</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">رسالة واتساب الافتراضية</label>
            <input
              type="text"
              value={formData.order_default_whatsapp_message ?? ""}
              onChange={(e) => handleChange("order_default_whatsapp_message", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">رابط الطلب</label>
            <input
              type="text"
              value={formData.order_url ?? ""}
              onChange={(e) => handleChange("order_url", e.target.value)}
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Branding / Images */}
      <section className="glass-panel rounded-3xl border border-white/10 p-6">
        <h2 className="text-lg font-black text-white mb-4">الهوية البصرية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">شعار المطعم</label>
            <input
              type="text"
              value={formData.branding_logo_image ?? ""}
              onChange={(e) => handleChange("branding_logo_image", e.target.value)}
              placeholder="/images/logo/logo-emblem.jpg"
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">صورة اللافتة</label>
            <input
              type="text"
              value={formData.branding_store_sign_image ?? ""}
              onChange={(e) => handleChange("branding_store_sign_image", e.target.value)}
              placeholder="/images/logo/store-sign.jpg"
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">صورة البانر</label>
            <input
              type="text"
              value={formData.branding_hero_image ?? ""}
              onChange={(e) => handleChange("branding_hero_image", e.target.value)}
              placeholder="/images/hero/hero-platter.jpg"
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1.5">صورة الواجهة</label>
            <input
              type="text"
              value={formData.branding_storefront_image ?? ""}
              onChange={(e) => handleChange("branding_storefront_image", e.target.value)}
              placeholder="/images/storefront/facade.jpg"
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
            />
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          رجوع
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-2.5 rounded-xl text-sm font-black text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? "جارٍ الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </form>
  );
}
