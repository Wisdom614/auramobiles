import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset =
      process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Case 1: Unsigned upload preset via Cloudinary API
    if (cloudName && uploadPreset) {
      const cFormData = new FormData();
      cFormData.append("file", base64Data);
      cFormData.append("upload_preset", uploadPreset);
      cFormData.append("folder", "aura_phones");

      const cRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cFormData,
      });

      const cData = await cRes.json();
      if (!cRes.ok || cData.error) {
        return NextResponse.json(
          { error: cData.error?.message || "Cloudinary upload failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: cData.secure_url || cData.url });
    }

    // Case 2: Signed server-side Cloudinary upload
    if (cloudName && apiKey && apiSecret) {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const crypto = await import("crypto");
      const signatureString = `folder=aura_phones&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(signatureString).digest("hex");

      const sFormData = new FormData();
      sFormData.append("file", base64Data);
      sFormData.append("api_key", apiKey);
      sFormData.append("timestamp", timestamp.toString());
      sFormData.append("signature", signature);
      sFormData.append("folder", "aura_phones");

      const sRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: sFormData,
      });

      const sData = await sRes.json();
      if (!sRes.ok || sData.error) {
        return NextResponse.json(
          { error: sData.error?.message || "Cloudinary signed upload failed" },
          { status: 500 }
        );
      }

      return NextResponse.json({ url: sData.secure_url || sData.url });
    }

    // Case 3: Development fallback (Return data URL if Cloudinary is not yet configured in .env)
    return NextResponse.json({
      url: base64Data,
      isFallback: true,
      message: "Cloudinary credentials not configured. Saved as Data URL preview.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process image upload" }, { status: 500 });
  }
}
