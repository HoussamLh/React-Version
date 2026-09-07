import { createClient } from "@supabase/supabase-js";
import { sendContactEmail } from "./services/contactEmail.service.js";

const createSupabaseAdminClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Supabase service is missing: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

const getContactFormData = (body) => ({
  name: String(body?.name || "").trim(),
  email: String(body?.email || "").trim(),
  phone: String(body?.phone || "").trim(),
  service: String(body?.service || "").trim(),
  message: String(body?.message || "").trim(),
});

const validateContactFormData = ({ name, email, phone, service, message }) => {
  return Boolean(name && email && phone && service && message);
};

const validateEnvironment = () => {
  const requiredEnvVars = [
    "RESEND_API_KEY",
    "RECEIVER_EMAIL",
    "SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ];

  return requiredEnvVars.filter((key) => !process.env[key]);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const contactData = getContactFormData(body);

    if (!validateContactFormData(contactData)) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const missingEnvVars = validateEnvironment();

    if (missingEnvVars.length > 0) {
      console.error(
        "Missing environment variables:",
        missingEnvVars.join(", "),
      );

      return res.status(500).json({
        success: false,
        message: "Email service is not configured correctly.",
      });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    const { error: submissionError } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        ...contactData,
        status: "new",
        source: "contact_page",
      });

    if (submissionError) {
      console.error("Contact submission save error:", submissionError);

      return res.status(500).json({
        success: false,
        message: "Failed to save your message.",
      });
    }

    const { error: emailError } = await sendContactEmail(contactData);

    if (emailError) {
      console.error("Resend email error:", emailError);

      return res.status(500).json({
        success: false,
        message: "Your message was saved, but the email could not be sent.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process your message.",
    });
  }
}
