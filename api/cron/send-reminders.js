import { connectToDatabase } from "../../lib/mongodb.js";
import { sendEmail, buildReminderHtml } from "../../lib/brevo.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

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

    const { db } = await connectToDatabase();

    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    const pendingReminders = await db
      .collection("appointments")
      .find({
        reminder_sent: false,
        $expr: {
          $lte: [
            {
              $dateAdd: {
                startDate: {
                  $dateFromString: {
                    dateString: {
                      $concat: ["$appointment_date", "T", "$appointment_time", ":00"],
                    },
                  },
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

        await db
          .collection("appointments")
          .updateOne({ _id: appt._id }, { $set: { reminder_sent: true } });
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
}
