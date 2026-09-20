"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { GalleryItem } from "@/data/gallery";

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onNavigate: (newItem: GalleryItem) => void;
}

export default function LightboxModal({ item, items, onClose, onNavigate }: LightboxModalProps) {
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;

  const handleNext = () => {
    if (currentIndex < 0) return;
    const nextIdx = (currentIndex + 1) % items.length;
    onNavigate(items[nextIdx]);
  };

  const handlePrev = () => {
    if (currentIndex < 0) return;
    const prevIdx = (currentIndex - 1 + items.length) % items.length;
    onNavigate(items[prevIdx]);
  };

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handleNext(); // In RTL, left is next
      if (e.key === "ArrowRight") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [item, handleNext, handlePrev, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in duration-200">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
        aria-label="إغلاق المعاينة"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
        aria-label="الصورة السابقة"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      <button
        onClick={handleNext}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50"
        aria-label="الصورة التالية"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      {/* Modal Content */}
      <div className="relative max-w-5xl w-full flex flex-col items-center">
        <div className="relative w-full h-[65vh] sm:h-[75vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Caption */}
        <div className="mt-4 text-center text-white max-w-xl">
          <div className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-1">
            {item.categoryLabel}
          </div>
          <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
