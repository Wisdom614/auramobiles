import { Order } from "@/lib/data/mock-orders";
import { formatCFA } from "@/lib/formatters";
import { SiteSettings } from "@/lib/store/settings-context";

export async function downloadOrderPdf(order: Order, settings?: SiteSettings) {
  // Dynamically import jsPDF only when user clicks to download (saves ~350KB on initial page load)
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 14;
  const contentWidth = pageWidth - margin * 2; // 182mm
  let y = 14;

  // 1. Boutique Luxury Header Block
  const headerHeight = 28;
  doc.setFillColor(15, 15, 20); // Deep luxury obsidian
  doc.rect(margin, y, contentWidth, headerHeight, "F");

  // Top 24K Gold Architectural Accent Line
  doc.setFillColor(212, 175, 55); // #D4AF37 Gold
  doc.rect(margin, y, contentWidth, 1.8, "F");

  // Left Title & Subtitles
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(settings?.storeName?.toUpperCase() || "AURA LUXE MOBILE", margin + 6, y + 9);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text("OFFICIAL LUXURY SMARTPHONE BOUTIQUE & VERIFICATION HUB", margin + 6, y + 14);

  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 190);
  doc.text(
    `${settings?.bueaAddress || "Check Point, Molyko, Buea"} • Nationwide Express • Republic of Cameroon`,
    margin + 6,
    y + 19
  );
  doc.text(
    `Direct WhatsApp: ${settings?.whatsappPhone || "+237 699 44 21 00"} • Email: ${settings?.supportEmail || "concierge@auraluxe.cm"}`,
    margin + 6,
    y + 24
  );

  // Right Side: Document Reference & Timestamp
  const invoiceCode = `INV-${order.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()}`;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 55);
  doc.text("OFFICIAL PROOF OF PURCHASE", pageWidth - margin - 6, y + 9, { align: "right" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(invoiceCode, pageWidth - margin - 6, y + 15, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(180, 180, 190);
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Issued: ${formattedDate}`, pageWidth - margin - 6, y + 20, { align: "right" });

  // Security Verification Stamp Badge
  doc.setFillColor(28, 28, 36);
  doc.rect(pageWidth - margin - 42, y + 22, 36, 4.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(52, 211, 153); // Emerald
  doc.text("● VERIFIED AUTHENTIC", pageWidth - margin - 24, y + 25.2, { align: "center" });

  y += headerHeight + 5;

  // 2. Client & Order Particulars Dual Ledger
  const boxHeight = 32;
  const colWidth = contentWidth / 2;

  // Outer border & fill
  doc.setDrawColor(220, 220, 228);
  doc.setFillColor(248, 248, 252);
  doc.rect(margin, y, contentWidth, boxHeight, "FD");

  // Middle vertical dividing line
  doc.setDrawColor(225, 225, 235);
  doc.line(margin + colWidth, y + 2, margin + colWidth, y + boxHeight - 2);

  // Left Column: Customer Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 105, 20); // Amber/Gold tone
  doc.text("DELIVERED TO (CLIENT DETAILS):", margin + 5, y + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(20, 20, 28);
  doc.text(order.customer?.fullName || "Valued Customer", margin + 5, y + 11.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 80);
  doc.text(`WhatsApp: ${order.customer?.phone || "Confirmed via order"}`, margin + 5, y + 16.5);
  doc.text(`Destination City: ${order.customer?.city || "Buea"}, Cameroon`, margin + 5, y + 21);
  const safeAddress = (order.customer?.address || "Showroom Collection Hub").substring(0, 42);
  doc.text(`Delivery Address: ${safeAddress}`, margin + 5, y + 25.5);

  // Right Column: Order Logistics
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 105, 20);
  doc.text("LOGISTICS & DISPATCH PARTICULARS:", margin + colWidth + 5, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 80);
  doc.text(`Order Reference: #${order.id}`, margin + colWidth + 5, y + 11.5);
  doc.text(`Tracking Code: ${order.trackingNumber || order.id}`, margin + colWidth + 5, y + 16.5);
  doc.text(
    `Payment Method: ${(order.customer?.paymentMethod || "cod").replace(/_/g, " ").toUpperCase()}`,
    margin + colWidth + 5,
    y + 21
  );
  doc.text(
    `Dispatch Hub: ${settings?.bueaAddress ? "Buea Molyko Vault" : "Central Hub"} • Status: ${order.status.toUpperCase()}`,
    margin + colWidth + 5,
    y + 25.5
  );

  y += boxHeight + 5;

  // 3. Itemized Products Table Header
  const tableHeaderHeight = 7.5;
  doc.setFillColor(20, 20, 26);
  doc.rect(margin, y, contentWidth, tableHeaderHeight, "F");

  // Gold baseline accent
  doc.setFillColor(212, 175, 55);
  doc.rect(margin, y + tableHeaderHeight - 0.6, contentWidth, 0.6, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);

  // Column X offsets
  const xDesc = margin + 4;
  const xSpecs = margin + 82;
  const xQty = margin + 125;
  const xPrice = margin + 148;
  const xTotal = margin + contentWidth - 4;

  doc.text("SMARTPHONE DESCRIPTION", xDesc, y + 5);
  doc.text("SPECS / COLOR", xSpecs, y + 5);
  doc.text("QTY", xQty, y + 5, { align: "center" });
  doc.text("UNIT PRICE", xPrice, y + 5, { align: "right" });
  doc.text("TOTAL (FCFA)", xTotal, y + 5, { align: "right" });

  y += tableHeaderHeight;

  // Table Rows
  order.items.forEach((item, index) => {
    const rowHeight = 13;

    // Alternating zebra shading
    if (index % 2 === 1) {
      doc.setFillColor(250, 250, 253);
      doc.rect(margin, y, contentWidth, rowHeight, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 28);
    doc.text(item.name, xDesc, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 125);
    doc.text(`Brand: ${item.brand} • 100% Authentic Device • QC Inspected`, xDesc, y + 9.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(40, 40, 50);
    doc.text(`${item.storage}`, xSpecs, y + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(110, 110, 125);
    doc.text(`${item.color}`, xSpecs, y + 9.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(20, 20, 28);
    doc.text(String(item.quantity), xQty, y + 6.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 70);
    doc.text(item.price.toLocaleString("fr-FR"), xPrice, y + 6.5, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(180, 130, 20); // Darker Gold for clarity
    doc.text((item.price * item.quantity).toLocaleString("fr-FR"), xTotal, y + 6.5, { align: "right" });

    // Row divider line
    doc.setDrawColor(235, 235, 242);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    y += rowHeight;
  });

  y += 5;

  // 4. Warranty Certificate Box (Left) & Financial Summary (Right)
  const totalsBoxWidth = 78;
  const warrantyWidth = contentWidth - totalsBoxWidth - 6;
  const summaryBoxHeight = 36;
  const totalsLeft = margin + contentWidth - totalsBoxWidth;

  // Left Box: Official Warranty Certificate & Policy
  doc.setFillColor(252, 251, 247);
  doc.setDrawColor(225, 215, 185);
  doc.rect(margin, y, warrantyWidth, summaryBoxHeight, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(140, 105, 20);
  doc.text("OFFICIAL BOUTIQUE WARRANTY & RETURN POLICY", margin + 4, y + 5.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(70, 70, 80);
  doc.text("• Covered by 6 to 12-Month Official Boutique Hardware Guarantee.", margin + 4, y + 10.5);
  doc.text("• 7-Day Immediate Technical Defect Replacement Guarantee.", margin + 4, y + 15);
  doc.text("• Live Apple / Samsung IMEI database verification before handover.", margin + 4, y + 19.5);
  doc.text("• Complimentary data transfer & certified wipe available at Buea showroom.", margin + 4, y + 24);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(110, 110, 125);
  doc.text("Quality Control Sign-Off: AURA Quality Control Lab, Buea Hub", margin + 4, y + 30);

  // Right Box: Financial Ledger
  doc.setDrawColor(220, 220, 230);
  doc.rect(totalsLeft, y, totalsBoxWidth, summaryBoxHeight, "D");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(80, 80, 90);

  doc.text("Hardware Subtotal:", totalsLeft + 4, y + 6.5);
  doc.text(`${order.subtotal.toLocaleString("fr-FR")} FCFA`, totalsLeft + totalsBoxWidth - 4, y + 6.5, {
    align: "right",
  });

  doc.text("Delivery Logistics:", totalsLeft + 4, y + 12.5);
  doc.text(
    order.deliveryFee === 0 ? "FREE (VIP Privilege)" : `${order.deliveryFee.toLocaleString("fr-FR")} FCFA`,
    totalsLeft + totalsBoxWidth - 4,
    y + 12.5,
    { align: "right" }
  );

  if (order.discount > 0) {
    doc.setTextColor(16, 185, 129); // Green
    doc.text("Voucher / Discount:", totalsLeft + 4, y + 18.5);
    doc.text(`- ${order.discount.toLocaleString("fr-FR")} FCFA`, totalsLeft + totalsBoxWidth - 4, y + 18.5, {
      align: "right",
    });
    doc.setTextColor(80, 80, 90);
  }

  // Grand Total Highlight Bar
  const totalBarHeight = 9.5;
  const totalBarY = y + summaryBoxHeight - totalBarHeight;
  doc.setFillColor(15, 15, 20);
  doc.rect(totalsLeft, totalBarY, totalsBoxWidth, totalBarHeight, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text("TOTAL AMOUNT DUE:", totalsLeft + 4, totalBarY + 6);
  doc.setFontSize(9.5);
  doc.text(`${order.total.toLocaleString("fr-FR")} FCFA`, totalsLeft + totalsBoxWidth - 4, totalBarY + 6, {
    align: "right",
  });

  y += summaryBoxHeight + 8;

  // 5. Official Verification Stamp & Security Footer Strip
  doc.setDrawColor(225, 225, 235);
  doc.line(margin, y, margin + contentWidth, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(130, 130, 140);
  doc.text(
    `Official Concierge WhatsApp: ${settings?.whatsappPhone || "+237 699 44 21 00"} • Showroom: ${
      settings?.bueaAddress || "Check Point, Molyko, Buea"
    } • Web: www.auraluxe.cm`,
    margin,
    y + 5
  );
  doc.text(
    "Authentic Official Document • Valid across Cameroon",
    pageWidth - margin,
    y + 5,
    { align: "right" }
  );

  // Download PDF
  const filename = `AURA-Invoice-${order.id.replace(/[^a-zA-Z0-9]/g, "")}.pdf`;
  doc.save(filename);
}
