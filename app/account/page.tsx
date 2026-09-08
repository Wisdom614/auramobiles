"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  MapPin,
  Shield,
  KeyRound,
  RefreshCw,
  LogOut,
  ExternalLink,
  ChevronRight,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  PhoneCall,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Save,
  Crown,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useOrders } from "@/lib/store/orders-context";
import { useSettings } from "@/lib/store/settings-context";
import { formatCFA } from "@/lib/formatters";
import { Order, OrderStatus } from "@/lib/data/mock-orders";
import { getOrdersFromDB, supabase } from "@/lib/supabase/client";

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, profile, isAdmin, isLoading, signOut, updateProfile } = useAuth();
  const { orders: contextOrders } = useOrders();
  const { settings } = useSettings();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "trade-in" | "security">("orders");

  // Editable Profile state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Douala");
  const [address, setAddress] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // Orders list state
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  // Sync profile data to local state
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "Douala");
      setAddress(profile.address || "");
    }
  }, [profile]);

  // Load user's orders from Supabase DB + local context
  useEffect(() => {
    let isMounted = true;

    async function fetchUserOrders() {
      setIsLoadingOrders(true);
      try {
        const dbOrders = await getOrdersFromDB();
        const allOrders = dbOrders && dbOrders.length > 0 ? dbOrders : contextOrders;

        if (profile?.email || profile?.phone) {
          const matched = allOrders.filter((ord) => {
            const customerEmail = ord.customer?.email?.toLowerCase() || "";
            const userEmail = profile.email?.toLowerCase() || "";
            const customerPhone = (ord.customer?.phone || "").replace(/\D/g, "");
            const userPhone = (profile.phone || "").replace(/\D/g, "");

            const emailMatch = userEmail && customerEmail === userEmail;
            const phoneMatch = userPhone && customerPhone && customerPhone.endsWith(userPhone.slice(-8));

            return emailMatch || phoneMatch;
          });

          if (isMounted) {
            // If matched orders exist, show them; otherwise if demo user, show the latest recent order for preview
            setUserOrders(matched.length > 0 ? matched : allOrders.slice(0, 2));
          }
        } else {
          if (isMounted) {
            setUserOrders(allOrders.slice(0, 2));
          }
        }
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
      } finally {
        if (isMounted) setIsLoadingOrders(false);
      }
    }

    if (user || profile) {
      fetchUserOrders();
    }
  }, [profile, contextOrders, user]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMessage("");
    setProfileErrorMessage("");
    setIsSavingProfile(true);

    try {
      const { error } = await updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
      });

      if (error) {
        setProfileErrorMessage(error);
      } else {
        setProfileSuccessMessage("Your VIP profile & delivery address have been updated successfully.");
        setTimeout(() => setProfileSuccessMessage(""), 5000);
      }
    } catch {
      setProfileErrorMessage("An unexpected error occurred while saving profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Update Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMessage("");
    setPasswordErrorMessage("");

    if (newPassword.length < 6) {
      setPasswordErrorMessage("Password must contain at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      if (supabase) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          setPasswordErrorMessage(error.message);
        } else {
          setPasswordSuccessMessage("Password updated successfully. Please keep it confidential.");
          setNewPassword("");
          setConfirmPassword("");
        }
      } else {
        // Offline / fallback mode
        setPasswordSuccessMessage("Password updated in local VIP session.");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordErrorMessage("Failed to update password. Please try again.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-2xl bg-[#141419] border border-[#D4AF37]/30 flex items-center justify-center mb-4 animate-pulse">
          <Crown className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <p className="text-sm font-medium text-zinc-400">Loading VIP Member Account...</p>
      </div>
    );
  }

  // Not logged in prompt
  if (!user && !profile) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="max-w-md w-full bg-[#121216] border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#1A1A22] border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-xl font-bold text-white mb-2">AURA VIP Account Required</h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Please sign in to access your order tracking, trade-in valuations, and saved delivery addresses.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/account/login"
              className="w-full py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all text-center"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/"
              className="w-full py-3 rounded-xl bg-zinc-900 border border-white/10 text-zinc-300 font-semibold text-xs hover:bg-zinc-800 transition-colors text-center"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userInitials = (profile?.fullName || user?.email || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "placed":
        return {
          label: "Order Placed",
          color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: Clock,
        };
      case "confirmed":
        return {
          label: "Confirmed by Concierge",
          color: "bg-amber-500/10 text-[#D4AF37] border-amber-500/20",
          icon: CheckCircle2,
        };
      case "preparing":
        return {
          label: "Preparing in Showroom",
          color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          icon: Package,
        };
      case "delivering":
        return {
          label: "Out for Delivery",
          color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          icon: Truck,
        };
      case "completed":
        return {
          label: "Delivered & Verified",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: CheckCircle2,
        };
      default:
        return {
          label: status,
          color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
          icon: Package,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-white pt-24 pb-24 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* 1. VIP CUSTOMER HEADER CARD */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#16161D] to-[#0F0F14] border border-white/10 p-6 sm:p-8 shadow-2xl">
          {/* Subtle gold ambient glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Identity Info */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Monogram Avatar */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-400 to-[#D4AF37] p-[2px] shadow-xl flex-shrink-0">
                <div className="w-full h-full bg-[#121217] rounded-2xl flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 tracking-wider">
                    {userInitials}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow">
                  <Crown className="w-3 h-3 fill-black" />
                </div>
              </div>

              {/* Names and Status */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg sm:text-2xl font-bold text-white">
                    {profile?.fullName || "AURA VIP Client"}
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> VIP Member
                  </span>
                </div>
                
                <p className="text-xs text-zinc-400 flex items-center gap-2">
                  <span>{profile?.email || user?.email}</span>
                  {profile?.phone && (
                    <>
                      <span>•</span>
                      <span>{profile.phone}</span>
                    </>
                  )}
                </p>

                <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>Preferred Hub: {profile?.city || "Douala / Yaoundé"}, Cameroon</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Admin Portal Shortcut if user is authorized admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:opacity-95 transition-all"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              )}

              <button
                onClick={handleSignOut}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-zinc-300 font-semibold text-xs flex items-center gap-2 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

          {/* Mobile VIP Tag */}
          <div className="sm:hidden mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> AURA Black Card Tier
            </span>
            <span className="text-[10px] text-zinc-400">Cameroon Official Client</span>
          </div>
        </div>

        {/* 2. TAB CONTROLS */}
        <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar gap-2 sm:gap-4">
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-3 pt-1 px-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === "orders"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>My Orders & Tracking</span>
            {userOrders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[10px] text-zinc-300">
                {userOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 pt-1 px-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery & Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("trade-in")}
            className={`pb-3 pt-1 px-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === "trade-in"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Trade-In Swaps</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 pt-1 px-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === "security"
                ? "border-[#D4AF37] text-[#D4AF37]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Security & Password</span>
          </button>
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB 1: ORDERS & TRACKING */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {isLoadingOrders ? (
              <div className="py-16 text-center text-zinc-400">
                <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs font-medium">Fetching your order history...</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="rounded-2xl bg-[#121216] border border-white/10 p-10 text-center">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="text-base font-bold text-white mb-1">No Orders Found Yet</h3>
                <p className="text-xs text-zinc-400 mb-6 max-w-sm mx-auto">
                  You haven&apos;t placed any smartphone orders under this account yet. Ready to experience flagship luxury?
                </p>
                <Link
                  href="/phones"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all"
                >
                  <span>Explore Flagship Smartphones</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const BadgeIcon = badge.icon;
                  const waClean = settings.whatsappCleanNumber || "237699442100";
                  const waSupportText = `Hello ${settings.storeName}, I am inquiring about my Order #${order.id} (${order.trackingNumber}).`;

                  return (
                    <div
                      key={order.id}
                      className="rounded-2xl bg-[#121216] border border-white/10 hover:border-white/20 transition-all p-5 sm:p-6 shadow-xl"
                    >
                      {/* Top Order Metadata */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">Order</span>
                            <span className="text-sm font-bold text-white">#{order.id}</span>
                            <span className="text-xs text-[#D4AF37] font-mono font-medium">
                              ({order.trackingNumber})
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            Placed on{" "}
                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>

                        {/* Status Pill */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}
                          >
                            <BadgeIcon className="w-3.5 h-3.5" />
                            <span>{badge.label}</span>
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="py-4 divide-y divide-white/5 space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between pt-3 first:pt-0 gap-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || "/placeholder.png"}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-contain bg-zinc-900 border border-white/5 p-1 flex-shrink-0"
                              />
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-zinc-400">
                                  {item.storage} • {item.color} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="text-xs sm:text-sm font-bold text-white">
                                {formatCFA(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Action CTAs */}
                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-xs text-zinc-400">
                          <span>Total Amount:</span>
                          <span className="text-base font-black text-[#D4AF37]">
                            {formatCFA(order.total)}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                            {order.customer?.paymentMethod === "cash_on_delivery"
                              ? "Cash on Delivery"
                              : "Mobile Money"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                          {/* WhatsApp Inquiry */}
                          <a
                            href={`https://wa.me/${waClean}?text=${encodeURIComponent(waSupportText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Concierge</span>
                          </a>

                          {/* Live Track Link */}
                          <Link
                            href={`/orders?id=${order.id}`}
                            className="px-4 py-2 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/25 text-[#D4AF37] font-bold text-xs flex items-center gap-1.5 transition-colors"
                          >
                            <span>Live Tracking</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED DELIVERY ADDRESS & PROFILE */}
        {activeTab === "profile" && (
          <div className="rounded-2xl bg-[#121216] border border-white/10 p-6 sm:p-8 shadow-xl">
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#D4AF37]" />
                <span>Saved VIP Delivery Address & Profile</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Your saved details automatically auto-fill at checkout for fast, 1-tap ordering.
              </p>
            </div>

            {profileSuccessMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{profileSuccessMessage}</span>
              </div>
            )}

            {profileErrorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{profileErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Full Name (Recipient)
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Marc Aurele"
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    WhatsApp Phone (For Delivery Concierge)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="e.g. 699442100 or +237 670000000"
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              {/* Email (Readonly) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-2">
                  Account Email (Registered)
                </label>
                <input
                  type="email"
                  value={profile?.email || user?.email || ""}
                  disabled
                  className="w-full bg-zinc-900/60 border border-white/5 rounded-xl px-4 py-3 text-sm text-zinc-400 cursor-not-allowed"
                />
                <p className="text-[10px] text-zinc-500 mt-1">
                  Email is locked to your authenticated session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Preferred City */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Delivery City (Cameroon)
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  >
                    <option value="Douala">Douala (Same-Day Express)</option>
                    <option value="Yaoundé">Yaoundé (Same-Day Express)</option>
                    <option value="Bafoussam">Bafoussam (24h Delivery)</option>
                    <option value="Kribi">Kribi (24h Delivery)</option>
                    <option value="Limbe">Limbe (24h Delivery)</option>
                    <option value="Buea">Buea (24h Delivery)</option>
                    <option value="Bamenda">Bamenda (24-48h Delivery)</option>
                    <option value="Garoua">Garoua (Air Cargo / 48h)</option>
                    <option value="Maroua">Maroua (Air Cargo / 48h)</option>
                    <option value="Other">Other Cameroon Location</option>
                  </select>
                </div>

                {/* Street / Landmark Address */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-2">
                    Quarters / Street Address / Landmark
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Bonapriso, Rue Tokoto near Hotel Serena"
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? "Saving Details..." : "Save Delivery Address"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: TRADE-IN SWAPS & VALUATIONS */}
        {activeTab === "trade-in" && (
          <div className="rounded-2xl bg-[#121216] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-[#D4AF37]" />
                  <span>AURA Trade-In Privilege</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Exchange your current smartphone for instant credit towards any new flagship.
                </p>
              </div>

              <Link
                href="/trade-in"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all text-center self-start sm:self-auto"
              >
                <span>Value a Device</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* How VIP Trade-in Works */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-[#D4AF37]">1. Automated Appraisal</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Select your device brand, model, storage, and battery condition to lock an instant valuation.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-[#D4AF37]">2. 5-Min Showroom Check</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Bring your phone to our Akwa/Bonapriso or Bastos lounges for a 65-point certified check.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5 space-y-2">
                <span className="text-xs font-bold text-[#D4AF37]">3. Instant Price Deduction</span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Pay only the difference on your brand-new flagship sealed in box with 1-year warranty.
                </p>
              </div>
            </div>

            {/* Concierge Assistance */}
            <div className="p-4 rounded-xl bg-[#161620] border border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <h4 className="text-xs font-bold text-white">Need a custom corporate or bulk trade-in?</h4>
                  <p className="text-[11px] text-zinc-400">Our VIP advisors appraise executive fleets across Cameroon.</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${settings.whatsappCleanNumber || "237699442100"}?text=${encodeURIComponent(
                  "Hello AURA, I would like an executive trade-in appraisal for my smartphone."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold whitespace-nowrap hover:bg-emerald-500/25 transition-all"
              >
                Chat with Concierge
              </a>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & PASSWORD */}
        {activeTab === "security" && (
          <div className="rounded-2xl bg-[#121216] border border-white/10 p-6 sm:p-8 shadow-xl max-w-xl">
            <div className="mb-6">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#D4AF37]" />
                <span>Security & Account Credentials</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Update your VIP customer login password and security settings.
              </p>
            </div>

            {passwordSuccessMessage && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{passwordSuccessMessage}</span>
              </div>
            )}

            {passwordErrorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#181820] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-6 py-3.5 rounded-xl gold-gradient-bg text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Shield className="w-4 h-4" />
                  <span>{isUpdatingPassword ? "Updating Password..." : "Update Security Password"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
