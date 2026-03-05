import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footers from "../../components/Footer";
import {
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaCheckCircle,
  FaClock, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp,
} from "react-icons/fa";

/* ─── Animation Variants ─────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 },
  }),
};
const slideLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
  }),
};

/* ─── Data ───────────────────────────────────────────────────── */
const infoCards = [
  {
    icon: <FaMapMarkerAlt size={24} />,
    label: "Visit Us",
    value: "123 Rental Drive, Mobility City, IN 400001",
    sub: "Open to walk-ins Mon–Sat",
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    glow: "from-emerald-50",
  },
  {
    icon: <FaPhone size={24} />,
    label: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon–Fri, 9 AM – 8 PM IST",
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    glow: "from-indigo-50",
  },
  {
    icon: <FaEnvelope size={24} />,
    label: "Email Us",
    value: "support@rentaride.com",
    sub: "We reply within 24 hours",
    color: "text-violet-600 bg-violet-50 border-violet-100",
    glow: "from-violet-50",
  },
  {
    icon: <FaClock size={24} />,
    label: "Working Hours",
    value: "Mon–Fri: 9 AM – 8 PM",
    sub: "Sat: 10 AM – 6 PM  ·  Sun: Closed",
    color: "text-rose-600 bg-rose-50 border-rose-100",
    glow: "from-rose-50",
  },
];

const socials = [
  { icon: <FaTwitter size={18} />, label: "Twitter", href: "#" },
  { icon: <FaInstagram size={18} />, label: "Instagram", href: "#" },
  { icon: <FaLinkedinIn size={18} />, label: "LinkedIn", href: "#" },
  { icon: <FaWhatsapp size={18} />, label: "WhatsApp", href: "#" },
];

/* ─── Component ──────────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1500);
  };

  const reset = () => {
    setSubmitted(false);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative w-full overflow-hidden bg-gray-950 pt-32 pb-28">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/4 h-[500px] w-[500px] rounded-full bg-emerald-600/10 blur-[140px]" />
          <div className="absolute top-20 right-1/4 h-[400px] w-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-block rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-400"
          >
            Get in Touch
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            We'd love to{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              hear from you
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-gray-400"
          >
            Have a question, need help with a booking, or want to partner with us?
            Our team is ready to help — drop us a message and we'll respond promptly.
          </motion.p>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.36 }}
            className="mt-10 flex items-center justify-center gap-3"
          >
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                {s.icon}
              </a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Info Cards Row ────────────────────────────────────── */}
      <div className="relative z-10 -mt-10 w-full px-6 lg:px-28">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={`relative overflow-hidden rounded-2xl border bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(0,0,0,0.10)] ${card.color.split(" ").slice(2).join(" ")}`}
            >
              {/* pastel glow top corner */}
              <div className={`absolute -top-6 -left-6 h-24 w-24 rounded-full bg-gradient-to-br ${card.glow} to-transparent blur-2xl opacity-60`} />
              <div className={`relative mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">{card.label}</p>
              <p className="mt-1 text-sm font-bold text-gray-900 leading-snug">{card.value}</p>
              <p className="mt-1 text-xs text-gray-400">{card.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="mx-auto max-w-[1200px] px-6 lg:px-28 py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5 items-start">

          {/* Left sidebar — FAQ / Trust */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-8"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                Frequently asked <span className="text-emerald-600">questions</span>
              </h2>
              <p className="mt-3 text-gray-500 text-base leading-relaxed">
                Can't find what you're looking for? Reach out directly.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                {
                  q: "How do I modify or cancel my booking?",
                  a: "Log into your account, navigate to 'My Orders', and you can modify or cancel from there. Cancellations are free within 24 hours.",
                },
                {
                  q: "What documents do I need to rent?",
                  a: "A valid driver's licence, a government-issued ID (Aadhaar / Passport), and a credit or debit card in your name.",
                },
                {
                  q: "Is there a late return fee?",
                  a: "Yes — a grace period of 30 minutes is given. Beyond that, hourly charges apply as per your plan.",
                },
                {
                  q: "Do you offer corporate / fleet rentals?",
                  a: "Absolutely! Contact us via the form and select 'Partnership' — our enterprise team will reach out within one business day.",
                },
              ].map((faq, i) => (
                <motion.details
                  key={i}
                  custom={i}
                  variants={slideLeft}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 open:shadow-sm transition-all duration-300 cursor-pointer"
                >
                  <summary className="flex items-center justify-between text-sm font-bold text-gray-900 list-none select-none">
                    {faq.q}
                    <span className="ml-3 flex-shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-45">＋</span>
                  </summary>
                  <p className="mt-3 text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </motion.details>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { stat: "4.9★", label: "Rating" },
                { stat: "50k+", label: "Happy Riders" },
                { stat: "24/7", label: "Support" },
              ].map((b, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
                >
                  <p className="text-xl font-extrabold text-gray-900">{b.stat}</p>
                  <p className="mt-0.5 text-xs font-medium text-gray-400">{b.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Contact Form */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-[0_8px_50px_rgba(0,0,0,0.07)] lg:p-12">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center justify-center py-20 text-center gap-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 240, damping: 18 }}
                      className="flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 shadow-[0_0_40px_rgba(34,197,94,0.2)]"
                    >
                      <FaCheckCircle size={44} className="text-emerald-500" />
                    </motion.div>
                    <h3 className="text-3xl font-extrabold text-gray-900">Message Sent!</h3>
                    <p className="text-gray-500 text-base max-w-sm leading-relaxed">
                      Thanks for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={reset}
                      className="mt-2 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-600"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-8">
                      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Send us a message</h2>
                      <p className="mt-2 text-gray-400 text-sm">All fields marked <span className="text-red-400 font-bold">*</span> are required.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      {/* Row 1 — Name + Email */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {[
                          { name: "name", label: "Full Name", type: "text", placeholder: "e.g. Arjun Mehta", required: true },
                          { name: "email", label: "Email Address", type: "email", placeholder: "you@email.com", required: true },
                        ].map((f) => (
                          <div key={f.name} className="flex flex-col gap-1.5">
                            <label className="text-sm font-bold text-gray-700">
                              {f.label} {f.required && <span className="text-red-400">*</span>}
                            </label>
                            <input
                              type={f.type}
                              name={f.name}
                              value={form[f.name]}
                              onChange={handleChange}
                              required={f.required}
                              placeholder={f.placeholder}
                              className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Row 2 — Phone + Subject */}
                      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-bold text-gray-700">Phone Number</label>
                          <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210"
                            className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-bold text-gray-700">Subject <span className="text-red-400">*</span></label>
                          <select name="subject" value={form.subject} onChange={handleChange} required
                            className="h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 appearance-none transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400">
                            <option value="" disabled>Select a topic…</option>
                            <option value="booking">Booking Inquiry</option>
                            <option value="support">Customer Support</option>
                            <option value="enterprise">Enterprise / Fleet</option>
                            <option value="billing">Billing Issue</option>
                            <option value="partnership">Partnership</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-gray-700">Message <span className="text-red-400">*</span></label>
                        <textarea name="message" value={form.message} onChange={handleChange} required rows={6}
                          placeholder="Tell us how we can help…"
                          className="resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-base font-extrabold text-white shadow-[0_6px_24px_rgba(34,197,94,0.35)] transition-all duration-200 hover:from-emerald-600 hover:to-green-700 hover:shadow-[0_10px_32px_rgba(34,197,94,0.45)] disabled:opacity-70"
                      >
                        {loading ? (
                          <>
                            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Sending…
                          </>
                        ) : (
                          <>
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                              <path d="m22 2-7 20-4-9-9-4 20-7z" /><path d="M22 2 11 13" />
                            </svg>
                            Send Message
                          </>
                        )}
                      </motion.button>

                      <p className="text-center text-xs text-gray-400">
                        🔒 Your information is kept completely private and never shared.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>

      <Footers />
    </>
  );
}

export default Contact;
