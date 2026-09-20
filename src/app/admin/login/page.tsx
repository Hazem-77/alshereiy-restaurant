"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await login(email, password);
      if (authError) {
        setError(authError.message);
        return;
      }
      await refresh();
      try {
        router.push("/admin/offers");
      } catch {
      }
      try {
        // await router.refresh();
      } catch {
      }
    } catch {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c10] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white flex items-center justify-center gap-2 mb-2">
            <span className="text-amber-500">🔥</span>
            <span>مطعم الشريعى</span>
          </h1>
          <p className="text-amber-400/80 text-sm">لوحة التحكم الإدارية</p>
        </div>

        {/* Login Form */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10">
          <h2 className="text-xl font-black text-white text-center mb-6">
            تسجيل الدخول
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 text-right">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@alshereiy.com"
                className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1.5 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-xl py-3 px-4 pr-12 text-sm text-white placeholder-gray-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  dir="ltr"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-black text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageCircle className="w-4 h-4" />
              )}
              {loading ? "جاري تسجيل الدخول..." : "دخول"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          لا تملك حساباً؟ تواصل مع مدير النظام
        </p>
      </div>
    </div>
  );
}
