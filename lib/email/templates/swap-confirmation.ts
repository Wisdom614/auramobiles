export interface SwapConfirmationData {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  city: string;
  brand: string;
  model: string;
  storage: string;
  condition: string;
  valuationFcfa: number;
  voucherCode: string;
}

export function generateSwapConfirmationHtml(data: SwapConfirmationData, storefrontUrl: string = "http://localhost:3000"): string {
  const swapUrl = `${storefrontUrl}/trade-in`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AURA Trade-In Valuation - ${data.voucherCode}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #09090B; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E4E4E7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #09090B; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #0E0E12; border: 1px solid #27272A; text-align: left;" cellspacing="0" cellpadding="0">
          
          <!-- Top Gold Header -->
          <tr>
            <td style="background-color: #000000; padding: 18px 25px; border-bottom: 2px solid #D4AF37;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="font-family: monospace; font-size: 15px; font-weight: 900; letter-spacing: 2px; color: #FFFFFF;">
                      ++ AURA LUXE MOBILE
                    </span>
                    <div style="font-family: monospace; font-size: 9px; letter-spacing: 1.5px; color: #D4AF37; margin-top: 3px;">
                      [ HARDWARE SWAP // APPRAISAL CERTIFICATE ]
                    </div>
                  </td>
                  <td align="right">
                    <span style="font-family: monospace; font-size: 11px; font-weight: bold; color: #D4AF37; background-color: #18181B; padding: 4px 8px; border: 1px solid #D4AF37;">
                      ${data.voucherCode}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro Content -->
          <tr>
            <td style="padding: 25px;">
              <div style="font-family: monospace; font-size: 11px; color: #D4AF37; letter-spacing: 1px; margin-bottom: 6px;">
                OFFICIAL TRADE-IN VALUATION
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #FFFFFF; text-transform: uppercase;">
                Hello, ${data.clientName}.
              </h1>
              <p style="font-size: 13px; line-height: 1.6; color: #A1A1AA; margin: 10px 0 0 0;">
                We have generated your instant trade-in appraisal certificate for your device. You can apply this valuation towards any flagship in our catalog.
              </p>
            </td>
          </tr>

          <!-- Valuation Highlight Box -->
          <tr>
            <td style="padding: 0 25px 20px 25px;">
              <div style="background-color: #050507; border: 1px solid #D4AF37; padding: 20px; text-align: center;">
                <div style="font-family: monospace; font-size: 11px; color: #88888F; text-transform: uppercase; letter-spacing: 1.5px;">
                  ESTIMATED TRADE-IN VALUATION
                </div>
                <div style="font-family: monospace; font-size: 28px; font-weight: 900; color: #D4AF37; margin: 8px 0 4px 0;">
                  ${data.valuationFcfa.toLocaleString()} FCFA
                </div>
                <div style="font-family: monospace; font-size: 11px; color: #10B981;">
                  VOUCHER CODE: <strong>${data.voucherCode}</strong>
                </div>
              </div>
            </td>
          </tr>

          <!-- Device Appraised Specs -->
          <tr>
            <td style="padding: 0 25px 20px 25px;">
              <div style="background-color: #121217; border: 1px solid #222226; padding: 15px; font-family: monospace; font-size: 12px;">
                <div style="color: #D4AF37; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">
                  [ APPRAISED DEVICE TELEMETRY ]
                </div>
                <table width="100%" cellspacing="0" cellpadding="0" style="line-height: 1.8;">
                  <tr>
                    <td style="color: #88888F;">Device Model:</td>
                    <td style="color: #FFFFFF; font-weight: bold; text-align: right;">${data.brand} ${data.model}</td>
                  </tr>
                  <tr>
                    <td style="color: #88888F;">Storage:</td>
                    <td style="color: #FFFFFF; text-align: right;">${data.storage}</td>
                  </tr>
                  <tr>
                    <td style="color: #88888F;">Declared Condition:</td>
                    <td style="color: #FFFFFF; text-align: right;">${data.condition}</td>
                  </tr>
                  <tr>
                    <td style="color: #88888F;">Location:</td>
                    <td style="color: #FFFFFF; text-align: right;">${data.city}, Cameroon</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 25px 25px 25px;">
              <div style="font-family: monospace; font-size: 11px; color: #D4AF37; text-transform: uppercase; font-bold; margin-bottom: 8px;">
                HOW TO REDEEM YOUR VOUCHER:
              </div>
              <ol style="margin: 0; padding-left: 20px; font-size: 12px; color: #A1A1AA; line-height: 1.8;">
                <li>Bring your device to our showroom in <strong>Buea, Molyko</strong> or request express courier pickup anywhere in Cameroon.</li>
                <li>Our technicians perform a fast 15-minute diagnostic hardware inspection.</li>
                <li>Receive your instant trade-in credit and walk away with your new flagship!</li>
              </ol>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 25px 30px 25px; text-align: center;">
              <a href="${swapUrl}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #D4AF37 0%, #AA8C2C 100%); color: #000000; font-family: monospace; font-weight: 900; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; text-decoration: none;">
                EXPLORE SMARTPHONES TO SWAP FOR →
              </a>
              <div style="margin-top: 15px; font-size: 11px; color: #71717A;">
                Instant WhatsApp Trade-In Concierge: <a href="https://wa.me/237699442100" style="color: #D4AF37; text-decoration: none;">+237 699 44 21 00</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 25px; background-color: #050507; border-top: 1px solid #18181B; font-family: monospace; font-size: 10px; color: #52525B; text-align: center;">
              <div>AURA LUXE MOBILE • BUEA, MOLYKO • PHONE SWAP ARCHIVE</div>
              <div style="margin-top: 4px;">Valuation valid for 7 days from generation date.</div>
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
