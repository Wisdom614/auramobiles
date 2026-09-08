"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  User,
  ArrowLeft,
  Truck,
  ShieldCheck,
  Tag,
  Shield,
  PhoneCall,
} from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { useWishlist } from "@/lib/store/wishlist-context";
import { useSettings } from "@/lib/store/settings-context";
import { useAuth } from "@/lib/store/auth-context";
import { PHONES, Phone } from "@/lib/data/phones";
import { BRANDS } from "@/lib/data/brands";
import { formatCFA } from "@/lib/formatters";
import { getPhonesFromDB } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { settings } = useSettings();
  const { user, profile, isAdmin } = useAuth();

  const [phonesList, setPhonesList] = useState<Phone[]>(PHONES);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getPhonesFromDB().then((data) => {
      if (data && data.length > 0) setPhonesList(data);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile search or mobile menu is active
  useEffect(() => {
    if (isSearchOpen || isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen, isMobileMenuOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isSearchOpen]);

  // Handle escape key to close search or drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter phones for live search
  const filteredSearchPhones = searchQuery.trim()
    ? phonesList
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/phones?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const navLinks = [
    { name: "Storefront", href: "/" },
    { name: "Phones", href: "/phones" },
    { name: "Trade-In & Swap", href: "/trade-in" },
    { name: "Special Deals", href: "/phones?deal=true" },
    { name: "Support", href: "/support" },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#08080A] border-b border-white/5 py-1.5 px-4 text-xs text-zinc-400 font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10.5px] sm:text-xs">
              Free express delivery over FCFA {settings.freeDeliveryThreshold.toLocaleString()}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10.5px] sm:text-xs uppercase">
              100% Sealed Hardware <span className="text-zinc-600">|</span> 1-Year Official Warranty
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-zinc-300">
            <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[10.5px] sm:text-xs uppercase">{settings.announcementText}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER - ARCHITECTURAL LUXURY NAVIGATION */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#09090B]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-xl shadow-black/80 py-2.5 sm:py-3"
            : "bg-[#09090B]/90 backdrop-blur-md border-b border-white/10 py-3 sm:py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: Brand Identity / Geometric Monogram Logo & Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group select-none">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-none bg-black border border-[#D4AF37]/50 shadow-md group-hover:border-[#D4AF37] transition-all shrink-0 flex items-center justify-center p-0.5 relative">
              <span className="absolute -top-0.5 -left-0.5 text-[#D4AF37] font-mono text-[7px] leading-none">+</span>
              <span className="absolute -bottom-0.5 -right-0.5 text-[#D4AF37] font-mono text-[7px] leading-none">+</span>
              <img
                src="/aura-monogram.jpg"
                alt="AURA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-black tracking-[0.22em] text-white group-hover:text-amber-200 transition-colors uppercase leading-tight">
                AURA
              </span>
              <span className="text-[7.5px] sm:text-[9px] tracking-[0.32em] text-[#D4AF37] uppercase font-mono font-semibold -mt-0.5">
                LUXE MOBILE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-mono">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-xs tracking-wider uppercase transition-all ${
                    isActive
                      ? "text-[#D4AF37] font-bold"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D4AF37]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Utility Actions: Ergonomic placement on both mobile & desktop */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 font-mono">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search smartphones"
              className="w-8 h-8 sm:w-9 sm:h-9 border border-white/10 hover:border-[#D4AF37]/60 text-zinc-300 hover:text-[#D4AF37] flex items-center justify-center transition-colors rounded-none cursor-pointer bg-white/5"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Wishlist Icon (Desktop only) */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative w-9 h-9 border border-white/10 hover:border-[#D4AF37]/60 text-zinc-300 hover:text-[#D4AF37] hidden sm:flex items-center justify-center transition-colors rounded-none bg-white/5"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center rounded-none leading-none">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon (Desktop only) */}
            <Link
              href={user || profile ? "/account" : "/account/login"}
              aria-label={user || profile ? "My Account" : "Sign In"}
              className="h-9 px-2.5 border border-white/10 hover:border-[#D4AF37]/60 text-zinc-300 hover:text-[#D4AF37] transition-colors hidden sm:inline-flex items-center gap-2 rounded-none text-xs bg-white/5"
            >
              {user || profile ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-4 h-4 bg-[#D4AF37] text-black font-mono font-bold text-[9px] flex items-center justify-center rounded-none">
                    {(profile?.fullName || user?.email || "U").charAt(0).toUpperCase()}
                  </span>
                  <span className="text-[11px] font-medium text-zinc-200 max-w-[80px] truncate hidden md:inline">
                    {profile?.fullName ? profile.fullName.split(" ")[0] : "VIP"}
                  </span>
                </div>
              ) : (
                <User className="w-4 h-4" />
              )}
            </Link>

            {/* Cart / Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="relative w-8 h-8 sm:w-9 sm:h-9 border border-white/10 hover:border-[#D4AF37]/60 text-zinc-200 hover:text-[#D4AF37] flex items-center justify-center transition-colors rounded-none cursor-pointer bg-white/5"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-[#D4AF37] text-black text-[9px] font-mono font-black flex items-center justify-center rounded-none shadow-md leading-none">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger (On the right for easy thumb access) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="w-8 h-8 sm:w-9 sm:h-9 border border-white/15 bg-white/10 hover:bg-white/15 hover:border-[#D4AF37] text-white flex items-center justify-center transition-colors rounded-none lg:hidden cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* 3. REFINED MOBILE SLIDE-OUT MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden font-sans">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Drawer Container */}
          <div className="absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#0E0E12] border-l border-white/10 flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-right duration-250">
            
            {/* Top Bar inside drawer */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#121217]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-black border border-[#D4AF37]/50 flex items-center justify-center rounded-none shrink-0">
                  <img
                    src="/aura-monogram.jpg"
                    alt="AURA"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs font-black tracking-widest text-white uppercase block font-mono">
                    AURA
                  </span>
                  <span className="text-[8px] font-mono tracking-widest text-[#D4AF37] uppercase -mt-0.5 block">
                    DIRECTORY
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="w-7 h-7 border border-white/10 hover:border-white/30 text-zinc-400 hover:text-white flex items-center justify-center rounded-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content inside drawer */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* Primary Navigation Directory */}
              <div className="space-y-1 font-mono text-xs">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mb-2 font-bold">
                  [ PRIMARY DIRECTORY ]
                </span>
                {navLinks.map((link, idx) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between py-2.5 px-3 border transition-all rounded-none ${
                        isActive
                          ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] font-bold"
                          : "bg-[#121217] border-white/5 text-zinc-200 hover:text-white hover:border-white/15"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] text-zinc-500 font-mono">
                          0{idx + 1}
                        </span>
                        <span className="uppercase tracking-wider">
                          {link.name}
                        </span>
                      </div>
                      {link.href === "/trade-in" && (
                        <span className="px-1.5 py-0.2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold uppercase">
                          SWAP
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Hardware Brand Rack */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">
                  [ HARDWARE ARCHIVE BY BRAND ]
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {BRANDS.slice(0, 6).map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/phones?brand=${brand.name}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2.5 bg-[#121217] border border-white/5 hover:border-[#D4AF37]/40 text-left transition-all rounded-none group"
                    >
                      <span className="text-[11px] font-bold text-white group-hover:text-[#D4AF37] transition-colors block truncate uppercase">
                        {brand.name}
                      </span>
                      <span className="text-[9px] text-zinc-500 block mt-0.5">
                        {brand.count} Models
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* VIP Client Bay */}
              <div className="space-y-2 font-mono text-xs pt-2 border-t border-white/10">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-bold">
                  [ CLIENT BAY ]
                </span>
                {user || profile ? (
                  <div className="p-3 bg-[#121217] border border-[#D4AF37]/30 space-y-2 rounded-none">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-black border border-[#D4AF37] text-[#D4AF37] font-bold text-xs flex items-center justify-center rounded-none shrink-0">
                        {(profile?.fullName || user?.email || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-white truncate block">
                          {profile?.fullName || "AURA VIP Client"}
                        </span>
                        <span className="text-[9px] text-[#D4AF37] block font-mono">
                          Black Card Member
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-1.5 px-2 bg-white/5 border border-white/10 hover:border-white/20 text-center text-[10px] text-zinc-200 uppercase"
                      >
                        Account
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="py-1.5 px-2 bg-white/5 border border-white/10 hover:border-white/20 text-center text-[10px] text-zinc-200 uppercase"
                      >
                        Wishlist ({wishlistCount})
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 px-3 gold-gradient-bg text-black font-extrabold text-center text-[11px] uppercase tracking-wider rounded-none"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/account/login?tab=signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2.5 px-3 bg-white/5 border border-white/10 text-zinc-200 font-bold text-center text-[11px] uppercase tracking-wider rounded-none hover:bg-white/10"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Showroom Info & WhatsApp Concierge */}
            <div className="p-4 border-t border-white/10 bg-[#121217] space-y-2 font-mono text-[11px]">
              <a
                href={`https://wa.me/${settings.whatsappCleanNumber || "237699442100"}?text=${encodeURIComponent(
                  "Hello AURA, I am browsing your mobile storefront and need concierge assistance."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-900/50 transition-all rounded-none"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge (1-Tap)</span>
              </a>
              <p className="text-[9px] text-zinc-500 text-center uppercase">
                [ BONAPRISO DOUALA • BASTOS YAOUNDÉ ]
              </p>
            </div>

          </div>
        </div>
      )}

      {/* 4. FOOLPROOF SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-150 font-sans">
          {/* Top Search Input Bar */}
          <div className="border-b border-white/10 bg-[#121217] px-4 py-3 sm:py-4">
            <div className="max-w-3xl mx-auto flex items-center gap-2 sm:gap-3">
              
              {/* Back / Close button */}
              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="p-2 border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white rounded-none transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer font-mono"
              >
                <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-semibold hidden sm:inline text-zinc-300">Back</span>
              </button>

              {/* Form and Input */}
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search iPhone, Galaxy, Xiaomi, Tecno..."
                  className="w-full bg-[#181820] border border-white/15 focus:border-[#D4AF37] rounded-none py-2 sm:py-2.5 pl-3 pr-10 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors font-mono"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear text"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* Cancel Button */}
              <button
                onClick={closeSearch}
                className="px-3 py-2 text-xs font-mono uppercase font-bold text-[#D4AF37] hover:text-amber-200 shrink-0 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Search Content & Results Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl w-full mx-auto">
            {searchQuery.trim() === "" ? (
              <div className="space-y-4">
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  [ POPULAR SEARCHES ]
                </p>
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {[
                    "iPhone 16 Pro Max",
                    "Galaxy S24 Ultra",
                    "Tecno Camon 30",
                    "Infinix GT 20 Pro",
                    "Certified Pre-Owned",
                    "Xiaomi 14 Ultra",
                  ].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-3 py-1.5 bg-[#141419] border border-white/10 hover:border-[#D4AF37]/50 text-xs text-zinc-300 hover:text-white transition-all rounded-none cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredSearchPhones.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  [ MATCHING SMARTPHONES ({filteredSearchPhones.length}) ]
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {filteredSearchPhones.map((phone) => (
                    <Link
                      key={phone.id}
                      href={`/phones/${phone.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-3 bg-[#121217] border border-white/10 hover:border-[#D4AF37]/50 transition-all rounded-none group relative"
                    >
                      <span className="absolute -top-0.5 -left-0.5 text-[#D4AF37] font-mono text-[7px]">+</span>
                      <div className="w-12 h-14 bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
                        <img
                          src={phone.images[0]}
                          alt={phone.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] uppercase font-mono text-[#D4AF37] block font-bold">
                          {phone.brand}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate uppercase">
                          {phone.name}
                        </h4>
                        <p className="text-xs font-mono font-bold text-[#D4AF37] mt-0.5">
                          {formatCFA(phone.basePrice)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                <p className="text-sm text-white uppercase">[ NO SMARTPHONES FOUND ]</p>
                <p className="text-xs text-zinc-400 mt-1">Try searching for Apple, Samsung, Tecno, or Infinix</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
