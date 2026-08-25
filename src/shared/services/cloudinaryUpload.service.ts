import { requireSupabase } from "../../lib/supabase";

export type CloudinaryResourceType = "image" | "video";

export type CloudinaryMediaUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: CloudinaryResourceType;
};

export type CloudinaryImageUploadResult = CloudinaryMediaUploadResult;

type CloudinaryUploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
  assetFolder: string;
  resourceType: CloudinaryResourceType;
};

const getAuthenticatedSession = async () => {
  const client = requireSupabase();
  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError) throw sessionError;
  if (!session?.access_token) throw new Error("Admin session required.");

  return session;
};

const parseJsonResponse = async <T>(response: Response): Promise<T> => {
  const responseText = await response.text();

  if (!responseText) {
    throw new Error(`Cloudinary API returned an empty response (${response.status}).`);
  }

  try {
    return JSON.parse(responseText) as T;
  } catch {
    throw new Error(`Cloudinary API returned an invalid response (${response.status}).`);
  }
};

export const uploadAdminMediaToCloudinary = async ({
  file,
  folder,
  fileBaseName,
  resourceType,
}: {
  file: File;
  folder: string;
  fileBaseName?: string;
  resourceType: CloudinaryResourceType;
}): Promise<CloudinaryMediaUploadResult> => {
  const session = await getAuthenticatedSession();

  const signResponse = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ folder, fileBaseName, resourceType }),
  });

  const signData = await parseJsonResponse<{
    success?: boolean;
    message?: string;
    upload?: CloudinaryUploadSignature;
  }>(signResponse);

  if (!signResponse.ok || !signData.success || !signData.upload) {
    throw new Error(signData.message || "Could not prepare Cloudinary upload.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signData.upload.apiKey);
  formData.append("timestamp", String(signData.upload.timestamp));
  formData.append("signature", signData.upload.signature);
  formData.append("public_id", signData.upload.publicId);
  formData.append("asset_folder", signData.upload.assetFolder);

  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${signData.upload.cloudName}/${resourceType}/upload`,
    { method: "POST", body: formData },
  );

  const uploadData = await parseJsonResponse<
    | CloudinaryMediaUploadResult
    | { error?: { message?: string } }
  >(uploadResponse);

  if (!uploadResponse.ok) {
    throw new Error(
      "error" in uploadData
        ? uploadData.error?.message || `Cloudinary ${resourceType} upload failed.`
        : `Cloudinary ${resourceType} upload failed.`,
    );
  }

  if (!("secure_url" in uploadData) || !("public_id" in uploadData) || !uploadData.secure_url || !uploadData.public_id) {
    throw new Error("Cloudinary returned an incomplete upload response.");
  }

  return uploadData;
};

export const uploadAdminImageToCloudinary = async (options: {
  file: File;
  folder: string;
  fileBaseName?: string;
}) => uploadAdminMediaToCloudinary({ ...options, resourceType: "image" });

export const uploadAdminVideoToCloudinary = async (options: {
  file: File;
  folder: string;
  fileBaseName?: string;
}) => uploadAdminMediaToCloudinary({ ...options, resourceType: "video" });

export const deleteAdminMediaFromCloudinary = async (
  publicId: string,
  resourceType: CloudinaryResourceType,
) => {
  const normalizedPublicId = publicId.trim();
  if (!normalizedPublicId) return;

  const session = await getAuthenticatedSession();
  const deleteResponse = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ publicId: normalizedPublicId, resourceType }),
  });

  const deleteData = await parseJsonResponse<{ success?: boolean; message?: string }>(
    deleteResponse,
  );

  if (!deleteResponse.ok || !deleteData.success) {
    throw new Error(deleteData.message || "Could not delete Cloudinary media.");
  }
};

export const deleteAdminImageFromCloudinary = async (publicId: string) =>
  deleteAdminMediaFromCloudinary(publicId, "image");

export const deleteAdminVideoFromCloudinary = async (publicId: string) =>
  deleteAdminMediaFromCloudinary(publicId, "video");

export const cleanupAdminCloudinaryFolder = async (folder: string) => {
  const normalizedFolder = folder.trim().replace(/\/+$/, "");
  if (!normalizedFolder) return;

  const session = await getAuthenticatedSession();
  const cleanupResponse = await fetch("/api/cloudinary/folders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ folder: normalizedFolder }),
  });

  const cleanupData = await parseJsonResponse<{
    success?: boolean;
    message?: string;
  }>(cleanupResponse);

  if (!cleanupResponse.ok || !cleanupData.success) {
    throw new Error(cleanupData.message || "Could not clean up Cloudinary folders.");
  }
};

export const getCloudinaryPublicId = (
  mediaUrl: string | null,
  resourceType: CloudinaryResourceType,
) => {
  if (!mediaUrl || !mediaUrl.includes("res.cloudinary.com/")) return null;

  try {
    const url = new URL(mediaUrl);
    const uploadMarker = `/${resourceType}/upload/`;
    const uploadIndex = url.pathname.indexOf(uploadMarker);

    if (uploadIndex === -1) return null;

    let publicId = url.pathname.slice(uploadIndex + uploadMarker.length);
    publicId = publicId.replace(/^v\d+\//, "");
    publicId = publicId.replace(/\.[^/.]+$/, "");

    return publicId || null;
  } catch {
    return null;
  }
};

export const getCloudinaryImagePublicId = (imageUrl: string | null) =>
  getCloudinaryPublicId(imageUrl, "image");

export const getCloudinaryVideoPublicId = (videoUrl: string | null) =>
  getCloudinaryPublicId(videoUrl, "video");
