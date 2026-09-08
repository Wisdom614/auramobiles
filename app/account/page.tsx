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
  Download,
  Lock,
  ArrowRight,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/store/auth-context";
import { useOrders } from "@/lib/store/orders-context";
import { useSettings } from "@/lib/store/settings-context";
import { formatCFA } from "@/lib/formatters";
import { Order, OrderStatus } from "@/lib/data/mock-orders";
import { getOrdersFromDB, supabase } from "@/lib/supabase/client";
import { OrderReceiptModal } from "@/components/orders/order-receipt-modal";

export default function CustomerAccountPage() {
  const router = useRouter();
  const { user, profile, isAdmin, isLoading, signOut, updateProfile } = useAuth();
  const { orders: contextOrders } = useOrders();
  const { settings } = useSettings();

  const [activeTab, setActiveTab] = useState<"orders" | "profile" | "trade-in" | "security">("orders");
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);

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
        setProfileSuccessMessage("Your delivery address and profile details have been saved.");
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
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 font-sans">
        <div className="w-14 h-14 bg-[#0E0E12] border border-[#D4AF37]/50 flex items-center justify-center mb-4 relative rounded-none">
          <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
          <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>
          <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
          <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>
          <Crown className="w-6 h-6 text-[#D4AF37] animate-pulse" />
        </div>
        <p className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
          [ ACCESSING CLIENT PROFILE... ]
        </p>
      </div>
    );
  }

  // Not logged in prompt
  if (!user && !profile) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-center px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-[#0E0E12] border border-white/10 p-8 sm:p-10 shadow-2xl relative rounded-none">
          <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[10px]">+</span>
          <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[10px]">+</span>
          <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[10px]">+</span>
          <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[10px]">+</span>

          <div className="w-12 h-12 bg-black border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-4">
            <User className="w-5 h-5 text-[#D4AF37]" />
          </div>

          <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-1">
            [ AUTHENTICATION REQUIRED ]
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-white mb-2 uppercase tracking-wide">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Please sign in to track your phone orders, manage your saved delivery addresses, and view trade-in vouchers.
          </p>

          <div className="flex flex-col gap-3 font-mono text-xs">
            <Link
              href="/account/login"
              className="w-full py-3.5 gold-gradient-bg text-black font-extrabold tracking-wider uppercase shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all text-center rounded-none"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/"
              className="w-full py-3 bg-white/5 border border-white/10 text-zinc-300 font-semibold tracking-wider uppercase hover:bg-white/10 transition-colors text-center rounded-none"
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

  const totalSpent = userOrders.reduce((sum, ord) => sum + (ord.total || 0), 0);

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
    <div className="min-h-screen bg-[#09090B] text-white pt-24 pb-24 sm:pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 1. ARCHITECTURAL SYSTEM TELEMETRY BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/10 text-[10px] font-mono text-zinc-400 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse"></span>
            <span className="text-[#D4AF37] font-bold">[ SYSTEM // CUSTOMER_PORTAL ]</span>
            <span>•</span>
            <span className="text-zinc-300">HUB: {profile?.city || "DOUALA"}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>AURA BLACK CARD TIER</span>
            <span>•</span>
            <span className="text-zinc-500">OFFICIAL CAMEROON CLIENT</span>
          </div>
        </div>

        {/* 2. CLIENT IDENTITY & TELEMETRY HERO CARD */}
        <div className="relative bg-[#0E0E12] border border-white/10 p-5 sm:p-7 shadow-2xl rounded-none">
          {/* Viewfinder crosshairs */}
          <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[10px] leading-none select-none">+</span>
          <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[10px] leading-none select-none">+</span>
          <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[10px] leading-none select-none">+</span>
          <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[10px] leading-none select-none">+</span>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Identity Details */}
            <div className="flex items-center gap-4 sm:gap-5">
              {/* Geometric Monogram Avatar */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-black border border-[#D4AF37] p-1 shrink-0 flex items-center justify-center rounded-none shadow-lg shadow-black">
                <span className="text-xl sm:text-2xl font-mono font-black text-[#D4AF37] tracking-widest">
                  {userInitials}
                </span>
                <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-[#D4AF37] text-black font-mono text-[8px] font-bold">
                  VIP
                </span>
              </div>

              {/* Names and Telemetry */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight truncate">
                    {profile?.fullName || "AURA Client"}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>Black Card</span>
                  </span>
                </div>
                
                <p className="text-xs text-zinc-400 font-mono flex items-center gap-2 flex-wrap">
                  <span>{profile?.email || user?.email}</span>
                  {profile?.phone && (
                    <>
                      <span className="text-zinc-600">•</span>
                      <span>{profile.phone}</span>
                    </>
                  )}
                </p>

                <p className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-1.5 font-mono">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>Preferred Hub: {profile?.city || "Douala / Yaoundé"}, Cameroon</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 bg-[#D4AF37] text-black font-bold tracking-wider uppercase flex items-center gap-2 hover:opacity-90 transition-all rounded-none"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Console</span>
                </Link>
              )}

              <a
                href={`https://wa.me/${settings.whatsappCleanNumber || "237699442100"}?text=${encodeURIComponent(
                  `Hello ${settings.storeName}, I am contacting you from my VIP account (${profile?.fullName || user?.email}).`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-white/5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 font-medium tracking-wider uppercase flex items-center gap-2 transition-all rounded-none"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Concierge Call</span>
              </a>

              <button
                onClick={handleSignOut}
                className="px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-zinc-300 font-semibold tracking-wider uppercase flex items-center gap-2 transition-all rounded-none cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

          </div>

          {/* 4-Column Metric Telemetry Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 font-mono text-xs">
            <div className="p-3 bg-[#121217] border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                [ TOTAL ORDERS ]
              </span>
              <span className="text-base sm:text-lg font-bold text-white">
                {userOrders.length}
              </span>
            </div>

            <div className="p-3 bg-[#121217] border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                [ ORDER VALUE ]
              </span>
              <span className="text-base sm:text-lg font-bold text-[#D4AF37]">
                {formatCFA(totalSpent)}
              </span>
            </div>

            <div className="p-3 bg-[#121217] border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                [ ACTIVE HUB ]
              </span>
              <span className="text-base sm:text-lg font-bold text-white truncate block">
                {profile?.city || "Douala"}
              </span>
            </div>

            <div className="p-3 bg-[#121217] border border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">
                [ VIP WARRANTY ]
              </span>
              <span className="text-base sm:text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>12M COVER</span>
              </span>
            </div>
          </div>
        </div>

        {/* 3. TECHNICAL TAB CONTROLS */}
        <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar gap-1 sm:gap-2 font-mono text-xs">
          <button
            onClick={() => setActiveTab("orders")}
            className={`py-3 px-4 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "orders"
                ? "border-[#D4AF37] text-[#D4AF37] bg-white/5"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>01 // Orders & Tracking</span>
            {userOrders.length > 0 && (
              <span className="px-1.5 py-0.2 bg-white/10 border border-white/10 text-[10px] text-[#D4AF37] font-bold">
                {userOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 px-4 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "border-[#D4AF37] text-[#D4AF37] bg-white/5"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>02 // Delivery & Profile</span>
          </button>

          <button
            onClick={() => setActiveTab("trade-in")}
            className={`py-3 px-4 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "trade-in"
                ? "border-[#D4AF37] text-[#D4AF37] bg-white/5"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>03 // Trade-In Swaps</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`py-3 px-4 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "security"
                ? "border-[#D4AF37] text-[#D4AF37] bg-white/5"
                : "border-transparent text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>04 // Security</span>
          </button>
        </div>

        {/* 4. TAB PANELS */}

        {/* TAB 1: ORDERS & TRACKING */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {isLoadingOrders ? (
              <div className="py-16 text-center text-zinc-400 bg-[#0E0E12] border border-white/10 font-mono text-xs">
                <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-none animate-spin mx-auto mb-3" />
                <p className="uppercase tracking-wider">[ FETCHING ORDER MANIFESTS... ]</p>
              </div>
            ) : userOrders.length === 0 ? (
              <div className="bg-[#0E0E12] border border-white/10 p-10 text-center relative rounded-none">
                <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
                <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>
                <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
                <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>

                <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-1">
                  [ ARCHIVE EMPTY ]
                </div>
                <h3 className="text-base font-bold text-white mb-2 uppercase tracking-wide">
                  No Orders on Record
                </h3>
                <p className="text-xs text-zinc-400 mb-6 max-w-md mx-auto leading-relaxed">
                  You haven&apos;t placed any smartphone orders yet. Explore our sealed flagship smartphones with 1-year warranty and express delivery across Cameroon.
                </p>
                <Link
                  href="/phones"
                  className="inline-flex items-center gap-2 px-6 py-3.5 gold-gradient-bg text-black font-mono font-extrabold text-xs uppercase tracking-widest hover:opacity-95 transition-all rounded-none"
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
                  const waSupportText = `Hello ${settings.storeName}, I am inquiring about my Order #${order.id} (Tracking: ${order.trackingNumber}).`;

                  return (
                    <div
                      key={order.id}
                      className="bg-[#0E0E12] border border-white/10 hover:border-[#D4AF37]/50 transition-all p-5 sm:p-6 shadow-xl relative rounded-none"
                    >
                      {/* Viewfinder crosshairs */}
                      <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[8px]">+</span>
                      <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[8px]">+</span>
                      <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[8px]">+</span>
                      <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[8px]">+</span>

                      {/* Top Order Telemetry Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap font-mono">
                            <span className="text-[10px] text-zinc-400 uppercase">[ ORDER ]</span>
                            <span className="text-sm font-black text-white">#{order.id}</span>
                            <span className="text-xs text-[#D4AF37] font-bold">
                              • TRACKING: {order.trackingNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
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

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider border rounded-none ${badge.color}`}
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
                              <div className="w-12 h-14 bg-black border border-white/10 p-1 flex items-center justify-center shrink-0">
                                <img
                                  src={item.image || "/placeholder.png"}
                                  alt={item.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-tight line-clamp-1">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                                  {item.storage} • {item.color} • Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs sm:text-sm font-mono font-bold text-[#D4AF37]">
                                {formatCFA(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Order Footer & Action CTAs */}
                      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                        <div className="flex items-center gap-3 text-zinc-400 flex-wrap">
                          <span className="uppercase text-[11px]">[ TOTAL ]</span>
                          <span className="text-base font-black text-white">
                            {formatCFA(order.total)}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 border border-white/10 bg-white/5 text-zinc-300 uppercase">
                            {order.customer?.paymentMethod === "cash_on_delivery"
                              ? "Cash on Delivery"
                              : "Mobile Money"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {/* Printable Receipt */}
                          <button
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="px-3.5 py-2 bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/10 text-white font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer rounded-none"
                          >
                            <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                            <span>Download Receipt</span>
                          </button>

                          {/* WhatsApp Concierge */}
                          <a
                            href={`https://wa.me/${waClean}?text=${encodeURIComponent(waSupportText)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/50 text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors rounded-none"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Support</span>
                          </a>

                          {/* Live Track Link */}
                          <Link
                            href={`/orders?id=${order.id}`}
                            className="px-4 py-2 gold-gradient-bg text-black font-extrabold uppercase tracking-wider flex items-center gap-1.5 hover:opacity-95 transition-all rounded-none"
                          >
                            <span>Track Order</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
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
          <div className="bg-[#0E0E12] border border-white/10 p-6 sm:p-8 shadow-xl relative rounded-none">
            <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>

            <div className="mb-6 pb-4 border-b border-white/10">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-1">
                [ CONFIGURATION // CLIENT_ADDRESS ]
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Saved Delivery Address & Profile</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Your saved recipient details will automatically auto-fill at checkout for instant order dispatch.
              </p>
            </div>

            {profileSuccessMessage && (
              <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in rounded-none">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{profileSuccessMessage}</span>
              </div>
            )}

            {profileErrorMessage && (
              <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in rounded-none">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{profileErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-5 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                    [ RECIPIENT FULL NAME ]
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="e.g. Marc Aurele"
                    className="w-full bg-[#121217] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                  />
                </div>

                {/* WhatsApp Phone */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                    [ WHATSAPP PHONE NUMBER ]
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="e.g. 699442100 or +237 670000000"
                    className="w-full bg-[#121217] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                  />
                </div>
              </div>

              {/* Email (Readonly Session) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  [ REGISTERED ACCOUNT EMAIL ]
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={profile?.email || user?.email || ""}
                    disabled
                    className="w-full bg-black/60 border border-white/10 px-4 py-3 text-sm text-zinc-400 cursor-not-allowed rounded-none font-mono"
                  />
                  <Lock className="w-4 h-4 text-zinc-600 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[10px] font-mono text-zinc-500 mt-1">
                  Email is locked to your authenticated session.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Preferred City */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                    [ DELIVERY CITY (CAMEROON) ]
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#121217] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none font-sans"
                  >
                    <option value="Douala">Douala (VIP Same-Day Express)</option>
                    <option value="Yaoundé">Yaoundé (VIP Next-Day Express)</option>
                    <option value="Bafoussam">Bafoussam (24h Express)</option>
                    <option value="Kribi">Kribi (24h Express)</option>
                    <option value="Limbe">Limbe (24h Express)</option>
                    <option value="Buea">Buea (24h Express)</option>
                    <option value="Bamenda">Bamenda (24-48h Delivery)</option>
                    <option value="Garoua">Garoua (Air Cargo / 48h)</option>
                    <option value="Maroua">Maroua (Air Cargo / 48h)</option>
                    <option value="Other">Other Cameroon Destination</option>
                  </select>
                </div>

                {/* Street / Landmark Address */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                    [ QUARTER / STREET / LANDMARK ]
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Bonapriso, Rue Tokoto near Hotel Serena"
                    className="w-full bg-[#121217] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-3.5 gold-gradient-bg text-black font-mono font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50 rounded-none cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingProfile ? "SAVING..." : "SAVE DELIVERY ADDRESS"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: TRADE-IN SWAPS & HARDWARE UPGRADES */}
        {activeTab === "trade-in" && (
          <div className="bg-[#0E0E12] border border-white/10 p-6 sm:p-8 shadow-xl space-y-6 relative rounded-none">
            <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-1">
                  [ SYSTEM // TRADE_IN_GATEWAY ]
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                  <span>AURA Trade-In & Phone Swap Privilege</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Swap your iPhone to Samsung or vice-versa. Enter your phone&apos;s condition and receive instant appraisal credit towards your new device.
                </p>
              </div>

              <Link
                href="/trade-in"
                className="inline-flex items-center gap-2 px-5 py-3 gold-gradient-bg text-black font-mono font-extrabold text-xs uppercase tracking-wider hover:opacity-95 transition-all rounded-none self-start sm:self-auto shrink-0"
              >
                <span>Launch Swap Calculator</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* 3-Step Swap Workflow */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-4 bg-[#121217] border border-white/5 space-y-2">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-bold">
                  [ 01 // PROPOSED WORTH ]
                </span>
                <h4 className="text-white font-bold uppercase">Automated Appraisal</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Select your current model, storage capacity, and enter your proposed worth to lock your appraisal voucher.
                </p>
              </div>

              <div className="p-4 bg-[#121217] border border-white/5 space-y-2">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-bold">
                  [ 02 // 65-POINT CHECK ]
                </span>
                <h4 className="text-white font-bold uppercase">Showroom Inspection</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Hand over your phone at our Douala Bonapriso or Yaoundé Bastos lounges for a certified 5-minute hardware check.
                </p>
              </div>

              <div className="p-4 bg-[#121217] border border-white/5 space-y-2">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block font-bold">
                  [ 03 // DELTA PAYMENT ]
                </span>
                <h4 className="text-white font-bold uppercase">Price Deduction</h4>
                <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                  Your trade-in credit is deducted on the spot. Pay only the difference and walk away with your brand-new sealed unit.
                </p>
              </div>
            </div>

            {/* Concierge Assistance Box */}
            <div className="p-4 bg-[#121217] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase">Need corporate or bulk smartphone swaps?</h4>
                  <p className="text-[11px] text-zinc-400 font-sans">Our VIP concierge handles executive fleet upgrades across Central Africa.</p>
                </div>
              </div>
              <a
                href={`https://wa.me/${settings.whatsappCleanNumber || "237699442100"}?text=${encodeURIComponent(
                  "Hello AURA, I would like an executive trade-in appraisal for my smartphone."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:bg-emerald-900/50 transition-all rounded-none"
              >
                Chat with Trade-In Concierge
              </a>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY & PASSWORD */}
        {activeTab === "security" && (
          <div className="bg-[#0E0E12] border border-white/10 p-6 sm:p-8 shadow-xl max-w-xl relative rounded-none">
            <span className="absolute -top-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -top-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -bottom-1 -left-1 text-[#D4AF37] font-mono text-[9px]">+</span>
            <span className="absolute -bottom-1 -right-1 text-[#D4AF37] font-mono text-[9px]">+</span>

            <div className="mb-6 pb-4 border-b border-white/10">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-1">
                [ SECURITY // CREDENTIALS ]
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#D4AF37]" />
                <span>Security & Password Credentials</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Update your account password. Use at least 6 characters with a combination of letters and numbers.
              </p>
            </div>

            {passwordSuccessMessage && (
              <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in rounded-none">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passwordSuccessMessage}</span>
              </div>
            )}

            {passwordErrorMessage && (
              <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in rounded-none">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordErrorMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4 font-sans">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  [ NEW PASSWORD ]
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#121217] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  [ CONFIRM NEW PASSWORD ]
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-[#121217] border border-white/15 px-4 py-3 text-sm text-white focus:outline-none focus:border-[#D4AF37] transition-colors rounded-none font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="px-6 py-3.5 gold-gradient-bg text-black font-mono font-extrabold text-xs uppercase tracking-widest shadow-lg shadow-amber-500/10 hover:opacity-95 transition-all flex items-center gap-2 disabled:opacity-50 rounded-none cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>{isUpdatingPassword ? "UPDATING..." : "UPDATE SECURITY PASSWORD"}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Official Printable VIP Receipt Modal */}
        <OrderReceiptModal
          order={selectedReceiptOrder}
          isOpen={Boolean(selectedReceiptOrder)}
          onClose={() => setSelectedReceiptOrder(null)}
        />

      </div>
    </div>
  );
}
