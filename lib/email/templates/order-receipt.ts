import { Order } from "@/lib/data/mock-orders";

export function generateOrderReceiptHtml(order: Order, storefrontUrl: string = "http://localhost:3000"): string {
  const customer = order.customer;
  const items = order.items;
  const trackingUrl = `${storefrontUrl}/orders?search=${encodeURIComponent(order.trackingNumber || order.id)}`;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #222226;">
        <div style="font-family: monospace; font-size: 13px; font-weight: bold; color: #FFFFFF; text-transform: uppercase;">
          ${item.name}
        </div>
        <div style="font-family: monospace; font-size: 11px; color: #88888F; margin-top: 2px;">
          Variant: <span style="color: #D4AF37;">${item.storage}</span> • Color: <span style="color: #CCCCCC;">${item.color}</span> • Qty: ${item.quantity}
        </div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #222226; text-align: right; vertical-align: top;">
        <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #D4AF37;">
          ${(item.price * item.quantity).toLocaleString()} FCFA
        </span>
      </td>
    </tr>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURA Order Confirmation - ${order.id}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E4E4E7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #09090B; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0E0E12; border: 1px solid #27272A; text-align: left;" cellspacing="0" cellpadding="0">
          
          <!-- Top Gold Telemetry Bar -->
          <tr>
            <td style="background-color: #000000; padding: 18px 25px; border-bottom: 2px solid #D4AF37;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: monospace; font-size: 15px; font-weight: 900; letter-spacing: 2px; color: #FFFFFF;">
                      ++ AURA LUXE MOBILE
                    </span>
                    <div style="font-family: monospace; font-size: 9px; letter-spacing: 1.5px; color: #D4AF37; margin-top: 3px;">
                      OFFICIAL ORDER RECEIPT
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-family: monospace; font-size: 10px; color: #71717A; background-color: #18181B; padding: 4px 8px; border: 1px solid #27272A;">
                      ${order.id}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Receipt Intro -->
          <tr>
            <td style="padding: 25px 25px 15px 25px;">
              <div style="font-family: monospace; font-size: 11px; color: #D4AF37; letter-spacing: 1px; margin-bottom: 6px;">
                ORDER CONFIRMATION
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: -0.5px;">
                Thank you for your order, ${customer.fullName}.
              </h1>
              <p style="font-size: 13px; line-height: 1.6; color: #A1A1AA; margin: 10px 0 0 0;">
                Your order has been safely received by our team at our Buea showroom in Molyko. We are carefully packaging your brand new sealed phone for fast delivery.
              </p>
            </td>
          </tr>

          <!-- Tracking & Logistics Block -->
          <tr>
            <td style="padding: 0 25px 20px 25px;">
              <div style="background-color: #050507; border: 1px solid #222226; padding: 15px;">
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="vertical-align: top; padding-right: 15px;">
                      <div style="font-family: monospace; font-size: 9px; color: #71717A; text-transform: uppercase; letter-spacing: 1px;">
                        TRACKING NUMBER
                      </div>
                      <div style="font-family: monospace; font-size: 13px; font-weight: bold; color: #D4AF37; margin-top: 3px;">
                        ${order.trackingNumber || order.id}
                      </div>
                    </td>
                    <td style="vertical-align: top;">
                      <div style="font-family: monospace; font-size: 9px; color: #71717A; text-transform: uppercase; letter-spacing: 1px;">
                        ESTIMATED DELIVERY
                      </div>
                      <div style="font-family: monospace; font-size: 12px; color: #FFFFFF; margin-top: 3px;">
                        ${order.estimatedDelivery || "Next-Day Delivery across Cameroon"}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Itemized Items Table -->
          <tr>
            <td style="padding: 0 25px;">
              <div style="font-family: monospace; font-size: 10px; color: #71717A; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #27272A; padding-bottom: 6px;">
                ORDERED ITEMS
              </div>
              <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 5px;">
                ${itemsHtml}
              </table>
            </td>
          </tr>

          <!-- Financial Summary Breakdown -->
          <tr>
            <td style="padding: 15px 25px 25px 25px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="font-family: monospace; font-size: 12px;">
                <tr>
                  <td style="padding: 4px 0; color: #88888F;">Subtotal:</td>
                  <td style="padding: 4px 0; text-align: right; color: #FFFFFF;">${order.subtotal.toLocaleString()} FCFA</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #88888F;">Delivery Fee (${customer.deliveryMethod.replace("_", " ").toUpperCase()}):</td>
                  <td style="padding: 4px 0; text-align: right; color: #FFFFFF;">
                    ${order.deliveryFee === 0 ? "FREE" : `${order.deliveryFee.toLocaleString()} FCFA`}
                  </td>
                </tr>
                ${
                  order.discount && order.discount > 0
                    ? `<tr>
                    <td style="padding: 4px 0; color: #10B981;">Discount:</td>
                    <td style="padding: 4px 0; text-align: right; color: #10B981;">-${order.discount.toLocaleString()} FCFA</td>
                  </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 10px 0 0 0; border-top: 1px solid #27272A; font-size: 14px; font-weight: bold; color: #FFFFFF;">TOTAL:</td>
                  <td style="padding: 10px 0 0 0; border-top: 1px solid #27272A; text-align: right; font-size: 16px; font-weight: 900; color: #D4AF37;">
                    ${order.total.toLocaleString()} FCFA
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Destination -->
          <tr>
            <td style="padding: 0 25px 25px 25px;">
              <div style="background-color: #121217; border: 1px solid #222226; padding: 15px; font-family: monospace; font-size: 11px;">
                <div style="color: #D4AF37; font-weight: bold; margin-bottom: 6px; text-transform: uppercase;">
                  [ RECIPIENT &amp; DELIVERY ADDRESS ]
                </div>
                <div style="color: #FFFFFF; font-weight: bold;">${customer.fullName} (${customer.phone})</div>
                <div style="color: #A1A1AA; margin-top: 2px;">${customer.address}, ${customer.city}, Cameroon</div>
                <div style="color: #71717A; margin-top: 4px;">Payment Method: <strong style="color: #E4E4E7;">${customer.paymentMethod.replace("_", " ").toUpperCase()}</strong></div>
              </div>
            </td>
          </tr>

          <!-- Action CTA: Live Tracking & WhatsApp -->
          <tr>
            <td style="padding: 0 25px 30px 25px; text-align: center;">
              <a href="${trackingUrl}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #D4AF37 0%, #AA8C2C 100%); color: #000000; font-family: monospace; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none;">
                TRACK YOUR ORDER STATUS →
              </a>
              <div style="margin-top: 15px; font-size: 11px; color: #71717A;">
                Questions? Message our support team on WhatsApp at <a href="https://wa.me/237699442100" style="color: #D4AF37; text-decoration: none;">+237 699 44 21 00</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 25px; background-color: #050507; border-top: 1px solid #18181B; font-family: monospace; font-size: 10px; color: #52525B; text-align: center;">
              <div>AURA LUXE MOBILE • BUEA, MOLYKO • EXPRESS DISPATCH NATIONWIDE</div>
              <div style="margin-top: 4px;">All units covered by Official Boutique Warranty. Sealed Hardware.</div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
