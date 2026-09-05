import type {
  ProjectMessageMediaType,
  ProjectMessageResourceType,
} from "../types/projectMessageMedia.types";

export type ProjectMessageCloudinaryUpload = {
  secure_url: string;
  public_id: string;
  resource_type: ProjectMessageResourceType;
};

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  signature: string;
  publicId: string;
  assetFolder: string;
  resourceType: ProjectMessageResourceType;
};

const parseJson = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text)
    throw new Error(
      `Cloudinary API returned an empty response (${response.status}).`,
    );
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(
      `Cloudinary API returned an invalid response (${response.status}).`,
    );
  }
};

export const uploadProjectMessageMediaToCloudinary = async ({
  file,
  requestId,
  messageId,
  mediaType,
  accessToken,
}: {
  file: File;
  requestId: string;
  messageId: string;
  mediaType: ProjectMessageMediaType;
  accessToken: string;
}): Promise<ProjectMessageCloudinaryUpload> => {
  const signResponse = await fetch("/api/cloudinary/project-message-sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      requestId,
      messageId,
      mediaType,
      fileBaseName: file.name.replace(/\.[^/.]+$/, ""),
      fileSize: file.size,
      fileType: file.type,
    }),
  });

  const signData = await parseJson<{
    success?: boolean;
    message?: string;
    upload?: UploadSignature;
  }>(signResponse);

  if (!signResponse.ok || !signData.success || !signData.upload) {
    throw new Error(signData.message || "Could not prepare Cloudinary upload.");
  }

  const upload = signData.upload;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", upload.apiKey);
  formData.append("timestamp", String(upload.timestamp));
  formData.append("signature", upload.signature);
  formData.append("public_id", upload.publicId);
  formData.append("asset_folder", upload.assetFolder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${upload.cloudName}/${upload.resourceType}/upload`,
    { method: "POST", body: formData },
  );

  const data = await parseJson<
    ProjectMessageCloudinaryUpload | { error?: { message?: string } }
  >(response);

  if (
    !response.ok ||
    !("secure_url" in data) ||
    !data.secure_url ||
    !data.public_id
  ) {
    throw new Error(
      "error" in data
        ? data.error?.message || "Cloudinary message attachment upload failed."
        : "Cloudinary message attachment upload failed.",
    );
  }

  return data;
};

export const deleteProjectMessageMediaFromCloudinary = async ({
  publicId,
  resourceType,
  requestId,
  messageId,
  accessToken,
}: {
  publicId: string;
  resourceType: ProjectMessageResourceType;
  requestId: string;
  messageId: string;
  accessToken: string;
}) => {
  const response = await fetch("/api/cloudinary/delete-project-message-media", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ publicId, resourceType, requestId, messageId }),
  });

  const data = await parseJson<{ success?: boolean; message?: string }>(
    response,
  );
  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Could not delete Cloudinary message media.",
    );
  }
};

export const deleteProjectMessageFromDatabase = async ({
  requestId,
  messageId,
  accessToken,
}: {
  requestId: string;
  messageId: string;
  accessToken: string;
}) => {
  const response = await fetch("/api/cloudinary/delete-project-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      requestId,
      messageId,
    }),
  });

  const data = await parseJson<{ success?: boolean; message?: string }>(
    response,
  );

  if (!response.ok || !data.success) {
    throw new Error(data.message || "Could not remove project message.");
  }
};