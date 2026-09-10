import { createClient } from "@supabase/supabase-js";
import { Phone, PHONES } from "@/lib/data/phones";
import { Order, OrderStatus } from "@/lib/data/mock-orders";
import { CustomerReview, INITIAL_REVIEWS } from "@/lib/data/mock-reviews";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export interface TradeInRecord {
  id: string;
  created_at: string;
  client_name: string;
  phone: string;
  city: string;
  brand: string;
  model: string;
  storage: string;
  condition: string;
  valuation_fcfa: number;
  voucher_code: string;
  status: "pending" | "approved" | "completed" | "rejected";
  notes?: string;
}

// Map database row to Phone model
function mapDbPhoneToModel(row: any): Phone {
  const generatedSlug = row.slug || (row.name ? row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : row.id);
  const storageVariants = Array.isArray(row.storage_variants) && row.storage_variants.length > 0 ? row.storage_variants : [
    { id: "s1", size: "256GB", price: Number(row.price_fcfa || 500000), stock: 8 },
  ];
  
  // Starting price always takes the lowest/first storage tier price if available
  const startingTierPrice = storageVariants[0]?.price ? Number(storageVariants[0].price) : undefined;
  const basePrice = startingTierPrice && startingTierPrice > 0 ? startingTierPrice : Number(row.price_fcfa || row.base_price || 500000);
  
  // Sanitize original price to avoid huge preset mismatches (e.g. 720k vs 95k)
  let originalPrice = row.original_price_fcfa ? Number(row.original_price_fcfa) : undefined;
  if (originalPrice && (originalPrice <= basePrice || originalPrice > basePrice * 3)) {
    originalPrice = Math.round(basePrice * 1.15);
  }

  return {
    id: row.id,
    slug: generatedSlug,
    name: row.name || row.model || "Smartphone",
    brand: row.brand as Phone["brand"],
    tagline: row.tagline || `${row.name} - Luxury Flagship Edition`,
    category: row.category || "flagship",
    basePrice,
    originalPrice,
    rating: Number(row.rating ?? 4.9),
    reviewCount: Number((row.review_count || row.reviews_count) ?? 1),
    isNew: row.is_new ?? true,
    isBestSeller: row.is_bestseller ?? false,
    isFeatured: row.is_featured ?? false,
    condition: row.condition === "Certified Refurbished" ? "Certified Refurbished" : "Brand New",
    warranty: row.warranty || "Official Boutique Warranty",
    storageVariants,
    colorVariants: row.color_variants || [
      { id: "c1", name: "Titanium", hex: "#8A8A8E", image: row.thumbnail || row.images?.[0] || "" },
    ],
    images: Array.isArray(row.images) && row.images.length > 0 ? row.images : [row.thumbnail || "/placeholder.png"],
    specs: row.specs || {
      screen: "6.7-inch OLED 120Hz",
      processor: "Flagship Octa-Core",
      ram: "12GB LPDDR5X",
      rearCamera: "50MP Triple Studio Array",
      frontCamera: "32MP HDR",
      battery: "5000 mAh",
      charging: "45W Fast Charging",
      os: "Latest OS",
      network: "5G Ultra Wideband",
      weight: "215g",
      waterResistance: "IP68 Certified",
    },
    highlights: row.highlights || ["100% Authentic Device", "Official Boutique Warranty"],
    boxContents: row.box_contents || ["Smartphone", "Charging Cable", "Warranty Certificate"],
  };
}

// Map Phone model to database row
function mapModelToDbPhone(phone: Phone): any {
  const startingTierPrice = phone.storageVariants && phone.storageVariants.length > 0 && phone.storageVariants[0].price > 0
    ? Number(phone.storageVariants[0].price)
    : Number(phone.basePrice);
  const effectiveBasePrice = startingTierPrice > 0 ? startingTierPrice : Number(phone.basePrice || 500000);

  let effectiveOriginalPrice = phone.originalPrice ? Number(phone.originalPrice) : null;
  if (effectiveOriginalPrice && (effectiveOriginalPrice <= effectiveBasePrice || effectiveOriginalPrice > effectiveBasePrice * 3)) {
    effectiveOriginalPrice = Math.round(effectiveBasePrice * 1.15);
  }

  return {
    id: phone.id,
    slug: phone.slug,
    name: phone.name,
    model: phone.name,
    brand: phone.brand,
    tagline: phone.tagline,
    category: phone.category,
    price_fcfa: effectiveBasePrice,
    original_price_fcfa: effectiveOriginalPrice,
    rating: phone.rating,
    review_count: phone.reviewCount,
    is_new: phone.isNew || false,
    is_bestseller: phone.isBestSeller || false,
    is_featured: phone.isFeatured || false,
    condition: phone.condition,
    warranty: phone.warranty,
    storage_variants: phone.storageVariants,
    color_variants: phone.colorVariants,
    images: phone.images,
    thumbnail: phone.images[0] || "",
    specs: phone.specs,
    highlights: phone.highlights,
    box_contents: phone.boxContents,
  };
}

// ==========================================================
// PHONES API
// ==========================================================

export async function getPhonesFromDB(): Promise<Phone[] | null> {
  // 1. Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        const mapped = data.map(mapDbPhoneToModel);
        try {
          localStorage.setItem("aura_phones_v1", JSON.stringify(mapped));
        } catch {}
        return mapped;
      }
    } catch {}
  }

  // 2. Fallback to localStorage (holds newly created/edited admin phones)
  try {
    const cached = localStorage.getItem("aura_phones_v1");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {}

  // 3. Fallback to default catalog
  return PHONES;
}

export async function getPhoneBySlugFromDB(slug: string): Promise<Phone | null> {
  const cleanSlug = slug?.toLowerCase().trim();

  // 1. Try Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("phones")
        .select("*")
        .or(`slug.eq.${cleanSlug},id.eq.${cleanSlug}`)
        .maybeSingle();

      if (!error && data) {
        return mapDbPhoneToModel(data);
      }
    } catch {}
  }

  // 2. Check full catalog (Supabase or localStorage cache)
  const all = await getPhonesFromDB();
  if (all && all.length > 0) {
    const match = all.find(
      (p) =>
        p.slug?.toLowerCase() === cleanSlug ||
        p.id?.toLowerCase() === cleanSlug ||
        p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") === cleanSlug
    );
    if (match) return match;
  }

  return null;
}

export async function insertPhoneToDB(phone: Phone): Promise<boolean> {
  // Sync to localStorage immediately
  try {
    const cached = localStorage.getItem("aura_phones_v1");
    const currentList: Phone[] = cached ? JSON.parse(cached) : PHONES;
    const filtered = currentList.filter((p) => p.id !== phone.id);
    localStorage.setItem("aura_phones_v1", JSON.stringify([phone, ...filtered]));
  } catch {}

  if (!supabase) return true;
  try {
    const payload = mapModelToDbPhone(phone);
    const { error } = await supabase.from("phones").upsert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function updatePhoneInDB(id: string, updates: Partial<Phone>): Promise<boolean> {
  // Sync to localStorage
  try {
    const cached = localStorage.getItem("aura_phones_v1");
    const currentList: Phone[] = cached ? JSON.parse(cached) : PHONES;
    const updatedList = currentList.map((p) => (p.id === id ? { ...p, ...updates } : p));
    localStorage.setItem("aura_phones_v1", JSON.stringify(updatedList));
  } catch {}

  if (!supabase) return true;
  try {
    const dbPayload: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) {
      dbPayload.name = updates.name;
      dbPayload.model = updates.name;
    }
    if (updates.slug !== undefined) dbPayload.slug = updates.slug;
    if (updates.brand !== undefined) dbPayload.brand = updates.brand;
    if (updates.tagline !== undefined) dbPayload.tagline = updates.tagline;
    if (updates.basePrice !== undefined) dbPayload.price_fcfa = updates.basePrice;
    if (updates.originalPrice !== undefined) dbPayload.original_price_fcfa = updates.originalPrice;
    if (updates.isFeatured !== undefined) dbPayload.is_featured = updates.isFeatured;
    if (updates.isBestSeller !== undefined) dbPayload.is_bestseller = updates.isBestSeller;
    if (updates.condition !== undefined) dbPayload.condition = updates.condition;
    if (updates.warranty !== undefined) dbPayload.warranty = updates.warranty;
    if (updates.storageVariants !== undefined) dbPayload.storage_variants = updates.storageVariants;
    if (updates.colorVariants !== undefined) dbPayload.color_variants = updates.colorVariants;
    if (updates.images !== undefined) {
      dbPayload.images = updates.images;
      dbPayload.thumbnail = updates.images[0] || "";
    }
    if (updates.specs !== undefined) dbPayload.specs = updates.specs;
    if (updates.highlights !== undefined) dbPayload.highlights = updates.highlights;
    if (updates.boxContents !== undefined) dbPayload.box_contents = updates.boxContents;

    const { error } = await supabase.from("phones").update(dbPayload).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deletePhoneFromDB(id: string): Promise<boolean> {
  // Sync to localStorage
  try {
    const cached = localStorage.getItem("aura_phones_v1");
    if (cached) {
      const currentList: Phone[] = JSON.parse(cached);
      const filtered = currentList.filter((p) => p.id !== id);
      localStorage.setItem("aura_phones_v1", JSON.stringify(filtered));
    }
  } catch {}

  if (!supabase) return true;
  try {
    const { error } = await supabase.from("phones").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function seedCatalogToDB(): Promise<{ count: number; error?: string }> {
  if (!supabase) return { count: 0, error: "Supabase credentials not configured." };
  try {
    const records = PHONES.map(mapModelToDbPhone);
    const { data, error } = await supabase.from("phones").upsert(records, { onConflict: "id" }).select();
    if (error) {
      return { count: 0, error: error.message };
    }
    return { count: data ? data.length : records.length };
  } catch (err: any) {
    return { count: 0, error: err.message || "Failed to seed catalog." };
  }
}

// ==========================================================
// ORDERS API
// ==========================================================

export async function getOrdersFromDB(): Promise<Order[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;
    return data.map((row: any) => ({
      id: row.id,
      trackingNumber: row.tracking_number,
      createdAt: row.created_at,
      status: row.status as OrderStatus,
      estimatedDelivery: row.estimated_delivery,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount || 0),
      deliveryFee: Number(row.delivery_fee || 0),
      total: Number(row.total),
      customer: row.customer,
      items: row.items,
      timeline: row.timeline,
    }));
  } catch {
    return null;
  }
}

export async function insertOrderToDB(order: Order): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("orders").insert({
      id: order.id,
      tracking_number: order.trackingNumber,
      created_at: order.createdAt,
      status: order.status,
      estimated_delivery: order.estimatedDelivery,
      subtotal: order.subtotal,
      discount: order.discount,
      delivery_fee: order.deliveryFee,
      total: order.total,
      customer: order.customer,
      items: order.items,
      timeline: order.timeline,
    });
    return !error;
  } catch {
    return false;
  }
}

export async function updateOrderStatusInDB(
  orderId: string,
  newStatus: OrderStatus,
  updatedTimeline: Order["timeline"]
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        timeline: updatedTimeline,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    return !error;
  } catch {
    return false;
  }
}

// ==========================================================
// TRADE-INS API
// ==========================================================

export async function getTradeInsFromDB(): Promise<TradeInRecord[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("trade_ins")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export async function insertTradeInToDB(record: Omit<TradeInRecord, "created_at">): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase.from("trade_ins").insert({
      ...record,
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

export async function updateTradeInStatusInDB(
  id: string,
  status: TradeInRecord["status"],
  notes?: string
): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from("trade_ins")
      .update({
        status,
        ...(notes ? { notes } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

// ==========================================================
// ADMIN AUTHENTICATION & MULTI-ADMIN MANAGEMENT
// ==========================================================

export const SUPER_ADMIN_EMAIL = "wisdombesong123@gmail.com";

export interface AdminUserRecord {
  id: string;
  email: string;
  role: "super_admin" | "admin";
  full_name?: string;
  created_at: string;
  created_by?: string;
}

export async function isAuthorizedAdmin(email: string): Promise<boolean> {
  const clean = email.trim().toLowerCase();
  if (clean === SUPER_ADMIN_EMAIL.toLowerCase()) return true;

  if (!supabase) return false;
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("email")
      .ilike("email", clean)
      .maybeSingle();

    if (error || !data) return false;
    return true;
  } catch {
    return false;
  }
}

export async function getAdminUsersFromDB(): Promise<AdminUserRecord[]> {
  const defaultList: AdminUserRecord[] = [
    {
      id: "super-admin-root",
      email: SUPER_ADMIN_EMAIL,
      role: "super_admin",
      full_name: "Wisdom Besong (Owner)",
      created_at: new Date().toISOString(),
      created_by: "System",
    },
  ];

  if (!supabase) return defaultList;
  try {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: true });

    if (error || !data || data.length === 0) {
      return defaultList;
    }
    return data;
  } catch {
    return defaultList;
  }
}

export async function addAdminUserToDB(
  email: string,
  fullName: string,
  role: "super_admin" | "admin" = "admin",
  createdBy: string = "Admin"
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  if (!supabase) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from("admin_users").upsert(
      {
        email: cleanEmail,
        full_name: fullName.trim() || "Boutique Admin",
        role,
        created_by: createdBy,
      },
      { onConflict: "email" }
    );

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to add administrator." };
  }
}

export async function removeAdminUserFromDB(email: string): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail === SUPER_ADMIN_EMAIL.toLowerCase()) {
    return { success: false, error: "Cannot remove primary Super Administrator." };
  }

  if (!supabase) return { success: true };

  try {
    const { error } = await supabase.from("admin_users").delete().ilike("email", cleanEmail);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ==========================================================
// ADVANCED RPC STORED PROCEDURES & ANALYTICS
// ==========================================================

export interface SalesAnalyticsData {
  total_revenue_fcfa: number;
  total_orders_count: number;
  pending_orders_count: number;
  completed_orders_count: number;
  total_trade_ins_count: number;
  pending_trade_ins_count: number;
  total_phones_count: number;
  generated_at?: string;
}

export async function getSalesAnalyticsFromDB(): Promise<SalesAnalyticsData | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("get_sales_analytics");
      if (!error && data) {
        return data as SalesAnalyticsData;
      }
    } catch {}
  }

  // Fallback: Compute from local data
  try {
    const orders = (await getOrdersFromDB()) || [];
    const tradeIns = (await getTradeInsFromDB()) || [];
    const phones = (await getPhonesFromDB()) || [];

    const totalRev = orders.reduce((acc, o) => acc + (o.total || 0), 0);
    const pendingOrders = orders.filter((o) => ["placed", "confirmed", "preparing"].includes(o.status)).length;
    const completedOrders = orders.filter((o) => o.status === "completed").length;
    const pendingTrades = tradeIns.filter((t) => t.status === "pending").length;

    return {
      total_revenue_fcfa: totalRev,
      total_orders_count: orders.length,
      pending_orders_count: pendingOrders,
      completed_orders_count: completedOrders,
      total_trade_ins_count: tradeIns.length,
      pending_trade_ins_count: pendingTrades,
      total_phones_count: phones.length,
      generated_at: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function adjustStockInDB(
  phoneId: string,
  tierSize: string,
  quantityChange: number,
  reason: string = "Admin stock manual adjustment"
): Promise<{ success: boolean; error?: string; new_stock?: number }> {
  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("adjust_storage_stock", {
        p_phone_id: phoneId,
        p_tier_size: tierSize,
        p_quantity_change: quantityChange,
        p_reason: reason,
      });

      if (!error && data && data.success) {
        return { success: true, new_stock: data.new_stock };
      }
    } catch {}
  }

  // Local fallback: Update cached phone storage variants
  try {
    const cached = localStorage.getItem("aura_phones_v1");
    if (cached) {
      const phones: Phone[] = JSON.parse(cached);
      const target = phones.find((p) => p.id === phoneId);
      if (target) {
        const variants = target.storageVariants || [];
        const updated = variants.map((v) =>
          v.size === tierSize || v.id === tierSize
            ? { ...v, stock: Math.max(0, (v.stock || 0) + quantityChange) }
            : v
        );
        target.storageVariants = updated;
        localStorage.setItem("aura_phones_v1", JSON.stringify(phones));
        return { success: true };
      }
    }
  } catch {}

  return { success: true };
}

export async function getOrderByTrackingFromDB(trackingNumber: string): Promise<Order | null> {
  const clean = trackingNumber.trim();
  if (!clean) return null;

  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("get_order_by_tracking", {
        p_tracking_number: clean,
      });

      if (!error && data) {
        return {
          id: data.id,
          trackingNumber: data.tracking_number,
          createdAt: data.created_at,
          status: data.status as OrderStatus,
          estimatedDelivery: data.estimated_delivery,
          subtotal: Number(data.subtotal),
          discount: Number(data.discount || 0),
          deliveryFee: Number(data.delivery_fee || 0),
          total: Number(data.total),
          customer: data.customer,
          items: data.items,
          timeline: data.timeline,
        };
      }
    } catch {}
  }

  // Fallback to table search
  const orders = await getOrdersFromDB();
  if (orders) {
    return (
      orders.find(
        (o) =>
          o.trackingNumber?.toLowerCase() === clean.toLowerCase() ||
          o.id?.toLowerCase() === clean.toLowerCase()
      ) || null
    );
  }

  return null;
}

export async function verifyVoucherFromDB(voucherCode: string): Promise<TradeInRecord | null> {
  const clean = voucherCode.trim().toUpperCase();
  if (!clean) return null;

  if (supabase) {
    try {
      const { data, error } = await supabase.rpc("lookup_trade_in_voucher", {
        p_voucher_code: clean,
      });
      if (!error && data) {
        return data as TradeInRecord;
      }
    } catch {}
  }

  const tradeIns = await getTradeInsFromDB();
  if (tradeIns) {
    return tradeIns.find((t) => t.voucher_code?.toUpperCase() === clean) || null;
  }

  return null;
}

// ==========================================================
// REAL-TIME SUPABASE WEBSOCKET SUBSCRIPTION HELPERS
// ==========================================================

export function subscribeToOrders(onUpdate: (order: any) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("public:orders")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "orders" },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToPhones(onUpdate: (phone: any) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("public:phones")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "phones" },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export function subscribeToTradeIns(onUpdate: (tradeIn: any) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("public:trade_ins")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "trade_ins" },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ==========================================================
// 8. CUSTOMER REVIEWS DB LAYER
// ==========================================================

export function mapDbReviewToModel(row: any): CustomerReview {
  return {
    id: row.id,
    phoneId: row.phone_id || "",
    phoneName: row.phone_name || row.phones?.name || "Official Flagship",
    clientName: row.client_name || "Valued Customer",
    city: row.city || "Buea",
    rating: Number(row.rating || 5),
    title: row.title || "Excellent Quality & Service",
    comment: row.comment || "",
    isVerified: row.is_verified !== false,
    orderId: row.order_id || undefined,
    variantPurchased: row.variant_purchased || undefined,
    condition: row.condition || "Brand New Sealed",
    helpfulCount: Number(row.helpful_count || 0),
    aspectRatings: row.aspect_ratings || {
      batteryHealth: 5,
      deliverySpeed: 5,
      conditionAccuracy: 5,
    },
    conciergeResponse: row.concierge_response || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    status: row.status || "published",
  };
}

export function mapModelToDbReview(rev: CustomerReview): any {
  return {
    id: rev.id,
    phone_id: rev.phoneId,
    client_name: rev.clientName,
    rating: rev.rating,
    title: rev.title,
    comment: rev.comment,
    city: rev.city,
    is_verified: rev.isVerified,
    order_id: rev.orderId,
    variant_purchased: rev.variantPurchased,
    condition: rev.condition,
    helpful_count: rev.helpfulCount,
    aspect_ratings: rev.aspectRatings,
    concierge_response: rev.conciergeResponse,
    status: rev.status,
    created_at: rev.createdAt,
  };
}

export async function getReviewsFromDB(): Promise<CustomerReview[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("customer_reviews")
      .select("*, phones(name)")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return null;
    return data.map(mapDbReviewToModel);
  } catch {
    return null;
  }
}

export async function insertReviewToDB(rev: CustomerReview): Promise<boolean> {
  // Sync to localStorage
  try {
    const cached = localStorage.getItem("aura_reviews_v1");
    const currentList: CustomerReview[] = cached ? JSON.parse(cached) : INITIAL_REVIEWS;
    const filtered = currentList.filter((r) => r.id !== rev.id);
    localStorage.setItem("aura_reviews_v1", JSON.stringify([rev, ...filtered]));
  } catch {}

  if (!supabase) return true;
  try {
    const payload = mapModelToDbReview(rev);
    const { error } = await supabase.from("customer_reviews").upsert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function updateReviewInDB(
  id: string,
  updates: Partial<CustomerReview>
): Promise<boolean> {
  // Sync to localStorage
  try {
    const cached = localStorage.getItem("aura_reviews_v1");
    const currentList: CustomerReview[] = cached ? JSON.parse(cached) : INITIAL_REVIEWS;
    const updatedList = currentList.map((r) => (r.id === id ? { ...r, ...updates } : r));
    localStorage.setItem("aura_reviews_v1", JSON.stringify(updatedList));
  } catch {}

  if (!supabase) return true;
  try {
    const dbPayload: any = {};
    if (updates.rating !== undefined) dbPayload.rating = updates.rating;
    if (updates.title !== undefined) dbPayload.title = updates.title;
    if (updates.comment !== undefined) dbPayload.comment = updates.comment;
    if (updates.helpfulCount !== undefined) dbPayload.helpful_count = updates.helpfulCount;
    if (updates.status !== undefined) dbPayload.status = updates.status;
    if (updates.conciergeResponse !== undefined) dbPayload.concierge_response = updates.conciergeResponse;
    if (updates.isVerified !== undefined) dbPayload.is_verified = updates.isVerified;

    const { error } = await supabase.from("customer_reviews").update(dbPayload).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deleteReviewFromDB(id: string): Promise<boolean> {
  try {
    const cached = localStorage.getItem("aura_reviews_v1");
    const currentList: CustomerReview[] = cached ? JSON.parse(cached) : INITIAL_REVIEWS;
    const filtered = currentList.filter((r) => r.id !== id);
    localStorage.setItem("aura_reviews_v1", JSON.stringify(filtered));
  } catch {}

  if (!supabase) return true;
  try {
    const { error } = await supabase.from("customer_reviews").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export function subscribeToReviews(onUpdate: (payload: any) => void) {
  if (!supabase) return () => {};

  const channel = supabase
    .channel("public:customer_reviews")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "customer_reviews" },
      (payload) => {
        onUpdate(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}



