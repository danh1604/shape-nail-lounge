import { useState } from "react";
import emailjs from "@emailjs/browser";
import "./App.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("Tất cả");
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
      "Móng tay",
    ],
    [
      "02",
      "SNS Full Set with Removal",
      "New SNS set including removal of existing product.",
      "$50+",
      "Móng tay",
    ],
    [
      "03",
      "SNS Ombré",
      "Soft ombré powder finish with a seamless blend.",
      "$65+",
      "Nghệ thuật",
    ],
    [
      "04",
      "Add Tips",
      "Add length to any SNS powder service.",
      "+$10",
      "Móng tay",
    ],
    ["05", "French", "Classic French tip add-on.", "+$10", "Nghệ thuật"],
    [
      "06",
      "Manicure",
      "Cut and shape, cuticle treatment and regular polish.",
      "$25",
      "Móng tay",
    ],
    [
      "07",
      "Gel Manicure",
      "Manicure finished with long-wear gel polish.",
      "$40",
      "Móng tay",
    ],
    [
      "08",
      "Polish Change - Hands or Toes",
      "Fresh regular polish on hands or toes.",
      "$20",
      "Móng tay",
    ],
    [
      "09",
      "Gel Polish Change - Hands or Toes",
      "Fresh gel color on hands or toes.",
      "$30",
      "Móng tay",
    ],
    [
      "10",
      "Gel Take Off with Service",
      "Removal when booking a new nail service.",
      "$5",
      "Móng tay",
    ],
    [
      "11",
      "Gel Take Off without Service",
      "Stand-alone gel removal.",
      "$10",
      "Móng tay",
    ],
    [
      "12",
      "Full Set with Gel",
      "Acrylic full set finished with gel color.",
      "$55+",
      "Móng tay",
    ],
    [
      "13",
      "Acrylic Fill with Gel",
      "Acrylic maintenance finished with gel color.",
      "$45+",
      "Móng tay",
    ],
    [
      "14",
      "Acrylic Ombré",
      "Blended acrylic ombré full set.",
      "$70+",
      "Nghệ thuật",
    ],
    [
      "15",
      "Gel-X Full Set",
      "Soft gel extensions with a clean, light feel.",
      "$65+",
      "Móng tay",
    ],
    [
      "16",
      "Gel-X Fill In",
      "Maintenance service for existing Gel-X.",
      "$55+",
      "Móng tay",
    ],
    [
      "17",
      "Builder Gel Full Set",
      "Structured builder gel for strength and shape.",
      "$60+",
      "Móng tay",
    ],
    [
      "18",
      "Builder Gel Fill In",
      "Builder gel maintenance for natural nails.",
      "$50+",
      "Móng tay",
    ],
    [
      "19",
      "Classic Spa Pedicure",
      "Mint soak, sugar scrub, lotion massage and hot towel wrap.",
      "$40",
      "Móng chân",
    ],
    [
      "20",
      "Deluxe Spa Pedicure",
      "Mint soak, sugar scrub, mineral mask, hot towel and hot stone massage.",
      "$50",
      "Móng chân",
    ],
    [
      "21",
      "Lemongrass & Green Tea Pedicure",
      "Scented soak, scrub, moisture mask, candle massage and hot stone.",
      "$60",
      "Móng chân",
    ],
    [
      "22",
      "Collagen Pedicure",
      "Collagen soak, scrub cleanse, mask, massage, hot stone and collagen socks.",
      "$70",
      "Móng chân",
    ],
    [
      "23",
      "French Design",
      "Fine French detail customized to your shape.",
      "$10 - $20",
      "Nghệ thuật",
    ],
    ["24", "Chrome", "Reflective chrome finish.", "$20", "Nghệ thuật"],
    ["25", "Cat Eye", "Magnetic cat-eye gel effect.", "$20", "Nghệ thuật"],
    [
      "26",
      "Custom Nail Art",
      "Original design created for your look.",
      "Price Varies",
      "Nghệ thuật",
    ],
    [
      "27",
      "Kids Polish Change - Hands",
      "Regular polish for children under 10.",
      "$10",
      "Khác",
    ],
    [
      "28",
      "Kids Gel Polish Change - Hands",
      "Gel polish for children under 10.",
      "$20",
      "Khác",
    ],
    [
      "29",
      "Kids Classic Pedicure",
      "Gentle classic pedicure for children under 10.",
      "$30",
      "Khác",
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
    filter === "Tất cả"
      ? services
      : services.filter((service) => service[4] === filter);

  return (
    <div className="site-shell">
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
          aria-label="Mở menu"
        >
          ☰
        </button>
        <nav className={menuOpen ? "nav open" : "nav"}>
          <a href="#about">Về Shape</a>
          <a href="#services">Dịch vụ</a>
          <a href="#lookbook">Lookbook</a>
          <a href="#contact">Liên hệ</a>
          <button className="nav-cta" onClick={() => setBookingOpen(true)}>
            Đặt lịch ↗
          </button>
        </nav>
      </header>
      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">NAIL CARE & QUIET MOMENTS</p>
            <h1>
              Chạm vào
              <br />
              <i>vẻ đẹp riêng.</i>
            </h1>
            <p>
              Một khoảng lặng nhỏ giữa thành phố. Nơi đôi tay được chăm chút, và
              bạn được trở về với chính mình.
            </p>
            <button
              className="dark-button"
              onClick={() => setBookingOpen(true)}
            >
              Đặt lịch ngay ↗
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
          <p className="kicker">01 / CÂU CHUYỆN SHAPE</p>
          <div>
            <h2>
              Vẻ đẹp không cần
              <br />
              <i>ồn ào để được thấy.</i>
            </h2>
            <p>
              Shape là nail lounge dành cho những ai tin rằng việc chăm sóc bản
              thân nên là một nghi thức, không phải một cuộc hẹn vội. Từng bảng
              màu và đường cọ đều được tạo ra chậm rãi, chỉn chu và thật riêng
              cho bạn.
            </p>
          </div>
        </section>
        <section className="services" id="services">
          <div className="section-top">
            <div>
              <p className="kicker">02 / SHAPE SERVICE MENU</p>
              <h2>
                Chọn điều
                <br />
                <i>bạn cần hôm nay.</i>
              </h2>
            </div>
            <div className="filters">
              {[
                "Tất cả",
                "Móng tay",
                "Móng chân",
                "Nghệ thuật",
                "Waxing",
                "Khác",
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
              Đẹp hơn,
              <br />
              <i>khi bạn thấy nhẹ lòng.</i>
            </h2>
            <p>
              Không TV, không vội vàng. Chỉ có playlist dịu nhẹ, một tách trà và
              đôi bàn tay tận tâm.
            </p>
            <span>✦ Vệ sinh chuẩn salon &nbsp; ✦ Sản phẩm chọn lọc</span>
          </div>
        </section>
        <section className="lookbook" id="lookbook">
          <p className="kicker">03 / LOOKBOOK</p>
          <h2>
            Một chút cảm hứng
            <br />
            <i>cho lần hẹn kế tiếp.</i>
          </h2>
          <div className="gallery">
            <img
              src="https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=85"
              alt="Mẫu móng màu nude"
            />
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85"
              alt="Mẫu nail art nhiều màu"
            />
            <img
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=85"
              alt="Mẫu móng tối giản"
            />
          </div>
        </section>
        <section className="contact" id="contact">
          <div>
            <p className="kicker">COME SAY HELLO</p>
            <h2>
              Hẹn bạn
              <br />
              <i>ở Shape nhé.</i>
            </h2>
            <p>
              24 Đặng Hữu Phổ, Thảo Điền
              <br />
              Thứ 2 — Chủ nhật · 09:30 — 20:30
            </p>
          </div>
          <button className="light-button" onClick={() => setBookingOpen(true)}>
            Đặt lịch của bạn ↗
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
        <p>Chạm vào vẻ đẹp riêng.</p>
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
              Đặt lịch tại <i>Shape.</i>
            </h2>
            {sent ? (
              <p className="success">
                Cảm ơn bạn. Email xác nhận đã được gửi đến hộp thư của bạn.
              </p>
            ) : (
              <form
  onSubmit={async (event) => {
  event.preventDefault();

  setSending(true);
  setBookingError("");

  const form = new FormData(event.currentTarget);
  const emailConfig = import.meta.env;

  // ==========================================
  // KIỂM TRA CẤU HÌNH EMAILJS
  // ==========================================
  const requiredSettings = {
    serviceId: emailConfig.VITE_EMAILJS_SERVICE_ID,
    customerTemplateId: emailConfig.VITE_EMAILJS_TEMPLATE_ID,
    ownerTemplateId: emailConfig.VITE_EMAILJS_OWNER_TEMPLATE_ID,
    publicKey: emailConfig.VITE_EMAILJS_PUBLIC_KEY,
    salonEmail: emailConfig.VITE_SALON_EMAIL,
  };

  const missingSettings = Object.entries(requiredSettings)
    .filter(([, value]) => !value || value.startsWith("your_"))
    .map(([key]) => key);

  if (missingSettings.length > 0) {
    setBookingError(
      "EmailJS chưa được cấu hình đầy đủ. Thiếu: " +
        missingSettings.join(", ")
    );
    setSending(false);
    return;
  }

  try {
    // ==========================================
    // LẤY THÔNG TIN KHÁCH
    // ==========================================
    const customerName = form.get("customer_name")?.toString().trim();
    const customerEmail = form.get("customer_email")?.toString().trim();
    const customerPhone = form.get("customer_phone")?.toString().trim();
    const appointmentDate = form
      .get("appointment_date")
      ?.toString()
      .trim();
    const serviceName = form.get("service_name")?.toString().trim();

    // ==========================================
    // KIỂM TRA EMAIL KHÁCH
    // ==========================================
    if (!customerEmail) {
      throw new Error("Bạn chưa nhập email của khách hàng.");
    }

    if (!customerName) {
      throw new Error("Bạn chưa nhập tên khách hàng.");
    }

    // ==========================================
    // THÔNG TIN DÙNG CHUNG
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
        "Xác nhận yêu cầu đặt lịch tại Shape Nail Lounge",
    };

    // ==========================================
    // EMAIL CHO KHÁCH HÀNG
    // template_u6dohxc
    // ==========================================
    const customerParams = {
      ...commonParams,

      // EmailJS Customer Template:
      // To Email = {{to_email}}
      to_email: customerEmail,
      to_name: customerName,

      // Khi khách bấm Reply -> trả về salon
      reply_to: emailConfig.VITE_SALON_EMAIL,
    };

    const ownerParams = {
      ...commonParams,

      // EmailJS Owner Template:
      // To Email = danhcute35@gmail.com
      to_email: emailConfig.VITE_SALON_EMAIL,
      to_name: "Shape Nail Lounge",

      // Khi salon bấm Reply -> trả lời khách
      reply_to: customerEmail,
    };

    const sendEmail = async (templateId, params, label) => {
      let lastError;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          return await emailjs.send(
            emailConfig.VITE_EMAILJS_SERVICE_ID,
            templateId,
            params,
            emailConfig.VITE_EMAILJS_PUBLIC_KEY,
          );
        } catch (error) {
          lastError = error;
          if (attempt === 0 && error?.message === "Failed to fetch") {
            await new Promise((resolve) => setTimeout(resolve, 800));
            continue;
          }
          throw new Error(`${label}: ${error?.text || error?.message || "lỗi không xác định"}`);
        }
      }
      throw new Error(`${label}: ${lastError?.message || "không thể gửi"}`);
    };

    const results = await Promise.allSettled([
      sendEmail(
        emailConfig.VITE_EMAILJS_TEMPLATE_ID,
        customerParams,
        "Email khách hàng",
      ),
      sendEmail(
        emailConfig.VITE_EMAILJS_OWNER_TEMPLATE_ID,
        ownerParams,
        "Email salon",
      ),
    ]);
    const failed = results.find((result) => result.status === "rejected");
    if (failed) {
      throw failed.reason;
    }

    setSent(true);
  } catch (error) {
    console.error("EmailJS Error:", error);

    const providerMessage =
      error?.text ||
      error?.message ||
      "EmailJS không trả về chi tiết lỗi.";

    setBookingError(
      `Không thể gửi email: ${providerMessage}`
    );
  } finally {
    setSending(false);
  }
}}
>
  <input
    name="customer_name"
    placeholder="Họ và tên"
    required
  />

  <input
    name="customer_email"
    type="email"
    placeholder="Email của khách"
    required
  />

  <input
    name="customer_phone"
    type="tel"
    placeholder="Số điện thoại"
    required
  />

  <input
    name="appointment_date"
    type="date"
    min={new Date().toISOString().split("T")[0]}
    required
  />

  <select name="service_name">
    <option>Classic Spa Pedicure - $40</option>
    <option>Gel Manicure - $40</option>
    <option>SNS Full Set - $45+</option>
    <option>Custom Nail Art - Price Varies</option>
  </select>

  {bookingError && (
    <p className="form-error">
      {bookingError}
    </p>
  )}

  <button
    className="dark-button"
    disabled={sending}
  >
    {sending ? "Đang gửi..." : "Gửi yêu cầu ↗"}
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
