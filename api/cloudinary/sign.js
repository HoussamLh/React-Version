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
    .slice(0, 80);

const createSignature = (params) => {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([firstKey], [secondKey]) => firstKey.localeCompare(secondKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${serialized}${CLOUDINARY_API_SECRET}`)
    .digest("hex");
};

const isAllowedFolder = (folder) =>
  /^devbysam\/(services|projects|team)\/[a-z0-9_-]+\/(images|videos)$/.test(folder);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  try {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
      throw new Error("Cloudinary server configuration is missing.");
    }

    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ success: false, message: "Authentication required." });
    }

    const supabaseAdmin = createSupabaseAdminClient();
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ success: false, message: "Invalid authentication session." });
    }

    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from("admin_profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (adminError) throw adminError;

    if (!adminProfile) {
      return res.status(403).json({ success: false, message: "Admin access required." });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const requestedFolder = String(body?.folder || "").trim().replace(/\/+$/, "");
    const resourceType = body?.resourceType === "video" ? "video" : "image";
    const fileBaseName = sanitizePathSegment(body?.fileBaseName || resourceType);

    if (!isAllowedFolder(requestedFolder)) {
      return res.status(400).json({ success: false, message: "Invalid Cloudinary media folder." });
    }

    const expectedFolderType = requestedFolder.endsWith("/videos") ? "video" : "image";

    if (resourceType !== expectedFolderType) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary resource type does not match the requested folder.",
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = `${requestedFolder}/${fileBaseName}-${timestamp}`;
    const signatureParams = { asset_folder: requestedFolder, public_id: publicId, timestamp };

    return res.status(200).json({
      success: true,
      upload: {
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY,
        timestamp,
        signature: createSignature(signatureParams),
        publicId,
        assetFolder: requestedFolder,
        resourceType,
      },
    });
  } catch (error) {
    console.error("Cloudinary signing error:", error);
    return res.status(500).json({ success: false, message: "Could not prepare Cloudinary upload." });
  }
}
