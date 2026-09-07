import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const receiverEmail = process.env.RECEIVER_EMAIL;

if (!resendApiKey) {
  throw new Error("Missing RESEND_API_KEY environment variable.");
}

if (!receiverEmail) {
  throw new Error("Missing RECEIVER_EMAIL environment variable.");
}

const resend = new Resend(resendApiKey);

const escapeHtml = (value = "") => {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

const createContactEmailHtml = ({ name, email, phone, service, message }) => {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeService = escapeHtml(service);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  return `
    <div
      style="
        font-family: Arial, sans-serif;
        background: #0d0f12;
        color: #ffffff;
        padding: 24px;
      "
    >
      <div
        style="
          max-width: 640px;
          margin: 0 auto;
          background: #181a1e;
          border: 1px solid #262930;
          border-radius: 16px;
          padding: 24px;
        "
      >
        <h2
          style="
            margin: 0 0 16px;
            color: #93dc5c;
          "
        >
          New DevBySam enquiry
        </h2>

        <table
          style="
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 24px;
          "
        >
          <tr>
            <td style="padding: 8px 0; color: #8a8f98;">
              Name
            </td>
            <td style="padding: 8px 0; color: #ffffff;">
              ${safeName}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px 0; color: #8a8f98;">
              Email
            </td>
            <td style="padding: 8px 0; color: #ffffff;">
              ${safeEmail}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px 0; color: #8a8f98;">
              Phone
            </td>
            <td style="padding: 8px 0; color: #ffffff;">
              ${safePhone}
            </td>
          </tr>

          <tr>
            <td style="padding: 8px 0; color: #8a8f98;">
              Service
            </td>
            <td style="padding: 8px 0; color: #ffffff;">
              ${safeService}
            </td>
          </tr>
        </table>

        <div
          style="
            border-top: 1px solid #262930;
            padding-top: 16px;
          "
        >
          <p
            style="
              margin: 0 0 8px;
              color: #8a8f98;
            "
          >
            Message
          </p>

          <p
            style="
              margin: 0;
              line-height: 1.6;
              color: #ffffff;
            "
          >
            ${safeMessage}
          </p>
        </div>
      </div>
    </div>
  `;
};

const createContactEmailText = ({ name, email, phone, service, message }) => {
  return `
New DevBySam contact form submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}

Message:
${message}
  `.trim();
};

export const sendContactEmail = async ({
  name,
  email,
  phone,
  service,
  message,
}) => {
  const { data, error } = await resend.emails.send({
    from: "DevBySam Contact Form <contact@devbysam.co.uk>",
    to: receiverEmail,
    replyTo: email,
    subject: `New ${service} enquiry from ${name}`,
    text: createContactEmailText({
      name,
      email,
      phone,
      service,
      message,
    }),
    html: createContactEmailHtml({
      name,
      email,
      phone,
      service,
      message,
    }),
  });

  if (error) {
    throw new Error(`Resend email failed: ${error.message}`);
  }

  return data;
};
