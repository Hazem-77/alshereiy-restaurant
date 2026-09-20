"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Star, MessageCircle, ArrowLeft } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import type { SiteConfig } from "@/data/siteConfig";
import { formatPrice, createWhatsAppUrl } from "@/lib/utils";

interface FeaturedItemsProps {
  siteConfig: SiteConfig;
  menuItems: MenuItem[];
}

export default function FeaturedItems({ siteConfig, menuItems }: FeaturedItemsProps) {
  const featuredList = menuItems.filter((item) => item.featured);

  return (
    <section id="featured" className="py-20 bg-[#0b0c10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-3">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>اختيارات عشاق الشريعى</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              الأطباق الأكثر طلباً
            </h2>
            <p className="mt-2 text-gray-400 text-sm sm:text-base max-w-xl">
              أصناف متميزة حازت على إعجاب آلاف العملاء بفضل المذاق الفريد والمكونات الممتازة.
            </p>
          </div>

          <a
            href="#menu"
            className="hidden md:inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>عرض كل الأصناف في المنيو</span>
            <ArrowLeft className="w-4 h-4" />
          </a>
        </div>

        {/* Editorial Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredList.map((item, index) => {
            const itemOrderMsg = `مرحباً مطعم الشريعى، أريد طلب: ${item.name} (${item.price} ج.م)`;
            const itemWhatsAppUrl = createWhatsAppUrl(siteConfig.contact.whatsapp, itemOrderMsg);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-3xl glass-panel p-4 sm:p-5 flex flex-col justify-between glass-panel-hover"
              >
                {/* Image Container */}
                <div className="relative h-60 w-full rounded-2xl overflow-hidden mb-5 border border-white/5">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transform group-hover:scale-108 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Badge */}
                  {item.badge && (
                    <div className="absolute top-3 right-3 bg-red-600/95 backdrop-blur-sm text-white text-xs font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      <span>{item.badge}</span>
                    </div>
                  )}

                  {/* Price Tag Overlay */}
                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-amber-500/40 text-left">
                    <span className="text-base font-black text-amber-400">
                      {formatPrice(item.price)}
                    </span>
                    {item.oldPrice && (
                      <span className="block text-[11px] text-gray-400 line-through">
                        {formatPrice(item.oldPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="text-right flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-amber-400/80 font-medium">
                        {item.categoryName}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Order Button */}
                  <div className="pt-5 mt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-gray-500 block">السعر الصافي</span>
                      <span className="text-lg font-black text-white">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <a
                      href={itemWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-black bg-amber-500 hover:bg-amber-400 transition-all shadow-md hover:shadow-amber-500/20 active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>اطلب الآن</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
