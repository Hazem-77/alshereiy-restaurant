"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, MessageSquare } from "lucide-react";
import { testimonialsData } from "@/data/testimonials";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-[#0b0c10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold mb-3">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>تجارب حقيقية</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            ماذا يقول عملاؤنا عن طعم الشريعى؟
          </h2>
          <p className="mt-3 text-gray-400 text-sm sm:text-base">
            ثقة عملائنا هي سر نجاحنا وشغفنا اليومي لتقديم الأفضل دائماً.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonialsData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl glass-panel p-6 flex flex-col justify-between text-right glass-panel-hover relative"
            >
              <div>
                {/* Rating stars & Quote icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-amber-500/20" />
                </div>

                {/* Comment */}
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/5">
                <span className="text-xs text-amber-400 font-semibold block">
                  الطلب: {item.dish}
                </span>
                <div className="flex items-center justify-between mt-1">
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <span className="text-[11px] text-gray-500">{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
