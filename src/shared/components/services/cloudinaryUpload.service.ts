import { requireSupabase } from "../../../lib/supabase";

type CloudinaryUploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
  assetFolder: string;
};

export type CloudinaryImageUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: string;
};

const requireCloudinaryUploadResponse = (
  response: CloudinaryImageUploadResult,
) => {
  if (!response.secure_url || !response.public_id) {
    throw new Error("Cloudinary returned an incomplete upload response.");
  }

  return response;
};

const getAuthenticatedSession = async () => {
  const client = requireSupabase();
  const {
    data: { session },
    error: sessionError,
  } = await client.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  if (!session?.access_token) {
    throw new Error("Admin session required.");
  }

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

export const uploadAdminImageToCloudinary = async ({
  file,
  folder,
  fileBaseName,
}: {
  file: File;
  folder: string;
  fileBaseName?: string;
}) => {
  const session = await getAuthenticatedSession();

  const signResponse = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      folder,
      fileBaseName,
    }),
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
    `https://api.cloudinary.com/v1_1/${signData.upload.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const uploadData = await parseJsonResponse<
    | CloudinaryImageUploadResult
    | { error?: { message?: string } }
  >(uploadResponse);

  if (!uploadResponse.ok) {
    throw new Error(
      "error" in uploadData
        ? uploadData.error?.message || "Cloudinary image upload failed."
        : "Cloudinary image upload failed.",
    );
  }

  return requireCloudinaryUploadResponse(
    uploadData as CloudinaryImageUploadResult,
  );
};

export const deleteAdminImageFromCloudinary = async (publicId: string) => {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    return;
  }

  const session = await getAuthenticatedSession();

  const deleteResponse = await fetch("/api/cloudinary/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({
      publicId: normalizedPublicId,
    }),
  });

  const deleteData = await parseJsonResponse<{
    success?: boolean;
    message?: string;
  }>(deleteResponse);

  if (!deleteResponse.ok || !deleteData.success) {
    throw new Error(deleteData.message || "Could not delete Cloudinary image.");
  }
};

export const getCloudinaryImagePublicId = (imageUrl: string | null) => {
  if (!imageUrl || !imageUrl.includes("res.cloudinary.com/")) {
    return null;
  }

  try {
    const url = new URL(imageUrl);
    const uploadMarker = "/image/upload/";
    const uploadIndex = url.pathname.indexOf(uploadMarker);

    if (uploadIndex === -1) {
      return null;
    }

    let publicId = url.pathname.slice(uploadIndex + uploadMarker.length);
    publicId = publicId.replace(/^v\d+\//, "");
    publicId = publicId.replace(/\.[^/.]+$/, "");

    return publicId || null;
  } catch {
    return null;
  }
};
