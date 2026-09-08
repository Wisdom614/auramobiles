/**
 * Formats numbers into Central African CFA Francs (FCFA / XAF)
 * e.g., 650000 -> "650 000 FCFA"
 */
export function formatCFA(amount: number): string {
  if (isNaN(amount)) return "0 FCFA";
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${formatted} FCFA`;
}

/**
 * Format storage string
 */
export function formatStorage(storage: string | number): string {
  if (typeof storage === "number") {
    return storage >= 1024 ? `${storage / 1024}TB` : `${storage}GB`;
  }
  return storage;
}

/**
 * Format date for order history & tracking
 */
export function formatDate(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Estimated delivery timeframe
 */
export function getEstimatedDelivery(city: string = "Douala"): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" };
  const d1 = new Intl.DateTimeFormat("en-GB", options).format(tomorrow);
  const d2 = new Intl.DateTimeFormat("en-GB", options).format(dayAfter);

  return `${d1} – ${d2} (${city})`;
}
