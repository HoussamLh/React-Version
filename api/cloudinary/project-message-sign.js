import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const createSupabaseAdminClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

const getBearerToken = (req) => {
  const header = req.headers?.authorization || "";
  const [scheme, token] = header.split(" ");
  return scheme?.toLowerCase() === "bearer" && token ? token : null;
};

const sanitizePathSegment = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "attachment";

const createSignature = (params) => {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${serialized}${CLOUDINARY_API_SECRET}`)
    .digest("hex");
};

const parseBody = (req) =>
  typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  try {
    if (
      !CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary server configuration is missing.");
    }

    const token = getBearerToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required." });
    }

    const supabaseAdmin = createSupabaseAdminClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid authentication session." });
    }

    const body = parseBody(req);
    const requestId = String(body.requestId || "").trim();
    const messageId = String(body.messageId || "").trim();
    const mediaType =
      body.mediaType === "file"
        ? "file"
        : body.mediaType === "image"
          ? "image"
          : null;
    const fileBaseName = sanitizePathSegment(body.fileBaseName);
    const fileSize = Number(body.fileSize);
    const fileType = String(body.fileType || "").trim();

    if (
      !requestId ||
      !messageId ||
      !mediaType ||
      !Number.isFinite(fileSize) ||
      fileSize <= 0
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Project message upload details are incomplete.",
        });
    }

    const { data: message, error: messageError } = await supabaseAdmin
      .from("project_messages")
      .select("id, project_request_id, sender_id, sender_type")
      .eq("id", messageId)
      .eq("project_request_id", requestId)
      .maybeSingle();

    if (messageError) throw messageError;
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Project message not found." });
    }

    const { data: request, error: requestError } = await supabaseAdmin
      .from("project_requests")
      .select("id, customer_id")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) throw requestError;
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Project request not found." });
    }

    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError) throw adminError;

    const isAdmin = Boolean(adminProfile);

    if (isAdmin) {
      if (message.sender_id !== user.id || message.sender_type !== "admin") {
        return res
          .status(403)
          .json({
            success: false,
            message: "You can only upload media to your own admin message.",
          });
      }
    } else if (
      request.customer_id !== user.id ||
      message.sender_id !== user.id ||
      message.sender_type !== "customer"
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You cannot upload media to this message.",
        });
    }

    const maxFileSize = 10 * 1024 * 1024;

    if (fileSize > maxFileSize) {
      return res.status(400).json({
        success: false,
        message: `${
          mediaType === "image" ? "Image" : "File"
        } is too large. Maximum allowed is 10 MB.`,
      });
    }

    if (mediaType === "image" && !fileType.startsWith("image/")) {
      return res
        .status(400)
        .json({ success: false, message: "Please choose a valid image file." });
    }

    const resourceType = mediaType === "image" ? "image" : "raw";
    const folder = `devbysam/customer-uploads/${request.customer_id}/${requestId}/messages/${mediaType === "image" ? "images" : "files"}`;
    const publicId = `${folder}/${messageId}-${fileBaseName}-${crypto.randomBytes(6).toString("hex")}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = createSignature({
      asset_folder: folder,
      public_id: publicId,
      timestamp,
    });

    return res.status(200).json({
      success: true,
      upload: {
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY,
        timestamp,
        signature,
        publicId,
        assetFolder: folder,
        resourceType,
      },
    });
  } catch (error) {
    console.error("Project message Cloudinary signing error:", error);
    return res.status(500).json({ success: false, message: "Could not prepare project message upload." });
  }
}
