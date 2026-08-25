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

const isAllowedPublicId = (publicId) =>
  /^devbysam\/(services|projects|team)\/[a-z0-9_-]+\/(images|videos)\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*$/.test(publicId);

const getMediaFolder = (publicId) => publicId.slice(0, publicId.lastIndexOf("/"));

const getEntityFolder = (mediaFolder) => mediaFolder.slice(0, mediaFolder.lastIndexOf("/"));

const encodePath = (value) =>
  value.split("/").map((segment) => encodeURIComponent(segment)).join("/");

const cloudinaryAdminHeaders = () => ({
  Authorization:
    `Basic ${Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64")}`,
});

const getFolderAssetCount = async (folder) => {
  const url = new URL(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/by_asset_folder`,
  );
  url.searchParams.set("asset_folder", folder);
  url.searchParams.set("max_results", "1");

  const response = await fetch(url, {
    method: "GET",
    headers: cloudinaryAdminHeaders(),
  });

  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};

  if (!response.ok) {
    throw new Error(data?.error?.message || `Could not inspect Cloudinary folder ${folder}.`);
  }

  return Array.isArray(data.resources) ? data.resources.length : 0;
};

const deleteEmptyFolder = async (folder) => {
  const assetCount = await getFolderAssetCount(folder);

  if (assetCount > 0) {
    return false;
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/folders/${encodePath(folder)}?skip_backup=true`,
    {
      method: "DELETE",
      headers: cloudinaryAdminHeaders(),
    },
  );

  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || `Could not delete Cloudinary folder ${folder}.`);
  }

  return true;
};

const cleanupEmptyFolders = async (mediaFolder) => {
  // The media folder is the only folder we can safely remove immediately after
  // deleting one asset. The entity folder is attempted afterwards and will
  // only disappear when all of its media folders are gone.
  await deleteEmptyFolder(mediaFolder);
  await deleteEmptyFolder(getEntityFolder(mediaFolder));
};

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
    const publicId = String(body?.publicId || "").trim();
    const resourceType = body?.resourceType === "video" ? "video" : "image";

    if (!isAllowedPublicId(publicId)) {
      return res.status(400).json({ success: false, message: "Invalid Cloudinary asset." });
    }

    const expectedResourceType = publicId.includes("/videos/") ? "video" : "image";

    if (resourceType !== expectedResourceType) {
      return res.status(400).json({
        success: false,
        message: "Cloudinary resource type does not match the asset path.",
      });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const invalidate = true;
    const signature = createSignature({ invalidate, public_id: publicId, timestamp });
    const formData = new URLSearchParams();

    formData.append("public_id", publicId);
    formData.append("timestamp", String(timestamp));
    formData.append("invalidate", "true");
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("signature", signature);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/destroy`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      },
    );

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};

    if (!response.ok || (data.result !== "ok" && data.result !== "not found")) {
      throw new Error(data?.error?.message || "Cloudinary media deletion failed.");
    }

    let folderCleanup = "skipped";

    try {
      await cleanupEmptyFolders(getMediaFolder(publicId));
      folderCleanup = "completed";
    } catch (folderError) {
      // Asset deletion is the critical operation. Folder cleanup must never
      // turn a successful asset deletion into a failed CMS operation.
      console.error("Cloudinary empty-folder cleanup error:", folderError);
      folderCleanup = "failed";
    }

    return res.status(200).json({
      success: true,
      result: data.result,
      folderCleanup,
    });
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not delete Cloudinary media.",
    });
  }
}
