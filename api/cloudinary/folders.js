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

const isAllowedFolder = (folder) =>
  /^devbysam\/(services|projects|team)\/[a-z0-9_-]+(?:\/(images|videos))?$/.test(folder);

const encodePath = (value) =>
  value.split("/").map((segment) => encodeURIComponent(segment)).join("/");

const adminHeaders = () => ({
  Authorization:
    `Basic ${Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString("base64")}`,
});

const getSubfolders = async (folder) => {
  const url = new URL(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/folders/${encodePath(folder)}`,
  );
  url.searchParams.set("max_results", "500");

  const response = await fetch(url, { headers: adminHeaders() });
  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};

  if (response.status === 404) return [];

  if (!response.ok) {
    throw new Error(data?.error?.message || `Could not inspect Cloudinary folder ${folder}.`);
  }

  return Array.isArray(data.folders) ? data.folders : [];
};

const getAssetCount = async (folder) => {
  const url = new URL(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/by_asset_folder`,
  );
  url.searchParams.set("asset_folder", folder);
  url.searchParams.set("max_results", "1");

  const response = await fetch(url, { headers: adminHeaders() });
  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};

  if (!response.ok) {
    throw new Error(data?.error?.message || `Could not inspect Cloudinary folder ${folder}.`);
  }

  return Array.isArray(data.resources) ? data.resources.length : 0;
};

const deleteFolder = async (folder) => {
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/folders/${encodePath(folder)}?skip_backup=true`,
    { method: "DELETE", headers: adminHeaders() },
  );

  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};

  if (response.status === 404) return false;

  if (!response.ok) {
    throw new Error(data?.error?.message || `Could not delete Cloudinary folder ${folder}.`);
  }

  return true;
};

const cleanupFolderTree = async (folder) => {
  const children = await getSubfolders(folder);

  for (const child of children) {
    await cleanupFolderTree(child.path || child.name);
  }

  const remainingAssets = await getAssetCount(folder);
  const remainingChildren = await getSubfolders(folder);

  if (remainingAssets === 0 && remainingChildren.length === 0) {
    await deleteFolder(folder);
    return true;
  }

  return false;
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
    const folder = String(body?.folder || "").trim().replace(/\/+$/, "");

    if (!isAllowedFolder(folder)) {
      return res.status(400).json({ success: false, message: "Invalid Cloudinary folder." });
    }

    const deleted = await cleanupFolderTree(folder);

    return res.status(200).json({ success: true, deleted });
  } catch (error) {
    console.error("Cloudinary folder cleanup error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not clean up Cloudinary folders.",
    });
  }
}
