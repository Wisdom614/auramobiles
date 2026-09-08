"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  RefreshCw,
  Cpu,
  Camera,
  BatteryCharging,
  Sparkles,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";

interface HeroSlide {
  id: string;
  tag: string;
  titleWhite: string;
  titleGold: string;
  description: string;
  brand: string;
  model: string;
  price: number;
  image: string;
  primaryLink: string;
  chips: { icon: React.ElementType; label: string }[];
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "iphone-16-pro-max",
    tag: "LATEST ARRIVALS",
    titleWhite: "iPhone 16 Pro Max",
    titleGold: "Bigger. Brighter. Better.",
    description:
      "Experience the next level of innovation with the iPhone 16 Pro Max. Stunning camera. Unmatched performance. Built for what's next.",
    brand: "Apple",
    model: "iPhone 16 Pro Max",
    price: 980000,
    image: "/hero-iphone.jpg",
    primaryLink: "/phones/iphone-16-pro-max",
    chips: [
      { icon: Cpu, label: "A18 Pro Chip" },
      { icon: Camera, label: "Pro Camera System" },
      { icon: BatteryCharging, label: "All-day Battery" },
    ],
  },
  {
    id: "samsung-galaxy-s24-ultra",
    tag: "GALAXY AI FLAGSHIP",
    titleWhite: "Galaxy S24 Ultra",
    titleGold: "Power. Precision. Intelligence.",
    description:
      "Titanium armor frame meets Galaxy AI intelligence. Shoot beyond horizons with 200MP Quad Telephoto and integrated S-Pen productivity.",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    price: 850000,
    image: "/hero-s24.jpg",
    primaryLink: "/phones/samsung-galaxy-s24-ultra",
    chips: [
      { icon: Cpu, label: "Snapdragon 8 Gen 3" },
      { icon: Sparkles, label: "Galaxy AI Suite" },
      { icon: Camera, label: "200MP Quad Zoom" },
    ],
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-[#09090B] border-b border-white/5 select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-amber-600/10 via-[#D4AF37]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Main Slide Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* Left / Content Area (Cols 1-6) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Tag */}
            <p className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              {slide.tag}
            </p>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
                {slide.titleWhite}
              </h1>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.12] text-[#E5C05B]">
                {slide.titleGold}
              </h2>
            </div>

            {/* Description */}
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link
                href={slide.primaryLink}
                className="px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#E5C05B] to-[#D4AF37] hover:from-[#F0CF6F] hover:to-[#DEB83E] text-black font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2 shadow-lg shadow-amber-500/15 transition-all hover:scale-[1.02] active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4 text-black" />
                <span>Shop Now →</span>
              </Link>

              <Link
                href="/trade-in"
                className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#141419]/90 hover:bg-[#1C1C24] text-white border border-white/15 hover:border-[#D4AF37]/50 font-semibold text-xs sm:text-sm tracking-wide flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                <span>Trade In Your Phone</span>
              </Link>
            </div>

            {/* Concise Product Highlights Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3">
              {slide.chips.map((chip, i) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141419] border border-white/8 text-[11px] sm:text-xs text-zinc-300 font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{chip.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center & Right Product Visual (Cols 7-12) */}
          <div className="lg:col-span-6 relative flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6">
            
            {/* Main Phone Image Showcase */}
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[16/10] sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={slide.image}
                alt={slide.model}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Right Side Floating Price Callout (Matching Reference) */}
            <div className="sm:absolute sm:right-2 sm:bottom-6 sm:translate-y-0 text-center sm:text-left bg-[#0D0D12]/90 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 shadow-2xl shrink-0">
              <span className="text-xs text-zinc-400 font-mono block">
                {slide.brand}
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                {slide.model}
              </span>
              <span className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider block mt-2">
                From
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#D4AF37] block mt-0.5">
                {formatCFA(slide.price)}
              </span>
            </div>

          </div>

        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-transparent flex items-center justify-center transition-all z-20 backdrop-blur-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-transparent flex items-center justify-center transition-all z-20 backdrop-blur-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slider Pagination Indicators (Matching Reference) */}
        <div className="flex items-center justify-center gap-2 pt-8 sm:pt-10">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? "w-8 bg-[#D4AF37]"
                  : "w-2 bg-zinc-700 hover:bg-zinc-500"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
