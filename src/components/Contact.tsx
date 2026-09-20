"use client";

import React from "react";
import { Phone, MessageCircle, MapPin, Clock, ExternalLink, Sparkles, Navigation } from "lucide-react";
import type { SiteConfig } from "@/data/siteConfig";

export default function Contact({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section id="contact" className="py-24 bg-[#0e0f14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Large Conversion CTA Card */}
        <div className="rounded-3xl bg-gradient-to-br from-amber-500/20 via-red-950/30 to-black/80 border border-amber-500/40 p-8 sm:p-12 lg:p-16 mb-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-black mb-6">
              <Sparkles className="w-4 h-4" />
              <span>توصيل سريع ساخن حتى باب بيتك</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6">
              جاهز تطلب أشهى وجبة النهاردة؟
            </h2>

            <p className="text-gray-300 text-base sm:text-lg mb-8 leading-relaxed">
              اختر وجبتك الآن وتواصل معنا مباشرة عبر واتساب لتسجيل طلبك فوراً واستمتع بأقوى مذاق مقرمش.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={siteConfig.order.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full text-base font-black text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-2xl shadow-amber-500/30 transition-transform transform hover:scale-[1.03] active:scale-95"
              >
                <MessageCircle className="w-5 h-5" />
                <span>اطلب الآن عبر واتساب</span>
              </a>

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 transition-all"
              >
                <Phone className="w-5 h-5 text-amber-400" />
                <span>اتصل بنا هاتفياً</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          {/* Phone / Call */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">أرقام التواصل والطلبات</h3>
              <p className="text-xs text-gray-400 mb-4">خدمة توصيل الطلبات وسرعة الرد على مدار ساعات العمل.</p>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-white/5">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="text-lg font-black text-amber-400 hover:text-amber-300 transition-colors"
                dir="ltr"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
              <span className="text-xs text-gray-500">متاح للمكالمات والواتساب</span>
            </div>
          </div>

          {/* Address & Maps */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center text-red-400 mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">موقع الفرع</h3>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">{siteConfig.contact.address}</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                <span>فتح الموقع في خرائط Google</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Working Hours */}
          <div className="p-8 rounded-3xl glass-panel border border-white/10 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">مواعيد العمل</h3>
              <p className="text-xs text-gray-400 mb-4">{siteConfig.contact.openingHours.days}</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <span className="text-sm font-bold text-amber-400 block">
                {siteConfig.contact.openingHours.hours}
              </span>
              <span className="text-xs text-emerald-400 mt-1 inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                مفتوح الآن لاستقبال طلباتكم
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
