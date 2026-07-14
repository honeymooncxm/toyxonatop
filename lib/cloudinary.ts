import "server-only";
import { v2 as cloudinary } from "cloudinary";

export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET,
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * Uploads a base64/data-uri or remote image URL to Cloudinary. When Cloudinary
 * credentials aren't configured (local/demo mode), the input URL is returned
 * unchanged so the rest of the app keeps working without live credentials.
 */
export async function uploadImage(source: string, folder = "toyxonatop"): Promise<string> {
  if (!isCloudinaryConfigured) {
    return source;
  }
  const result = await cloudinary.uploader.upload(source, {
    folder,
    resource_type: "image",
  });
  return result.secure_url;
}
