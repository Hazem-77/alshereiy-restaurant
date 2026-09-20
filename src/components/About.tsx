"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Sparkles, Flame, CheckCircle } from "lucide-react";
import type { SiteConfig } from "@/data/siteConfig";

export default function About({ siteConfig }: { siteConfig: SiteConfig }) {
  const pillars = [
    {
      title: "دجاج بلدي طازج 100%",
      desc: "نعتمد فقط على صدور وأوراك الدجاج الطازج المذبوح يومياً، بلا مفروم أو لحوم مجمدة.",
      icon: ShieldCheck,
    },
    {
      title: "خلطات وتتبيلات حصرية",
      desc: "تتبيلة سرية تم ابتكارها وتطويرها بعناية لتعطيك قرمشة ذهبية لا تُنسى ونكهة عميقة حتى العظم.",
      icon: Flame,
    },
    {
      title: "زيوت نظيفة وصحية",
      desc: "نستخدم زيوت نباتية مصفاة مع مراقبة درجات حرارة القلي بدقة متناهية لمنع تشرب الزيت.",
      icon: Sparkles,
    },
    {
      title: "ضيافة واحترام للعميل",
      desc: "كل وجبة تخرج من مطبخنا تُعامل كأول وجبة نقدمها لأعز ضيوفنا، وبسرعة توصيل قياسية.",
      icon: HeartHandshake,
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#0b0c10] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Storefront Image Composition */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden glass-panel p-3 border border-amber-500/30 shadow-2xl">
              <div className="relative h-96 sm:h-[480px] w-full rounded-2xl overflow-hidden group">
                <Image
                  src={siteConfig.branding.storefrontImage}
                  alt="واجهة مطعم الشريعى الحقيقية"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Overlaid Tag */}
                <div className="absolute bottom-6 right-6 left-6 text-right">
                  <div className="inline-block bg-amber-500 text-black text-xs font-black px-3 py-1 rounded-full mb-2">
                    فرعنا الرئيسي
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    مطعم الشريعى - فرايد تشكن إيجبت
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    أحدث المعدات ونظام مطبخ مفتوح يضمن أعلى درجات النظافة والاحترافية.
                  </p>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-amber-600 text-white p-3.5 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2">
                <Flame className="w-5 h-5 fill-current" />
                <span>أعلى تقييم محلي</span>
              </div>
            </div>
          </motion.div>

          {/* Story & Values Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 text-right"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-4">
              <Sparkles className="w-4 h-4" />
              <span>عن مطعم الشريعى</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
              قصتنا بدأت بشغف تقديم
              <span className="block text-amber-400">القرمشة الحقيقية والمذاق الفريد</span>
            </h2>

            <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8">
              في مطعم الشريعى، لا نؤمن بأن الوجبات السريعة تعني التنازل عن الجودة. بدأنا بهدف واضح: تقديم فرايد تشكن وبورجر بمستوى المطاعم العالمية الفاخرة ولكن بنكهة مصرية أصيلة وبأسعار في متناول الجميع.
            </p>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {pillars.map((pillar, i) => {
                const IconComponent = pillar.icon;
                return (
                  <div key={i} className="p-4 rounded-2xl bg-[#14151f] border border-white/5 text-right">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 mb-3">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5">{pillar.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <a
                href={siteConfig.order.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-extrabold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
              >
                <span>جرّب بنفسك الآن</span>
                <Flame className="w-4 h-4 fill-black" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
