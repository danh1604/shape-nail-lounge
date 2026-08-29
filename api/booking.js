export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed." });
  }

  try {
    const {
      customer_name,
      customer_email,
      customer_phone,
      appointment_date,
      service_name,
      service_price,
    } = req.body || {};

    if (!customer_name || !customer_email || !customer_phone || !appointment_date) {
      return res.status(400).json({
        message: "Missing required booking information.",
      });
    }

    const apiKey = process.env.BREVO_API_KEY;
    const salonEmail = process.env.SALON_EMAIL;

    if (!apiKey || !salonEmail) {
      return res.status(500).json({
        message: "Brevo configuration is missing.",
      });
    }

    const sendEmail = async ({ to, replyTo, subject, htmlContent }) => {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          sender: {
            name: "Shape Nail Lounge",
            email: salonEmail,
          },
          to,
          replyTo: replyTo
            ? {
                email: replyTo.email,
                name: replyTo.name || "Shape Nail Lounge",
              }
            : undefined,
          subject,
          htmlContent,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Brevo request failed with status ${response.status}`
        );
      }
    };

    const customerHtml = `
      <p>Hi ${customer_name},</p>
      <p>Thank you for booking with Shape Nail Lounge.</p>
      <p><strong>Date:</strong> ${appointment_date}</p>
      <p><strong>Service:</strong> ${service_name}</p>
      <p><strong>Price:</strong> ${service_price || "Price varies"}</p>
      <p>We will contact you shortly to confirm your appointment.</p>
      <p>Best,<br />Shape Nail Lounge</p>
    `;

    const salonHtml = `
      <p><strong>Customer:</strong> ${customer_name}</p>
      <p><strong>Email:</strong> ${customer_email}</p>
      <p><strong>Phone:</strong> ${customer_phone}</p>
      <p><strong>Date:</strong> ${appointment_date}</p>
      <p><strong>Service:</strong> ${service_name}</p>
      <p><strong>Price:</strong> ${service_price || "Price varies"}</p>
    `;

    await sendEmail({
      to: [{ email: customer_email, name: customer_name }],
      replyTo: { email: salonEmail, name: "Shape Nail Lounge" },
      subject: "Appointment Confirmation - Shape Nail Lounge",
      htmlContent: customerHtml,
    });

    await new Promise((resolve) => setTimeout(resolve, 1200));

    await sendEmail({
      to: [{ email: salonEmail, name: "Shape Nail Lounge" }],
      replyTo: { email: customer_email, name: customer_name },
      subject: `New appointment request from ${customer_name}`,
      htmlContent: salonHtml,
    });

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
