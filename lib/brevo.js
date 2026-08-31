export const getBrevoErrorMessage = async (response, senderEmail) => {
  const errorData = await response.json().catch(() => ({}));
  const rawMessage = errorData.message || `Brevo request failed with status ${response.status}`;
  const normalized = rawMessage.toLowerCase();

  if (
    /sender|from.*email|not allowed|unauthorized|verify|domain|authoriz/i.test(
      normalized
    ) ||
    senderEmail?.toLowerCase().includes("gmail.com") ||
    senderEmail?.toLowerCase().includes("yahoo.com") ||
    senderEmail?.toLowerCase().includes("outlook.com") ||
    senderEmail?.toLowerCase().includes("hotmail.com") ||
    senderEmail?.toLowerCase().includes("icloud.com")
  ) {
    return `${rawMessage}. Please verify the sender email in Brevo > Settings > Senders & Domains and restart the server after updating SENDER_EMAIL in .env. Use a business email from your own domain, not Gmail/Outlook/Yahoo. Current sender: ${senderEmail || "not set"}.`;
  }

  return rawMessage;
};

export const isPublicSenderEmail = (email) =>
  /@(gmail|yahoo|outlook|hotmail|icloud|live|protonmail)\.(com|net)$/i.test(email || "");

export const sendEmail = async ({
  apiKey,
  senderEmail,
  to,
  replyTo,
  subject,
  htmlContent,
  templateId,
  params,
}) => {
  const payload = {
    sender: {
      name: "Shape Nail Lounge",
      email: senderEmail,
    },
    to,
    replyTo: replyTo
      ? {
          email: replyTo.email,
          name: replyTo.name || "Shape Nail Lounge",
        }
      : undefined,
    subject,
    ...(templateId ? { templateId: Number(templateId) } : {}),
    ...(params ? { params } : {}),
    ...(htmlContent ? { htmlContent } : {}),
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getBrevoErrorMessage(response, senderEmail));
  }
};

export const buildReminderHtml = ({
  customer_name,
  appointment_date,
  appointment_time,
  service_name,
  shopLogoUrl,
}) => `
  <div style="margin:0;padding:0;background:#f5efe8;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:640px;margin:0 auto;background:#fffdf9;border:1px solid #eadcc2;border-radius:20px;overflow:hidden;box-shadow:0 18px 42px rgba(49,40,29,0.08);">
      <div style="background:linear-gradient(135deg,#2d221d 0%,#3a2d26 100%);padding:26px 30px 22px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td valign="middle">
              <img src="${shopLogoUrl}" alt="Shape Nail Lounge logo" width="52" height="52" style="display:block;width:52px;height:52px;object-fit:contain;border-radius:16px;background:#fff;padding:4px;" />
            </td>
            <td valign="middle" style="padding-left:16px;">
              <div style="font-size:11px;letter-spacing:3px;color:#e7d7b1;font-weight:700;text-transform:uppercase;">Shape</div>
              <div style="font-size:28px;letter-spacing:1.5px;color:#fffaf5;font-weight:700;line-height:1.1;">Nail Lounge</div>
            </td>
            <td valign="middle" align="right">
              <span style="display:inline-block;background:#d7b36a;color:#2d221d;padding:9px 14px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Reminder</span>
            </td>
          </tr>
        </table>
      </div>
      <div style="padding:30px 28px 8px;">
        <p style="margin:0 0 12px;font-size:11px;letter-spacing:2px;color:#8a7045;text-transform:uppercase;font-weight:700;">Friendly reminder</p>
        <h1 style="margin:0 0 12px;color:#2d221d;font-size:32px;line-height:1.2;font-weight:700;">Hi ${customer_name},</h1>
        <p style="margin:0 0 22px;color:#564f49;font-size:16px;line-height:1.8;">This is a gentle reminder that your appointment at Shape Nail Lounge is coming up soon.</p>
        <div style="background:#f5efe5;border:1px solid #eadfc8;border-radius:14px;padding:20px 22px;margin:0 0 22px;">
          <p style="margin:0 0 12px;color:#8b7349;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Your appointment</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr><td style="padding:8px 0;font-size:14px;color:#594f48;width:120px;font-weight:700;">Date</td><td style="padding:8px 0;font-size:15px;color:#2d221d;">${appointment_date} at ${appointment_time}</td></tr>
            <tr><td style="padding:8px 0;font-size:14px;color:#594f48;width:120px;font-weight:700;">Service</td><td style="padding:8px 0;font-size:15px;color:#2d221d;">${service_name || "Your appointment"}</td></tr>
            <tr><td style="padding:8px 0;font-size:14px;color:#594f48;width:120px;font-weight:700;">Location</td><td style="padding:8px 0;font-size:15px;color:#2d221d;">Shape Nail Lounge</td></tr>
          </table>
        </div>
        <p style="margin:0 0 10px;color:#544d48;font-size:15px;line-height:1.8;">Please arrive 10 minutes early so we can prepare everything for your visit and make sure your time with us is relaxed and seamless.</p>
        <p style="margin:0 0 26px;color:#544d48;font-size:15px;line-height:1.8;">We look forward to welcoming you soon.</p>
        <div style="border-top:1px solid #e7dcc2;padding-top:20px;margin-top:10px;">
          <p style="margin:0;color:#544d48;font-size:15px;line-height:1.8;">Warmly,</p>
          <p style="margin:18px 0 0;color:#2d221d;font-size:16px;font-weight:700;line-height:1.6;">Shape Nail Lounge</p>
        </div>
      </div>
      <div style="background:#f9f3ea;padding:18px 28px 26px;text-align:center;border-top:1px solid #eadcc2;">
        <div style="font-size:12px;letter-spacing:1.8px;color:#8a7045;text-transform:uppercase;font-weight:700;">Luxury nail care</div>
      </div>
    </div>
  </div>
`;
