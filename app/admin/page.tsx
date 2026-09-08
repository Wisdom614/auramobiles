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
  Edit3,
  Sparkles,
  Layers,
  Eye,
  Check,
  Image as ImageIcon,
  Wrench,
} from "lucide-react";
import { formatCFA } from "@/lib/formatters";
import { Phone, PHONES, StorageVariant } from "@/lib/data/phones";
import { FLAGSHIP_PRESETS, FlagshipPreset } from "@/lib/data/flagship-presets";
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

  // Order & Trade-in Detailed View Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedTradeIn, setSelectedTradeIn] = useState<TradeInRecord | null>(null);
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  // Add Phone Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("");

  const INITIAL_NEW_PHONE = {
    name: "",
    brand: "Apple" as Phone["brand"],
    tagline: "",
    condition: "Brand New" as Phone["condition"],
    warranty: "Official Boutique Warranty",
    basePrice: 650000,
    originalPrice: 720000,
    thumbnail: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    extraImagesText: "",
    stockCount: 8,
    storageTiers: [
      { size: "256GB", price: 650000, stock: 8 },
      { size: "512GB", price: 750000, stock: 4 },
    ],
    colorName: "Natural Titanium",
    colorHex: "#9A958E",
    screen: "6.7\" Super Retina XDR OLED",
    processor: "Apple A18 Pro (3nm)",
    ram: "8GB Unified Memory",
    rearCamera: "48MP Main + 12MP 5x Telephoto + 48MP Ultrawide",
    frontCamera: "12MP TrueDepth Camera",
    battery: "4,685 mAh",
    charging: "MagSafe Wireless & 27W Fast USB-C",
    os: "iOS 18 with Apple Intelligence",
    waterResistance: "IP68 Certified",
    highlightsText: "100% Genuine Sealed Unit\nBoutique Concierge Warranty\nVIP Handover in Douala & Yaoundé",
    boxContentsText: "Smartphone\nFast Charging Cable\nAURA Luxe Authentication Card",
  };

  const [newPhone, setNewPhone] = useState(INITIAL_NEW_PHONE);

  // Edit Phone Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);
  const [editExtraImagesText, setEditExtraImagesText] = useState("");
  const [editHighlightsText, setEditHighlightsText] = useState("");
  const [editBoxContentsText, setEditBoxContentsText] = useState("");
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);

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

  // Handle Preset Selection for 1-Click Auto-Fill
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    if (!presetId) return;
    const preset = FLAGSHIP_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setNewPhone({
      name: preset.name,
      brand: preset.brand,
      tagline: preset.tagline,
      condition: preset.condition,
      warranty: "Official Boutique Warranty",
      basePrice: preset.basePrice,
      originalPrice: preset.originalPrice,
      thumbnail: preset.thumbnail,
      extraImagesText: preset.images.slice(1).join("\n"),
      stockCount: preset.storageVariants[0]?.stock || 6,
      storageTiers: preset.storageVariants,
      colorName: preset.colorVariants[0]?.name || "Titanium",
      colorHex: preset.colorVariants[0]?.hex || "#9A958E",
      screen: preset.specs.screen,
      processor: preset.specs.processor,
      ram: preset.specs.ram,
      rearCamera: preset.specs.rearCamera,
      frontCamera: preset.specs.frontCamera,
      battery: preset.specs.battery,
      charging: preset.specs.charging,
      os: preset.specs.os,
      waterResistance: preset.specs.waterResistance,
      highlightsText: preset.highlights.join("\n"),
      boxContentsText: preset.boxContents.join("\n"),
    });
    showToast(`⚡ Auto-filled real specs & pricing for ${preset.name}!`, "success");
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

    const extraImgs = newPhone.extraImagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const allImages = [newPhone.thumbnail, ...extraImgs.filter((u) => u !== newPhone.thumbnail)];

    const highlightsList = newPhone.highlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const boxList = newPhone.boxContentsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const storageVariantsList: StorageVariant[] = (newPhone.storageTiers || []).map((t, idx) => ({
      id: `${id}-s${idx + 1}`,
      size: t.size,
      price: Number(t.price),
      stock: Number(t.stock),
    }));

    const created: Phone = {
      id,
      slug,
      name: newPhone.name,
      brand: newPhone.brand,
      tagline: newPhone.tagline || `${newPhone.name} - Luxury Flagship Edition`,
      category: "flagship",
      basePrice: Number(newPhone.basePrice),
      originalPrice: newPhone.originalPrice ? Number(newPhone.originalPrice) : undefined,
      rating: 4.9,
      reviewCount: 1,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      condition: newPhone.condition,
      warranty: newPhone.warranty,
      images: allImages.length > 0 ? allImages : [newPhone.thumbnail],
      storageVariants:
        storageVariantsList.length > 0
          ? storageVariantsList
          : [
              {
                id: `${id}-s1`,
                size: "256GB",
                price: Number(newPhone.basePrice),
                stock: Number(newPhone.stockCount),
              },
            ],
      colorVariants: [
        {
          id: `${id}-c1`,
          name: newPhone.colorName || "Titanium Edition",
          hex: newPhone.colorHex || "#8A8A8E",
          image: newPhone.thumbnail,
        },
      ],
      specs: {
        screen: newPhone.screen,
        processor: newPhone.processor,
        ram: newPhone.ram || "12GB LPDDR5X",
        rearCamera: newPhone.rearCamera,
        frontCamera: newPhone.frontCamera || "32MP HDR Camera",
        battery: newPhone.battery,
        charging: newPhone.charging || "45W Fast Charging",
        os: newPhone.os || "Latest Flagship OS",
        network: "5G Ultra Wideband",
        weight: "215g",
        waterResistance: newPhone.waterResistance || "IP68 Certified",
      },
      highlights:
        highlightsList.length > 0
          ? highlightsList
          : ["100% Genuine Sealed Unit", "Boutique Concierge Warranty", "VIP Handover Available"],
      boxContents:
        boxList.length > 0
          ? boxList
          : ["Device", "Fast Charging Cable", "Boutique Authentication Card"],
    };

    if (supabase) {
      const ok = await insertPhoneToDB(created);
      if (!ok) {
        showToast("Saved locally (Supabase write failed or schema not created yet)", "info");
      } else {
        showToast(`"${created.name}" saved directly to Supabase & live on customer storefront!`, "success");
      }
    } else {
      showToast(`"${created.name}" saved to local boutique session!`, "success");
    }

    setPhones((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    setNewPhone(INITIAL_NEW_PHONE);
    setSelectedPresetId("");
  };

  // Open Edit Modal
  const handleOpenEditModal = (phone: Phone) => {
    setEditingPhone({ ...phone });
    setEditExtraImagesText(phone.images?.slice(1).join("\n") || "");
    setEditHighlightsText(phone.highlights?.join("\n") || "");
    setEditBoxContentsText(phone.boxContents?.join("\n") || "");
    setIsEditModalOpen(true);
  };

  // Upload image for Edit modal
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPhone) return;

    setIsUploadingEditImage(true);
    showToast("Uploading image to Cloudinary...", "info");

    const res = await uploadToCloudinary(file);
    setIsUploadingEditImage(false);

    if (res.error) {
      showToast(`Upload warning: ${res.error}`, "error");
    } else {
      const currentImages = editingPhone.images || [];
      const updatedImages = [res.url, ...currentImages.slice(1)];
      setEditingPhone({
        ...editingPhone,
        images: updatedImages,
      });
      showToast("Updated phone photo!", "success");
    }
  };

  // Save Edit Phone Changes
  const handleSaveEditPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhone) return;

    setIsUpdatingPhone(true);

    const extraImgs = editExtraImagesText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const primaryImg = editingPhone.images?.[0] || "/placeholder.png";
    const allImages = [primaryImg, ...extraImgs.filter((u) => u !== primaryImg)];

    const highlightsList = editHighlightsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const boxList = editBoxContentsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedPhone: Phone = {
      ...editingPhone,
      images: allImages,
      highlights: highlightsList,
      boxContents: boxList,
    };

    const ok = await updatePhoneInDB(updatedPhone.id, updatedPhone);
    setIsUpdatingPhone(false);

    if (ok) {
      showToast(`"${updatedPhone.name}" updated successfully! Changes are live on customer storefront.`, "success");
      setPhones((prev) => prev.map((p) => (p.id === updatedPhone.id ? updatedPhone : p)));
      setIsEditModalOpen(false);
      setEditingPhone(null);
    } else {
      showToast("Failed to update phone.", "error");
    }
  };

  // Storage tier helpers for Add Phone modal
  const handleAddStorageTier = () => {
    setNewPhone((prev) => ({
      ...prev,
      storageTiers: [
        ...(prev.storageTiers || []),
        { size: "512GB", price: Number(prev.basePrice) + 120000, stock: 4 },
      ],
    }));
  };

  const handleRemoveStorageTier = (index: number) => {
    setNewPhone((prev) => ({
      ...prev,
      storageTiers: (prev.storageTiers || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateStorageTier = (index: number, field: "size" | "price" | "stock", value: any) => {
    setNewPhone((prev) => ({
      ...prev,
      storageTiers: (prev.storageTiers || []).map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    }));
  };

  // Storage tier helpers for Edit Phone modal
  const handleAddEditStorageTier = () => {
    if (!editingPhone) return;
    const currentVariants = editingPhone.storageVariants || [];
    const newTier: StorageVariant = {
      id: `${editingPhone.id}-s${currentVariants.length + 1}`,
      size: "512GB",
      price: Number(editingPhone.basePrice) + 120000,
      stock: 4,
    };
    setEditingPhone({
      ...editingPhone,
      storageVariants: [...currentVariants, newTier],
    });
  };

  const handleRemoveEditStorageTier = (index: number) => {
    if (!editingPhone) return;
    setEditingPhone({
      ...editingPhone,
      storageVariants: (editingPhone.storageVariants || []).filter((_, i) => i !== index),
    });
  };

  const handleUpdateEditStorageTier = (
    index: number,
    field: "size" | "price" | "stock",
    value: any
  ) => {
    if (!editingPhone) return;
    setEditingPhone({
      ...editingPhone,
      storageVariants: (editingPhone.storageVariants || []).map((t, i) =>
        i === index ? { ...t, [field]: value } : t
      ),
    });
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
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
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
    if (selectedTradeIn && selectedTradeIn.id === id) {
      setSelectedTradeIn((prev) => (prev ? { ...prev, status } : null));
    }
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
    <div className="min-h-screen bg-[#070709] text-white">
      {/* Toast Notification */}
      {statusMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-none border shadow-2xl backdrop-blur-md animate-fade-in font-mono text-xs ${
            statusMessage.type === "success"
              ? "bg-[#0A0A0D]/95 border-[#D4AF37]/60 text-[#F3E5AB]"
              : statusMessage.type === "error"
              ? "bg-red-950/95 border-red-500/50 text-red-200"
              : "bg-blue-950/95 border-blue-500/50 text-blue-200"
          }`}
        >
          {statusMessage.type === "success" && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
          {statusMessage.type === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
          {statusMessage.type === "info" && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
          <span className="font-medium tracking-wide uppercase">{statusMessage.text}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-none bg-black border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] font-mono font-bold text-sm tracking-wider shadow-inner">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-mono font-bold tracking-wider text-white uppercase">
                  AURA LUXE OPERATIONS
                </h1>
                <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-widest">
                  [ {isSuperAdmin ? "SUPER ADMIN" : "OPERATOR"} ]
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/40 tracking-wider">
                CENTRAL AFRICA LUXURY SMARTPHONE OPERATIONS // TERMINAL v2.4
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Supabase Connection Status Indicator */}
            <div
              className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-none text-[11px] font-mono border ${
                isSupabaseConnected
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-400"
                  : "bg-amber-950/40 border-amber-500/30 text-amber-300"
              }`}
            >
              <Database className="w-3 h-3" />
              <span className="uppercase tracking-wider">
                {isSupabaseConnected ? "SUPABASE LIVE" : "LOCAL MOCK"}
              </span>
            </div>

            {/* Current Admin User Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-none bg-black/60 border border-white/10 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-white/70 truncate max-w-[170px]">
                {currentUserEmail}
              </span>
            </div>

            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-red-950/30 hover:bg-red-900/50 text-red-300 border border-red-500/30 font-mono text-xs uppercase tracking-wider transition"
              title="Sign Out of Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SIGN OUT</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 font-mono text-xs uppercase tracking-wider transition"
            >
              <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">STOREFRONT</span>
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
              className={`flex items-center gap-2 px-3.5 py-2 rounded-none font-mono text-xs uppercase tracking-wider border transition ${
                activeTab === "overview"
                  ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37]"
                  : "bg-black/40 text-white/60 hover:text-white border-white/10 hover:border-white/25"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>[ 01 // DASHBOARD ]</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-none font-mono text-xs uppercase tracking-wider border transition ${
                activeTab === "inventory"
                  ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37]"
                  : "bg-black/40 text-white/60 hover:text-white border-white/10 hover:border-white/25"
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>[ 02 // INVENTORY ({phones.length}) ]</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-none font-mono text-xs uppercase tracking-wider border transition relative ${
                activeTab === "orders"
                  ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37]"
                  : "bg-black/40 text-white/60 hover:text-white border-white/10 hover:border-white/25"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>[ 03 // ORDERS ({orders.length}) ]</span>
              {pendingOrdersCount > 0 && (
                <span className="w-2 h-2 rounded-none bg-amber-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("trade-ins")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-none font-mono text-xs uppercase tracking-wider border transition ${
                activeTab === "trade-ins"
                  ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37]"
                  : "bg-black/40 text-white/60 hover:text-white border-white/10 hover:border-white/25"
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>[ 04 // TRADE-INS ({tradeIns.length}) ]</span>
              {pendingTradeInsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-none bg-[#D4AF37] text-black text-[9px] font-bold">
                  {pendingTradeInsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("site-settings")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-none font-mono text-xs uppercase tracking-wider border transition ${
                activeTab === "site-settings"
                  ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37]"
                  : "bg-black/40 text-white/60 hover:text-white border-white/10 hover:border-white/25"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>[ 05 // SITE CONFIG ]</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-none font-mono text-xs uppercase tracking-wider border transition ${
                activeTab === "settings"
                  ? "bg-[#D4AF37] text-black font-bold border-[#D4AF37]"
                  : "bg-black/40 text-white/60 hover:text-white border-white/10 hover:border-white/25"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>[ 06 // ACCESS CONTROL ]</span>
            </button>
          </div>

          {activeTab === "inventory" && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider border border-[#D4AF37] transition shadow-lg shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ ADD NEW PHONE</span>
            </button>
          )}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            {/* Continuous 4-Bay Architectural Ledger */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-white/10 bg-black divide-y sm:divide-y-0 sm:divide-x divide-white/10">
              {/* Bay 1: Revenue */}
              <div className="relative p-6 bg-[#0B0B0E] hover:bg-[#0E0E12] transition">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <div className="flex items-center justify-between text-white/40 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest">BAY 01 // TOTAL REVENUE</span>
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-mono font-light text-white mb-1 tracking-tight">
                  {formatCFA(totalRevenueFCFA)}
                </div>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Real orders fulfilled & placed</span>
                </div>
              </div>

              {/* Bay 2: Pending Orders */}
              <div className="relative p-6 bg-[#0B0B0E] hover:bg-[#0E0E12] transition">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <div className="flex items-center justify-between text-white/40 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest">BAY 02 // PENDING ORDERS</span>
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-mono font-light text-white mb-1 tracking-tight">
                  {pendingOrdersCount} DISPATCHES
                </div>
                <div className="text-[11px] font-mono text-amber-400/80">Requires boutique confirmation</div>
              </div>

              {/* Bay 3: Flagship Stock */}
              <div className="relative p-6 bg-[#0B0B0E] hover:bg-[#0E0E12] transition">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <div className="flex items-center justify-between text-white/40 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest">BAY 03 // STOCK UNITS</span>
                  <Smartphone className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-mono font-light text-white mb-1 tracking-tight">
                  {activeStockCount} UNITS
                </div>
                <div className="text-[11px] font-mono text-white/50">{phones.length} active models listed</div>
              </div>

              {/* Bay 4: Trade-In Requests */}
              <div className="relative p-6 bg-[#0B0B0E] hover:bg-[#0E0E12] transition">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <div className="flex items-center justify-between text-white/40 mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest">BAY 04 // APPRAISALS</span>
                  <RefreshCw className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-mono font-light text-white mb-1 tracking-tight">
                  {pendingTradeInsCount} PENDING
                </div>
                <div className="text-[11px] font-mono text-purple-300">Awaiting boutique inspection</div>
              </div>
            </div>

            {/* Supabase Database Seed / Sync Banner */}
            <div className="relative bg-[#0A0A0D] border border-[#D4AF37]/30 p-6">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Database className="w-4 h-4 text-[#D4AF37]" />
                    <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                      [ DB_SYNC // SUPABASE CLOUD SYNC & CATALOG SEEDER ]
                    </h2>
                  </div>
                  <p className="text-xs font-mono text-white/60 max-w-xl">
                    Populate your remote Supabase database with all 15 default luxury flagship models in one synchronous execution.
                  </p>
                </div>
                <button
                  onClick={handleSeedCatalog}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider transition border border-[#D4AF37] shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>EXECUTE CATALOG SEED</span>
                </button>
              </div>
            </div>

            {/* Quick Overview Table: Recent Orders */}
            <div className="relative bg-[#0A0A0D] border border-white/10 p-6">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    [ MANIFEST // RECENT CLIENT ORDERS ]
                  </h3>
                  <p className="text-[11px] font-mono text-white/40">Latest incoming purchase requests</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-mono uppercase tracking-wider text-[#D4AF37] hover:underline flex items-center gap-1"
                >
                  <span>VIEW ALL ORDERS</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono text-[10px] uppercase tracking-widest">
                      <th className="py-3 px-4 font-medium">ORDER ID</th>
                      <th className="py-3 px-4 font-medium">CLIENT</th>
                      <th className="py-3 px-4 font-medium">CITY</th>
                      <th className="py-3 px-4 font-medium">AMOUNT</th>
                      <th className="py-3 px-4 font-medium">PAYMENT</th>
                      <th className="py-3 px-4 font-medium">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {orders.slice(0, 5).map((order) => (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-white/[0.04] transition cursor-pointer group"
                        title="Click to view complete order details"
                      >
                        <td className="py-3 px-4 text-[#D4AF37] font-semibold group-hover:underline">{order.id}</td>
                        <td className="py-3 px-4 text-white">{order.customer.fullName}</td>
                        <td className="py-3 px-4 text-white/60">{order.customer.city}</td>
                        <td className="py-3 px-4 text-white font-medium">{formatCFA(order.total)}</td>
                        <td className="py-3 px-4 text-white/60 uppercase">
                          {order.customer.paymentMethod.replace("_", " ")}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-wider border ${
                              order.status === "completed"
                                ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                                : order.status === "delivering"
                                ? "bg-blue-950/60 text-blue-300 border-blue-500/30"
                                : "bg-amber-950/60 text-amber-300 border-amber-500/30"
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
                  placeholder="FILTER BY BRAND OR MODEL..."
                  value={phoneSearch}
                  onChange={(e) => setPhoneSearch(e.target.value)}
                  className="w-full bg-[#0A0A0D] border border-white/15 rounded-none pl-10 pr-4 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="text-xs font-mono text-white/50 tracking-wider">
                INDEX COUNT: <strong className="text-white">{filteredPhones.length}</strong> /{" "}
                {phones.length} HARDWARE UNITS
              </div>
            </div>

            {/* Inventory Table */}
            <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none overflow-hidden">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono text-[10px] uppercase tracking-widest">
                      <th className="py-3.5 px-4 font-medium">DEVICE MODEL</th>
                      <th className="py-3.5 px-4 font-medium">CONDITION</th>
                      <th className="py-3.5 px-4 font-medium">BASE PRICE (FCFA)</th>
                      <th className="py-3.5 px-4 font-medium">STOCK STATUS</th>
                      <th className="py-3.5 px-4 font-medium text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {filteredPhones.map((phone) => {
                      const totalStock = phone.storageVariants.reduce((sum, v) => sum + v.stock, 0);
                      const inStock = totalStock > 0;

                      return (
                        <tr key={phone.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-none bg-black border border-white/10 p-1 flex items-center justify-center shrink-0 relative overflow-hidden">
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
                                <div className="text-[11px] text-white/50">{phone.brand} // {phone.storageVariants[0]?.size || "256GB"}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-wider border ${
                                phone.condition === "Brand New"
                                  ? "bg-[#D4AF37]/15 text-[#F3E5AB] border-[#D4AF37]/30"
                                  : "bg-white/10 text-white/80 border-white/20"
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
                              className={`flex items-center gap-2 px-2.5 py-1 rounded-none text-[10px] font-mono uppercase tracking-wider border transition ${
                                inStock
                                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/60"
                                  : "bg-red-950/40 text-red-400 border-red-500/30 hover:bg-red-950/60"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-none ${
                                  inStock ? "bg-emerald-400" : "bg-red-400"
                                }`}
                              />
                              <span>{inStock ? `IN STOCK (${totalStock})` : "OUT OF STOCK"}</span>
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/phones/${phone.slug}`}
                                target="_blank"
                                className="p-2 rounded-none bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 transition"
                                title="View live customer product page"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleOpenEditModal(phone)}
                                className="p-2 rounded-none bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/30 transition"
                                title="Edit phone details & specs"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePhone(phone.id, phone.name)}
                                className="p-2 rounded-none bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition"
                                title="Delete phone"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
                  placeholder="FILTER ORDER ID, CLIENT, PHONE..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full bg-[#0A0A0D] border border-white/15 rounded-none pl-10 pr-4 py-2.5 font-mono text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="text-xs font-mono text-white/50 tracking-wider">
                TOTAL ORDERS LOGGED: <strong className="text-white">{orders.length}</strong>
              </div>
            </div>

            {/* Orders Table */}
            <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none overflow-hidden">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono text-[10px] uppercase tracking-widest">
                      <th className="py-3.5 px-4 font-medium">MANIFEST ID & DATE</th>
                      <th className="py-3.5 px-4 font-medium">CLIENT & CONTACT</th>
                      <th className="py-3.5 px-4 font-medium">ORDERED ITEMS</th>
                      <th className="py-3.5 px-4 font-medium">TOTAL (FCFA)</th>
                      <th className="py-3.5 px-4 font-medium">STATUS</th>
                      <th className="py-3.5 px-4 font-medium text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {filteredOrders.map((order) => {
                      const cleanPhone = order.customer.phone.replace(/[^0-9]/g, "");
                      const waLink = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                        order.customer.fullName
                      )},%20this%20is%20AURA%20Luxe%20Mobile%20regarding%20your%20Order%20${order.id}.`;

                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          className="hover:bg-white/[0.03] transition cursor-pointer group"
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-bold text-[#D4AF37] group-hover:underline">{order.id}</div>
                            <div className="text-[11px] text-white/40">
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
                            <div className="text-[11px] text-white/60">{order.customer.phone}</div>
                            <div className="text-[11px] text-white/40 uppercase">{order.customer.city}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              {order.items.map((it, idx) => (
                                <div key={idx} className="text-[11px] text-white/80">
                                  {it.quantity}x {it.name} ({it.storage})
                                </div>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white">{formatCFA(order.total)}</div>
                            <div className="text-[10px] text-white/50 uppercase tracking-wider">
                              {order.customer.paymentMethod.replace("_", " ")}
                            </div>
                          </td>

                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={order.status}
                              onChange={(e) => handleOrderStatusChange(order.id, e.target.value as any)}
                              className="bg-black border border-white/20 text-white rounded-none px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider focus:border-[#D4AF37] focus:outline-none"
                            >
                              <option value="placed">Placed (Received)</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="preparing">Preparing Package</option>
                              <option value="delivering">Out for Delivery</option>
                              <option value="completed">Completed</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white/5 hover:bg-white/10 text-white border border-white/15 font-mono text-[11px] uppercase tracking-wider transition"
                                title="View Complete Order Details"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Details</span>
                              </button>
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] border border-[#25D366]/40 font-mono text-[11px] uppercase tracking-wider font-bold transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
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

        {/* TAB 4: TRADE-INS APPRAISALS */}
        {activeTab === "trade-ins" && (
          <div className="space-y-6 animate-fade-in">
            <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none overflow-hidden">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono text-[10px] uppercase tracking-widest">
                      <th className="py-3.5 px-4 font-medium">TRADE-IN ID</th>
                      <th className="py-3.5 px-4 font-medium">CLIENT INFO</th>
                      <th className="py-3.5 px-4 font-medium">EXCHANGED DEVICE</th>
                      <th className="py-3.5 px-4 font-medium">CONDITION</th>
                      <th className="py-3.5 px-4 font-medium">VOUCHER VALUE</th>
                      <th className="py-3.5 px-4 font-medium">STATUS</th>
                      <th className="py-3.5 px-4 font-medium text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {tradeIns.map((item) => {
                      const cleanPhone = item.phone.replace(/[^0-9]/g, "");
                      const waLink = `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(
                        item.client_name
                      )},%20this%20is%20AURA%20Luxe%20Mobile%20regarding%20your%20Trade-In%20Appraisal%20for%20the%20${encodeURIComponent(
                        item.model
                      )}%20(Voucher:%20${item.voucher_code}).`;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedTradeIn(item)}
                          className="hover:bg-white/[0.03] transition cursor-pointer group"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-[#D4AF37] group-hover:underline">{item.id}</td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-white">{item.client_name}</div>
                            <div className="text-[11px] text-white/60">{item.phone}</div>
                            <div className="text-[11px] text-white/40 uppercase">{item.city}</div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {item.brand} {item.model}
                          </td>
                          <td className="py-3.5 px-4 text-[11px] text-white/80">{item.condition}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-400">
                            {formatCFA(item.valuation_fcfa)}
                          </td>
                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={item.status}
                              onChange={(e) => handleTradeInStatusChange(item.id, e.target.value as any)}
                              className="bg-black border border-white/20 text-white rounded-none px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-wider focus:border-[#D4AF37] focus:outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="approved">Approved</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => setSelectedTradeIn(item)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white/5 hover:bg-white/10 text-white border border-white/15 font-mono text-[11px] uppercase tracking-wider transition"
                                title="View Complete Swap Details"
                              >
                                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Details</span>
                              </button>
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-none bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/40 font-mono text-[11px] uppercase tracking-wider font-bold hover:bg-[#25D366]/25 transition"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Offer</span>
                              </a>
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

        {/* TAB 5: BOUTIQUE & SITE CONFIGURATION */}
        {activeTab === "site-settings" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header & Quick Save Bar */}
            <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-none bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <span>[ CONFIG // BOUTIQUE & SYSTEM ARCHITECTURE ]</span>
                    <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-widest">
                      LIVE
                    </span>
                  </h2>
                  <p className="text-[11px] font-mono text-white/40">
                    Storefront, header, footer, checkout, and concierge adapt synchronously to these values.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetSiteSettings}
                  className="px-4 py-2 rounded-none bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-mono text-xs uppercase tracking-wider transition"
                >
                  RESET DEFAULTS
                </button>
                <button
                  type="button"
                  onClick={handleSaveSiteSettings}
                  disabled={isSavingSiteSettings}
                  className="px-6 py-2 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider border border-[#D4AF37] transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSavingSiteSettings ? "BROADCASTING..." : "COMMIT SETTINGS"}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSiteSettings} className="space-y-8">
              {/* SECTION 1: BRAND IDENTITY & ANNOUNCEMENT BAR */}
              <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6 space-y-5">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <Store className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      01 // BRAND IDENTITY & TOP TICKER
                    </h3>
                    <p className="text-[11px] font-mono text-white/40">
                      Store name in navigation, footer, metadata, and top announcement banner
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={siteForm.storeName}
                      onChange={(e) => setSiteForm({ ...siteForm, storeName: e.target.value })}
                      placeholder="e.g. AURA LUXE MOBILE"
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      Brand Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={siteForm.tagline}
                      onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                      placeholder="e.g. Central Africa's Premier Luxury Smartphone Boutique"
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                    Storefront Top Announcement Bar Message
                  </label>
                  <input
                    type="text"
                    value={siteForm.announcementText}
                    onChange={(e) => setSiteForm({ ...siteForm, announcementText: e.target.value })}
                    placeholder="e.g. Free VIP delivery on orders over FCFA 500,000 • 100% Genuine Sealed Devices"
                    className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                  <div className="mt-2.5 p-3 rounded-none bg-black border border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Truck className="w-3 h-3 text-[#D4AF37]" />
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
              <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6 space-y-5">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      02 // CONCIERGE DESK & DIRECT CONTACTS
                    </h3>
                    <p className="text-[11px] font-mono text-white/40">
                      Direct telephone, WhatsApp dispatch line, and customer concierge inbox
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      Official WhatsApp Business Line *
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        required
                        value={siteForm.whatsappPhone}
                        onChange={(e) => setSiteForm({ ...siteForm, whatsappPhone: e.target.value })}
                        placeholder="+237 699 44 21 00"
                        className="w-full bg-black border border-white/15 rounded-none pl-9 pr-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 block mt-1">
                      Used for WhatsApp checkout & instant order dispatch.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      Direct Telephone Line
                    </label>
                    <div className="relative">
                      <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={siteForm.secondaryPhone}
                        onChange={(e) => setSiteForm({ ...siteForm, secondaryPhone: e.target.value })}
                        placeholder="+237 677 88 99 00"
                        className="w-full bg-black border border-white/15 rounded-none pl-9 pr-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 block mt-1">
                      Shown on footer, contact page, and order receipts.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      Support / Concierge Email
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={siteForm.supportEmail}
                        onChange={(e) => setSiteForm({ ...siteForm, supportEmail: e.target.value })}
                        placeholder="concierge@auraluxe.cm"
                        className="w-full bg-black border border-white/15 rounded-none pl-9 pr-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                      />
                    </div>
                    <span className="text-[10px] font-mono text-white/40 block mt-1">
                      Official email for client inquiries and order invoices.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PHYSICAL FLAGSHIP BOUTIQUES */}
              <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6 space-y-5">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      03 // PHYSICAL FLAGSHIP LOUNGES & WORKING HOURS
                    </h3>
                    <p className="text-[11px] font-mono text-white/40">
                      Physical locations for client pickups, trade-in device inspections, and luxury lounges
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      Buea Showroom Address (Molyko Hub)
                    </label>
                    <input
                      type="text"
                      value={siteForm.bueaAddress || siteForm.doualaAddress}
                      onChange={(e) => setSiteForm({ ...siteForm, bueaAddress: e.target.value, doualaAddress: e.target.value })}
                      placeholder="Check Point, Molyko, Buea"
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      Nationwide Delivery Dispatch Hub Note
                    </label>
                    <input
                      type="text"
                      value={siteForm.yaoundeAddress}
                      onChange={(e) => setSiteForm({ ...siteForm, yaoundeAddress: e.target.value })}
                      placeholder="Express Nationwide Courier (Douala, Yaoundé & All 10 Regions)"
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                    Operating / Concierge Hours
                  </label>
                  <div className="relative max-w-md">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3 top-3" />
                    <input
                      type="text"
                      value={siteForm.openingHours}
                      onChange={(e) => setSiteForm({ ...siteForm, openingHours: e.target.value })}
                      placeholder="Mon - Sat: 08:30 – 19:30"
                      className="w-full bg-black border border-white/15 rounded-none pl-9 pr-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: DELIVERY FEES & FREE THRESHOLD */}
              <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6 space-y-5">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <Truck className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      04 // LOGISTICS, DELIVERY FEES & FREE VIP THRESHOLD
                    </h3>
                    <p className="text-[11px] font-mono text-white/40">
                      Calculates delivery costs automatically at checkout in Douala, Yaoundé, and nationwide
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
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
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-amber-300 font-bold focus:border-[#D4AF37] focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-white/40 block mt-1">
                      Same-day courier to customer doorsteps in Douala/Yaoundé.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
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
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-amber-300 font-bold focus:border-[#D4AF37] focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-white/40 block mt-1">
                      Secured transit to Bafoussam, Garoua, Bamenda, Kribi, etc.
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
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
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-emerald-400 font-bold focus:border-[#D4AF37] focus:outline-none"
                    />
                    <span className="text-[10px] font-mono text-white/40 block mt-1">
                      Orders reaching this amount enjoy complimentary zero-fee delivery.
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 5: MOBILE MONEY PAYMENT INSTRUCTIONS */}
              <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6 space-y-5">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                <div className="flex items-center gap-2.5 pb-3 border-b border-white/10">
                  <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                  <div>
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      05 // CAMEROON MOBILE MONEY DISPATCH INSTRUCTIONS
                    </h3>
                    <p className="text-[11px] font-mono text-white/40">
                      Displayed on checkout page when customers select MTN Mobile Money or Orange Money
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      MTN Mobile Money Instructions / Number
                    </label>
                    <input
                      type="text"
                      value={siteForm.mtnMomoNumber}
                      onChange={(e) => setSiteForm({ ...siteForm, mtnMomoNumber: e.target.value })}
                      placeholder="e.g. *126# / 677 88 99 00"
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-white/70 uppercase tracking-wider mb-1">
                      Orange Money Instructions / Number
                    </label>
                    <input
                      type="text"
                      value={siteForm.orangeMoneyNumber}
                      onChange={(e) => setSiteForm({ ...siteForm, orangeMoneyNumber: e.target.value })}
                      placeholder="e.g. #150# / 699 44 21 00"
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* BOTTOM FLOATING SAVE BAR */}
              <div className="p-4 rounded-none bg-[#09090B]/95 border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 shadow-2xl backdrop-blur-md">
                <div className="text-xs font-mono text-white/70 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    Settings synchronize automatically across remote database and client browsers.
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleResetSiteSettings}
                    className="px-4 py-2.5 rounded-none bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 font-mono text-xs uppercase tracking-wider transition flex-1 sm:flex-initial"
                  >
                    RESET DEFAULTS
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingSiteSettings}
                    className="px-8 py-2.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider transition border border-[#D4AF37] flex items-center justify-center gap-2 flex-1 sm:flex-initial disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSavingSiteSettings ? "SAVING..." : "COMMIT BOUTIQUE SETTINGS"}</span>
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
              <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6 space-y-6">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-none bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      [ PROFILE // OPERATOR CREDENTIALS ]
                    </h2>
                    <p className="text-[11px] font-mono text-white/40">Active authenticated session</p>
                  </div>
                </div>

                <div className="p-4 rounded-none bg-black border border-white/10 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 uppercase">ACTIVE EMAIL:</span>
                    <strong className="text-white">{currentUserEmail}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 uppercase">ACCESS LEVEL:</span>
                    <span className="px-2 py-0.5 rounded-none text-[9px] font-mono font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 uppercase tracking-widest">
                      {isSuperAdmin ? "PRIMARY SUPER ADMINISTRATOR" : "BOUTIQUE ADMINISTRATOR"}
                    </span>
                  </div>
                </div>

                {/* Change Password Form */}
                <form onSubmit={handleChangePassword} className="space-y-3 pt-2 border-t border-white/10">
                  <h3 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>UPDATE SECURITY KEY</span>
                  </h3>

                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full py-2.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider transition border border-[#D4AF37] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isChangingPassword ? "UPDATING..." : "UPDATE SECURITY KEY"}
                  </button>
                </form>
              </div>

              {/* Authorize New Admin Card */}
              <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6 space-y-6">
                <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
                <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-none bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                      [ ACCESS // AUTHORIZE OPERATOR ]
                    </h2>
                    <p className="text-[11px] font-mono text-white/40">Grant terminal privileges to trusted staff</p>
                  </div>
                </div>

                <form onSubmit={handleAddAdmin} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      Staff Member Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="colleague@auramobiles.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Marie Claire"
                      value={newAdminFullName}
                      onChange={(e) => setNewAdminFullName(e.target.value)}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 font-mono text-xs text-white placeholder:text-white/30 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1">
                      Privilege Role
                    </label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as any)}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 font-mono text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="admin">Administrator (Orders, Inventory & Trade-ins)</option>
                      <option value="super_admin">Super Administrator (Full Team & DB Access)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingAdmin}
                    className="w-full py-2.5 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider transition border border-[#D4AF37] flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{isAddingAdmin ? "AUTHORIZING..." : "GRANT TERMINAL ACCESS"}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Admin Team Table */}
            <div className="relative bg-[#0A0A0D] border border-white/10 rounded-none p-6">
              <span className="absolute top-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute top-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 left-2 text-[10px] font-mono text-white/20 select-none">+</span>
              <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/20 select-none">+</span>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                    [ ROSTER // AUTHORIZED OPERATOR TEAM ]
                  </h3>
                  <p className="text-[11px] font-mono text-white/40">Personnel authorized to access the AURA Luxe operations portal</p>
                </div>
                <span className="px-2.5 py-1 rounded-none bg-white/5 font-mono text-[10px] uppercase tracking-wider text-white/70 border border-white/10">
                  {adminUsers.length} ACTIVE OPERATORS
                </span>
              </div>

              <div className="overflow-x-auto border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 font-mono text-[10px] uppercase tracking-widest">
                      <th className="py-3 px-4 font-medium">ADMINISTRATOR</th>
                      <th className="py-3 px-4 font-medium">ROLE</th>
                      <th className="py-3 px-4 font-medium">ADDED BY</th>
                      <th className="py-3 px-4 font-medium">MEMBER SINCE</th>
                      <th className="py-3 px-4 font-medium text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-xs">
                    {adminUsers.map((admin) => {
                      const isOwner = admin.email.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

                      return (
                        <tr key={admin.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 px-4">
                            <div className="font-medium text-white flex items-center gap-2">
                              <span>{admin.full_name || "Administrator"}</span>
                              {isOwner && (
                                <span className="px-1.5 py-0.2 rounded-none text-[8px] font-bold bg-[#D4AF37] text-black uppercase">
                                  OWNER
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-white/40">{admin.email}</div>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-mono uppercase tracking-wider border ${
                                admin.role === "super_admin"
                                  ? "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30"
                                  : "bg-white/10 text-white/80 border-white/20"
                              }`}
                            >
                              {admin.role.replace("_", " ")}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-[11px] text-white/60">{admin.created_by || "System"}</td>

                          <td className="py-3 px-4 text-[11px] text-white/40">
                            {new Date(admin.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>

                          <td className="py-3 px-4 text-right">
                            {isOwner ? (
                              <span className="text-[10px] text-white/30 uppercase tracking-wider">PROTECTED</span>
                            ) : (
                              <button
                                onClick={() => handleRemoveAdmin(admin.email)}
                                className="px-2.5 py-1 rounded-none bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 text-[10px] font-mono uppercase tracking-wider transition"
                                title="Revoke access"
                              >
                                REVOKE
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

      {/* MODAL 1: ADD NEW PHONE (WITH 1-CLICK PRESETS) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative bg-[#0A0A0D] border border-white/20 rounded-none w-full max-w-3xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <span className="absolute top-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>

            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-1.5 rounded-none border border-white/10 hover:border-white/30 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-none bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                  [ BLUEPRINT // REGISTER FLAGSHIP SMARTPHONE ]
                </h2>
                <p className="text-[11px] font-mono text-white/40">
                  Data committed here synchronizes instantly with client catalog and live specs tables.
                </p>
              </div>
            </div>

            {/* PRESET QUICK-FILL TOOLBAR */}
            <div className="relative p-4 rounded-none bg-[#0E0E14] border border-[#D4AF37]/40 my-5">
              <span className="absolute top-1.5 left-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none">+</span>
              <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-[#D4AF37]/40 select-none">+</span>

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <label className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                    ⚡ 1-CLICK FLAGSHIP SPEC PRESETS
                  </label>
                </div>
                <span className="text-[10px] text-[#D4AF37] font-mono font-semibold uppercase">
                  ZERO MANUAL TYPING
                </span>
              </div>
              <p className="text-[11px] font-mono text-white/60 mb-3">
                Select any flagship model below to auto-populate hardware specs, camera array, battery, storage tiers, and luxury photos.
              </p>
              <select
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full bg-black border border-[#D4AF37]/60 rounded-none px-3.5 py-2.5 font-mono text-xs text-[#F3E5AB] font-bold focus:outline-none focus:ring-1 focus:ring-[#D4AF37] cursor-pointer"
              >
                <option value="">-- CHOOSE PRESET TO POPULATE SPEC BLUEPRINT --</option>
                {FLAGSHIP_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.brand}) • {p.condition} • {formatCFA(p.basePrice)}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleCreatePhone} className="space-y-6 font-mono">
              {/* SECTION 1: PHOTO & GALLERY */}
              <div className="p-4 rounded-none border border-dashed border-white/20 bg-black/40 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>01 // PRIMARY PHOTO & GALLERY (CUSTOMER VIEW)</span>
                  </label>
                  <span className="text-[10px] font-mono text-white/40">Cloudinary Upload or Direct URLs</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-none bg-black border border-white/15 p-2 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <img
                      src={newPhone.thumbnail || "/placeholder.png"}
                      alt="Primary Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider cursor-pointer border border-white/20 transition">
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isUploadingImage ? "UPLOADING TO CLOUDINARY..." : "UPLOAD PRIMARY PHOTO (CLOUDINARY)"}</span>
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
                      placeholder="Or paste primary image URL..."
                      value={newPhone.thumbnail}
                      onChange={(e) => setNewPhone({ ...newPhone, thumbnail: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white/90 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1">
                    Additional Gallery Photos (One URL per line — creates customer angle thumbnails)
                  </label>
                  <textarea
                    rows={2}
                    value={newPhone.extraImagesText}
                    onChange={(e) => setNewPhone({ ...newPhone, extraImagesText: e.target.value })}
                    placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
                    className="w-full bg-black border border-white/15 rounded-none p-3 text-xs text-white/80 focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* SECTION 2: IDENTITY & PRICING */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Model Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. iPhone 16 Pro Max"
                      value={newPhone.name}
                      onChange={(e) => setNewPhone({ ...newPhone, name: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Brand *</label>
                    <select
                      value={newPhone.brand}
                      onChange={(e) => setNewPhone({ ...newPhone, brand: e.target.value as any })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Google">Google Pixel</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Tecno">Tecno</option>
                      <option value="Infinix">Infinix</option>
                      <option value="OnePlus">OnePlus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Tagline / Luxury Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Apple's Ultimate Flagship with Grade 5 Titanium & A18 Pro"
                    value={newPhone.tagline}
                    onChange={(e) => setNewPhone({ ...newPhone, tagline: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Base Price in FCFA *</label>
                    <input
                      type="number"
                      required
                      step={5000}
                      value={newPhone.basePrice}
                      onChange={(e) => setNewPhone({ ...newPhone, basePrice: Number(e.target.value) })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-[#D4AF37] font-bold focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Original Price (Strike-through)</label>
                    <input
                      type="number"
                      step={5000}
                      value={newPhone.originalPrice}
                      onChange={(e) => setNewPhone({ ...newPhone, originalPrice: Number(e.target.value) })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-white/50 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Condition</label>
                    <select
                      value={newPhone.condition}
                      onChange={(e) => setNewPhone({ ...newPhone, condition: e.target.value as any })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Brand New">Brand New (100% Sealed)</option>
                      <option value="Certified Refurbished">Certified Pre-Owned</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Warranty Guarantee Text</label>
                  <input
                    type="text"
                    value={newPhone.warranty}
                    onChange={(e) => setNewPhone({ ...newPhone, warranty: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* SECTION 3: STORAGE VARIANTS & STOCK MANAGER */}
              <div className="p-4 rounded-none bg-black/50 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>02 // STORAGE TIERS & STOCK INVENTORY</span>
                    </h3>
                    <p className="text-[11px] font-mono text-white/50">
                      These appear as selectable chips on the product page, dynamically updating customer pricing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddStorageTier}
                    className="px-3 py-1.5 rounded-none bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-wider transition"
                  >
                    + ADD TIER
                  </button>
                </div>

                <div className="space-y-2">
                  {(newPhone.storageTiers || []).map((tier, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-black p-2.5 rounded-none border border-white/10">
                      <div className="col-span-3">
                        <label className="block text-[9px] font-mono text-white/40 uppercase mb-0.5">Capacity</label>
                        <input
                          type="text"
                          value={tier.size}
                          onChange={(e) => handleUpdateStorageTier(idx, "size", e.target.value)}
                          placeholder="e.g. 256GB"
                          className="w-full bg-[#0A0A0D] border border-white/15 rounded-none px-2.5 py-1.5 text-xs text-white font-bold"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-[9px] font-mono text-white/40 uppercase mb-0.5">Price (FCFA)</label>
                        <input
                          type="number"
                          step={5000}
                          value={tier.price}
                          onChange={(e) => handleUpdateStorageTier(idx, "price", Number(e.target.value))}
                          className="w-full bg-[#0A0A0D] border border-white/15 rounded-none px-2.5 py-1.5 text-xs text-[#D4AF37] font-bold"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[9px] font-mono text-white/40 uppercase mb-0.5">Stock Units</label>
                        <input
                          type="number"
                          value={tier.stock}
                          onChange={(e) => handleUpdateStorageTier(idx, "stock", Number(e.target.value))}
                          className="w-full bg-[#0A0A0D] border border-white/15 rounded-none px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="col-span-1 pt-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveStorageTier(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Remove tier"
                        >
                          <Trash2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: REAL HARDWARE SPECIFICATIONS */}
              <div className="p-4 rounded-none bg-black/50 border border-white/15 space-y-3">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>03 // COMPONENT ARCHITECTURE & HARDWARE SPECS</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Processor</label>
                    <input
                      type="text"
                      value={newPhone.processor}
                      onChange={(e) => setNewPhone({ ...newPhone, processor: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Display Screen</label>
                    <input
                      type="text"
                      value={newPhone.screen}
                      onChange={(e) => setNewPhone({ ...newPhone, screen: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Rear Camera Array</label>
                    <input
                      type="text"
                      value={newPhone.rearCamera}
                      onChange={(e) => setNewPhone({ ...newPhone, rearCamera: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Battery Capacity</label>
                    <input
                      type="text"
                      value={newPhone.battery}
                      onChange={(e) => setNewPhone({ ...newPhone, battery: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">RAM Memory</label>
                    <input
                      type="text"
                      value={newPhone.ram}
                      onChange={(e) => setNewPhone({ ...newPhone, ram: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Fast Charging & Wireless</label>
                    <input
                      type="text"
                      value={newPhone.charging}
                      onChange={(e) => setNewPhone({ ...newPhone, charging: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: HIGHLIGHTS & BOX CONTENTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                    Device Highlights (One bullet per line)
                  </label>
                  <textarea
                    rows={3}
                    value={newPhone.highlightsText}
                    onChange={(e) => setNewPhone({ ...newPhone, highlightsText: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-none p-3 text-xs text-white/90 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                    What's In The Box (One item per line)
                  </label>
                  <textarea
                    rows={3}
                    value={newPhone.boxContentsText}
                    onChange={(e) => setNewPhone({ ...newPhone, boxContentsText: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-none p-3 text-xs text-white/90 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* SUBMIT ACTION BAR */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-[#0A0A0D] py-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-none text-white/70 hover:text-white font-mono text-xs uppercase tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isUploadingImage}
                  className="px-8 py-3 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider transition border border-[#D4AF37] shadow-xl flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>COMMIT TO INVENTORY</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT EXISTING PHONE */}
      {isEditModalOpen && editingPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative bg-[#0A0A0D] border border-white/20 rounded-none w-full max-w-3xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto shadow-2xl">
            <span className="absolute top-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>

            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-1.5 rounded-none border border-white/10 hover:border-white/30 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-none bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">
                    [ EDIT // {editingPhone.name} ]
                  </h2>
                  <p className="text-[11px] font-mono text-white/40">
                    Modifications reflect immediately on customer pages and checkout pricing.
                  </p>
                </div>
              </div>

              <Link
                href={`/phones/${editingPhone.slug}`}
                target="_blank"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono uppercase tracking-wider text-white transition"
              >
                <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>VIEW LIVE PAGE</span>
              </Link>
            </div>

            <form onSubmit={handleSaveEditPhone} className="space-y-6 font-mono">
              {/* PHOTO SECTION */}
              <div className="p-4 rounded-none border border-dashed border-white/20 bg-black/40 space-y-3">
                <label className="text-[11px] font-mono font-bold text-white/80 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>01 // UPDATE PRIMARY PHOTO & GALLERY ASSETS</span>
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 rounded-none bg-black border border-white/15 p-2 flex items-center justify-center shrink-0 relative overflow-hidden">
                    <img
                      src={editingPhone.images?.[0] || "/placeholder.png"}
                      alt={editingPhone.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-none bg-white/5 hover:bg-white/10 text-white text-xs font-mono uppercase tracking-wider cursor-pointer border border-white/20 transition">
                      <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{isUploadingEditImage ? "UPLOADING..." : "REPLACE PRIMARY IMAGE (CLOUDINARY)"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageUpload}
                        disabled={isUploadingEditImage}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or update primary image URL..."
                      value={editingPhone.images?.[0] || ""}
                      onChange={(e) =>
                        setEditingPhone({
                          ...editingPhone,
                          images: [e.target.value, ...(editingPhone.images?.slice(1) || [])],
                        })
                      }
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white/90 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                    Additional Gallery Photos (One URL per line — creates angle thumbnails for customer)
                  </label>
                  <textarea
                    rows={2}
                    value={editExtraImagesText}
                    onChange={(e) => setEditExtraImagesText(e.target.value)}
                    className="w-full bg-black border border-white/15 rounded-none p-3 text-xs text-white/80 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* MODEL IDENTITY */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Model Name *</label>
                    <input
                      type="text"
                      required
                      value={editingPhone.name}
                      onChange={(e) => setEditingPhone({ ...editingPhone, name: e.target.value })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Brand</label>
                    <select
                      value={editingPhone.brand}
                      onChange={(e) => setEditingPhone({ ...editingPhone, brand: e.target.value as any })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Apple">Apple</option>
                      <option value="Samsung">Samsung</option>
                      <option value="Google">Google Pixel</option>
                      <option value="Xiaomi">Xiaomi</option>
                      <option value="Tecno">Tecno</option>
                      <option value="Infinix">Infinix</option>
                      <option value="OnePlus">OnePlus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Tagline / Subtitle</label>
                  <input
                    type="text"
                    value={editingPhone.tagline}
                    onChange={(e) => setEditingPhone({ ...editingPhone, tagline: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Base Price in FCFA *</label>
                    <input
                      type="number"
                      required
                      step={5000}
                      value={editingPhone.basePrice}
                      onChange={(e) => setEditingPhone({ ...editingPhone, basePrice: Number(e.target.value) })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-[#D4AF37] font-bold focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Original Price (Strike-through)</label>
                    <input
                      type="number"
                      step={5000}
                      value={editingPhone.originalPrice || ""}
                      onChange={(e) => setEditingPhone({ ...editingPhone, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-white/50 focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Condition</label>
                    <select
                      value={editingPhone.condition}
                      onChange={(e) => setEditingPhone({ ...editingPhone, condition: e.target.value as any })}
                      className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2.5 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    >
                      <option value="Brand New">Brand New (Sealed)</option>
                      <option value="Certified Refurbished">Certified Pre-Owned</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-white/70 uppercase tracking-wider mb-1.5">Warranty Guarantee String</label>
                  <input
                    type="text"
                    value={editingPhone.warranty}
                    onChange={(e) => setEditingPhone({ ...editingPhone, warranty: e.target.value })}
                    className="w-full bg-black border border-white/15 rounded-none px-3.5 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* STORAGE TIERS MANAGER */}
              <div className="p-4 rounded-none bg-black/50 border border-white/15 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>02 // STORAGE TIERS & STOCK UNITS</span>
                    </h3>
                    <p className="text-[11px] font-mono text-white/50">
                      Manage capacities, pricing per size, and units currently in stock.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddEditStorageTier}
                    className="px-3 py-1.5 rounded-none bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#D4AF37] border border-[#D4AF37]/40 text-xs font-mono uppercase tracking-wider transition"
                  >
                    + ADD STORAGE TIER
                  </button>
                </div>

                <div className="space-y-2">
                  {(editingPhone.storageVariants || []).map((tier, idx) => (
                    <div key={tier.id || idx} className="grid grid-cols-12 gap-2 items-center bg-black p-2.5 rounded-none border border-white/10">
                      <div className="col-span-3">
                        <label className="block text-[9px] font-mono text-white/40 uppercase mb-0.5">Capacity</label>
                        <input
                          type="text"
                          value={tier.size}
                          onChange={(e) => handleUpdateEditStorageTier(idx, "size", e.target.value)}
                          className="w-full bg-[#0A0A0D] border border-white/15 rounded-none px-2.5 py-1.5 text-xs text-white font-bold"
                        />
                      </div>
                      <div className="col-span-5">
                        <label className="block text-[9px] font-mono text-white/40 uppercase mb-0.5">Price (FCFA)</label>
                        <input
                          type="number"
                          step={5000}
                          value={tier.price}
                          onChange={(e) => handleUpdateEditStorageTier(idx, "price", Number(e.target.value))}
                          className="w-full bg-[#0A0A0D] border border-white/15 rounded-none px-2.5 py-1.5 text-xs text-[#D4AF37] font-bold"
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="block text-[9px] font-mono text-white/40 uppercase mb-0.5">Stock Units</label>
                        <input
                          type="number"
                          value={tier.stock}
                          onChange={(e) => handleUpdateEditStorageTier(idx, "stock", Number(e.target.value))}
                          className="w-full bg-[#0A0A0D] border border-white/15 rounded-none px-2.5 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="col-span-1 pt-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveEditStorageTier(idx)}
                          className="text-red-400 hover:text-red-300 p-1"
                          title="Remove tier"
                        >
                          <Trash2 className="w-3.5 h-3.5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HARDWARE SPECS */}
              <div className="p-4 rounded-none bg-black/50 border border-white/15 space-y-3">
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>03 // HARDWARE SPECIFICATIONS</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Processor</label>
                    <input
                      type="text"
                      value={editingPhone.specs?.processor || ""}
                      onChange={(e) =>
                        setEditingPhone({
                          ...editingPhone,
                          specs: { ...editingPhone.specs, processor: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Screen / Display</label>
                    <input
                      type="text"
                      value={editingPhone.specs?.screen || ""}
                      onChange={(e) =>
                        setEditingPhone({
                          ...editingPhone,
                          specs: { ...editingPhone.specs, screen: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Rear Camera</label>
                    <input
                      type="text"
                      value={editingPhone.specs?.rearCamera || ""}
                      onChange={(e) =>
                        setEditingPhone({
                          ...editingPhone,
                          specs: { ...editingPhone.specs, rearCamera: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">Battery</label>
                    <input
                      type="text"
                      value={editingPhone.specs?.battery || ""}
                      onChange={(e) =>
                        setEditingPhone({
                          ...editingPhone,
                          specs: { ...editingPhone.specs, battery: e.target.value },
                        })
                      }
                      className="w-full bg-black border border-white/15 rounded-none px-3 py-2 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* HIGHLIGHTS & BOX CONTENTS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                    Device Highlights (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editHighlightsText}
                    onChange={(e) => setEditHighlightsText(e.target.value)}
                    className="w-full bg-black border border-white/15 rounded-none p-3 text-xs text-white/90 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-white/60 uppercase mb-1">
                    Box Contents (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editBoxContentsText}
                    onChange={(e) => setEditBoxContentsText(e.target.value)}
                    className="w-full bg-black border border-white/15 rounded-none p-3 text-xs text-white/90 focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 sticky bottom-0 bg-[#0A0A0D] py-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-none text-white/70 hover:text-white font-mono text-xs uppercase tracking-wider"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPhone}
                  className="px-8 py-3 rounded-none bg-[#D4AF37] hover:bg-[#F3E5AB] text-black font-mono font-bold text-xs uppercase tracking-wider transition border border-[#D4AF37] shadow-xl flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isUpdatingPhone ? "SAVING..." : "COMMIT CHANGES TO STORE"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: COMPLETE ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative bg-[#0A0A0D] border border-white/20 rounded-none w-full max-w-3xl p-6 sm:p-8 my-6 max-h-[90vh] overflow-y-auto shadow-2xl font-mono text-xs text-white">
            <span className="absolute top-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>

            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-1.5 rounded-none border border-white/10 hover:border-white/30 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-none bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold uppercase text-white">
                      [ ORDER // {selectedOrder.id} ]
                    </h2>
                    <span
                      className={`px-2 py-0.5 text-[9px] uppercase font-bold border ${
                        selectedOrder.status === "completed"
                          ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30"
                          : selectedOrder.status === "delivering"
                          ? "bg-blue-950/60 text-blue-400 border-blue-500/30"
                          : "bg-amber-950/60 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {selectedOrder.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    Placed on{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • Tracking: {selectedOrder.trackingNumber}
                  </p>
                </div>
              </div>

              {/* Status Changer */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 uppercase">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleOrderStatusChange(selectedOrder.id, e.target.value as any)}
                  className="bg-black border border-[#D4AF37]/50 text-white rounded-none px-3 py-1.5 text-xs uppercase focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="placed">Placed (Received)</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing Package</option>
                  <option value="delivering">Out for Delivery</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* 2-Column Info Deck */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Customer & Delivery */}
              <div className="p-4 bg-black/60 border border-white/10 space-y-2.5">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-bold">
                  01 // CLIENT & DELIVERY DETAILS
                </span>
                <div className="space-y-1.5 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Customer Name:</span>
                    <strong className="text-white font-medium">{selectedOrder.customer.fullName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Phone Number:</span>
                    <div className="flex items-center gap-2 font-mono">
                      <a href={`tel:${selectedOrder.customer.phone}`} className="text-white hover:text-[#D4AF37]">
                        {selectedOrder.customer.phone}
                      </a>
                      <a
                        href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Email:</span>
                    <span className="text-white/80">{selectedOrder.customer.email || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">City / Region:</span>
                    <span className="text-white font-mono uppercase">{selectedOrder.customer.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Delivery Address:</span>
                    <span className="text-white text-right max-w-[220px]">{selectedOrder.customer.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Delivery Option:</span>
                    <span className="text-[#D4AF37] font-mono uppercase text-[11px]">
                      {selectedOrder.customer.deliveryMethod.replace("_", " ")}
                    </span>
                  </div>
                  {selectedOrder.customer.orderNotes && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[10px] text-white/40 block font-mono">Customer Instructions:</span>
                      <p className="text-[11px] text-white/90 italic mt-0.5">"{selectedOrder.customer.orderNotes}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment & Tracking */}
              <div className="p-4 bg-black/60 border border-white/10 space-y-2.5">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-bold">
                  02 // PAYMENT & DISPATCH TELEMETRY
                </span>
                <div className="space-y-1.5 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Payment Method:</span>
                    <span className="text-white font-mono uppercase font-bold">
                      {selectedOrder.customer.paymentMethod.replace("_", " ")}
                    </span>
                  </div>
                  {selectedOrder.customer.paymentPhone && (
                    <div className="flex justify-between">
                      <span className="text-white/50 font-mono text-[11px]">Payment Number:</span>
                      <span className="text-white font-mono">{selectedOrder.customer.paymentPhone}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Tracking Number:</span>
                    <span className="text-emerald-400 font-mono font-bold">{selectedOrder.trackingNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Estimated Window:</span>
                    <span className="text-white/90">{selectedOrder.estimatedDelivery || "Same-day express"}</span>
                  </div>

                  {/* Timeline Steps */}
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[10px] text-white/40 block font-mono">Order Progress Steps:</span>
                    <div className="space-y-1 font-mono text-[11px]">
                      {selectedOrder.timeline.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[10px]">
                          <span
                            className={`w-1.5 h-1.5 rounded-none ${
                              t.completed ? "bg-emerald-400" : "bg-white/20"
                            }`}
                          />
                          <span className={t.completed ? "text-white" : "text-white/40"}>{t.title}</span>
                          <span className="text-white/30 text-[9px] ml-auto">{t.timestamp}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Itemized Order Table */}
            <div className="space-y-2 mb-6">
              <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block font-bold">
                03 // ORDERED ITEMS IN MANIFEST
              </span>

              <div className="border border-white/10 overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="bg-white/[0.03] border-b border-white/10 text-white/40 text-[10px] uppercase">
                      <th className="py-2.5 px-3">ITEM</th>
                      <th className="py-2.5 px-3">SPECS / COLOR</th>
                      <th className="py-2.5 px-3 text-right">UNIT PRICE</th>
                      <th className="py-2.5 px-3 text-center">QTY</th>
                      <th className="py-2.5 px-3 text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-sans text-xs">
                    {selectedOrder.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={it.image}
                              alt={it.name}
                              className="w-9 h-9 object-cover rounded-none bg-black border border-white/10 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white text-xs">{it.name}</div>
                              <div className="text-[10px] text-white/40 font-mono uppercase">{it.brand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-white/80">
                          <div>{it.storage}</div>
                          <div className="text-white/40 text-[10px]">{it.color}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-white/80">{formatCFA(it.price)}</td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-white">{it.quantity}</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-[#D4AF37]">
                          {formatCFA(it.price * it.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Ledger Summary */}
            <div className="p-4 bg-black border border-white/15 space-y-2 mb-6 font-mono">
              <div className="flex justify-between text-white/60 text-xs">
                <span>Items Subtotal:</span>
                <span>{formatCFA(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-white/60 text-xs">
                <span>Delivery Fee:</span>
                <span>{formatCFA(selectedOrder.deliveryFee)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400 text-xs">
                  <span>Special VIP Discount:</span>
                  <span>- {formatCFA(selectedOrder.discount)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-white/15 flex justify-between items-baseline">
                <span className="text-xs uppercase font-bold text-white">Grand Total (FCFA):</span>
                <span className="text-xl font-black text-[#D4AF37]">{formatCFA(selectedOrder.total)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-none text-white/60 hover:text-white border border-white/10 hover:border-white/30 text-xs uppercase"
              >
                [ CLOSE MANIFEST ]
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-none bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs uppercase transition"
                >
                  [ PRINT RECEIPT ]
                </button>
                <a
                  href={`https://wa.me/${selectedOrder.customer.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                    selectedOrder.customer.fullName
                  )},%20this%20is%20AURA%20Luxe%20Mobile%20regarding%20your%20Order%20${selectedOrder.id}.%20Total:%20${formatCFA(
                    selectedOrder.total
                  )}.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-none bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>[ WHATSAPP DISPATCH ]</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: COMPLETE SWAP / TRADE-IN DETAILS */}
      {selectedTradeIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="relative bg-[#0A0A0D] border border-white/20 rounded-none w-full max-w-3xl p-6 sm:p-8 my-6 max-h-[90vh] overflow-y-auto shadow-2xl font-mono text-xs text-white">
            <span className="absolute top-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute top-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[10px] font-mono text-[#D4AF37]/40 select-none">+</span>

            <button
              onClick={() => setSelectedTradeIn(null)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-1.5 rounded-none border border-white/10 hover:border-white/30 transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-none bg-black border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold uppercase text-white">
                      [ SWAP DETAILS // {selectedTradeIn.id} ]
                    </h2>
                    <span className="px-2 py-0.5 text-[9px] uppercase font-bold bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                      VOUCHER: {selectedTradeIn.voucher_code}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40 mt-0.5">
                    Logged on{" "}
                    {new Date(selectedTradeIn.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    • Store / Destination: {selectedTradeIn.city}
                  </p>
                </div>
              </div>

              {/* Status Changer */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/50 uppercase">Status:</span>
                <select
                  value={selectedTradeIn.status}
                  onChange={(e) => handleTradeInStatusChange(selectedTradeIn.id, e.target.value as any)}
                  className="bg-black border border-[#D4AF37]/50 text-white rounded-none px-3 py-1.5 text-xs uppercase focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="pending">Pending Inspection</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed / Exchanged</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            {/* 2-Column Info Deck */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Customer Information */}
              <div className="p-4 bg-black/60 border border-white/10 space-y-2.5">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-bold">
                  01 // CLIENT CONTACT & STORE
                </span>
                <div className="space-y-1.5 font-sans text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Client Name:</span>
                    <strong className="text-white font-medium">{selectedTradeIn.client_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Phone Number:</span>
                    <div className="flex items-center gap-2 font-mono">
                      <a href={`tel:${selectedTradeIn.phone}`} className="text-white hover:text-[#D4AF37]">
                        {selectedTradeIn.phone}
                      </a>
                      <a
                        href={`https://wa.me/${selectedTradeIn.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:text-emerald-300"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Handover Store:</span>
                    <span className="text-white font-mono uppercase font-bold">{selectedTradeIn.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50 font-mono text-[11px]">Status:</span>
                    <span className="text-emerald-400 font-mono uppercase font-bold">{selectedTradeIn.status}</span>
                  </div>
                </div>
              </div>

              {/* Voucher & Guarantee */}
              <div className="p-4 bg-black/60 border border-white/10 space-y-2.5">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-bold">
                  02 // VOUCHER SECURITY CODE
                </span>
                <div className="p-3 bg-zinc-950 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-zinc-400 block">7-DAY PRICE LOCK VOUCHER:</span>
                    <span className="text-sm font-black text-emerald-400 tracking-wider">
                      {selectedTradeIn.voucher_code}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard?.writeText(selectedTradeIn.voucher_code);
                      setCopiedVoucher(true);
                      setTimeout(() => setCopiedVoucher(false), 2000);
                    }}
                    className="px-2.5 py-1 text-[10px] bg-white/5 hover:bg-white/10 text-white border border-white/15"
                  >
                    {copiedVoucher ? "COPIED" : "COPY"}
                  </button>
                </div>
                <p className="text-[11px] text-white/50 font-sans">
                  Client presents this voucher code upon arrival at the showroom or to the courier for immediate credit deduction.
                </p>
              </div>
            </div>

            {/* Hardware Exchanged vs Transaction Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Phone Giving Up */}
              <div className="p-4 bg-black border border-white/15 space-y-2">
                <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">
                  PHONE TRADING IN (CURRENT PHONE):
                </span>
                <div className="text-sm font-bold text-white">
                  {selectedTradeIn.brand} {selectedTradeIn.model}
                </div>
                <div className="text-xs text-white/80">
                  Storage: <strong className="text-white">{selectedTradeIn.storage}</strong>
                </div>
                <div className="text-xs text-white/80">
                  Condition: <strong className="text-[#D4AF37]">{selectedTradeIn.condition}</strong>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-[11px] text-white/60">Estimated Store Value:</span>
                  <span className="text-sm font-black text-emerald-400">
                    {formatCFA(selectedTradeIn.valuation_fcfa)}
                  </span>
                </div>
              </div>

              {/* Transaction Summary & Notes */}
              <div className="p-4 bg-black border border-white/15 space-y-2">
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest block font-bold">
                  SWAP DETAILS & PROPOSED PRICING:
                </span>
                {selectedTradeIn.notes ? (
                  <div className="p-2.5 bg-zinc-950 border border-white/10 font-sans text-xs text-white/90 leading-relaxed whitespace-pre-wrap">
                    {selectedTradeIn.notes}
                  </div>
                ) : (
                  <div className="text-xs text-white/50 italic">
                    Standard trade-in request. Detailed notes were not provided.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSelectedTradeIn(null)}
                className="px-4 py-2.5 rounded-none text-white/60 hover:text-white border border-white/10 hover:border-white/30 text-xs uppercase"
              >
                [ CLOSE ]
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedTradeIn.phone}`}
                  className="px-4 py-2.5 rounded-none bg-white/5 hover:bg-white/10 text-white border border-white/15 text-xs uppercase transition flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>[ CALL ]</span>
                </a>
                <a
                  href={`https://wa.me/${selectedTradeIn.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(
                    selectedTradeIn.client_name
                  )},%20this%20is%20AURA%20Luxe%20Mobile%20regarding%20your%20Trade-In%20Appraisal%20for%20the%20${encodeURIComponent(
                    selectedTradeIn.model
                  )}%20(Voucher:%20${selectedTradeIn.voucher_code}).`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-none bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xs uppercase flex items-center gap-2 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>[ WHATSAPP CLIENT ]</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
