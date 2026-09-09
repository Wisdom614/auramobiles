import jsPDF from "jspdf";
import { Order } from "@/lib/data/mock-orders";
import { formatCFA } from "@/lib/formatters";
import { SiteSettings } from "@/lib/store/settings-context";

export function downloadOrderPdf(order: Order, settings?: SiteSettings) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  let y = 18;

  // 1. Boutique Header
  doc.setFillColor(18, 18, 22);
  doc.rect(margin, y, contentWidth, 24, "F");

  // Gold accent line on top of header
  doc.setFillColor(212, 175, 55); // #D4AF37
  doc.rect(margin, y, contentWidth, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(settings?.storeName?.toUpperCase() || "AURA LUXE MOBILE", margin + 6, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(200, 200, 200);
  doc.text("Official Boutique Invoice & Proof of Purchase", margin + 6, y + 15);
  doc.text("Buea (Molyko) • Delivers Nationwide • Republic of Cameroon", margin + 6, y + 19);

  // Invoice Number Badge on top right
  const invoiceCode = `INV-${order.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(212, 175, 55);
  doc.text(invoiceCode, pageWidth - margin - 6, y + 10, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  doc.text(`Date: ${formattedDate}`, pageWidth - margin - 6, y + 16, { align: "right" });

  y += 30;

  // 2. Client & Order Information Table
  doc.setDrawColor(220, 220, 225);
  doc.setFillColor(248, 248, 250);
  doc.rect(margin, y, contentWidth, 34, "FD");

  // Two columns inside client box
  const colWidth = contentWidth / 2;

  // Left Column: Customer
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 110);
  doc.text("DELIVERED TO:", margin + 5, y + 6);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 25);
  doc.text(order.customer?.fullName || "Valued Customer", margin + 5, y + 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 70);
  doc.text(`WhatsApp: ${order.customer?.phone || "Confirmed"}`, margin + 5, y + 19);
  doc.text(`City: ${order.customer?.city || "Buea"}, Cameroon`, margin + 5, y + 24);
  const safeAddress = (order.customer?.address || "Showroom Collection").substring(0, 42);
  doc.text(`Address: ${safeAddress}`, margin + 5, y + 29);

  // Vertical divider line
  doc.setDrawColor(230, 230, 235);
  doc.line(margin + colWidth, y + 2, margin + colWidth, y + 32);

  // Right Column: Order particulars
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 110);
  doc.text("ORDER DETAILS:", margin + colWidth + 5, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 70);
  doc.text(`Order ID: #${order.id}`, margin + colWidth + 5, y + 13);
  doc.text(`Tracking Code: ${order.trackingNumber}`, margin + colWidth + 5, y + 18);
  doc.text(`Status: ${order.status.toUpperCase()}`, margin + colWidth + 5, y + 23);
  doc.text(`Payment Mode: ${(order.customer?.paymentMethod || "COD").replace(/_/g, " ").toUpperCase()}`, margin + colWidth + 5, y + 28);

  y += 40;

  // 3. Simple Items Table Header
  doc.setFillColor(240, 240, 245);
  doc.rect(margin, y, contentWidth, 8, "F");
  doc.setDrawColor(210, 210, 220);
  doc.line(margin, y + 8, margin + contentWidth, y + 8);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 60);

  // Column X offsets
  const xDesc = margin + 4;
  const xSpecs = margin + 85;
  const xQty = margin + 125;
  const xPrice = margin + 145;
  const xTotal = margin + contentWidth - 4;

  doc.text("SMARTPHONE DESCRIPTION", xDesc, y + 5.5);
  doc.text("SPECS", xSpecs, y + 5.5);
  doc.text("QTY", xQty, y + 5.5, { align: "center" });
  doc.text("UNIT (FCFA)", xPrice, y + 5.5, { align: "right" });
  doc.text("TOTAL (FCFA)", xTotal, y + 5.5, { align: "right" });

  y += 8;

  // Table Body Rows
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);

  order.items.forEach((item, index) => {
    const rowHeight = 12;

    // Alternate light background
    if (index % 2 === 1) {
      doc.setFillColor(252, 252, 254);
      doc.rect(margin, y, contentWidth, rowHeight, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 25);
    doc.text(item.name, xDesc, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 130);
    doc.text(`Brand: ${item.brand} • 100% Authentic Device`, xDesc, y + 9);

    doc.setFontSize(8);
    doc.setTextColor(60, 60, 70);
    doc.text(`${item.storage} • ${item.color}`, xSpecs, y + 6.5);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 25);
    doc.text(String(item.quantity), xQty, y + 6.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 70);
    doc.text(item.price.toLocaleString("fr-FR"), xPrice, y + 6.5, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 25);
    doc.text((item.price * item.quantity).toLocaleString("fr-FR"), xTotal, y + 6.5, { align: "right" });

    // Bottom border for each row
    doc.setDrawColor(235, 235, 240);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
  });

  y += 6;

  // 4. Financial Calculations & Warranty Summary Table
  const totalsBoxWidth = 80;
  const totalsLeft = margin + contentWidth - totalsBoxWidth;

  // Warranty Note on Left
  const warrantyWidth = contentWidth - totalsBoxWidth - 10;
  doc.setFillColor(250, 249, 245);
  doc.setDrawColor(230, 220, 190);
  doc.rect(margin, y, warrantyWidth, 28, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(140, 105, 20);
  doc.text("OFFICIAL WARRANTY & RETURN POLICY", margin + 4, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(80, 80, 90);
  doc.text(
    "All phones include certified boutique hardware verification.",
    margin + 4,
    y + 11
  );
  doc.text(
    "Free 7-day technical defect replacement in Buea or via nationwide return.",
    margin + 4,
    y + 16
  );
  doc.text(
    "Authorized 100% Authentic Device • Inspected prior to delivery dispatch.",
    margin + 4,
    y + 21
  );

  // Financial Table on Right
  doc.setDrawColor(220, 220, 230);
  doc.rect(totalsLeft, y, totalsBoxWidth, 28, "D");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(90, 90, 100);
  doc.text("Subtotal:", totalsLeft + 4, y + 6);
  doc.text(`${order.subtotal.toLocaleString("fr-FR")} FCFA`, totalsLeft + totalsBoxWidth - 4, y + 6, { align: "right" });

  doc.text("Delivery Fee:", totalsLeft + 4, y + 12);
  doc.text(
    order.deliveryFee === 0 ? "FREE (VIP)" : `${order.deliveryFee.toLocaleString("fr-FR")} FCFA`,
    totalsLeft + totalsBoxWidth - 4,
    y + 12,
    { align: "right" }
  );

  if (order.discount > 0) {
    doc.text("Discount:", totalsLeft + 4, y + 17);
    doc.text(`- ${order.discount.toLocaleString("fr-FR")} FCFA`, totalsLeft + totalsBoxWidth - 4, y + 17, { align: "right" });
  }

  // Grand Total Highlight
  doc.setFillColor(18, 18, 22);
  doc.rect(totalsLeft, y + 20, totalsBoxWidth, 8, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 55);
  doc.text("TOTAL AMOUNT:", totalsLeft + 4, y + 25.5);
  doc.text(`${order.total.toLocaleString("fr-FR")} FCFA`, totalsLeft + totalsBoxWidth - 4, y + 25.5, { align: "right" });

  y += 38;

  // 5. Official Verification Stamp & Footer
  doc.setDrawColor(220, 220, 230);
  doc.line(margin, y, margin + contentWidth, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 150);
  doc.text(
    `Contact & Support: ${settings?.whatsappPhone || settings?.secondaryPhone || "+237 699 44 21 00"} • Web: www.auraluxe.cm`,
    margin,
    y + 5
  );
  doc.text(
    "Thank you for choosing AURA Luxe Mobile Cameroon.",
    pageWidth - margin,
    y + 5,
    { align: "right" }
  );

  // Trigger download directly to user's device
  const filename = `AURA-Receipt-${order.id.replace(/[^a-zA-Z0-9]/g, "")}.pdf`;
  doc.save(filename);
}
