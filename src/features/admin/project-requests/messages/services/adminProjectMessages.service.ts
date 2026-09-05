import { requireSupabase } from "../../../../../lib/supabase";
import {
  deleteProjectMessageFromDatabase,
  deleteProjectMessageMediaFromCloudinary,
  uploadProjectMessageMediaToCloudinary,
} from "../../../../../shared/services/projectMessageMediaUpload.service";
import type { ProjectMessageMedia } from "../../../../../shared/types/projectMessageMedia.types";

export type AdminProjectMessage = {
  id: string;
  projectRequestId: string;
  senderId: string;
  senderType: "customer" | "admin";
  message: string;
  createdAt: string;
  readAt: string | null;
  media: ProjectMessageMedia[];
};

type ProjectMessageRow = {
  id: string;
  project_request_id: string;
  sender_id: string;
  sender_type: "customer" | "admin";
  message: string;
  created_at: string;
  read_at: string | null;
};

type ProjectMessageMediaRow = {
  id: string;
  project_request_id: string;
  message_id: string;
  customer_id: string;
  media_type: "image" | "file";
  resource_type: "image" | "raw";
  original_filename: string;
  mime_type: string | null;
  file_size: number | null;
  secure_url: string;
  public_id: string;
  created_at: string;
  updated_at: string;
};

const messageSelect =
  "id, project_request_id, sender_id, sender_type, message, created_at, read_at";
const mediaSelect =
  "id, project_request_id, message_id, customer_id, media_type, resource_type, original_filename, mime_type, file_size, secure_url, public_id, created_at, updated_at";

const mapMedia = (row: ProjectMessageMediaRow): ProjectMessageMedia => ({
  id: row.id,
  projectRequestId: row.project_request_id,
  messageId: row.message_id,
  customerId: row.customer_id,
  mediaType: row.media_type,
  resourceType: row.resource_type,
  originalFilename: row.original_filename,
  mimeType: row.mime_type,
  fileSize: row.file_size,
  secureUrl: row.secure_url,
  publicId: row.public_id,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapMessage = (
  row: ProjectMessageRow,
  media: ProjectMessageMedia[] = [],
): AdminProjectMessage => ({
  id: row.id,
  projectRequestId: row.project_request_id,
  senderId: row.sender_id,
  senderType: row.sender_type,
  message: row.message,
  createdAt: row.created_at,
  readAt: row.read_at,
  media,
});

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getAdminSession = async () => {
  const client = requireSupabase();
  const {
    data: { session },
    error,
  } = await client.auth.getSession();
  if (error) throw error;
  if (!session?.user?.id || !session.access_token)
    throw new Error("Admin session required.");
  return session;
};

const loadMedia = async (projectRequestId: string) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("project_message_media")
    .select(mediaSelect)
    .eq("project_request_id", projectRequestId)
    .order("created_at", { ascending: true })
    .returns<ProjectMessageMediaRow[]>();
  if (error) throw error;
  return data.map(mapMedia);
};

export const getAdminProjectMessages = async (
  projectRequestId: string,
): Promise<AdminProjectMessage[]> => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("project_messages")
    .select(messageSelect)
    .eq("project_request_id", projectRequestId)
    .order("created_at", { ascending: true })
    .returns<ProjectMessageRow[]>();
  if (error) throw error;

  const media = await loadMedia(projectRequestId);
  const grouped = new Map<string, ProjectMessageMedia[]>();
  media.forEach((item) => {
    const current = grouped.get(item.messageId) ?? [];
    current.push(item);
    grouped.set(item.messageId, current);
  });

  return data.map((row) => mapMessage(row, grouped.get(row.id) ?? []));
};

export const sendAdminProjectMessage = async (
  projectRequestId: string,
  message: string,
): Promise<AdminProjectMessage> => {
  const client = requireSupabase();
  const session = await getAdminSession();

  const { data, error } = await client
    .from("project_messages")
    .insert({
      project_request_id: projectRequestId,
      sender_id: session.user.id,
      sender_type: "admin",
      message: message.trim(),
    })
    .select(messageSelect)
    .single<ProjectMessageRow>();
  if (error) throw error;
  return mapMessage(data);
};

export const uploadAdminProjectMessageMedia = async ({
  file,
  requestId,
  messageId,
  mediaType,
}: {
  file: File;
  requestId: string;
  messageId: string;
  mediaType: "image" | "file";
}): Promise<ProjectMessageMedia> => {
  const client = requireSupabase();
  const session = await getAdminSession();
  const maxSize = 10 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      `${mediaType === "image" ? "Image" : "File"} is too large. ${formatFileSize(
        file.size,
      )} selected. Maximum allowed is 10 MB.`,
    );
  }
  if (mediaType === "image" && !file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  const { data: request, error: requestError } = await client
    .from("project_requests")
    .select("customer_id")
    .eq("id", requestId)
    .single<{ customer_id: string }>();
  if (requestError) throw requestError;

  const uploaded = await uploadProjectMessageMediaToCloudinary({
    file,
    requestId,
    messageId,
    mediaType,
    accessToken: session.access_token,
  });

  const { data, error } = await client
    .from("project_message_media")
    .insert({
      project_request_id: requestId,
      message_id: messageId,
      customer_id: request.customer_id,
      media_type: mediaType,
      resource_type: uploaded.resource_type,
      original_filename: file.name,
      mime_type: file.type || null,
      file_size: file.size,
      secure_url: uploaded.secure_url,
      public_id: uploaded.public_id,
    })
    .select(mediaSelect)
    .single<ProjectMessageMediaRow>();

  if (error) {
    await deleteProjectMessageMediaFromCloudinary({
      publicId: uploaded.public_id,
      resourceType: uploaded.resource_type,
      requestId,
      messageId,
      accessToken: session.access_token,
    }).catch(() => undefined);
    throw error;
  }

  return mapMedia(data);
};

export const markAdminProjectMessagesAsRead = async (
  projectRequestId: string,
) => {
  const client = requireSupabase();
  await getAdminSession();

  const { error } = await client
    .from("project_messages")
    .update({ read_at: new Date().toISOString() })
    .eq("project_request_id", projectRequestId)
    .eq("sender_type", "customer")
    .is("read_at", null);
  if (error) throw error;
};

export const sendAdminProjectMessageWithMedia = async ({
  projectRequestId,
  message,
  images,
  files,
}: {
  projectRequestId: string;
  message: string;
  images: File[];
  files: File[];
}): Promise<AdminProjectMessage> => {
  const session = await getAdminSession();

  const createdMessage = await sendAdminProjectMessage(
    projectRequestId,
    message,
  );

  const uploadedMedia: Array<{
    publicId: string;
    resourceType: "image" | "raw";
  }> = [];

  try {
    for (const image of images) {
      const media = await uploadAdminProjectMessageMedia({
        file: image,
        requestId: projectRequestId,
        messageId: createdMessage.id,
        mediaType: "image",
      });

      uploadedMedia.push({
        publicId: media.publicId,
        resourceType: media.resourceType,
      });
    }

    for (const file of files) {
      const media = await uploadAdminProjectMessageMedia({
        file,
        requestId: projectRequestId,
        messageId: createdMessage.id,
        mediaType: "file",
      });

      uploadedMedia.push({
        publicId: media.publicId,
        resourceType: media.resourceType,
      });
    }

    return {
      ...createdMessage,
      media: [],
    };
  } catch (sendError) {
    let cleanupFailed = false;

    for (const media of uploadedMedia) {
      try {
        await deleteProjectMessageMediaFromCloudinary({
          publicId: media.publicId,
          resourceType: media.resourceType,
          requestId: projectRequestId,
          messageId: createdMessage.id,
          accessToken: session.access_token,
        });
      } catch (cleanupError) {
        cleanupFailed = true;

        console.error(
          "Could not roll back admin project message media:",
          cleanupError,
        );
      }
    }

    if (!cleanupFailed) {
      try {
        await deleteProjectMessageFromDatabase({
          requestId: projectRequestId,
          messageId: createdMessage.id,
          accessToken: session.access_token,
        });
      } catch (messageCleanupError) {
        console.error(
          "Could not roll back admin project message:",
          messageCleanupError,
        );
      }
    }

    throw sendError;
  }
};