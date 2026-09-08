export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
}

export async function uploadToCloudinary(file: File): Promise<{ url: string; error?: string }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // 1. If unsigned direct client upload is configured
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", "aura_phones");

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        return { url: "", error: errData.error?.message || "Cloudinary direct upload failed" };
      }

      const data: CloudinaryUploadResult = await res.json();
      return { url: data.secure_url || data.url };
    } catch (err: any) {
      return { url: "", error: err.message || "Network error during Cloudinary upload" };
    }
  }

  // 2. Fall back to our Next.js backend upload route
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      return { url: "", error: data.error || "Server upload failed" };
    }

    return { url: data.url };
  } catch (err: any) {
    return { url: "", error: err.message || "Failed to reach upload endpoint" };
  }
}
