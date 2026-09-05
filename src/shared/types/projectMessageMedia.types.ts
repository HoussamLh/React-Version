export type ProjectMessageMediaType = "image" | "file";
export type ProjectMessageResourceType = "image" | "raw";

export type ProjectMessageMedia = {
  id: string;
  projectRequestId: string;
  messageId: string;
  customerId: string;
  mediaType: ProjectMessageMediaType;
  resourceType: ProjectMessageResourceType;
  originalFilename: string;
  mimeType: string | null;
  fileSize: number | null;
  secureUrl: string;
  publicId: string;
  createdAt: string;
  updatedAt: string;
};
