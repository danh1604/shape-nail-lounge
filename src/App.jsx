import { useState } from "react";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const bookingEndpoint = `${apiBaseUrl}/api/booking`;
  const services = [
    ["01", "SNS", "", "", "SNS"],
    ["02", "Acrylic Full Set with Gel", "", "$55+", "SNS"],
    ["03", "Acrylic Fill with Gel", "", "$45+", "SNS"],
    ["04", "Gel-X Full Set", "", "$65+", "SNS"],
    ["05", "Gel-X Fill In", "", "$55+", "SNS"],
    ["06", "Builder Gel Full Set", "", "$60+", "SNS"],
    ["07", "Builder Gel Fill In", "", "$50+", "SNS"],
    ["08", "Manicure", "", "$25", "Manicure"],
    ["09", "Gel Manicure", "", "$40", "Manicure"],
    ["10", "Polish Change - Hands or Toes", "", "$20", "Manicure"],
    ["11", "Gel Polish Change - Hands or Toes", "", "$30", "Manicure"],
    ["12", "Classic Spa Pedicure", "Mint soak, sugar scrub, lotion massage and hot towel wrap.", "$40", "Pedicure"],
    ["13", "Deluxe Spa Pedicure", "Mint soak, sugar scrub, mineral mask, hot towel and hot stone massage.", "$50", "Pedicure"],
    ["14", "Lemongrass & Green Tea Pedicure", "Scented soak, scrub, moisture mask, candle massage and hot stone.", "$60", "Pedicure"],
    ["15", "Collagen Pedicure", "Collagen soak, scrub cleanse, mask, massage, hot stone and collagen socks.", "$70", "Pedicure"],
    ["16", "Kids Polish Change - Hands", "", "$10", "Kids"],
    ["17", "Kids Gel Polish Change - Hands", "", "$20", "Kids"],
    ["18", "Kids Classic Pedicure", "", "$30", "Kids"],
    ["19", "Eyebrows", "", "$12", "Waxing"],
    ["20", "Upper Lips", "", "$8", "Waxing"],
    ["21", "Chin", "", "$10+", "Waxing"],
    ["22", "Face Combo", "", "$40+", "Waxing"],
    ["23", "Underarms", "", "$25", "Waxing"],
    ["24", "Arms", "", "$30 / $40", "Waxing"],
    ["25", "Legs", "", "$40 / $60", "Waxing"],
    ["26", "Chest", "", "$30+", "Waxing"],
    ["27", "Back", "", "$50+", "Waxing"],
  ];
  const bookingServices = [
    ["01", "SNS Acrylic Full Set with Gel"],
    ["02", "SNS Acrylic Fill with Gel"],
    ["03", "Gel-X Full Set"],
    ["04", "Gel-X Fill In"],
    ["05", "Builder Gel Full Set"],
    ["06", "Builder Gel Fill In"],
    ["07", "Manicure"],
    ["08", "Gel Manicure"],
    ["09", "Polish Change - Hands or Toes"],
    ["10", "Gel Polish Change - Hands or Toes"],
    ["11", "Classic Spa Pedicure"],
    ["12", "Deluxe Spa Pedicure"],
    ["13", "Lemongrass & Green Tea Pedicure"],
    ["14", "Collagen Pedicure"],
    ["15", "Kids Polish Change - Hands"],
    ["16", "Kids Gel Polish Change - Hands"],
    ["17", "Kids Classic Pedicure"],
    ["18", "Eyebrows"],
    ["19", "Upper Lip"],
    ["20", "Chin"],
    ["21", "Face Combo"],
    ["22", "Underarms"],
    ["23", "Arms"],
    ["24", "Legs"],
    ["25", "Chest"],
    ["26", "Back"],
  ];

  const visibleServices =
    filter === "All"
      ? services
      : services.filter((service) => service[4] === filter);

  const minBookingDateTime = new Date(
    Date.now() - new Date().getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <div className="site-shell" lang="en-US">
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
                "SNS",
                "Manicure",
                "Pedicure",
                "Kids",
                "Waxing",
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
          <div className="contact-copy">
            <p className="kicker">COME SAY HELLO</p>
            <h2>
              See you
              <br />
              <i>at Shape.</i>
            </h2>
           
          </div>
        </section>
      </main>
      <div className="floating-buttons">
        <button
          className="fab-book"
          onClick={() => setBookingOpen(true)}
          aria-label="Book an appointment"
        >
          <span className="fab-book-icon" aria-hidden="true">✏</span>
          <span>
            <small>BOOKING</small>
            <strong>Book now</strong>
          </span>
        </button>
        <a
          className="fab-phone"
          href="tel:+17042802159"
          aria-label="Call Shape Nail Lounge at (704) 280-2159"
        >
          <span className="hotline-icon" aria-hidden="true">☎</span>
          <span>
            <small>HOTLINE</small>
            <strong>(704) 280-2159</strong>
          </span>
        </a>
      </div>
      <footer>
        <div className="footer-inner">
          <a className="logo" href="#top">
            <img src="/logo1.jpg" alt="Shape Nail Lounge" />
            <span>
              SHAPE <small>NAIL LOUNGE</small>
            </span>
          </a>

          <div className="footer-contact">
            <strong className="footer-label">GET IN TOUCH</strong>
            <p className="contact-address">
              4457 School House Commons, Harrisburg, NC 28075
            </p>
            <div className="contact-hours">
              <span>Mon — Fri · 09:30 AM — 7:00 PM</span>
              <span>Sat · 10:00 AM — 6:00 PM</span>
              <span>Sun · 11:00 AM — 5:00 PM</span>
            </div>
            <a
              href="https://maps.app.goo.gl/udp5u1Hg6d4HiBdz7"
              target="_blank"
              rel="noreferrer"
              className="footer-direction"
            >
              GET DIRECTIONS ↗
            </a>
            <a href="tel:+17042802159" className="footer-phone">
              Phone - WhatsApp: (704) 280-2159
            </a>
          </div>

          <div
            className="footer-map"
            style={{
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
        </div>

        <small className="footer-copyright">© 2026 Shape Nail Lounge</small>
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
            <div className="modal-header">
              <div className="booking-brand-bar">
                <img src="/logo1.jpg" alt="Shape Nail Lounge" />
                <div>
                  <span>SHAPE</span>
                  <strong>NAIL LOUNGE</strong>
                </div>
              </div>
              <p className="kicker booking-kicker">YOUR MOMENT, YOUR WAY</p>
              <h2>
                Book at <i>Shape.</i>
              </h2>
            </div>
            {sent ? (
              <p className="success">
                Thank you. A confirmation email has been sent to your inbox.
              </p>
            ) : (
              <>
                <form
                  className="modal-body"
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

                      const customerNote =
                        form.get("customer_note")?.toString().trim() || "";

                      const appointmentDateTime =
                        form.get("appointment_datetime")?.toString().trim() || "";

                      const [appointmentDate, appointmentTime] = appointmentDateTime
                        ? appointmentDateTime.split("T")
                        : ["", ""];

                      const serviceName = selectedServices.join(", ");
                      const servicePrice = "Price varies";

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

                      if (!appointmentTime) {
                        throw new Error("Please select an appointment time.");
                      }

                      if (selectedServices.length === 0) {
                        throw new Error("Please select at least one service.");
                      }

                      const response = await fetch(bookingEndpoint, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          customer_name: customerName,
                          customer_email: customerEmail,
                          customer_phone: customerPhone,
                          customer_note: customerNote,
                          appointment_date: appointmentDate,
                          appointment_time: appointmentTime,
                          service_name: serviceName,
                          service_price: servicePrice,
                          timezone_offset: new Date().getTimezoneOffset(),
                        }),
                      });

                      const data = await response.json().catch(() => ({}));

                      if (!response.ok) {
                        throw new Error(data?.message || "Unable to send booking request.");
                      }

                      setSent(true);
                    } catch (error) {
                      setBookingError(
                        `Unable to send email: ${error?.message || "Brevo did not return error details."}`
                      );
                    } finally {
                      setSending(false);
                    }
                  }}
                >
                  <div className="booking-field-group">
                    <label htmlFor="customer_name">Full name</label>
                    <input
                      id="customer_name"
                      name="customer_name"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="booking-field-group">
                    <label htmlFor="customer_email">Email</label>
                    <input
                      id="customer_email"
                      name="customer_email"
                      type="email"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="booking-field-group">
                    <label htmlFor="customer_phone">Phone number</label>
                    <input
                      id="customer_phone"
                      name="customer_phone"
                      type="tel"
                      placeholder="(704) 000-0000"
                      required
                    />
                  </div>

                  <div className="booking-field-group">
                    <label htmlFor="appointment_datetime">Date & time</label>
                    <input
                      id="appointment_datetime"
                      name="appointment_datetime"
                      type="datetime-local"
                      lang="en-US"
                      locale="en-US"
                      min={minBookingDateTime}
                      required
                    />
                  </div>

                  <div className="booking-field-group">
                    <label>Services</label>
                    <div className="service-checkbox-list">
                      {bookingServices.map(([number, name]) => (
                        <label key={`${name}-${number}`} className="service-checkbox-item">
                          <input
                            type="checkbox"
                            name="service_name"
                            value={name}
                            checked={selectedServices.includes(name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices([...selectedServices, name]);
                              } else {
                                setSelectedServices(selectedServices.filter((s) => s !== name));
                              }
                            }}
                          />
                          <span className="service-checkbox-mark"></span>
                          <span className="service-checkbox-text">{name}</span>
                        </label>
                      ))}
                    </div>
                    {selectedServices.length > 0 && (
                      <p className="service-selected-count">
                        {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} selected
                      </p>
                    )}
                  </div>

                  <div className="booking-field-group">
                    <label htmlFor="customer_note">Additional note</label>
                    <textarea
                      id="customer_note"
                      name="customer_note"
                      rows="4"
                      placeholder="Tell us any details, preferred style, or special requests..."
                    />
                  </div>
                </form>
                <div className="modal-footer">
                  {bookingError && (
                    <p className="form-error">
                      {bookingError}
                    </p>
                  )}
                  <p className="booking-note">
                    We'll send a reminder 2 hours before your appointment.
                  </p>
                  <button
                    type="submit"
                    className="dark-button booking-submit"
                    disabled={sending}
                    onClick={() => {
                      document.querySelector('.modal-body')?.requestSubmit();
                    }}
                  >
                    {sending
                      ? "Sending..."
                      : "Submit request ↗"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
