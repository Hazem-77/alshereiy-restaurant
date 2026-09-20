"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Clock, Sparkles, CheckCircle2, ArrowLeft, Tag } from "lucide-react";
import { offersData } from "@/data/offers";
import { isOfferActive, calculateTimeLeft, CountdownTime, Offer } from "@/lib/offerUtils";
import { formatPrice } from "@/lib/utils";

interface OfferSectionProps {
  initialOffers?: Offer[];
}

export default function OfferSection({ initialOffers }: OfferSectionProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [selectedOfferIndex, setSelectedOfferIndex] = useState(0);

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter active offers according to isOfferActive
  const offers = initialOffers ?? offersData;
  const activeOffers = offers.filter((offer) => isOfferActive(offer, currentTime));

  // If no active offers, hide section automatically as requested
  if (activeOffers.length === 0) {
    return null;
  }

  // Ensure index in bounds
  const currentOffer = activeOffers[selectedOfferIndex] || activeOffers[0];
  const timeLeft: CountdownTime = calculateTimeLeft(currentOffer.endDate, currentTime);

  return (
    <section id="offers" className="py-20 bg-[#0e0f14] relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs sm:text-sm font-black mb-4">
            <Flame className="w-4 h-4 text-red-500 fill-red-500 animate-bounce" />
            <span>عروض التوفير الخاصة والمحدودة</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            وفر مع أقوى عروض الشريعى
          </h2>
          <p className="mt-3 text-gray-400 text-base sm:text-lg">
            عروض حصرية لفترة محدودة بأعلى جودة وأوفر سعر لتستمتع بأشهى الوجبات مع عائلتك وأصحابك.
          </p>
        </div>

        {/* Offer selector tabs if multiple offers are active */}
        {activeOffers.length > 1 && (
          <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
            {activeOffers.map((offer, idx) => (
              <button
                key={offer.id}
                onClick={() => setSelectedOfferIndex(idx)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedOfferIndex === idx
                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/25 scale-105"
                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                }`}
              >
                {offer.title}
              </button>
            ))}
          </div>
        )}

        {/* Selected Offer Showcase Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentOffer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl glass-panel border border-amber-500/30 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Offer Info & Details */}
              <div className="lg:col-span-7 flex flex-col items-start text-right">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {currentOffer.badge && (
                    <span className="bg-red-600 text-white text-xs font-black px-3.5 py-1 rounded-full shadow-md">
                      {currentOffer.badge}
                    </span>
                  )}
                  {currentOffer.discount && (
                    <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold px-3 py-1 rounded-full">
                      {currentOffer.discount}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-snug">
                  {currentOffer.title}
                </h3>
                {currentOffer.subtitle && (
                  <span className="text-amber-400 font-bold text-sm sm:text-base mt-1 block">
                    {currentOffer.subtitle}
                  </span>
                )}

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-4 mb-6">
                  {currentOffer.description}
                </p>

                {/* Offer bullet points */}
                {currentOffer.features && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 w-full">
                    {currentOffer.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs sm:text-sm text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Display */}
                <div className="flex items-baseline gap-4 mb-8 bg-black/40 px-5 py-3 rounded-2xl border border-white/5">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 font-medium">سعر العرض الحصري:</span>
                    <span className="text-3xl sm:text-4xl font-black text-amber-400">
                      {formatPrice(currentOffer.price)}
                    </span>
                  </div>
                  {currentOffer.oldPrice && (
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">بدلاً من:</span>
                      <span className="text-lg sm:text-xl font-bold text-gray-500 line-through">
                        {formatPrice(currentOffer.oldPrice)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Countdown Ticker Box */}
                {!timeLeft.isExpired && (
                  <div className="w-full mb-8 bg-gradient-to-r from-red-950/40 via-amber-950/30 to-black/40 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-right">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-400 mb-3">
                      <Clock className="w-4 h-4 animate-spin text-amber-400" />
                      <span>ينتهي هذا العرض خلال:</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                      <div className="bg-[#181924] rounded-xl p-2 sm:p-3 border border-white/10">
                        <span className="text-xl sm:text-3xl font-black text-white block">
                          {timeLeft.days}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">يوم</span>
                      </div>
                      <div className="bg-[#181924] rounded-xl p-2 sm:p-3 border border-white/10">
                        <span className="text-xl sm:text-3xl font-black text-white block">
                          {timeLeft.hours.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">ساعة</span>
                      </div>
                      <div className="bg-[#181924] rounded-xl p-2 sm:p-3 border border-white/10">
                        <span className="text-xl sm:text-3xl font-black text-white block">
                          {timeLeft.minutes.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-400 font-medium">دقيقة</span>
                      </div>
                      <div className="bg-[#181924] rounded-xl p-2 sm:p-3 border border-amber-500/40 bg-amber-500/10">
                        <span className="text-xl sm:text-3xl font-black text-amber-400 block">
                          {timeLeft.seconds.toString().padStart(2, "0")}
                        </span>
                        <span className="text-[10px] sm:text-xs text-amber-300 font-medium">ثانية</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <a
                  href={currentOffer.ctaLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-black text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-500/25 transition-transform transform hover:scale-[1.02] active:scale-95"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>{currentOffer.ctaText || "اطلب هذا العرض الآن"}</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
              </div>

              {/* Offer Image presentation */}
              <div className="lg:col-span-5 relative">
                <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl group">
                  <Image
                    src={currentOffer.image}
                    alt={currentOffer.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Corner saving badge */}
                  {currentOffer.oldPrice && (
                    <div className="absolute bottom-4 right-4 bg-amber-500 text-black font-black px-4 py-2 rounded-xl text-sm shadow-xl flex items-center gap-1.5">
                      <Tag className="w-4 h-4" />
                      <span>وفر {currentOffer.oldPrice - currentOffer.price} ج.م</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
