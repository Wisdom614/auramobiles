import { createClient } from "@supabase/supabase-js";
import { Phone, PHONES } from "@/lib/data/phones";
import { Order, OrderStatus } from "@/lib/data/mock-orders";

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
  return {
    id: row.id,
    slug: row.slug,
    name: row.name || row.model || "Smartphone",
    brand: row.brand as Phone["brand"],
    tagline: row.tagline || `${row.name} - Luxury Flagship Edition`,
    category: row.category || "flagship",
    basePrice: Number(row.price_fcfa || row.base_price || 500000),
    originalPrice: row.original_price_fcfa ? Number(row.original_price_fcfa) : undefined,
    rating: Number(row.rating ?? 4.9),
    reviewCount: Number((row.review_count || row.reviews_count) ?? 1),
    isNew: row.is_new ?? true,
    isBestSeller: row.is_bestseller ?? false,
    isFeatured: row.is_featured ?? false,
    condition: row.condition === "Certified Refurbished" ? "Certified Refurbished" : "Brand New",
    warranty: row.warranty || "12 Months Official Boutique Warranty",
    storageVariants: row.storage_variants || [
      { id: "s1", size: "256GB", price: Number(row.price_fcfa || 500000), stock: 8 },
    ],
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
    highlights: row.highlights || ["100% Genuine Sealed Unit", "12-Month Official Warranty"],
    boxContents: row.box_contents || ["Smartphone", "Charging Cable", "Warranty Certificate"],
  };
}

// Map Phone model to database row
function mapModelToDbPhone(phone: Phone): any {
  return {
    id: phone.id,
    slug: phone.slug,
    name: phone.name,
    brand: phone.brand,
    tagline: phone.tagline,
    category: phone.category,
    price_fcfa: phone.basePrice,
    original_price_fcfa: phone.originalPrice || null,
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
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from("phones")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return null;
    }
    return data.map(mapDbPhoneToModel);
  } catch {
    return null;
  }
}

export async function insertPhoneToDB(phone: Phone): Promise<boolean> {
  if (!supabase) return false;
  try {
    const payload = mapModelToDbPhone(phone);
    const { error } = await supabase.from("phones").upsert(payload);
    return !error;
  } catch {
    return false;
  }
}

export async function updatePhoneInDB(id: string, updates: Partial<Phone>): Promise<boolean> {
  if (!supabase) return false;
  try {
    const dbPayload: any = { updated_at: new Date().toISOString() };
    if (updates.basePrice !== undefined) dbPayload.price_fcfa = updates.basePrice;
    if (updates.originalPrice !== undefined) dbPayload.original_price_fcfa = updates.originalPrice;
    if (updates.isFeatured !== undefined) dbPayload.is_featured = updates.isFeatured;
    if (updates.isBestSeller !== undefined) dbPayload.is_bestseller = updates.isBestSeller;
    if (updates.images !== undefined) {
      dbPayload.images = updates.images;
      dbPayload.thumbnail = updates.images[0];
    }
    if (updates.name !== undefined) dbPayload.name = updates.name;
    if (updates.brand !== undefined) dbPayload.brand = updates.brand;

    const { error } = await supabase.from("phones").update(dbPayload).eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export async function deletePhoneFromDB(id: string): Promise<boolean> {
  if (!supabase) return false;
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
