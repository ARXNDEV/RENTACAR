import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaCarSide, FaTwitter, FaInstagram, FaLinkedinIn, FaGithub,
  FaMapMarkerAlt, FaPhone, FaEnvelope,
} from "react-icons/fa";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Browse Cars", to: "/vehicles" },
      { label: "Airport Pickup", to: "#" },
      { label: "Long-term Rental", to: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "#" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "#" },
      { label: "Blog", to: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", to: "#" },
      { label: "Track Booking", to: "/profile/orders" },
      { label: "Cancellation Policy", to: "#" },
      { label: "Insurance Info", to: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "#" },
      { label: "Terms & Conditions", to: "#" },
      { label: "Cookie Policy", to: "#" },
    ],
  },
];

const socials = [
  { icon: <FaTwitter size={16} />, href: "#", label: "Twitter" },
  { icon: <FaInstagram size={16} />, href: "#", label: "Instagram" },
  { icon: <FaLinkedinIn size={16} />, href: "#", label: "LinkedIn" },
  { icon: <FaGithub size={16} />, href: "#", label: "GitHub" },
];

const Footers = () => (
  <footer className="relative w-full overflow-hidden bg-gray-950 mt-20 lg:mt-28">

    {/* Ambient background glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-600/5 blur-[120px] rounded-full" />
    </div>

    {/* ── CTA Banner ───────────────────────────────────────── */}
    <div className="relative border-b border-white/5">
      <div className="mx-auto max-w-[1200px] px-6 lg:px-28 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Ready to hit the road?
          </h2>
          <p className="mt-3 text-gray-400 text-base max-w-md">
            Book your perfect ride in minutes. Transparent pricing, insured vehicles, and 150+ locations.
          </p>
        </div>
        <Link to="/vehicles" className="flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 px-8 py-4 text-base font-bold text-white shadow-[0_6px_24px_rgba(34,197,94,0.35)] hover:shadow-[0_8px_32px_rgba(34,197,94,0.5)] transition-all duration-200"
          >
            Browse Cars →
          </motion.button>
        </Link>
      </div>
    </div>

    {/* ── Main Footer Content ───────────────────────────────── */}
    <div className="relative mx-auto max-w-[1200px] px-6 lg:px-28 pt-14 pb-10">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-6">

        {/* Brand Column — spans 2 cols */}
        <div className="col-span-2 flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3 group w-fit">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-[0_4px_14px_rgba(34,197,94,0.3)]">
              <FaCarSide size={18} className="text-white" />
            </div>
            <span className="text-xl font-extrabold text-white">
              Rent<span className="text-emerald-400">aRide</span>
            </span>
          </Link>

          <p className="text-sm text-gray-500 leading-relaxed max-w-[220px]">
            India's most trusted car rental platform. Flexible, insured, and always on time.
          </p>

          {/* Contact */}
          <div className="flex flex-col gap-2.5">
            {[
              { icon: <FaMapMarkerAlt size={12} />, text: "Mobility City, IN 400001" },
              { icon: <FaPhone size={12} />, text: "+91 98765 43210" },
              { icon: <FaEnvelope size={12} />, text: "support@rentaride.com" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-emerald-500">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          {/* Socials */}
          <div className="flex items-center gap-2">
            {socials.map((s, i) => (
              <a
                key={i}
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 text-gray-500 transition-all duration-200 hover:border-emerald-500/40 hover:bg-emerald-500/8 hover:text-emerald-400"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link Columns */}
        {columns.map((col, i) => (
          <div key={i} className="flex flex-col gap-4">
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-gray-600">
              {col.title}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {col.links.map((link, j) => (
                <li key={j}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 transition-colors duration-150 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Divider ─── */}
      <div className="mt-12 border-t border-white/5" />

      {/* ── Bottom Bar ─── */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} <span className="text-gray-500 font-semibold">RentaRide</span>. All rights reserved.
        </p>

        {/* Trust badges */}
        <div className="flex items-center gap-4">
          {["Privacy", "Terms", "Cookies"].map((item, i) => (
            <a key={i} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-xs text-gray-600">All systems operational</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footers;