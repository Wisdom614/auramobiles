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
  ArrowRight,
  ShieldCheck,
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
    tag: "LATEST ARRIVALS // APEX TIER",
    titleWhite: "iPhone 16 Pro Max",
    titleGold: "Bigger. Brighter. Better.",
    description:
      "Precision-forged grade 5 titanium enclosure powered by the 3nm A18 Pro silicon. Studio-grade 48MP Fusion optics and extended battery life.",
    brand: "Apple",
    model: "iPhone 16 Pro Max",
    price: 980000,
    image: "/hero-iphone.jpg",
    primaryLink: "/phones/iphone-16-pro-max",
    chips: [
      { icon: Cpu, label: "A18 Pro Silicon" },
      { icon: Camera, label: "48MP Fusion Optics" },
      { icon: BatteryCharging, label: "All-Day Endurance" },
    ],
  },
  {
    id: "samsung-galaxy-s24-ultra",
    tag: "GALAXY AI FLAGSHIP // TITANIUM",
    titleWhite: "Galaxy S24 Ultra",
    titleGold: "Power. Precision. Intelligence.",
    description:
      "Titanium armor chassis integrated with Galaxy AI workflow intelligence. 200MP Quad Telephoto sensor suite and embedded low-latency S-Pen.",
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
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-[#09090B] border-b border-white/10 select-none font-sans">
      
      {/* Background subtle technical grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Ambient gold glow */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#D4AF37]/8 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        
        {/* Frame Telemetry Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10 text-[10px] font-mono uppercase tracking-widest text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#D4AF37] animate-pulse"></span>
            <span className="text-white font-bold">[ CENTRAL DISPATCH VAULT // READY ]</span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-[#D4AF37] hidden sm:inline">100% GENUINE HARDWARE</span>
          </div>
          <div className="flex items-center gap-3">
            <span>[ FRAME 0{currentSlide + 1} / 0{HERO_SLIDES.length} ]</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left / Content Area (Cols 1-6) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 text-[#D4AF37] text-[10px] font-mono uppercase tracking-widest">
              <span>{slide.tag}</span>
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.08] uppercase">
                {slide.titleWhite}
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.08] text-[#D4AF37]">
                {slide.titleGold}
              </h2>
            </div>

            {/* Description */}
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-xl">
              {slide.description}
            </p>

            {/* Concise Product Highlights Pills with 0px radius */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono">
              {slide.chips.map((chip, i) => {
                const Icon = chip.icon;
                return (
                  <div
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#121217] border border-white/10 text-[11px] text-zinc-300 font-medium"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{chip.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Architectural Tactical Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Link
                href={slide.primaryLink}
                className="px-6 sm:px-7 py-3.5 gold-gradient-bg text-black font-extrabold text-xs uppercase tracking-widest flex items-center gap-2.5 hover:opacity-95 transition cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-black stroke-[2.5]" />
                <span>ACQUIRE HARDWARE</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
              </Link>

              <Link
                href="/trade-in"
                className="px-5 sm:px-6 py-3.5 bg-[#121217] hover:bg-[#16161D] text-white border border-white/15 hover:border-[#D4AF37]/60 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition font-mono"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>[ INITIATE PHONE SWAP ]</span>
              </Link>
            </div>

          </div>

          {/* Right Product Visual Canvas (Cols 7-12) */}
          <div className="lg:col-span-6 relative flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-5">
            
            {/* Viewfinder Framed Phone Image Showcase */}
            <div className="relative w-full max-w-md lg:max-w-lg aspect-[16/11] sm:aspect-[4/3] bg-[#0E0E12] border border-white/15 overflow-hidden group">
              {/* Viewfinder crosshairs */}
              <span className="absolute top-2 left-2 text-[#D4AF37] font-mono text-xs select-none z-20">+</span>
              <span className="absolute top-2 right-2 text-[#D4AF37] font-mono text-xs select-none z-20">+</span>
              <span className="absolute bottom-2 left-2 text-[#D4AF37] font-mono text-xs select-none z-20">+</span>
              <span className="absolute bottom-2 right-2 text-[#D4AF37] font-mono text-xs select-none z-20">+</span>

              <img
                src={slide.image}
                alt={slide.model}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

              {/* Viewfinder bottom corner watermark */}
              <div className="absolute bottom-3 left-3 text-[9px] font-mono text-white/50 tracking-widest uppercase pointer-events-none">
                VERIFIED SEALED UNIT // CAMEROON STOCK
              </div>
            </div>

            {/* Right Side Floating Price Matrix */}
            <div className="sm:absolute sm:right-2 sm:bottom-4 text-left bg-[#0E0E12]/95 border border-[#D4AF37]/50 p-4 sm:p-5 shadow-2xl shrink-0 font-mono relative">
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D4AF37]"></span>
              <span className="text-[10px] text-[#D4AF37] font-bold block uppercase tracking-wider">
                [ FACTORY SEALED ]
              </span>
              <span className="text-xs font-bold text-white block mt-1 uppercase">
                {slide.brand} • {slide.model}
              </span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mt-2">
                ACQUISITION PRICE:
              </span>
              <span className="text-lg sm:text-xl font-black text-[#D4AF37] block mt-0.5">
                {formatCFA(slide.price)}
              </span>
            </div>

          </div>

        </div>

        {/* Carousel Navigation Bar (Teenage Engineering Style) */}
        <div className="flex items-center justify-between pt-8 sm:pt-10 border-t border-white/10 mt-8">
          {/* Step buttons */}
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`px-3 py-1 text-[11px] font-mono font-bold tracking-wider transition-all cursor-pointer border ${
                  currentSlide === idx
                    ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                    : "bg-[#121217] text-zinc-400 border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                0{idx + 1} // {s.brand.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="p-2 bg-[#121217] hover:bg-[#181820] text-zinc-400 hover:text-white border border-white/10 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="p-2 bg-[#121217] hover:bg-[#181820] text-zinc-400 hover:text-white border border-white/10 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
