import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5174;

const mongoClient = new MongoClient(process.env.MONGODB_URI);
let appointments;

app.use(cors());
app.use(express.json());

const getBrevoErrorMessage = async (response, senderEmail) => {
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

const isPublicSenderEmail = (email) => /@(gmail|yahoo|outlook|hotmail|icloud|live|protonmail)\.(com|net)$/i.test(email || "");

const sendEmail = async ({
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

const buildReminderHtml = ({ customer_name, appointment_date, appointment_time, service_name, shopLogoUrl }) => `
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

app.post("/api/booking", async (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_note,
      appointment_date,
      appointment_time,
      appointment_datetime,
      service_name,
      service_price,
    } = req.body || {};

    const resolvedDateTime = appointment_datetime || "";
    const [parsedDate, parsedTime] = resolvedDateTime
      ? resolvedDateTime.split("T")
      : [appointment_date || "", appointment_time || ""];

    if (
      !customer_name ||
      !customer_email ||
      !customer_phone ||
      !parsedDate ||
      !parsedTime
    ) {
      return res.status(400).json({
        message: "Missing required booking information.",
      });
    }

    const finalAppointmentDate = parsedDate;
    const finalAppointmentTime = parsedTime;

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;
    const salonContactEmail = process.env.SALON_EMAIL;
    const shopLogoUrl =
      process.env.SHOP_LOGO_URL ||
      "https://img.mailinblue.com/11962144/images/content_library/original/6a93ae97ef18b433911b0deb.jpg";

    if (!apiKey || !senderEmail || !salonContactEmail) {
      return res.status(500).json({
        message: "Brevo configuration is missing.",
      });
    }

    if (isPublicSenderEmail(senderEmail)) {
      return res.status(500).json({
        message: "SENDER_EMAIL must be a verified business email from your own domain. Gmail/Outlook/Yahoo are not valid sender addresses for Brevo production setup.",
      });
    }

    const appointmentDateTime = `${finalAppointmentDate} at ${finalAppointmentTime}`;
    const customerTemplateId = Number(
      process.env.BREVO_CUSTOMER_TEMPLATE_ID || process.env.BREVO_TEMPLATE_ID || 0
    );
    const salonTemplateId = Number(
      process.env.BREVO_SALON_TEMPLATE_ID || process.env.BREVO_TEMPLATE_ID || 0
    );

    const customerParams = {
      customer_name,
      customer_email,
      customer_phone,
      appointment_datetime: appointmentDateTime,
      service_name,
      service_price: service_price || "Price varies",
      salon_name: "Shape Nail Lounge",
      shop_logo_url: shopLogoUrl,
      customer_note: customer_note || "No additional notes",
    };

    const salonParams = {
      customer_name,
      customer_email,
      customer_phone,
      appointment_datetime: appointmentDateTime,
      service_name,
      service_price: service_price || "Price varies",
      salon_name: "Shape Nail Lounge",
      shop_logo_url: shopLogoUrl,
      customer_note: customer_note || "No additional notes",
    };

    await sendEmail({
      apiKey,
      senderEmail,
      to: [{ email: customer_email, name: customer_name }],
      replyTo: { email: salonContactEmail, name: "Shape Nail Lounge" },
      subject: "Appointment Confirmation - Shape Nail Lounge",
      htmlContent: customerTemplateId ? undefined : `
        <div style="background:#f7f1e7;padding:32px 0;font-family:Arial,Helvetica,sans-serif;color:#31281d;">
          <div style="max-width:620px;margin:0 auto;background:#fffdf9;border:1px solid #e5d7bd;border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(49,40,29,0.08);">
            <div style="background:#31281d;padding:22px 28px;display:flex;align-items:center;gap:16px;">
              <div style="width:46px;height:46px;border-radius:50%;background:#d7b36a;color:#31281d;font-weight:700;font-size:24px;display:flex;align-items:center;justify-content:center;">S</div>
              <div>
                <div style="font-size:12px;letter-spacing:3px;color:#f0e3c3;font-weight:700;">SHAPE</div>
                <div style="font-size:23px;letter-spacing:2px;color:#fffaf0;font-weight:600;line-height:1.1;">NAIL LOUNGE</div>
              </div>
            </div>

            <div style="padding:34px 28px 24px;">
              <p style="margin:0 0 14px;font-size:13px;letter-spacing:2px;color:#8a7045;text-transform:uppercase;font-weight:700;">Appointment confirmed</p>
              <h2 style="margin:0 0 12px;color:#31281d;font-size:32px;line-height:1.2;">Hi ${customer_name},</h2>
              <p style="margin:0 0 20px;color:#5e564d;font-size:16px;line-height:1.7;">
                Thank you for booking with Shape Nail Lounge. Your appointment has been received and we are looking forward to welcoming you.
              </p>

              <div style="background:#f5efe5;border:1px solid #eadfc8;border-radius:12px;padding:18px 20px;margin:0 0 20px;">
                <p style="margin:0 0 8px;color:#8a7045;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;">Appointment details</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong style="color:#31281d;">Date:</strong> ${appointmentDateTime}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong style="color:#31281d;">Service:</strong> ${service_name}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong style="color:#31281d;">Price:</strong> ${service_price || "Price varies"}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong style="color:#31281d;">Note:</strong> ${customer_note || "No additional notes"}</p>
              </div>

              <p style="margin:0 0 14px;color:#5e564d;font-size:15px;line-height:1.7;">
                <strong>Reminder:</strong> We will send you a reminder 2 hours before your appointment.
              </p>
              <p style="margin:0 0 22px;color:#5e564d;font-size:15px;line-height:1.7;">
                Please arrive 10 minutes early so we can prepare everything for you.
              </p>

              <div style="border-top:1px solid #e6dcc7;padding-top:20px;margin-top:10px;">
                <p style="margin:0;color:#5e564d;font-size:15px;line-height:1.7;">We will contact you shortly to confirm your appointment.</p>
                <p style="margin:18px 0 0;color:#31281d;font-weight:600;">Warmly,<br />Shape Nail Lounge</p>
              </div>
            </div>
          </div>
        </div>
      `,
      templateId: customerTemplateId || undefined,
      params: customerTemplateId ? customerParams : undefined,
    });

    await new Promise((resolve) => setTimeout(resolve, 1200));

    await sendEmail({
      apiKey,
      senderEmail,
      to: [{ email: salonContactEmail, name: "Shape Nail Lounge" }],
      replyTo: { email: customer_email, name: customer_name },
      subject: `New appointment request from ${customer_name}`,
      htmlContent: salonTemplateId ? undefined : `
        <div style="background:#f7f1e7;padding:32px 0;font-family:Arial,Helvetica,sans-serif;color:#31281d;">
          <div style="max-width:620px;margin:0 auto;background:#fffdf9;border:1px solid #e5d7bd;border-radius:18px;overflow:hidden;box-shadow:0 12px 30px rgba(49,40,29,0.08);">
            <div style="background:#31281d;padding:22px 28px;display:flex;align-items:center;gap:16px;">
              <div style="width:46px;height:46px;border-radius:50%;background:#d7b36a;color:#31281d;font-weight:700;font-size:24px;display:flex;align-items:center;justify-content:center;">S</div>
              <div>
                <div style="font-size:12px;letter-spacing:3px;color:#f0e3c3;font-weight:700;">SHAPE</div>
                <div style="font-size:23px;letter-spacing:2px;color:#fffaf0;font-weight:600;line-height:1.1;">NAIL LOUNGE</div>
              </div>
            </div>

            <div style="padding:30px 28px 24px;">
              <p style="margin:0 0 10px;color:#8a7045;font-size:12px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">New booking request</p>
              <h2 style="margin:0 0 18px;color:#31281d;font-size:28px;line-height:1.2;">Customer details</h2>

              <div style="background:#f5efe5;border:1px solid #eadfc8;border-radius:12px;padding:18px 20px;">
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong>Customer:</strong> ${customer_name}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong>Email:</strong> ${customer_email}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong>Phone:</strong> ${customer_phone}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong>Date:</strong> ${appointmentDateTime}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong>Service:</strong> ${service_name}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong>Price:</strong> ${service_price || "Price varies"}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong>Note:</strong> ${customer_note || "No additional notes"}</p>
              </div>
            </div>
          </div>
        </div>
      `,
      templateId: salonTemplateId || undefined,
      params: salonTemplateId ? salonParams : undefined,
    });

    await appointments.insertOne({
      customer_name,
      customer_email,
      customer_phone,
      customer_note: customer_note || "",
      appointment_date: finalAppointmentDate,
      appointment_time: finalAppointmentTime,
      service_name,
      service_price: service_price || "Price varies",
      reminder_sent: false,
      created_at: new Date(),
    });

    return res.status(200).json({
      message: "Booking email sent successfully.",
    });
  } catch (error) {
    console.error("BREVO BACKEND ERROR:", error);
    return res.status(500).json({
      message: error.message || "Failed to send booking email.",
    });
  }
});

app.get("/api/cron/send-reminders", async (req, res) => {
  try {
    if (req.query.token !== process.env.CRON_SECRET_TOKEN) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.SENDER_EMAIL;
    const salonContactEmail = process.env.SALON_EMAIL;
    const reminderTemplateId = Number(
      process.env.BREVO_REMINDER_TEMPLATE_ID || process.env.BREVO_TEMPLATE_ID || 0
    );
    const shopPhone = process.env.SHOP_PHONE || "123 Beauty Street";
    const shopLogoUrl =
      process.env.SHOP_LOGO_URL ||
      "https://img.mailinblue.com/11962144/images/content_library/original/6a93ae97ef18b433911b0deb.jpg";

    if (!apiKey || !senderEmail || !salonContactEmail) {
      return res.status(500).json({ message: "Brevo configuration is missing." });
    }

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const pendingReminders = await appointments
      .find({
        reminder_sent: false,
        $expr: {
          $lte: [
            {
              $dateAdd: {
                startDate: {
                  $dateFromString: { dateString: { $concat: ["$appointment_date", "T", "$appointment_time", ":00"] } },
                },
                unit: "hour",
                amount: -2,
              },
            },
            twoHoursLater,
          ],
        },
      })
      .toArray();

    let sent = 0;
    for (const appt of pendingReminders) {
      try {
        const reminderParams = {
          customer_name: appt.customer_name,
          appointment_datetime: `${appt.appointment_date} at ${appt.appointment_time}`,
          service_name: appt.service_name || "Your appointment",
          store_phone: shopPhone,
          shop_logo_url: shopLogoUrl,
        };

        await sendEmail({
          apiKey,
          senderEmail,
          to: [{ email: appt.customer_email, name: appt.customer_name }],
          replyTo: { email: salonContactEmail, name: "Shape Nail Lounge" },
          subject: "Appointment Reminder - Shape Nail Lounge",
          htmlContent: reminderTemplateId
            ? undefined
            : buildReminderHtml({
                customer_name: appt.customer_name,
                appointment_date: appt.appointment_date,
                appointment_time: appt.appointment_time,
                service_name: appt.service_name,
                shopLogoUrl,
              }),
          templateId: reminderTemplateId || undefined,
          params: reminderTemplateId ? reminderParams : undefined,
        });

        await appointments.updateOne(
          { _id: appt._id },
          { $set: { reminder_sent: true } }
        );
        sent++;
      } catch (emailError) {
        console.error("REMINDER EMAIL ERROR:", emailError);
      }
    }

    return res.status(200).json({ sent });
  } catch (error) {
    console.error("CRON JOB ERROR:", error);
    return res.status(500).json({ message: error.message || "Cron job failed." });
  }
});

app.listen(PORT, async () => {
  try {
    await mongoClient.connect();
    appointments = mongoClient.db("nail-studio").collection("appointments");
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
