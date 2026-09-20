"use client";

import React, { useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import type { SiteConfig } from "@/data/siteConfig";

export default function FloatingWhatsApp({ siteConfig }: { siteConfig: SiteConfig }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip on Desktop */}
      <div
        className={`hidden md:flex items-center gap-2 bg-[#12131a] text-white text-xs font-bold px-4 py-2.5 rounded-2xl border border-emerald-500/40 shadow-xl transition-all duration-300 pointer-events-none ${
          showTooltip ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
        }`}
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        <span>اطلب الآن عبر واتساب واستلم ساخناً!</span>
      </div>

      {/* Floating Action Button */}
      <a
        href={siteConfig.order.orderUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 active:scale-95 animate-pulse-ring"
        aria-label="تواصل واطلب عبر واتساب"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white" />

        {/* Online Status Dot */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-emerald-300 border-2 border-black rounded-full" />
      </a>
    </div>
  );
}
