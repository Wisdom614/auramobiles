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
} from "lucide-react";
import { useCart } from "@/lib/store/cart-context";
import { useWishlist } from "@/lib/store/wishlist-context";
import { PHONES } from "@/lib/data/phones";
import { formatCFA } from "@/lib/formatters";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Handle escape key to close search
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
    ? PHONES.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
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
    { name: "Trade-In / Swap", href: "/trade-in" },
    { name: "Deals", href: "/phones?deal=true" },
    { name: "Support", href: "/support" },
  ];

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#08080A] border-b border-white/5 py-1.5 px-4 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] sm:text-xs">Free delivery on orders over FCFA 500,000</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] sm:text-xs">
              100% Genuine Devices <span className="text-zinc-600">|</span> Official Warranty
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-zinc-300">
            <Tag className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] sm:text-xs">Special deals this week – Don&apos;t miss out!</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER - SPACIOUS, MINIMAL, LUXURY */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-[#09090B]/95 backdrop-blur-xl border-b border-[#D4AF37]/15 shadow-xl shadow-black/80 py-3"
            : "bg-[#09090B]/90 backdrop-blur-md border-b border-white/8 py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left: Mobile Menu Toggle (Mobile only) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 -ml-2 text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Identity / Real Generated Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-black border border-[#D4AF37]/30 shadow-md group-hover:border-[#D4AF37] transition-all">
              <img
                src="/aura-monogram.jpg"
                alt="AURA"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-[0.22em] text-white group-hover:text-amber-200 transition-colors uppercase leading-tight">
                AURA
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.32em] text-[#D4AF37] uppercase font-mono font-semibold -mt-0.5">
                LUXE MOBILE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links - Spacious & Clean */}
          <nav className="hidden lg:flex items-center gap-8 text-sm">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-[13px] font-medium tracking-wide transition-all ${
                    isActive
                      ? "text-[#D4AF37] font-semibold"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#D4AF37] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search smartphones"
              className="p-2.5 text-zinc-300 hover:text-[#D4AF37] rounded-xl hover:bg-white/5 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon (Desktop only) */}
            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className="relative p-2.5 text-zinc-300 hover:text-[#D4AF37] rounded-xl hover:bg-white/5 transition-colors hidden sm:inline-flex"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account Icon (Desktop only) */}
            <Link
              href="/account"
              aria-label="My Account"
              className="p-2.5 text-zinc-300 hover:text-[#D4AF37] rounded-xl hover:bg-white/5 transition-colors hidden sm:inline-flex"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Cart"
              className="relative p-2.5 text-zinc-200 hover:text-[#D4AF37] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#D4AF37] text-black text-[10px] font-black flex items-center justify-center shadow-md">
                {itemCount}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* 3. MOBILE SLIDE-OUT MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Drawer Content */}
          <div className="absolute top-0 left-0 bottom-0 w-4/5 max-w-xs bg-[#0F0F14] border-r border-white/10 p-6 flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-left duration-250">
            <div>
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/aura-monogram.jpg"
                    alt="AURA"
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-base font-black tracking-widest text-white uppercase">
                    AURA
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-2 -mr-2 text-zinc-400 hover:text-white rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="flex flex-col space-y-2 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`py-3 px-3 rounded-xl text-base font-semibold transition-all ${
                      pathname === link.href
                        ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30"
                        : "text-zinc-200 hover:bg-white/5"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Bottom Actions inside drawer */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-zinc-900/60 text-zinc-300 text-sm font-medium"
              >
                <Heart className="w-4 h-4 text-[#D4AF37]" />
                <span>Wishlist ({wishlistCount})</span>
              </Link>
              <Link
                href="/account"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-zinc-900/60 text-zinc-300 text-sm font-medium"
              >
                <User className="w-4 h-4 text-[#D4AF37]" />
                <span>My Account</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOLPROOF MOBILE & DESKTOP SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#09090B]/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-150">
          {/* Top Search Input Bar */}
          <div className="border-b border-white/10 bg-[#121217] px-4 py-3 sm:py-4">
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              
              {/* Back / Close button with large touch target */}
              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="p-2.5 -ml-1 text-zinc-300 hover:text-white rounded-xl hover:bg-white/10 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-[#D4AF37]" />
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
                  className="w-full bg-[#181820] border border-white/10 focus:border-[#D4AF37] rounded-full py-2.5 sm:py-3 pl-4 pr-10 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear text"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>

              {/* Explicit Done / Cancel Button */}
              <button
                onClick={closeSearch}
                className="px-3.5 py-2 text-xs font-semibold text-[#D4AF37] hover:text-amber-200 shrink-0"
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
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
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
                      className="px-3.5 py-2 rounded-xl bg-[#141419] border border-white/5 hover:border-[#D4AF37]/40 text-xs text-zinc-300 hover:text-white transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : filteredSearchPhones.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                  Matching Smartphones ({filteredSearchPhones.length})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredSearchPhones.map((phone) => (
                    <Link
                      key={phone.id}
                      href={`/phones/${phone.slug}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#14141A] border border-white/5 hover:border-[#D4AF37]/50 transition-all group"
                    >
                      <img
                        src={phone.images[0]}
                        alt={phone.name}
                        className="w-14 h-14 object-contain rounded-xl bg-black/60 p-1 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] uppercase font-mono text-[#D4AF37] block">
                          {phone.brand}
                        </span>
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-200 transition-colors truncate">
                          {phone.name}
                        </h4>
                        <p className="text-xs font-bold text-[#D4AF37] mt-0.5">
                          {formatCFA(phone.basePrice)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500">
                <p className="text-sm">No smartphones found matching &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-xs text-zinc-400 mt-1">Try searching for Apple, Samsung, Tecno, or Infinix</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
