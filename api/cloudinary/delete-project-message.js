import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const createSupabaseAdminClient = () => {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase server configuration is missing.");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const getBearerToken = (req) => {
  const header = req.headers?.authorization || "";
  const [scheme, token] = header.split(" ");

  return scheme?.toLowerCase() === "bearer" && token ? token : null;
};

const parseBody = (req) =>
  typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  try {
    const token = getBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication session.",
      });
    }

    const body = parseBody(req);

    const requestId = String(body.requestId || "").trim();
    const messageId = String(body.messageId || "").trim();

    if (!requestId || !messageId) {
      return res.status(400).json({
        success: false,
        message: "Project message deletion details are incomplete.",
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
      return res.status(404).json({
        success: false,
        message: "Project message not found.",
      });
    }

    const { data: request, error: requestError } = await supabaseAdmin
      .from("project_requests")
      .select("id, customer_id")
      .eq("id", requestId)
      .maybeSingle();

    if (requestError) throw requestError;

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Project request not found.",
      });
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
        return res.status(403).json({
          success: false,
          message: "You can only remove your own admin message.",
        });
      }
    } else {
      if (
        request.customer_id !== user.id ||
        message.sender_id !== user.id ||
        message.sender_type !== "customer"
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only remove your own customer message.",
        });
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from("project_messages")
      .delete()
      .eq("id", messageId)
      .eq("project_request_id", requestId)
      .eq("sender_id", user.id)
      .eq("sender_type", isAdmin ? "admin" : "customer");

    if (deleteError) throw deleteError;

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Project message deletion error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not remove project message.",
    });
  }
}
