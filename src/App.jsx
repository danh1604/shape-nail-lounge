import { useState } from "react";
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
      "",
      "$45+",
      "Nail Care",
    ],
    [
      "02",
      "SNS Full Set with Removal",
      "",
      "$50+",
      "Nail Care",
    ],
    [
      "03",
      "SNS Ombré",
      "",
      "$65+",
      "Nail Art",
    ],
    [
      "04",
      "Add Tips",
      "",
      "+$10",
      "Nail Care",
    ],
    ["05", "French", "", "+$10", "Nail Art"],
    [
      "06",
      "Manicure",
      "",
      "$25",
      "Nail Care",
    ],
    [
      "07",
      "Gel Manicure",
      "",
      "$40",
      "Nail Care",
    ],
    [
      "08",
      "Polish Change - Hands or Toes",
      "",
      "$20",
      "Nail Care",
    ],
    [
      "09",
      "Gel Polish Change - Hands or Toes",
      "",
      "$30",
      "Nail Care",
    ],
    [
      "10",
      "Gel Take Off with Service",
      "",
      "$5",
      "Nail Care",
    ],
    [
      "11",
      "Gel Take Off without Service",
      "",
      "$10",
      "Nail Care",
    ],
    [
      "12",
      "Full Set with Gel",
      "",
      "$55+",
      "Nail Care",
    ],
    [
      "13",
      "Acrylic Fill with Gel",
      "",
      "$45+",
      "Nail Care",
    ],
    [
      "14",
      "Acrylic Ombré",
      "",
      "$70+",
      "Nail Art",
    ],
    [
      "15",
      "Gel-X Full Set",
      "",
      "$65+",
      "Nail Care",
    ],
    [
      "16",
      "Gel-X Fill In",
      "",
      "$55+",
      "Nail Care",
    ],
    [
      "17",
      "Builder Gel Full Set",
      "",
      "$60+",
      "Nail Care",
    ],
    [
      "18",
      "Builder Gel Fill In",
      "",
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
      "",
      "$10 - $20",
      "Nail Art",
    ],
    ["24", "Chrome", "", "$20", "Nail Art"],
    ["25", "Cat Eye", "", "$20", "Nail Art"],
    [
      "26",
      "Custom Nail Art",
      "",
      "Price Varies",
      "Nail Art",
    ],
    [
      "27",
      "Kids Polish Change - Hands",
      "",
      "$10",
      "Other",
    ],
    [
      "28",
      "Kids Gel Polish Change - Hands",
      "",
      "$20",
      "Other",
    ],
    [
      "29",
      "Kids Classic Pedicure",
      "",
      "$30",
      "Other",
    ],
    ["30", "Eyebrows", "", "$12", "Waxing"],
    ["31", "Upper Lip", "", "$8", "Waxing"],
    ["32", "Chin", "", "$10+", "Waxing"],
    [
      "33",
      "Face Combo",
      "",
      "$40+",
      "Waxing",
    ],
    ["34", "Underarms", "", "$25", "Waxing"],
    ["35", "Arms", "", "$30 / $40", "Waxing"],
    ["36", "Legs", "", "$40 / $60", "Waxing"],
    ["37", "Chest", "", "$30+", "Waxing"],
    ["38", "Back", "", "$50+", "Waxing"],
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
          <img src="/logo1.jpg" alt="Shape Nail Lounge" />
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
              Shape Nail Lounge is for those who believe self-care should be a
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
              No TV, no rush. Just a gentle playlist, a glass of wine and attentive
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
              src="/chan.png"
              alt="Pedicure feet"
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
              4457 School House Commons, Harrisburg, NC 28075
              <br />
              Mon — Fri · 09:30 AM — 7:00 PM
              <br />
              Sat · 10:00 AM — 6:00 PM
              <br />
              Sun · 11:00 AM — 5:00 PM
            </p>
          </div>
          <button className="light-button" onClick={() => setBookingOpen(true)}>
            Book your appointment ↗
          </button>
        </section>
      </main>
      <a
        className="hotline-button"
        href="tel:+17042802159"
        aria-label="Call Shape Nail Lounge at (704) 280-2159"
      >
        <span className="hotline-icon" aria-hidden="true">☎</span>
        <span>
          <small>HOTLINE</small>
          <strong>(704) 280-2159</strong>
        </span>
      </a>
      <footer>
        <a className="logo" href="#top">
          <img src="/logo1.jpg" alt="Shape Nail Lounge" />
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

    try {
      const customerName =
        form.get("customer_name")?.toString().trim() || "";

      const customerEmail =
        form.get("customer_email")?.toString().trim() || "";

      const customerPhone =
        form.get("customer_phone")?.toString().trim() || "";

      const appointmentDate =
        form.get("appointment_date")?.toString().trim() || "";

      const serviceSelection =
        form.get("service_name")?.toString().trim() || "";
      const serviceSeparator = serviceSelection.lastIndexOf(" - ");
      const serviceName =
        serviceSeparator > -1
          ? serviceSelection.slice(0, serviceSeparator)
          : serviceSelection;
      const servicePrice =
        serviceSeparator > -1
          ? serviceSelection.slice(serviceSeparator + 3)
          : "Price varies";

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

      console.log("================================");
      console.log("BOOKING EMAIL VIA BACKEND BREVO");
      console.log("Customer:", customerName);
      console.log("Customer email:", customerEmail);
      console.log("Date:", appointmentDate);
      console.log("Service:", serviceName);
      console.log("================================");

      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          appointment_date: appointmentDate,
          service_name: serviceName,
          service_price: servicePrice,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Unable to send booking request.");
      }

      console.log("🎉 BOOKING EMAIL COMPLETE");
      setSent(true);
    } catch (error) {
      console.error("❌ BREVO BOOKING ERROR:", error);
      setBookingError(
        `Unable to send email: ${error?.message || "Brevo did not return error details."}`
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
