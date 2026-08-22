import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const services = [
    [
      "01",
      "SNS Full Set",
      "SNS powder set with a natural, durable finish.",
      "$45+",
      "Nail Care",
    ],
    [
      "02",
      "SNS Full Set with Removal",
      "New SNS set including removal of existing product.",
      "$50+",
      "Nail Care",
    ],
    [
      "03",
      "SNS Ombré",
      "Soft ombré powder finish with a seamless blend.",
      "$65+",
      "Nail Art",
    ],
    [
      "04",
      "Add Tips",
      "Add length to any SNS powder service.",
      "+$10",
      "Nail Care",
    ],
    ["05", "French", "Classic French tip add-on.", "+$10", "Nail Art"],
    [
      "06",
      "Manicure",
      "Cut and shape, cuticle treatment and regular polish.",
      "$25",
      "Nail Care",
    ],
    [
      "07",
      "Gel Manicure",
      "Manicure finished with long-wear gel polish.",
      "$40",
      "Nail Care",
    ],
    [
      "08",
      "Polish Change - Hands or Toes",
      "Fresh regular polish on hands or toes.",
      "$20",
      "Nail Care",
    ],
    [
      "09",
      "Gel Polish Change - Hands or Toes",
      "Fresh gel color on hands or toes.",
      "$30",
      "Nail Care",
    ],
    [
      "10",
      "Gel Take Off with Service",
      "Removal when booking a new nail service.",
      "$5",
      "Nail Care",
    ],
    [
      "11",
      "Gel Take Off without Service",
      "Stand-alone gel removal.",
      "$10",
      "Nail Care",
    ],
    [
      "12",
      "Full Set with Gel",
      "Acrylic full set finished with gel color.",
      "$55+",
      "Nail Care",
    ],
    [
      "13",
      "Acrylic Fill with Gel",
      "Acrylic maintenance finished with gel color.",
      "$45+",
      "Nail Care",
    ],
    [
      "14",
      "Acrylic Ombré",
      "Blended acrylic ombré full set.",
      "$70+",
      "Nail Art",
    ],
    [
      "15",
      "Gel-X Full Set",
      "Soft gel extensions with a clean, light feel.",
      "$65+",
      "Nail Care",
    ],
    [
      "16",
      "Gel-X Fill In",
      "Maintenance service for existing Gel-X.",
      "$55+",
      "Nail Care",
    ],
    [
      "17",
      "Builder Gel Full Set",
      "Structured builder gel for strength and shape.",
      "$60+",
      "Nail Care",
    ],
    [
      "18",
      "Builder Gel Fill In",
      "Builder gel maintenance for natural nails.",
      "$50+",
      "Nail Care",
    ],
    [
      "19",
      "Classic Spa Pedicure",
      "Mint soak, sugar scrub, lotion massage and hot towel wrap.",
      "$40",
      "Pedicure",
    ],
    [
      "20",
      "Deluxe Spa Pedicure",
      "Mint soak, sugar scrub, mineral mask, hot towel and hot stone massage.",
      "$50",
      "Pedicure",
    ],
    [
      "21",
      "Lemongrass & Green Tea Pedicure",
      "Scented soak, scrub, moisture mask, candle massage and hot stone.",
      "$60",
      "Pedicure",
    ],
    [
      "22",
      "Collagen Pedicure",
      "Collagen soak, scrub cleanse, mask, massage, hot stone and collagen socks.",
      "$70",
      "Pedicure",
    ],
    [
      "23",
      "French Design",
      "Fine French detail customized to your shape.",
      "$10 - $20",
      "Nail Art",
    ],
    ["24", "Chrome", "Reflective chrome finish.", "$20", "Nail Art"],
    ["25", "Cat Eye", "Magnetic cat-eye gel effect.", "$20", "Nail Art"],
    [
      "26",
      "Custom Nail Art",
      "Original design created for your look.",
      "Price Varies",
      "Nail Art",
    ],
    [
      "27",
      "Kids Polish Change - Hands",
      "Regular polish for children under 10.",
      "$10",
      "Other",
    ],
    [
      "28",
      "Kids Gel Polish Change - Hands",
      "Gel polish for children under 10.",
      "$20",
      "Other",
    ],
    [
      "29",
      "Kids Classic Pedicure",
      "Gentle classic pedicure for children under 10.",
      "$30",
      "Other",
    ],
    ["30", "Eyebrows", "Clean, shaped brows.", "$12", "Waxing"],
    ["31", "Upper Lip", "Quick facial waxing service.", "$8", "Waxing"],
    ["32", "Chin", "Quick facial waxing service.", "$10+", "Waxing"],
    [
      "33",
      "Face Combo",
      "Eyebrows, upper lip and chin combo.",
      "$40+",
      "Waxing",
    ],
    ["34", "Underarms", "Smooth underarm waxing.", "$25", "Waxing"],
    ["35", "Arms", "Half or full arm waxing.", "$30 / $40", "Waxing"],
    ["36", "Legs", "Half or full leg waxing.", "$40 / $60", "Waxing"],
    ["37", "Chest", "Chest waxing service.", "$30+", "Waxing"],
    ["38", "Back", "Back waxing service.", "$50+", "Waxing"],
  ];
  const visibleServices =
    filter === "All"
      ? services
      : services.filter((service) => service[4] === filter);

  return (
    <div className="site-shell">
      <style>{`
        .header {
          border-radius: 0 0 18px 18px;
          box-shadow: 0 8px 24px rgba(49, 40, 29, .06);
        }
        .hero-photo {
          border-radius: 0 0 0 28px;
        }
        .dark-button,
        .light-button,
        .nav-cta,
        .filters button {
          border-radius: 999px;
        }
        .dark-button,
        .light-button,
        .nav-cta {
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .dark-button:hover,
        .light-button:hover,
        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 18px rgba(49, 40, 29, .16);
        }
        .service {
          border-radius: 14px;
          padding-inline: 14px;
          transition: background .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .service:hover {
          background: #f3ede2;
          transform: translateX(4px);
          box-shadow: 0 8px 20px rgba(49, 40, 29, .07);
        }
        .gallery img {
          border-radius: 18px;
          transition: transform .35s ease, box-shadow .35s ease;
        }
        .gallery img:hover {
          transform: translateY(-5px);
          box-shadow: 0 14px 28px rgba(49, 40, 29, .16);
        }
        .contact {
          border-radius: 24px 24px 0 0;
        }
        footer {
          border-radius: 24px 24px 0 0;
          box-shadow: 0 -8px 24px rgba(49, 40, 29, .08);
        }
        .modal-card {
          border-radius: 22px;
          box-shadow: 0 24px 70px rgba(49, 40, 29, .24);
        }
        input,
        select,
        textarea {
          border-radius: 10px;
        }
      `}</style>
      <header className="header">
        <a className="logo" href="#top">
          <img src="/logo.svg" alt="Shape Nail Lounge" />
          <span>
            SHAPE <small>NAIL LOUNGE</small>
          </span>
        </a>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          ☰
        </button>
        <nav className={menuOpen ? "nav open" : "nav"}>
          <a href="#about">About Shape</a>
          <a href="#services">Services</a>
          <a href="#lookbook">Lookbook</a>
          <a href="#contact">Contact</a>
          <button className="nav-cta" onClick={() => setBookingOpen(true)}>
            Book an appointment ↗
          </button>
        </nav>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">NAIL CARE & QUIET MOMENTS</p>
            <h1>
              Discover your
              <br />
              <i>signature beauty.</i>
            </h1>
            <p>
              A quiet pause in the city, where your hands are cared for and you
              can return to yourself.
            </p>
            <button
              className="dark-button"
              onClick={() => setBookingOpen(true)}
            >
              Book now ↗
            </button>
          </div>
          <div className="hero-photo">
            <span className="est">
              EST.
              <br />
              <b>2026</b>
            </span>
          </div>
        </section>
        <section className="intro" id="about">
          <p className="kicker">01 / THE SHAPE STORY</p>
          <div>
            <h2>
              Beauty does not need
              <br />
              <i>to be loud to be seen.</i>
            </h2>
            <p>
              Shape is a nail lounge for those who believe self-care should be a
              ritual, not a rushed appointment. Every color and brushstroke is
              created slowly, thoughtfully and uniquely for you.
            </p>
          </div>
        </section>
        <section className="services" id="services">
          <div className="section-top">
            <div>
              <p className="kicker">02 / SHAPE SERVICE MENU</p>
              <h2>
                Choose what
                <br />
                <i>you need today.</i>
              </h2>
            </div>
            <div className="filters">
              {[
                "All",
                "Nail Care",
                "Pedicure",
                "Nail Art",
                "Waxing",
                "Other",
              ].map((item) => (
                <button
                  className={filter === item ? "selected" : ""}
                  key={item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="service-list">
            {visibleServices.map(([number, name, description, price]) => (
              <article className="service" key={name}>
                <span>{number}</span>
                <div>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
                <b>{price}</b>
              </article>
            ))}
          </div>
        </section>
        <section className="ritual">
          <div className="ritual-photo"></div>
          <div className="ritual-copy">
            <p className="kicker">THE SHAPE RITUAL</p>
            <h2>
              Feel better,
              <br />
              <i>when you feel at ease.</i>
            </h2>
            <p>
              No TV, no rush. Just a gentle playlist, a cup of tea and attentive
              hands.
            </p>
            <span>✦ Salon-grade hygiene &nbsp; ✦ Curated products</span>
          </div>
        </section>
        <section className="lookbook" id="lookbook">
          <p className="kicker">03 / LOOKBOOK</p>
          <h2>
            A little inspiration
            <br />
            <i>for your next appointment.</i>
          </h2>
          <div className="gallery">
            <img
              src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=85"
              alt="Nude nail design"
            />
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85"
              alt="Colorful nail art design"
            />
            <img
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=85"
              alt="Minimal nail design"
            />
          </div>
        </section>
        <section className="contact" id="contact">
          <div>
            <p className="kicker">COME SAY HELLO</p>
            <h2>
              See you
              <br />
              <i>at Shape.</i>
            </h2>
            <p>
              24 Dang Huu Pho, Thao Dien
              <br />
              Monday — Sunday · 09:30 — 20:30
            </p>
          </div>
          <button className="light-button" onClick={() => setBookingOpen(true)}>
            Book your appointment ↗
          </button>
        </section>
      </main>
      <footer>
        <a className="logo" href="#top">
          <img src="/logo.svg" alt="Shape Nail Lounge" />
          <span>
            SHAPE <small>NAIL LOUNGE</small>
          </span>
        </a>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "300px",
            lineHeight: 1.5,
          }}
        >
          <strong
            style={{
              color: "#d8b66d",
              fontSize: "10px",
              letterSpacing: ".18em",
            }}
          >
            GET IN TOUCH
          </strong>
          <a
            href="https://maps.app.goo.gl/udp5u1Hg6d4HiBdz7"
            target="_blank"
            rel="noreferrer"
          >
            4457 School House Commons, Harrisburg, NC 28075
          </a>
          <a
            href="https://maps.app.goo.gl/udp5u1Hg6d4HiBdz7"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#d8b66d", fontSize: "10px", letterSpacing: ".12em" }}
          >
            GET DIRECTIONS ↗
          </a>
          <a href="tel:+17042802159">Phone - WhatsApp: (704) 280-2159</a>
        </div>
        <div
          style={{
            width: "clamp(280px, 42vw, 420px)",
            height: "220px",
            overflow: "hidden",
            border: "1px solid #62513b",
            borderRadius: "4px",
            background: "#51432f",
          }}
        >
          <iframe
            title="Shape Nail Lounge location map"
            src="https://www.google.com/maps?q=4457+School+House+Commons,+Harrisburg,+NC+28075&output=embed"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
              filter: "sepia(.2) saturate(.8)",
            }}
          />
        </div>
        <p>Discover your signature beauty.</p>
        <small>© 2026 Shape Nail Lounge</small>
      </footer>
      {bookingOpen && (
        <div className="modal" onClick={() => setBookingOpen(false)}>
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="close" onClick={() => setBookingOpen(false)}>
              ×
            </button>
            <p className="kicker">YOUR MOMENT, YOUR WAY</p>
            <h2>
              Book at <i>Shape.</i>
            </h2>
            {sent ? (
              <p className="success">
                Thank you. A confirmation email has been sent to your inbox.
              </p>
            ) : (
              <form
  onSubmit={async (event) => {
    event.preventDefault();

    setSending(true);
    setBookingError("");
    setSent(false);

    const form = new FormData(event.currentTarget);
    const emailConfig = import.meta.env;

    // ==========================================
    // 1. CHECK EMAILJS CONFIGURATION
    // ==========================================
    const requiredSettings = {
      serviceId: emailConfig.VITE_EMAILJS_SERVICE_ID,
      customerTemplateId: emailConfig.VITE_EMAILJS_TEMPLATE_ID,
      ownerTemplateId: emailConfig.VITE_EMAILJS_OWNER_TEMPLATE_ID,
      publicKey: emailConfig.VITE_EMAILJS_PUBLIC_KEY,
      salonEmail: emailConfig.VITE_SALON_EMAIL,
    };

    const missingSettings = Object.entries(requiredSettings)
      .filter(([, value]) => !value)
      .map(([key]) => key);

    if (missingSettings.length > 0) {
      setBookingError(
        "EmailJS is not fully configured. Missing: " +
          missingSettings.join(", ")
      );

      setSending(false);
      return;
    }

    try {
      // ==========================================
      // 2. GET CUSTOMER DETAILS
      // ==========================================
      const customerName =
        form.get("customer_name")?.toString().trim() || "";

      const customerEmail =
        form.get("customer_email")?.toString().trim() || "";

      const customerPhone =
        form.get("customer_phone")?.toString().trim() || "";

      const appointmentDate =
        form.get("appointment_date")?.toString().trim() || "";

      const serviceName =
        form.get("service_name")?.toString().trim() || "";

      // ==========================================
      // 3. VALIDATE
      // ==========================================
      if (!customerName) {
        throw new Error("Please enter the customer's name.");
      }

      if (!customerEmail) {
        throw new Error("Please enter the customer's email.");
      }

      if (!customerPhone) {
        throw new Error("Please enter a phone number.");
      }

      if (!appointmentDate) {
        throw new Error("Please select an appointment date.");
      }

      // ==========================================
      // 4. LOG FOR DEBUGGING
      // ==========================================
      console.log("================================");
      console.log("BOOKING EMAIL");
      console.log("Customer:", customerName);
      console.log("Customer email:", customerEmail);
      console.log("Salon:", emailConfig.VITE_SALON_EMAIL);
      console.log("Date:", appointmentDate);
      console.log("Service:", serviceName);
      console.log("================================");

      // ==========================================
      // 5. SHARED PARAMETERS
      // ==========================================
      const commonParams = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        appointment_date: appointmentDate,
        service_name: serviceName,

        salon_email: emailConfig.VITE_SALON_EMAIL,

        from_name: "Shape Nail Lounge",

        subject:
          "Appointment Confirmation - Shape Nail Lounge",
      };

      // ==========================================
      // 6. CUSTOMER EMAIL
      // ==========================================
      const customerParams = {
        ...commonParams,

        to_email: customerEmail,
        to_name: customerName,

        reply_to: emailConfig.VITE_SALON_EMAIL,
      };

      console.log(
        "📧 Sending confirmation email to customer:",
        customerParams.to_email
      );

      // ==========================================
      // 7. SEND CUSTOMER EMAIL FIRST
      // ==========================================
      let customerResponse;

      try {
        customerResponse = await emailjs.send(
          emailConfig.VITE_EMAILJS_SERVICE_ID,
          emailConfig.VITE_EMAILJS_TEMPLATE_ID,
          customerParams,
          emailConfig.VITE_EMAILJS_PUBLIC_KEY
        );

        console.log(
          "✅ CUSTOMER EMAIL:",
          customerResponse
        );

        console.log(
          "✅ Recipient:",
          customerEmail
        );
      } catch (customerError) {
        console.error(
          "❌ CUSTOMER EMAIL ERROR:",
          customerError
        );

        throw new Error(
          "Unable to send the customer confirmation email: " +
            (
              customerError?.text ||
              customerError?.message ||
              "Unknown error"
            )
        );
      }

      // ==========================================
      // 8. WAIT 1 SECOND
      // ==========================================
      // EmailJS API has a rate limit of 1 request/second.
      // Wait before sending the second email.
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      // ==========================================
      // 9. SALON EMAIL
      // ==========================================
      const ownerParams = {
        ...commonParams,

        to_email: emailConfig.VITE_SALON_EMAIL,

        to_name: "Shape Nail Lounge",

        reply_to: customerEmail,
      };

      console.log(
        "📧 Sending notification to salon:",
        ownerParams.to_email
      );

      // ==========================================
      // 10. SEND SALON EMAIL
      // ==========================================
      try {
        const ownerResponse = await emailjs.send(
          emailConfig.VITE_EMAILJS_SERVICE_ID,
          emailConfig.VITE_EMAILJS_OWNER_TEMPLATE_ID,
          ownerParams,
          emailConfig.VITE_EMAILJS_PUBLIC_KEY
        );

        console.log(
          "✅ SALON EMAIL:",
          ownerResponse
        );
      } catch (ownerError) {
        console.error(
          "❌ SALON EMAIL ERROR:",
          ownerError
        );

        // Do not treat a salon email failure as a customer failure.
        console.warn(
          "Customer email sent successfully, but the salon email failed."
        );
      }

      // ==========================================
      // 11. COMPLETE
      // ==========================================
      console.log(
        "🎉 BOOKING EMAIL COMPLETE"
      );

      console.log(
        "📬 Confirmation email sent to:",
        customerEmail
      );

      setSent(true);

    } catch (error) {
      console.error(
        "❌ EMAILJS BOOKING ERROR:",
        error
      );

      const providerMessage =
        error?.text ||
        error?.message ||
        "EmailJS did not return error details.";

      setBookingError(
        `Unable to send email: ${providerMessage}`
      );

    } finally {
      setSending(false);
    }
  }}
>
  <input
    name="customer_name"
    placeholder="Full name"
    required
  />

  <input
    name="customer_email"
    type="email"
    placeholder="Customer email"
    required
  />

  <input
    name="customer_phone"
    type="tel"
    placeholder="Phone number"
    required
  />

  <input
    name="appointment_date"
    type="date"
    min={new Date().toISOString().split("T")[0]}
    required
  />

  <select
    name="service_name"
    required
  >
    <option value="Classic Spa Pedicure - $40">
      Classic Spa Pedicure - $40
    </option>

    <option value="Gel Manicure - $40">
      Gel Manicure - $40
    </option>

    <option value="SNS Full Set - $45+">
      SNS Full Set - $45+
    </option>

    <option value="Custom Nail Art - Price Varies">
      Custom Nail Art - Price Varies
    </option>
  </select>

  {bookingError && (
    <p className="form-error">
      {bookingError}
    </p>
  )}

  <button
    type="submit"
    className="dark-button"
    disabled={sending}
  >
    {sending
      ? "Sending..."
      : "Submit request ↗"}
  </button>
</form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
