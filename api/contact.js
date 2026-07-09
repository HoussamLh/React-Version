import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed.",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const name = String(body?.name || "").trim();
    const email = String(body?.email || "").trim();
    const phone = String(body?.phone || "").trim();
    const service = String(body?.service || "").trim();
    const message = String(body?.message || "").trim();

    if (!name || !email || !phone || !service || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    const requiredEnvVars = [
      "EMAIL_USER",
      "EMAIL_PASS",
      "RECEIVER_EMAIL",
      "SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
    ];

    const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

    if (missingEnvVars.length > 0) {
      return res.status(500).json({
        success: false,
        message: `Service is missing: ${missingEnvVars.join(", ")}`,
      });
    }

    const supabaseAdmin = createSupabaseAdminClient();

    const { error: submissionError } = await supabaseAdmin
      .from("contact_submissions")
      .insert({
        name,
        email,
        phone,
        service,
        message,
        status: "new",
        source: "contact_page",
      });

    if (submissionError) {
      console.error("Contact submission save error:", submissionError);

return res.status(500).json({
  success: false,
  message: "Failed to send message.",
  error: error instanceof Error ? error.message : String(error),
});

    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeService = escapeHtml(service);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

    await transporter.sendMail({
      from: `"DevBySam Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      replyTo: email,
      subject: `New ${service} enquiry from ${name}`,
      text: `
New DevBySam contact form submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; background: #0d0f12; color: #ffffff; padding: 24px;">
          <div style="max-width: 640px; margin: 0 auto; background: #181a1e; border: 1px solid #262930; border-radius: 16px; padding: 24px;">
            <h2 style="margin: 0 0 16px; color: #93dc5c;">
              New DevBySam enquiry
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: #8a8f98;">Name</td>
                <td style="padding: 8px 0; color: #ffffff;">${safeName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a8f98;">Email</td>
                <td style="padding: 8px 0; color: #ffffff;">${safeEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a8f98;">Phone</td>
                <td style="padding: 8px 0; color: #ffffff;">${safePhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8a8f98;">Service</td>
                <td style="padding: 8px 0; color: #ffffff;">${safeService}</td>
              </tr>
            </table>

            <div style="border-top: 1px solid #262930; padding-top: 16px;">
              <p style="margin: 0 0 8px; color: #8a8f98;">Message</p>
              <p style="margin: 0; line-height: 1.6; color: #ffffff;">
                ${safeMessage}
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
}
