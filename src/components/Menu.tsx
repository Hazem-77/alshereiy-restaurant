"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Search, MessageCircle } from "lucide-react";
import { menuCategories, MenuCategory } from "@/data/menu";
import { formatPrice, createWhatsAppUrl } from "@/lib/utils";
import type { MenuItem } from "@/data/menu";
import type { SiteConfig } from "@/data/siteConfig";

interface MenuProps {
  siteConfig: SiteConfig;
  menuItems: MenuItem[];
}

export default function Menu({ siteConfig, menuItems }: MenuProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory["id"]>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-24 bg-[#0e0f14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-3">
            <Utensils className="w-4 h-4 text-amber-400" />
            <span>قائمة طعام غنية ومتنوعة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            استكشف قائمة طعام الشريعى
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base">
            اختر وجبتك المفضلة المُعدة بأعلى معايير النظافة والجودة مع أشهى الصوصات والخلطات السرية.
          </p>
        </div>

        {/* Search Bar & Categories Navigation */}
        <div className="flex flex-col items-center gap-6 mb-12">
          {/* Quick Search */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن وجبة، ساندوتش، أو صوص..."
              className="w-full bg-[#181924] border border-white/10 focus:border-amber-500/60 rounded-full py-3.5 pr-12 pl-5 text-sm text-white placeholder-gray-500 outline-none transition-all shadow-inner"
            />
            <Search className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                مسح
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap w-full">
            {menuCategories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all relative ${
                    isActive
                      ? "text-black bg-amber-500 shadow-md shadow-amber-500/20"
                      : "text-gray-300 bg-[#161722] hover:bg-[#1d1f2d] border border-white/5 hover:border-white/15"
                  }`}
                >
                  {category.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryIndicator"
                      className="absolute inset-0 bg-amber-500 rounded-full -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Cards Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          <AnimatePresence>
            {filteredItems.map((item) => {
              const itemOrderMsg = `مرحباً مطعم الشريعى، أريد طلب: ${item.name} (${item.price} ج.م)`;
              const itemWhatsAppUrl = createWhatsAppUrl(siteConfig.contact.whatsapp, itemOrderMsg);

              return (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl glass-panel p-4 flex flex-col justify-between glass-panel-hover group"
                >
                  {/* Dish Image */}
                  <div className="relative h-44 w-full rounded-xl overflow-hidden mb-3.5 border border-white/5 bg-black/40">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {item.badge && (
                      <div className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow">
                        {item.badge}
                      </div>
                    )}

                    {item.oldPrice && (
                      <div className="absolute top-2 left-2 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full shadow">
                        توفير {item.oldPrice - item.price} ج.م
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="text-right flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] text-amber-400 font-semibold block mb-1">
                        {item.categoryName}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1.5 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <div className="flex flex-col text-right">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-amber-400">
                            {formatPrice(item.price)}
                          </span>
                          {item.oldPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatPrice(item.oldPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      <a
                        href={itemWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 transition-transform active:scale-95 shadow"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>اطلب</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Utensils className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p className="text-base font-bold text-gray-300">لم نتمكن من إيجاد أطباق تطابق بحثك</p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSearchQuery("");
              }}
              className="mt-3 text-sm text-amber-400 font-bold hover:underline"
            >
              عرض جميع الأصناف
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
