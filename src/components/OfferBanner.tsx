"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Flame, Clock } from "lucide-react";
import { offersData } from "@/data/offers";
import type { Offer } from "@/lib/offerUtils";
import { isOfferActive, calculateTimeLeft } from "@/lib/offerUtils";

interface OfferBannerProps {
  initialOffers?: Offer[];
  initialTime?: Date;
}

export default function OfferBanner({ initialOffers, initialTime }: OfferBannerProps) {
  const [currentTime, setCurrentTime] = useState<Date>(
    initialTime ?? new Date("2000-01-01T00:00:00Z"),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const offers = initialOffers ?? offersData;
  const activeOffers = offers.filter((o) => isOfferActive(o, currentTime));
  if (activeOffers.length === 0) return null;

  const topOffer = activeOffers[0];
  const timeLeft = calculateTimeLeft(topOffer.endDate, currentTime);

  return (
    <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white py-2 px-4 text-xs sm:text-sm font-bold shadow-md relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <Flame className="w-4 h-4 text-yellow-300 animate-pulse shrink-0" />
          <span className="text-yellow-200">عرض حصري:</span>
          <span className="font-extrabold">{topOffer.title}</span>
          <span className="hidden md:inline text-white/90">({topOffer.discount || "توفير مميز"})</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!timeLeft.isExpired && (
            <div className="hidden sm:flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-full text-[11px]">
              <Clock className="w-3.5 h-3.5 text-yellow-300" />
              <span>متبقي: {timeLeft.days}ي {timeLeft.hours}س {timeLeft.minutes}د {timeLeft.seconds}ث</span>
            </div>
          )}

          <Link
            href="#offers"
            className="bg-black text-yellow-300 hover:bg-neutral-900 px-3 py-1 rounded-full text-xs transition-colors shrink-0 flex items-center gap-1"
          >
            <span>شاهد العرض</span>
            <Sparkles className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
