import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/lib/data/mock-orders";
import { sendEmail } from "@/lib/email/service";
import { generateOrderReceiptHtml } from "@/lib/email/templates/order-receipt";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order: Order = body.order;

    if (!order || !order.id || !order.customer) {
      return NextResponse.json(
        { error: "Invalid order manifest provided" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const storefrontUrl = `${protocol}://${host}`;

    const receiptHtml = generateOrderReceiptHtml(order, storefrontUrl);

    // 1. Send customer invoice
    const customerEmail = order.customer.email;
    let customerResult = null;

    if (customerEmail && customerEmail.includes("@")) {
      customerResult = await sendEmail({
        to: customerEmail,
        subject: `Order Confirmation [${order.id}] - AURA Luxe Mobile`,
        html: receiptHtml,
      });
    }

    // 2. Send admin notification email to store operations
    const adminEmail = process.env.ADMIN_ALERT_EMAIL || "orders@auraluxe.cm";
    const adminAlertSubject = `[NEW ACQUISITION] Order ${order.id} - ${order.total.toLocaleString()} FCFA (${order.customer.city})`;
    
    const adminResult = await sendEmail({
      to: adminEmail,
      subject: adminAlertSubject,
      html: `
        <div style="background-color: #000; color: #fff; font-family: monospace; padding: 20px;">
          <h2 style="color: #D4AF37; margin: 0 0 10px 0;">[ NEW INCOMING ORDER RECEIVED ]</h2>
          <p>Order ID: <strong>${order.id}</strong></p>
          <p>Customer: <strong>${order.customer.fullName}</strong> (${order.customer.phone})</p>
          <p>Delivery: <strong>${order.customer.address}, ${order.customer.city}</strong></p>
          <p>Total: <strong style="color: #D4AF37;">${order.total.toLocaleString()} FCFA</strong></p>
          <p>Payment Method: <strong>${order.customer.paymentMethod}</strong></p>
          <hr style="border-color: #333;" />
          <p>Please inspect and allocate sealed hardware from the Buea Molyko vault.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      customerEmailDispatched: !!customerResult?.success,
      adminAlertDispatched: !!adminResult?.success,
    });
  } catch (error) {
    console.error("Error in /api/email/order:", error);
    return NextResponse.json(
      { error: "Failed to dispatch order emails" },
      { status: 500 }
    );
  }
}
