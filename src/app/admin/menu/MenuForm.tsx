"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Save, ArrowLeft, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { MenuItemRow } from "@/lib/menuMapping";

interface MenuFormProps {
  mode: "create" | "edit";
  initialData?: MenuItemRow | null;
}

const CATEGORIES = [
  { value: "chicken", label: "ساندوتشات فراخ" },
  { value: "beef", label: "ساندوتشات لحمة" },
  { value: "broast", label: "وجبات بروست" },
  { value: "zinger", label: "وجبات زنجر" },
  { value: "combos", label: "عروض التوفير" },
  { value: "sides", label: "المقبلات والصوصات" },
  { value: "drinks", label: "المشروبات" },
];

const SPICE_LEVELS = [
  { value: "regular", label: "عادي" },
  { value: "spicy", label: "حار" },
  { value: "none", label: "بدون" },
];

export default function MenuForm({ mode, initialData }: MenuFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    old_price: string;
    image: string;
    category: string;
    category_name: string;
    badge: string;
    featured: boolean;
    enabled: boolean;
    sort_order: string;
    ingredients: string;
    spice_level: string;
  }>({
    name: initialData?.name ?? "",
    description: initialData?.description ?? "",
    price: initialData?.price?.toString() ?? "",
    old_price: initialData?.old_price?.toString() ?? "",
    image: initialData?.image ?? "",
    category: initialData?.category ?? "chicken",
    category_name: initialData?.category_name ?? "",
    badge: initialData?.badge ?? "",
    featured: initialData?.featured ?? false,
    enabled: initialData?.enabled ?? true,
    sort_order: initialData?.sort_order?.toString() ?? "0",
    ingredients: initialData?.ingredients?.join("\n") ?? "",
    spice_level: initialData?.spice_level ?? "regular",
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
      const uniqueName = `menu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
      const filePath = `items/${uniqueName}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("menu-images").getPublicUrl(filePath);
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

    if (!formData.name.trim()) {
      setError("الاسم مطلوب");
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
    if (!formData.category) {
      setError("التصنيف مطلوب");
      setLoading(false);
      return;
    }
    if (!formData.category_name.trim()) {
      setError("اسم التصنيف مطلوب");
      setLoading(false);
      return;
    }

    try {
      const url = mode === "create" ? "/api/menu" : `/api/menu/${initialData!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const ingredients = formData.ingredients.split("\n").filter((i: string) => i.trim());

      const body: Record<string, unknown> = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        old_price: formData.old_price ? Number(formData.old_price) : null,
        image: formData.image || null,
        category: formData.category,
        category_name: formData.category_name,
        badge: formData.badge || null,
        featured: formData.featured,
        enabled: formData.enabled,
        sort_order: Number(formData.sort_order) || 0,
        ingredients: ingredients.length > 0 ? ingredients : null,
        spice_level: formData.spice_level || null,
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

      router.push("/admin/menu");
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

      {/* Name */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">اسم الصنف *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
          required
          placeholder="مثال: ساندوتش هرم فراخ"
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
          placeholder="وصف الصنف..."
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all resize-y"
        />
      </div>

      {/* Price and Old Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">السعر *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
            required
            min="1"
            placeholder="290"
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
            placeholder="330"
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">ترتيب العرض</label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) => setFormData((p) => ({ ...p, sort_order: e.target.value }))}
            min="0"
            placeholder="0"
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Category Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">التصنيف *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
            required
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all appearance-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1.5">اسم التصنيف *</label>
          <input
            type="text"
            value={formData.category_name}
            onChange={(e) => setFormData((p) => ({ ...p, category_name: e.target.value }))}
            required
            placeholder="مثال: ساندوتشات فراخ"
            className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Spice Level */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">مستوى التوابل</label>
        <select
          value={formData.spice_level}
          onChange={(e) => setFormData((p) => ({ ...p, spice_level: e.target.value }))}
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white outline-none transition-all appearance-none"
        >
          {SPICE_LEVELS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Badge */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">الشارة</label>
        <input
          type="text"
          value={formData.badge}
          onChange={(e) => setFormData((p) => ({ ...p, badge: e.target.value }))}
          placeholder="🔥 الأكثر طلباً"
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
        />
      </div>

      {/* Ingredients */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">المكونات (كل مكون في سطر منفصل)</label>
        <textarea
          value={formData.ingredients}
          onChange={(e) => setFormData((p) => ({ ...p, ingredients: e.target.value }))}
          rows={3}
          placeholder="دجاج فيليه 360 جم&#10;عيش راوند 4 طبقات&#10;موتزريلا مقلية"
          className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all resize-y"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1.5">صورة الصنف</label>
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

      {/* Featured Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setFormData((p) => ({ ...p, featured: !p.featured }))}
          className={`relative w-12 h-6 rounded-full transition-colors ${formData.featured ? "bg-amber-500" : "bg-gray-600"}`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.featured ? "left-7" : "left-1"}`}
          />
        </button>
        <span className="text-sm text-gray-300">{formData.featured ? "مميز" : "عادي"}</span>
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
          onClick={() => router.push("/admin/menu")}
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
          {mode === "create" ? "حفظ الصنف" : "تحديث الصنف"}
        </button>
      </div>
    </form>
  );
}
