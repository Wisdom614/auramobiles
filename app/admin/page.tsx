"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Smartphone,
  ShoppingBag,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Upload,
  Trash2,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Database,
  X,
  Store,
  Shield,
  ShieldCheck,
  KeyRound,
  Users,
  LogOut,
  UserPlus,
  Lock,
  SlidersHorizontal,
  MapPin,
  Mail,
  Clock,
  Truck,
  PhoneCall,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { Phone, PHONES } from "@/lib/data/phones";
import { Order, INITIAL_ORDERS, OrderStatus } from "@/lib/data/mock-orders";
import { useSettings, DEFAULT_SETTINGS, SiteSettings } from "@/lib/store/settings-context";
import {
  supabase,
  getPhonesFromDB,
  insertPhoneToDB,
  updatePhoneInDB,
  deletePhoneFromDB,
  seedCatalogToDB,
  getOrdersFromDB,
  updateOrderStatusInDB,
  getTradeInsFromDB,
  updateTradeInStatusInDB,
  TradeInRecord,
  SUPER_ADMIN_EMAIL,
  isAuthorizedAdmin,
  getAdminUsersFromDB,
  addAdminUserToDB,
  removeAdminUserFromDB,
  AdminUserRecord,
} from "@/lib/supabase/client";
import { uploadToCloudinary } from "@/lib/cloudinary/upload";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "inventory" | "orders" | "trade-ins" | "site-settings" | "settings">("overview");

  // Boutique Site Settings State
  const { settings, updateSettings } = useSettings();
  const [siteForm, setSiteForm] = useState<SiteSettings>(settings);
  const [isSavingSiteSettings, setIsSavingSiteSettings] = useState(false);

  useEffect(() => {
    setSiteForm(settings);
  }, [settings]);

  // Auth State
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Business Data State
  const [phones, setPhones] = useState<Phone[]>(PHONES);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [tradeIns, setTradeIns] = useState<TradeInRecord[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserRecord[]>([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Search & Filter
  const [phoneSearch, setPhoneSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");

  // Add Phone Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newPhone, setNewPhone] = useState({
    name: "",
    brand: "Apple" as Phone["brand"],
    condition: "Brand New" as Phone["condition"],
    basePrice: 650000,
    originalPrice: 720000,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    stockCount: 8,
    storage: "256GB",
    colorName: "Natural Titanium",
    colorHex: "#9A958E",
    screen: "6.7\" Super Retina XDR OLED",
    processor: "Apple A18 Pro (3nm)",
    battery: "4,685 mAh",
    rearCamera: "48MP Main + 12MP 5x Telephoto + 48MP Ultrawide",
  });

  // Settings & Team Forms State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminFullName, setNewAdminFullName] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "super_admin">("admin");
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // Toast Notification
  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Check Authentication & Authorizations on mount
  useEffect(() => {
    async function checkAuthAndLoad() {
      setIsLoading(true);

      if (!supabase) {
        setIsSupabaseConnected(false);
        // In local mode without Supabase credentials, allow local demo owner
        setCurrentUserEmail(SUPER_ADMIN_EMAIL);
        setCurrentUserName("Wisdom Besong (Owner)");
        setIsSuperAdmin(true);
        setIsAuthorized(true);
        setAuthChecked(true);
        setIsLoading(false);
        return;
      }

      setIsSupabaseConnected(true);

      // Check Supabase session
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;

      if (!sessionUser?.email) {
        // Not logged in -> redirect to /admin/login
        setAuthChecked(true);
        setIsAuthorized(false);
        setIsLoading(false);
        router.replace("/admin/login");
        return;
      }

      const email = sessionUser.email;
      const authorized = await isAuthorizedAdmin(email);

      if (!authorized) {
        // Logged in but not on the admin roster
        setCurrentUserEmail(email);
        setIsAuthorized(false);
        setAuthChecked(true);
        setIsLoading(false);
        return;
      }

      // Authorized admin
      setCurrentUserEmail(email);
      setCurrentUserName(sessionUser.user_metadata?.full_name || email.split("@")[0]);
      setIsSuperAdmin(email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase());
      setIsAuthorized(true);
      setAuthChecked(true);

      // Load all business data
      const [dbPhones, dbOrders, dbTradeIns, dbAdmins] = await Promise.all([
        getPhonesFromDB(),
        getOrdersFromDB(),
        getTradeInsFromDB(),
        getAdminUsersFromDB(),
      ]);

      if (dbPhones && dbPhones.length > 0) setPhones(dbPhones);
      if (dbOrders && dbOrders.length > 0) {
        setOrders(dbOrders);
      } else {
        try {
          const savedOrders = localStorage.getItem("aura_orders_v1");
          if (savedOrders) setOrders(JSON.parse(savedOrders));
        } catch {}
      }

      if (dbTradeIns && dbTradeIns.length > 0) setTradeIns(dbTradeIns);
      if (dbAdmins && dbAdmins.length > 0) setAdminUsers(dbAdmins);

      setIsLoading(false);
    }

    checkAuthAndLoad();

    // Listen to Auth State Changes
    if (supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_OUT" || !session?.user) {
          router.replace("/admin/login");
        }
      });
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [router]);

  // Handle Logout
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.replace("/admin/login");
  };

  // Handle Seeding Supabase Catalog
  const handleSeedCatalog = async () => {
    if (!supabase) {
      showToast("Supabase is not configured in .env", "error");
      return;
    }
    showToast("Seeding catalog to Supabase...", "info");
    const result = await seedCatalogToDB();
    if (result.error) {
      showToast(`Seeding error: ${result.error}`, "error");
    } else {
      showToast(`Successfully seeded ${result.count} flagship phones to Supabase!`, "success");
      const updated = await getPhonesFromDB();
      if (updated) setPhones(updated);
    }
  };

  // Handle Image Upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    showToast("Uploading image to Cloudinary...", "info");

    const res = await uploadToCloudinary(file);
    setIsUploadingImage(false);

    if (res.error) {
      showToast(`Upload warning: ${res.error}`, "error");
    } else {
      setNewPhone((prev) => ({ ...prev, thumbnail: res.url }));
      showToast("Image uploaded successfully!", "success");
    }
  };

  // Handle Add Phone
  const handleCreatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newPhone.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const id = `phone-${Date.now()}`;

    const created: Phone = {
      id,
      slug,
      name: newPhone.name,
      brand: newPhone.brand,
      tagline: `${newPhone.name} - Luxury Edition`,
      category: "flagship",
      basePrice: Number(newPhone.basePrice),
      originalPrice: newPhone.originalPrice ? Number(newPhone.originalPrice) : undefined,
      rating: 4.9,
      reviewCount: 1,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      condition: newPhone.condition,
      warranty: newPhone.condition === "Brand New" ? "12 Months Official Boutique Warranty" : "6 Months Boutique Warranty",
      images: [newPhone.thumbnail],
      storageVariants: [
        {
          id: `${id}-s1`,
          size: newPhone.storage,
          price: Number(newPhone.basePrice),
          stock: Number(newPhone.stockCount),
        },
      ],
      colorVariants: [
        {
          id: `${id}-c1`,
          name: newPhone.colorName,
          hex: newPhone.colorHex,
          image: newPhone.thumbnail,
        },
      ],
      specs: {
        screen: newPhone.screen,
        processor: newPhone.processor,
        ram: "12GB LPDDR5X",
        rearCamera: newPhone.rearCamera,
        frontCamera: "32MP HDR Camera",
        battery: newPhone.battery,
        charging: "45W Fast Charging",
        os: "Latest Flagship OS",
        network: "5G Ultra Wideband",
        weight: "210g",
        waterResistance: "IP68 Certified",
      },
      highlights: ["100% Genuine Sealed Unit", "Boutique Concierge Warranty", "VIP Handover Available"],
      boxContents: ["Device", "Fast Charging Cable", "Boutique Authentication Card"],
    };

    if (supabase) {
      const ok = await insertPhoneToDB(created);
      if (!ok) {
        showToast("Saved locally (Supabase write failed or schema not created yet)", "info");
      } else {
        showToast(`"${created.name}" saved directly to Supabase!`, "success");
      }
    } else {
      showToast(`"${created.name}" saved to local boutique session!`, "success");
    }

    setPhones((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
  };

  // Toggle In Stock status
  const handleToggleStock = async (phone: Phone) => {
    const currentStock = phone.storageVariants.reduce((sum, v) => sum + v.stock, 0);
    const newVariants = phone.storageVariants.map((v) => ({
      ...v,
      stock: currentStock > 0 ? 0 : 5,
    }));

    const updatedPhone = { ...phone, storageVariants: newVariants };

    setPhones((prev) =>
      prev.map((p) => (p.id === phone.id ? updatedPhone : p))
    );

    if (supabase) {
      await insertPhoneToDB(updatedPhone);
      showToast(`Updated stock status for ${phone.name}`);
    }
  };

  // Delete Phone
  const handleDeletePhone = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from inventory?`)) return;

    setPhones((prev) => prev.filter((p) => p.id !== id));
    if (supabase) {
      await deletePhoneFromDB(id);
    }
    showToast(`Removed "${name}" from catalog.`);
  };

  // Update Order Status
  const handleOrderStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map((o) => {
      if (o.id !== orderId) return o;
      const updatedTimeline = o.timeline.map((step) => {
        if (step.status === newStatus) return { ...step, completed: true, timestamp: "Updated just now" };
        return step;
      });
      return { ...o, status: newStatus, timeline: updatedTimeline };
    });

    setOrders(updated);
    try {
      localStorage.setItem("aura_orders_v1", JSON.stringify(updated));
    } catch {}

    if (supabase) {
      const target = updated.find((o) => o.id === orderId);
      if (target) {
        await updateOrderStatusInDB(orderId, newStatus, target.timeline);
      }
    }
    showToast(`Order ${orderId} status set to: ${newStatus.toUpperCase()}`);
  };

  // Update Trade-In status
  const handleTradeInStatusChange = async (id: string, status: TradeInRecord["status"]) => {
    setTradeIns((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    if (supabase) {
      await updateTradeInStatusInDB(id, status);
    }
    showToast(`Trade-in ${id} status updated to ${status.toUpperCase()}`);
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }

    if (!supabase) {
      showToast("Supabase is not configured.", "error");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      setIsChangingPassword(false);
      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Password updated successfully!", "success");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      setIsChangingPassword(false);
      showToast(err.message || "Failed to update password", "error");
    }
  };

  // Add New Administrator
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail) return;

    setIsAddingAdmin(true);
    const res = await addAdminUserToDB(
      newAdminEmail,
      newAdminFullName,
      newAdminRole,
      currentUserEmail || "Super Admin"
    );
    setIsAddingAdmin(false);

    if (!res.success) {
      showToast(res.error || "Failed to add admin", "error");
    } else {
      showToast(`Authorized ${newAdminEmail} as ${newAdminRole.toUpperCase()}!`, "success");
      setNewAdminEmail("");
      setNewAdminFullName("");
      const updated = await getAdminUsersFromDB();
      setAdminUsers(updated);
    }
  };

  // Remove Administrator
  const handleRemoveAdmin = async (email: string) => {
    if (!confirm(`Revoke administrator access for ${email}?`)) return;

    const res = await removeAdminUserFromDB(email);
    if (!res.success) {
      showToast(res.error || "Failed to remove admin", "error");
    } else {
      showToast(`Revoked access for ${email}`);
      const updated = await getAdminUsersFromDB();
      setAdminUsers(updated);
    }
  };

  // Save Boutique Site Settings
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSiteSettings(true);
    try {
      const ok = await updateSettings(siteForm);
      if (ok) {
        showToast("Boutique settings saved to Supabase & broadcast system-wide!", "success");
      } else {
        showToast("Boutique settings saved locally!", "info");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to update settings", "error");
    } finally {
      setIsSavingSiteSettings(false);
    }
  };

  // Reset Boutique Site Settings
  const handleResetSiteSettings = async () => {
    if (confirm("Reset all boutique settings to official factory defaults?")) {
      setIsSavingSiteSettings(true);
      setSiteForm(DEFAULT_SETTINGS);
      await updateSettings(DEFAULT_SETTINGS);
      setIsSavingSiteSettings(false);
      showToast("Boutique settings restored to defaults.", "info");
    }
  };

  // Loading Screen
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin mb-4" />
        <p className="text-sm font-semibold tracking-wide text-white/70">
          Verifying boutique security credentials...
        </p>
      </div>
    );
  }

  // Access Denied Screen (Logged in but email is not on admin roster)
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#09090B] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold mb-2">Access Restricted</h1>
        <p className="text-xs text-white/60 max-w-md mb-6 leading-relaxed">
          The account <strong className="text-white">{currentUserEmail}</strong> is not recognized as an authorized AURA Luxe boutique administrator.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white border border-white/20 transition"
          >
            Sign Out & Switch Account
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-black text-xs font-bold transition"
          >
            Return to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // Metrics
  const totalRevenueFCFA = orders.reduce((acc, o) => acc + o.total, 0);
  const activeStockCount = phones.reduce(
    (acc, p) => acc + p.storageVariants.reduce((sum, v) => sum + v.stock, 0),
    0
  );
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "placed" || o.status === "confirmed" || o.status === "preparing"
  ).length;
  const pendingTradeInsCount = tradeIns.filter((t) => t.status === "pending").length;

  const filteredPhones = phones.filter(
    (p) =>
      p.name.toLowerCase().includes(phoneSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(phoneSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.phone.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customer.city.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md animate-fade-in ${
            statusMessage.type === "success"
              ? "bg-[#121217]/95 border-[#D4AF37]/50 text-[#F3E5AB]"
              : statusMessage.type === "error"
              ? "bg-red-950/95 border-red-500/50 text-red-200"
              : "bg-blue-950/95 border-blue-500/50 text-blue-200"
          }`}
        >
          {statusMessage.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#D4AF37]" />}
          {statusMessage.type === "error" && <AlertCircle className="w-5 h-5 text-red-400" />}
          {statusMessage.type === "info" && <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />}
          <span className="text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0D0D12]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#17171F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] font-bold text-lg">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-semibold tracking-wide text-white">
                  AURA LUXE BOUTIQUE
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase">
                  {isSuperAdmin ? "Super Admin" : "Admin"}
                </span>
              </div>
              <p className="text-xs text-white/50">Central Africa Luxury Smartphone Operations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Supabase Connection Status Indicator */}
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isSupabaseConnected
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-950/40 border-amber-500/30 text-amber-300"
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConnected ? "Supabase Connected" : "Local Mock Storage"}</span>
            </div>

            {/* Current Admin User Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#17171F] border border-white/10 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-white/80 font-medium truncate max-w-[160px]">
                {currentUserEmail}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-semibold transition"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 text-xs font-medium transition"
            >
              <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Storefront</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 overflow-x-auto gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "overview"
                  ? "bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "inventory"
                  ? "bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Inventory ({phones.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition relative ${
                activeTab === "orders"
                  ? "bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("trade-ins")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "trade-ins"
                  ? "bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Trade-Ins ({tradeIns.length})</span>
              {pendingTradeInsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold">
                  {pendingTradeInsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("site-settings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "site-settings"
                  ? "bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Site Settings</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === "settings"
                  ? "bg-[#D4AF37] text-black font-semibold shadow-lg shadow-[#D4AF37]/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Team & Security</span>
            </button>
          </div>

          {activeTab === "inventory" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F26] text-black font-semibold text-sm hover:brightness-110 transition shadow-lg shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Phone</span>
            </button>
          )}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#121217] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between text-white/50 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
                  <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {formatCFA(totalRevenueFCFA)}
                </div>
                <div className="text-xs text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Real orders placed</span>
                </div>
              </div>

              <div className="bg-[#121217] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between text-white/50 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Pending Fulfillment</span>
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{pendingOrdersCount}</div>
                <div className="text-xs text-amber-400/80">Requires boutique confirmation</div>
              </div>

              <div className="bg-[#121217] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between text-white/50 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Flagship Stock Units</span>
                  <Smartphone className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{activeStockCount} Units</div>
                <div className="text-xs text-white/50">{phones.length} active models listed</div>
              </div>

              <div className="bg-[#121217] border border-white/10 rounded-2xl p-5">
                <div className="flex items-center justify-between text-white/50 mb-3">
                  <span className="text-xs uppercase tracking-wider font-semibold">Trade-In Requests</span>
                  <RefreshCw className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{pendingTradeInsCount} Pending</div>
                <div className="text-xs text-purple-300">Awaiting boutique inspection</div>
              </div>
            </div>

            {/* Supabase Database Seed / Sync Banner */}
            <div className="bg-gradient-to-r from-[#17171F] via-[#121217] to-[#17171F] border border-[#D4AF37]/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#D4AF37]/5 to-transparent pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-[#D4AF37]" />
                    <h2 className="text-lg font-bold text-white">Supabase Cloud Sync & Catalog Seeder</h2>
                  </div>
                  <p className="text-sm text-white/70 max-w-xl">
                    Populate your Supabase database with all 15 default luxury flagship models in one click.
                  </p>
                </div>
                <button
                  onClick={handleSeedCatalog}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-sm transition shadow-xl shrink-0"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Seed Catalog to Supabase</span>
                </button>
              </div>
            </div>

            {/* Quick Overview Table: Recent Orders */}
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-white">Recent Client Orders</h3>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-semibold text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <span>View all orders</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-medium">Order ID</th>
                      <th className="pb-3 font-medium">Client</th>
                      <th className="pb-3 font-medium">City</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Payment</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 font-mono text-[#D4AF37] font-semibold">{order.id}</td>
                        <td className="py-3.5 text-white font-medium">{order.customer.fullName}</td>
                        <td className="py-3.5 text-white/70">{order.customer.city}</td>
                        <td className="py-3.5 text-white font-bold">{formatCFA(order.total)}</td>
                        <td className="py-3.5 text-white/60 capitalize">
                          {order.customer.paymentMethod.replace("_", " ")}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              order.status === "completed"
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/30"
                                : order.status === "delivering"
                                ? "bg-blue-950/60 text-blue-300 border border-blue-500/30"
                                : "bg-amber-950/60 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeTab === "inventory" && (
          <div className="space-y-6 animate-fade-in">
            {/* Search and count bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search brand or model..."
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  className="w-full bg-[#121217] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="text-xs text-white/60">
                Showing <strong className="text-white">{filteredPhones.length}</strong> of{" "}
                {phones.length} phones
              </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#121217] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-medium">Device</th>
                      <th className="py-3.5 px-4 font-medium">Condition</th>
                      <th className="py-3.5 px-4 font-medium">Price (FCFA)</th>
                      <th className="py-3.5 px-4 font-medium">Stock Status</th>
                      <th className="py-3.5 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredPhones.map((phone) => {
                      const totalStock = phone.storageVariants.reduce((sum, v) => sum + v.stock, 0);
                      const inStock = totalStock > 0;

                      return (
                        <tr key={phone.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 p-1 flex items-center justify-center shrink-0 relative overflow-hidden">
                                <Image
                                  src={phone.images[0] || "/placeholder.png"}
                                  alt={phone.name}
                                  width={48}
                                  height={48}
                                  unoptimized
                                  className="object-contain max-h-full"
                                />
                              </div>
                              <div>
                                <div className="font-semibold text-white">{phone.name}</div>
                                <div className="text-xs text-white/50">{phone.brand} • {phone.storageVariants[0]?.size || "256GB"}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                                phone.condition === "Brand New"
                                  ? "bg-[#D4AF37]/15 text-[#F3E5AB] border border-[#D4AF37]/30"
                                  : "bg-white/10 text-white/80 border border-white/20"
                              }`}
                            >
                              {phone.condition.toUpperCase()}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-white">
                            {formatCFA(phone.basePrice)}
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleStock(phone)}
                              className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                                inStock
                                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/60"
                                  : "bg-red-950/40 text-red-400 border-red-500/30 hover:bg-red-950/60"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  inStock ? "bg-emerald-400" : "bg-red-400"
                                }`}
                              />
                              <span>{inStock ? `In Stock (${totalStock})` : "Out of Stock"}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/phones/${phone.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition"
                                title="View on storefront"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() => handleDeletePhone(phone.id, phone.name)}
                                className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition"
                                title="Delete phone"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-fade-in">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search by ID, client, or phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#121217] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="text-xs text-white/60">
                Total Orders: <strong className="text-white">{orders.length}</strong>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-[#121217] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-medium">Order ID & Date</th>
                      <th className="py-3.5 px-4 font-medium">Client & WhatsApp</th>
                      <th className="py-3.5 px-4 font-medium">Items</th>
                      <th className="py-3.5 px-4 font-medium">Total FCFA</th>
                      <th className="py-3.5 px-4 font-medium">Update Status</th>
                      <th className="py-3.5 px-4 font-medium text-right">Dispatch</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map((order) => {
                      const cleanPhone = order.customer.phone.replace(/[^0-9]/g, "");
                      const waLink = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                        order.customer.fullName
                      )},%20this%20is%20AURA%20Luxe%20Mobile%20regarding%20your%20Order%20${order.id}.`;

                      return (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-[#D4AF37]">{order.id}</div>
                            <div className="text-xs text-white/40">
                              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-white">{order.customer.fullName}</div>
                            <div className="text-xs text-white/60">{order.customer.phone}</div>
                            <div className="text-xs text-white/40 capitalize">{order.customer.city}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="text-xs text-white/80">
                                  {it.quantity}x {it.name} ({it.storage})
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{formatCFA(order.total)}</div>
                            <div className="text-[11px] text-white/50 capitalize">
                              {order.customer.paymentMethod.replace("_", " ")}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value as any)}
                              className="bg-[#17171F] border border-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:border-[#D4AF37] focus:outline-none"
                            >
                              <option value="placed">Placed (Received)</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing Package</option>
                              <option value="delivering">Out for Delivery</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-bold transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRADE-INS APPRAISALS */}
        {activeTab === "trade-ins" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-[#121217] border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 text-xs uppercase tracking-wider">
                      <th className="py-3.5 px-4 font-medium">Trade-In ID</th>
                      <th className="py-3.5 px-4 font-medium">Client Info</th>
                      <th className="py-3.5 px-4 font-medium">Exchanged Device</th>
                      <th className="py-3.5 px-4 font-medium">Condition</th>
                      <th className="py-3.5 px-4 font-medium">Voucher Value</th>
                      <th className="py-3.5 px-4 font-medium">Status</th>
                      <th className="py-3.5 px-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tradeIns.map((item) => {
                      const cleanPhone = item.phone.replace(/[^0-9]/g, "");
                      const waLink = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                        item.client_name
                      )},%20this%20is%20AURA%20Luxe%20Mobile%20regarding%20your%20Trade-In%20Appraisal%20for%20the%20${encodeURIComponent(
                        item.model
                      )}%20(Voucher:%20${item.voucher_code}).`;

                      return (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#D4AF37]">{item.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-white">{item.client_name}</div>
                            <div className="text-xs text-white/60">{item.phone}</div>
                            <div className="text-xs text-white/40">{item.city}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {item.brand} {item.model}
                          </td>
                          <td className="py-3.5 px-4 text-xs text-white/80">{item.condition}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400">
                            {formatCFA(item.valuation_fcfa)}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={item.status}
                              onChange={(e) => handleTradeInStatusChange(item.id, e.target.value as any)}
                              className="bg-[#17171F] border border-white/20 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:border-[#D4AF37] focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40 text-xs font-bold hover:bg-[#25D366]/30 transition"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Offer</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: BOUTIQUE & SITE CONFIGURATION */}
        {activeTab === "site-settings" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header & Quick Save Bar */}
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#17171F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <span>Boutique & System Configuration</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase">
                      Live Settings
                    </span>
                  </h2>
                  <p className="text-xs text-white/50">
                    All system modules (storefront, navbar, footer, checkout, support) adapt dynamically to these values.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetSiteSettings}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-semibold transition"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleSaveSiteSettings}
                  disabled={isSavingSiteSettings}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F26] text-black font-bold text-xs hover:brightness-110 transition shadow-lg shadow-[#D4AF37]/15 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSavingSiteSettings ? "Broadcasting..." : "Save Settings"}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSiteSettings} className="space-y-8">
              {/* SECTION 1: BRAND IDENTITY & ANNOUNCEMENT BAR */}
              <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <Store className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      1. Brand Identity & Header Announcement
                    </h3>
                    <p className="text-xs text-white/50">
                      Controls the store name in navigation, footer, metadata, and top announcement banner
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteForm.storeName}
                      onChange={(e) => setSiteForm({ ...siteForm, storeName: e.target.value })}
                      placeholder="e.g. AURA LUXE MOBILE"
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Brand Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={siteForm.tagline}
                      onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                      placeholder="e.g. Central Africa's Premier Luxury Smartphone Boutique"
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Storefront Top Announcement Bar Message
                  </label>
                  <input
                    type="text"
                    value={siteForm.announcementText}
                    onChange={(e) => setSiteForm({ ...siteForm, announcementText: e.target.value })}
                    placeholder="e.g. Free VIP delivery on orders over FCFA 500,000 • 100% Genuine Sealed Devices"
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                  <div className="mt-2.5 p-3 rounded-xl bg-[#09090B] border border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Free delivery over FCFA {siteForm.freeDeliveryThreshold?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#D4AF37] font-medium">
                      <span>Live Preview:</span>
                      <span className="text-zinc-200 truncate max-w-[280px] sm:max-w-md">
                        {siteForm.announcementText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONCIERGE & DIRECT CONTACTS */}
              <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <PhoneCall className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      2. Concierge Desk & Client Contacts
                    </h3>
                    <p className="text-xs text-white/50">
                      Direct phone, WhatsApp order dispatch, and customer support channels
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Official WhatsApp Business Line *
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={siteForm.whatsappPhone}
                        onChange={(e) => setSiteForm({ ...siteForm, whatsappPhone: e.target.value })}
                        placeholder="+237 699 44 21 00"
                        className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-white/40 block mt-1">
                      Used for WhatsApp checkout & quick order confirmations.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Direct Telephone Line
                    </label>
                    <div className="relative">
                      <PhoneCall className="w-4 h-4 text-[#D4AF37] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={siteForm.secondaryPhone}
                        onChange={(e) => setSiteForm({ ...siteForm, secondaryPhone: e.target.value })}
                        placeholder="+237 677 88 99 00"
                        className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-white/40 block mt-1">
                      Shown on footer, contact page, and order receipts.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Support / Concierge Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={siteForm.supportEmail}
                        onChange={(e) => setSiteForm({ ...siteForm, supportEmail: e.target.value })}
                        placeholder="concierge@auraluxe.cm"
                        className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                      />
                    </div>
                    <span className="text-[10px] text-white/40 block mt-1">
                      Official email for client inquiries and order invoices.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PHYSICAL FLAGSHIP BOUTIQUES */}
              <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      3. Physical Flagship Lounges & Working Hours
                    </h3>
                    <p className="text-xs text-white/50">
                      Physical locations for client pickups, trade-in device inspections, and luxury lounges
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Douala Flagship Showroom Address
                    </label>
                    <input
                      type="text"
                      value={siteForm.doualaAddress}
                      onChange={(e) => setSiteForm({ ...siteForm, doualaAddress: e.target.value })}
                      placeholder="Rue Tokoto, Bonapriso, Douala"
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Yaoundé Bastos Lounge Address
                    </label>
                    <input
                      type="text"
                      value={siteForm.yaoundeAddress}
                      onChange={(e) => setSiteForm({ ...siteForm, yaoundeAddress: e.target.value })}
                      placeholder="Avenue Bastos, Face Ambassade, Yaoundé"
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Operating / Concierge Hours
                  </label>
                  <div className="relative max-w-md">
                    <Clock className="w-4 h-4 text-[#D4AF37] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={siteForm.openingHours}
                      onChange={(e) => setSiteForm({ ...siteForm, openingHours: e.target.value })}
                      placeholder="Mon - Sat: 08:30 – 19:30"
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: DELIVERY FEES & FREE THRESHOLD */}
              <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <Truck className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      4. Logistics, Delivery Fees & Free Delivery Minimum
                    </h3>
                    <p className="text-xs text-white/50">
                      Calculates delivery costs automatically at checkout in Douala, Yaoundé, and nationwide
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Douala & Yaoundé Local Express Fee (FCFA)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={siteForm.deliveryFeeDoualaYaounde}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, deliveryFeeDoualaYaounde: Number(e.target.value) })
                      }
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono font-bold text-amber-300"
                    />
                    <span className="text-[10px] text-white/40 block mt-1">
                      Same-day courier to customer doorsteps in Douala/Yaoundé.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Nationwide Secured Transit Fee (FCFA)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={500}
                      value={siteForm.deliveryFeeNationwide}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, deliveryFeeNationwide: Number(e.target.value) })
                      }
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono font-bold text-amber-300"
                    />
                    <span className="text-[10px] text-white/40 block mt-1">
                      Secured transit to Bafoussam, Garoua, Bamenda, Kribi, etc.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Free VIP Delivery Minimum Order (FCFA)
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={10000}
                      value={siteForm.freeDeliveryThreshold}
                      onChange={(e) =>
                        setSiteForm({ ...siteForm, freeDeliveryThreshold: Number(e.target.value) })
                      }
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono font-bold text-emerald-400"
                    />
                    <span className="text-[10px] text-white/40 block mt-1">
                      Orders reaching this amount enjoy complimentary zero-fee delivery.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: MOBILE MONEY PAYMENT INSTRUCTIONS */}
              <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      5. Local Cameroon Mobile Money Instructions
                    </h3>
                    <p className="text-xs text-white/50">
                      Displayed on checkout page when customers select MTN Mobile Money or Orange Money
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      MTN Mobile Money Instructions / Number
                    </label>
                    <input
                      type="text"
                      value={siteForm.mtnMomoNumber}
                      onChange={(e) => setSiteForm({ ...siteForm, mtnMomoNumber: e.target.value })}
                      placeholder="e.g. *126# / 677 88 99 00"
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Orange Money Instructions / Number
                    </label>
                    <input
                      type="text"
                      value={siteForm.orangeMoneyNumber}
                      onChange={(e) => setSiteForm({ ...siteForm, orangeMoneyNumber: e.target.value })}
                      placeholder="e.g. #150# / 699 44 21 00"
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM FLOATING SAVE BAR */}
              <div className="p-4 rounded-2xl bg-[#0F0F14] border border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-2xl backdrop-blur-md">
                <div className="text-xs text-white/70 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    Settings automatically synchronize across Supabase cloud and client browsers.
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetSiteSettings}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 text-xs font-semibold transition flex-1 sm:flex-initial"
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingSiteSettings}
                    className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F26] text-black font-bold text-xs hover:brightness-110 transition shadow-lg shadow-[#D4AF37]/20 flex items-center justify-center gap-2 flex-1 sm:flex-initial disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSavingSiteSettings ? "Saving Settings..." : "Save Boutique Settings"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* TAB 6: TEAM & SECURITY MANAGEMENT */}
        {activeTab === "settings" && (
          <div className="space-y-8 animate-fade-in">
            {/* Grid 2 Columns: Profile/Password & Add Admin */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Card & Password Reset */}
              <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#17171F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Administrator Profile</h2>
                    <p className="text-xs text-white/50">Your active boutique credentials</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Active Email:</span>
                    <strong className="text-white font-mono">{currentUserEmail}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Access Level:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 uppercase">
                      {isSuperAdmin ? "Primary Super Administrator" : "Boutique Administrator"}
                    </span>
                  </div>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-3 pt-2 border-t border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Change Security Password</span>
                  </h3>

                  <div>
                    <label className="block text-[11px] text-white/70 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-white/70 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs transition shadow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isChangingPassword ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>

              {/* Authorize New Admin Card */}
              <div className="bg-[#121217] border border-white/10 rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#17171F] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Authorize New Administrator</h2>
                    <p className="text-xs text-white/50">Grant dashboard access to trusted boutique staff</p>
                  </div>
                </div>

                <form onSubmit={handleAddAdmin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Staff Member Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="colleague@auramobiles.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Marie Claire"
                      value={newAdminFullName}
                      onChange={(e) => setNewAdminFullName(e.target.value)}
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">Privilege Role</label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as any)}
                      className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="admin">Administrator (Orders, Inventory & Trade-ins)</option>
                      <option value="super_admin">Super Administrator (Full Team & DB Access)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingAdmin}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F26] text-black font-bold text-xs hover:brightness-110 transition shadow flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isAddingAdmin ? "Authorizing..." : "Grant Admin Privileges"}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Admin Team Table */}
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Authorized Boutique Team Roster</h3>
                  <p className="text-xs text-white/50">Personnel authorized to access the AURA Luxe operations portal</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-white/70 border border-white/10">
                  {adminUsers.length} Active Admins
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                      <th className="pb-3 font-medium">Administrator</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Added By</th>
                      <th className="pb-3 font-medium">Member Since</th>
                      <th className="pb-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {adminUsers.map((admin) => {
                      const isOwner = admin.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

                      return (
                        <tr key={admin.id} className="hover:bg-white/[0.02]">
                          <td className="py-3.5">
                            <div className="font-medium text-white flex items-center gap-2">
                              <span>{admin.full_name || "Administrator"}</span>
                              {isOwner && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#D4AF37] text-black uppercase">
                                  Owner
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-mono text-white/50">{admin.email}</div>
                          </td>

                          <td className="py-3.5">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                admin.role === "super_admin"
                                  ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30"
                                  : "bg-white/10 text-white/80 border border-white/20"
                              }`}
                            >
                              {admin.role.replace("_", " ")}
                            </span>
                          </td>

                          <td className="py-3.5 text-xs text-white/60">{admin.created_by || "System"}</td>

                          <td className="py-3.5 text-xs text-white/40">
                            {new Date(admin.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="py-3.5 text-right">
                            {isOwner ? (
                              <span className="text-[11px] text-white/30 italic">Protected</span>
                            ) : (
                              <button
                                onClick={() => handleRemoveAdmin(admin.email)}
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs transition"
                                title="Revoke access"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD NEW PHONE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-[#121217] border border-white/10 rounded-2xl w-full max-w-2xl p-6 relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-1">Add Flagship Phone</h2>
            <p className="text-xs text-white/50 mb-6">
              Upload images directly to Cloudinary and sync with your Supabase catalog.
            </p>

            <form onSubmit={handleCreatePhone} className="space-y-4">
              {/* Image Upload Zone */}
              <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02]">
                <label className="block text-xs font-semibold text-white/70 mb-2 uppercase tracking-wider">
                  Phone Photo (Cloudinary Upload)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-black/60 border border-white/10 p-2 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <Image
                      src={newPhone.thumbnail}
                      alt="Preview"
                      width={80}
                      height={80}
                      unoptimized
                      className="object-contain max-h-full"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold cursor-pointer border border-white/20 transition">
                      <Upload className="w-4 h-4 text-[#D4AF37]" />
                      <span>{isUploadingImage ? "Uploading to Cloudinary..." : "Choose Image File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        disabled={isUploadingImage}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste direct image URL..."
                      value={newPhone.thumbnail}
                      onChange={(e) => setNewPhone({ ...newPhone, thumbnail: e.target.value })}
                      className="w-full bg-[#17171F] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/80 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Name & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Model Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 16 Pro Max 256GB"
                    value={newPhone.name}
                    onChange={(e) => setNewPhone({ ...newPhone, name: e.target.value })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Brand</label>
                  <select
                    value={newPhone.brand}
                    onChange={(e) => setNewPhone({ ...newPhone, brand: e.target.value as any })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="Tecno">Tecno</option>
                    <option value="Infinix">Infinix</option>
                    <option value="Google">Google Pixel</option>
                    <option value="OnePlus">OnePlus</option>
                  </select>
                </div>
              </div>

              {/* Price & Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Base Price in FCFA *</label>
                  <input
                    type="number"
                    required
                    value={newPhone.basePrice}
                    onChange={(e) => setNewPhone({ ...newPhone, basePrice: Number(e.target.value) })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Original Price (FCFA)</label>
                  <input
                    type="number"
                    value={newPhone.originalPrice}
                    onChange={(e) => setNewPhone({ ...newPhone, originalPrice: Number(e.target.value) })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Condition</label>
                  <select
                    value={newPhone.condition}
                    onChange={(e) => setNewPhone({ ...newPhone, condition: e.target.value as any })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Brand New">Brand New (Sealed)</option>
                    <option value="Certified Refurbished">Certified Pre-Owned</option>
                  </select>
                </div>
              </div>

              {/* Storage & Color */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Storage</label>
                  <select
                    value={newPhone.storage}
                    onChange={(e) => setNewPhone({ ...newPhone, storage: e.target.value })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Color Name</label>
                  <input
                    type="text"
                    value={newPhone.colorName}
                    onChange={(e) => setNewPhone({ ...newPhone, colorName: e.target.value })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Stock Units</label>
                  <input
                    type="number"
                    value={newPhone.stockCount}
                    onChange={(e) => setNewPhone({ ...newPhone, stockCount: Number(e.target.value) })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Processor</label>
                  <input
                    type="text"
                    value={newPhone.processor}
                    onChange={(e) => setNewPhone({ ...newPhone, processor: e.target.value })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1.5">Battery Capacity</label>
                  <input
                    type="text"
                    value={newPhone.battery}
                    onChange={(e) => setNewPhone({ ...newPhone, battery: e.target.value })}
                    className="w-full bg-[#17171F] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-white/60 hover:text-white text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-6 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-bold text-xs transition shadow-lg flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save Phone to Inventory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
