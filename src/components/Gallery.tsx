"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, Maximize2 } from "lucide-react";
import { galleryData, GalleryItem } from "@/data/gallery";
import LightboxModal from "./LightboxModal";

export default function Gallery() {
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  return (
    <section id="gallery" className="py-24 bg-[#0e0f14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-3">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>معرض الصور والمنيو الكامل</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            نظرة حية من داخل مطعم الشريعى
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base">
            اضغط على أي صورة لتكبيرها واستعراض اللوحات الكاملة للأصناف والأسعار وتجهيزات المطعم.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveLightboxItem(item)}
              className="group relative h-80 rounded-3xl overflow-hidden glass-panel border border-white/10 cursor-pointer"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover transform group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

              {/* Category Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30">
                {item.categoryLabel}
              </div>

              {/* Click to Expand Icon */}
              <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-1 group-hover:translate-y-0">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Caption */}
              <div className="absolute bottom-4 right-4 left-4 text-right transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <LightboxModal
          item={activeLightboxItem}
          items={galleryData}
          onClose={() => setActiveLightboxItem(null)}
          onNavigate={(newItem) => setActiveLightboxItem(newItem)}
        />
      </div>
    </section>
  );
}
