"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Phone, Menu, X, Flame, Sparkles } from "lucide-react";
import type { SiteConfig } from "@/data/siteConfig";

export default function Navbar({ siteConfig }: { siteConfig: SiteConfig }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "#hero" },
    { name: "العروض الحصرية", href: "#offers", badge: "جديد" },
    { name: "الأكثر طلباً", href: "#featured" },
    { name: "قائمة الطعام", href: "#menu" },
    { name: "قصتنا", href: "#about" },
    { name: "الصور", href: "#gallery" },
    { name: "آراء العملاء", href: "#testimonials" },
    { name: "تواصل معنا", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#0b0c10]/90 backdrop-blur-md border-b border-amber-500/20 py-3 shadow-2xl shadow-black/40"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="#hero" className="flex items-center gap-3 group">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-md group-hover:border-amber-400 transition-colors">
            <Image
              src={siteConfig.branding.logoImage}
              alt={siteConfig.name}
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-bold">
              {siteConfig.name}
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500 inline-block animate-pulse" />
            </span>
            <span className="text-[11px] text-amber-400/90 font-medium tracking-wide">
               فرايد تشكن إيجبت & برجر
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative text-sm font-medium text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 py-1"
            >
              {link.name}
              {link.badge && (
                <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Actions (Phone + Order CTA) */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={`tel:${siteConfig.contact.phone}`}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
            title="اتصل بنا هاتفياً"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>{siteConfig.contact.phoneDisplay}</span>
          </a>

          <a
            href={siteConfig.order.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 transition-all transform hover:scale-[1.03] shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>اطلب الآن</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href={siteConfig.order.orderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 text-xs font-bold text-black bg-amber-500 rounded-full shadow"
          >
            اطلب
          </a>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-300 hover:text-white bg-white/5 rounded-lg border border-white/10"
            aria-label="تبديل القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0b0c10]/95 backdrop-blur-xl border-b border-amber-500/20 px-6 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-semibold text-gray-200 hover:text-amber-400 py-2 border-b border-white/5"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}

            <div className="pt-3 flex flex-col gap-2">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-gray-200 bg-white/5 rounded-xl border border-white/10"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>اتصل بنا: {siteConfig.contact.phoneDisplay}</span>
              </a>
              <a
                href={siteConfig.order.orderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 text-sm font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-lg"
              >
                <Sparkles className="w-4 h-4" />
                <span>اطلب أونلاين عبر واتساب</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
