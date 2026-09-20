"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, UtensilsCrossed, MessageCircle, Clock, Award, ShieldCheck } from "lucide-react";
import type { SiteConfig } from "@/data/siteConfig";

export default function Hero({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden bg-[#0b0c10]"
    >
      {/* Background ambient lighting and pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Right Column (Arabic RTL: Leading content) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-7 text-right flex flex-col items-start"
          >
            {/* Tag / Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{siteConfig.hero.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.25] tracking-tight mb-6">
              {siteConfig.hero.title}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 mt-2">
                {siteConfig.hero.highlight}
              </span>
            </h1>

            {/* Description */}
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mb-8">
              {siteConfig.hero.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
              <a
                href={siteConfig.order.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-extrabold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{siteConfig.hero.primaryCta}</span>
              </a>

              <Link
                href="#menu"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full text-base font-bold text-white bg-white/5 hover:bg-white/10 border border-white/15 hover:border-amber-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <UtensilsCrossed className="w-5 h-5 text-amber-400" />
                <span>{siteConfig.hero.secondaryCta}</span>
              </Link>
            </div>

            {/* Highlights Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 w-full">
              {siteConfig.hero.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-extrabold text-amber-400">
                    {stat.value}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Left Column (Editorial Visual Composition) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative background aura */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 via-red-500/20 to-transparent rounded-3xl blur-2xl transform rotate-3" />

              {/* Main Dish Presentation Card */}
              <div className="relative rounded-3xl overflow-hidden glass-panel p-3 border border-amber-500/30 shadow-2xl">
                <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden group">
                  <Image
                    src={siteConfig.branding.heroImage}
                    alt="أشهى صواني الشريعى الملكية"
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Overlaid Badges */}
                  <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                    <span>🔥 الأكثر طلباً</span>
                  </div>

                  <div className="absolute bottom-4 right-4 left-4 text-right">
                    <span className="text-xs text-amber-400 font-bold tracking-wide">
                      صينية البروست والزنجر الملكية
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      قرمشة خيالية مع صوص الشيدر والتايجر
                    </h3>
                  </div>
                </div>

                {/* Floating Micro-Card: Fresh Daily */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-6 -right-6 hidden sm:flex items-center gap-3 bg-[#161722]/95 backdrop-blur-md border border-amber-500/30 p-3.5 rounded-2xl shadow-xl z-20"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">دجاج طازج 100%</span>
                    <span className="text-[11px] text-gray-400">بدون مفروم أو مجمدات</span>
                  </div>
                </motion.div>

                {/* Floating Micro-Card: Fast Delivery */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute -top-6 -left-6 hidden sm:flex items-center gap-3 bg-[#161722]/95 backdrop-blur-md border border-red-500/30 p-3.5 rounded-2xl shadow-xl z-20"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-white block">توصيل دليفري سريع</span>
                    <span className="text-[11px] text-gray-400">يصلك ساخناً ومقرمشاً</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
