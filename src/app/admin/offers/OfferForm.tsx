"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Save, ArrowLeft, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Offer } from "@/lib/offerUtils";

interface OfferFormProps {
  mode: "create" | "edit";
  initialData?: Offer;
}

export default function OfferForm({ mode, initialData }: OfferFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    subtitle: string;
    description: string;
    discount: string;
    price: string;
    old_price: string;
    image: string;
    start_date: string;
    end_date: string;
    badge: string;
    cta_text: string;
    enabled: boolean;
    features: string;
  }>({
    title: initialData?.title ?? "",
    subtitle: initialData?.subtitle ?? "",
    description: initialData?.description ?? "",
    discount: initialData?.discount ?? "",
    price: initialData?.price?.toString() ?? "",
    old_price: initialData?.oldPrice?.toString() ?? "",
    image: initialData?.image ?? "",
    start_date: initialData?.startDate ? initialData.startDate.split("T")[0] : "",
    end_date: initialData?.endDate ? initialData.endDate.split("T")[0] : "",
    badge: initialData?.badge ?? "",
    cta_text: initialData?.ctaText ?? "اطلب هذا العرض الآن",
    enabled: initialData?.enabled ?? true,
    features: initialData?.features?.join("\n") ?? "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      setError("صيغة الصورة غير مدعومة. استخدم JPEG أو PNG أو WebP.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `offers/${uniqueName}`;

      const { error: uploadError } = await supabase.storage
        .from("offer-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("offer-images").getPublicUrl(filePath);
      setFormData((prev) => ({ ...prev, image: publicUrl }));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.title.trim()) {
      setError("العنوان مطلوب");
      setLoading(false);
      return;
    }
    if (!formData.description.trim()) {
      setError("الوصف مطلوب");
      setLoading(false);
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setError("السعر مطلوب ويجب أن يكون أكبر من صفر");
      setLoading(false);
      return;
    }
    if (!formData.start_date) {
      setError("تاريخ البداية مطلوب");
      setLoading(false);
      return;
    }
    if (!formData.end_date) {
      setError("تاريخ النهاية مطلوب");
      setLoading(false);
      return;
    }
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setError("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      setLoading(false);
      return;
    }

    try {
      const url = mode === "create" ? "/api/offers" : `/api/offers/${initialData!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const features = formData.features.split("\n").filter((f) => f.trim());

      const body: Record<string, unknown> = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description,
        discount: formData.discount || null,
        price: Number(formData.price),
        old_price: formData.old_price ? Number(formData.old_price) : null,
        image: formData.image || null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        badge: formData.badge || null,
        cta_text: formData.cta_text || null,
        enabled: formData.enabled,
        features,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "حدث خطأ");
        setLoading(false);
        return;
      }

      router.push("/admin/offers");
      router.refresh();
    } catch {
      setError("حدث خطأ في الشبكة");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> تم رفع الصورة بنجاح
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">عنوان العرض *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
          required
          placeholder="مثال: عرض القرمشة الملكي"
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">العنوان الفرعي</label>
        <input
          type="text"
          value={formData.subtitle}
          onChange={(e) => setFormData((p) => ({ ...p, subtitle: e.target.value }))}
          placeholder="توفير 120 ج.م على الوجبة العائلية"
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">الوصف *</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
          required
          rows={3}
          placeholder="وصف العرض..."
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all resize-y"
        />
      </div>

      {/* Price and Discount Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">السعر *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
            required
            min="1"
            placeholder="500"
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">السعر القديم</label>
          <input
            type="number"
            value={formData.old_price}
            onChange={(e) => setFormData((p) => ({ ...p, old_price: e.target.value }))}
            min="0"
            placeholder="620"
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">الخصم</label>
          <input
            type="text"
            value={formData.discount}
            onChange={(e) => setFormData((p) => ({ ...p, discount: e.target.value }))}
            placeholder="خصم 20%"
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Badge */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">الشارة</label>
        <input
          type="text"
          value={formData.badge}
          onChange={(e) => setFormData((p) => ({ ...p, badge: e.target.value }))}
          placeholder="🔥 العرض الأقوى"
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
        />
      </div>

      {/* CTA Text */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">نص زر الدعوة للإجراء</label>
        <input
          type="text"
          value={formData.cta_text}
          onChange={(e) => setFormData((p) => ({ ...p, cta_text: e.target.value }))}
          placeholder="اطلب هذا العرض الآن"
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">تاريخ البداية *</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData((p) => ({ ...p, start_date: e.target.value }))}
            required
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">تاريخ النهاية *</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData((p) => ({ ...p, end_date: e.target.value }))}
            required
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all"
          />
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">صورة العرض</label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
            {formData.image ? (
              <Image
                src={formData.image}
                alt="preview"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="w-8 h-8 text-gray-600" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-amber-500 file:text-black file:text-xs file:font-bold cursor-pointer"
            />
            {uploading && <span className="text-xs text-amber-400">جار الرفع...</span>}
          </div>
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">المميزات (كل ميزة في سطر منفصل)</label>
        <textarea
          value={formData.features}
          onChange={(e) => setFormData((p) => ({ ...p, features: e.target.value }))}
          rows={4}
          placeholder="3 قطع دجاج بروست مقلي&#10;1 باكت بطاطس عائلي&#10;1 أرز بسمتي كبير&#10;4 صوص شيدر"
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all resize-y"
        />
      </div>

      {/* Enabled Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFormData((p) => ({ ...p, enabled: !p.enabled }))}
          className={`relative w-12 h-6 rounded-full transition-colors ${formData.enabled ? "bg-emerald-500" : "bg-gray-600"}`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.enabled ? "left-7" : "left-1"}`}
          />
        </button>
        <span className="text-sm text-gray-300">{formData.enabled ? "مفعل" : "معطل"}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/offers")}
          className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          رجوع
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="px-8 py-2.5 rounded-xl text-sm font-black text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {mode === "create" ? "حفظ العرض" : "تحديث العرض"}
        </button>
      </div>
    </form>
  );
}
