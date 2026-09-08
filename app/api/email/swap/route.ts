import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/service";
import {
  generateSwapConfirmationHtml,
  SwapConfirmationData,
} from "@/lib/email/templates/swap-confirmation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const data: SwapConfirmationData = await req.json();

    if (!data.clientName || !data.voucherCode || !data.valuationFcfa) {
      return NextResponse.json(
        { error: "Incomplete swap appraisal details" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const storefrontUrl = `${protocol}://${host}`;

    const swapHtml = generateSwapConfirmationHtml(data, storefrontUrl);

    // 1. Send client confirmation if email provided
    let clientResult = null;
    if (data.clientEmail && data.clientEmail.includes("@")) {
      clientResult = await sendEmail({
        to: data.clientEmail,
        subject: `Trade-In Appraisal Certificate [${data.voucherCode}] - AURA Luxe Mobile`,
        html: swapHtml,
      });
    }

    // 2. Send admin alert to store operations
    const adminEmail = process.env.ADMIN_ALERT_EMAIL || "tradein@auraluxe.cm";
    const adminResult = await sendEmail({
      to: adminEmail,
      subject: `[TRADE-IN CLAIM] ${data.brand} ${data.model} - ${data.valuationFcfa.toLocaleString()} FCFA (${data.clientName})`,
      html: `
        <div style="background-color: #000; color: #fff; font-family: monospace; padding: 20px;">
          <h2 style="color: #D4AF37; margin: 0 0 10px 0;">[ NEW TRADE-IN APPRAISAL CLAIMED ]</h2>
          <p>Voucher: <strong style="color: #D4AF37;">${data.voucherCode}</strong></p>
          <p>Client: <strong>${data.clientName}</strong> (${data.clientPhone})</p>
          <p>Location: <strong>${data.city}, Cameroon</strong></p>
          <p>Device: <strong>${data.brand} ${data.model} (${data.storage})</strong></p>
          <p>Condition: <strong>${data.condition}</strong></p>
          <p>Estimated Valuation: <strong style="color: #D4AF37;">${data.valuationFcfa.toLocaleString()} FCFA</strong></p>
          <hr style="border-color: #333;" />
          <p>Awaiting physical inspection at Buea Molyko counter or courier collection.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      voucherCode: data.voucherCode,
      clientEmailDispatched: !!clientResult?.success,
      adminAlertDispatched: !!adminResult?.success,
    });
  } catch (error) {
    console.error("Error in /api/email/swap:", error);
    return NextResponse.json(
      { error: "Failed to dispatch swap emails" },
      { status: 500 }
    );
  }
}
