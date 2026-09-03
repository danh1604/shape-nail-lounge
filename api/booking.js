import { connectToDatabase } from "../lib/mongodb.js";
import { sendEmail, isPublicSenderEmail } from "../lib/brevo.js";

export const config = {
  api: { bodyParser: { sizeLimit: "1mb" } },
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

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
      timezone_offset,
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

    const localDateTime = new Date(`${parsedDate}T${parsedTime}:00`);
    const offsetMinutes = Number(timezone_offset) || 0;
    const utcDateTime = new Date(localDateTime.getTime() + offsetMinutes * 60 * 1000);

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
        message:
          "SENDER_EMAIL must be a verified business email from your own domain. Gmail/Outlook/Yahoo are not valid sender addresses for Brevo production setup.",
      });
    }

    const appointmentDateTime = `${finalAppointmentDate} at ${finalAppointmentTime}`;

    const { db } = await connectToDatabase();

    await Promise.all([
      sendEmail({
        apiKey,
        senderEmail,
        to: [{ email: customer_email, name: customer_name }],
        replyTo: { email: salonContactEmail, name: "Shape Nail Lounge" },
        subject: "Appointment Confirmation - Shape Nail Lounge",
        htmlContent: `
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
              <p style="margin:0 0 20px;color:#5e564d;font-size:16px;line-height:1.7;">Thank you for booking with Shape Nail Lounge. Your appointment has been received and we are looking forward to welcoming you.</p>
              <div style="background:#f5efe5;border:1px solid #eadfc8;border-radius:12px;padding:18px 20px;margin:0 0 20px;">
                <p style="margin:0 0 8px;color:#8a7045;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;">Appointment details</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong style="color:#31281d;">Date:</strong> ${appointmentDateTime}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong style="color:#31281d;">Service:</strong> ${service_name}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong style="color:#31281d;">Price:</strong> ${service_price || "Price varies"}</p>
                <p style="margin:6px 0;color:#31281d;font-size:15px;"><strong style="color:#31281d;">Note:</strong> ${customer_note || "No additional notes"}</p>
              </div>
              <p style="margin:0 0 14px;color:#5e564d;font-size:15px;line-height:1.7;"><strong>Reminder:</strong> We will send you a reminder 2 hours before your appointment.</p>
              <p style="margin:0 0 22px;color:#5e564d;font-size:15px;line-height:1.7;">Please arrive 10 minutes early so we can prepare everything for you.</p>
              <div style="border-top:1px solid #e6dcc7;padding-top:20px;margin-top:10px;">
                <p style="margin:0;color:#5e564d;font-size:15px;line-height:1.7;">We will contact you shortly to confirm your appointment.</p>
                <p style="margin:18px 0 0;color:#31281d;font-weight:600;">Warmly,<br />Shape Nail Lounge</p>
              </div>
            </div>
          </div>
        </div>
      `,
      }),
      sendEmail({
        apiKey,
        senderEmail,
        to: [{ email: salonContactEmail, name: "Shape Nail Lounge" }],
        replyTo: { email: customer_email, name: customer_name },
        subject: `New appointment request from ${customer_name}`,
        htmlContent: `
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
      }),
      db.collection("appointments").insertOne({
        customer_name,
        customer_email,
        customer_phone,
        customer_note: customer_note || "",
        appointment_date: finalAppointmentDate,
        appointment_time: finalAppointmentTime,
        appointment_datetime_utc: utcDateTime,
        timezone_offset: offsetMinutes,
        service_name,
        service_price: service_price || "Price varies",
        reminder_sent: false,
        created_at: new Date(),
      }),
    ]);

    return res.status(200).json({
      message: "Booking email sent successfully.",
    });
  } catch (error) {
    console.error("BREVO API HANDLER ERROR:", error);
    return res.status(500).json({
      message: error.message || "Failed to send booking email.",
    });
  }
}
