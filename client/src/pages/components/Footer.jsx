import React from "react";
import { Link } from "react-router-dom";
import { FaPlane, FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
      {/* Top gradient border */}
      <div className="h-1 w-full bg-brand-gradient" />

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-brand/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-violet/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
                <FaPlane className="text-white text-lg -rotate-45" />
              </div>
              <span className="text-xl font-extrabold text-white">Tripify</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Your gateway to the world's most breathtaking destinations. Handpicked packages, unbeatable experiences, memories that last forever.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {[
                { Icon: FaInstagram, href: "#" },
                { Icon: FaTwitter,   href: "#" },
                { Icon: FaFacebook,  href: "#" },
                { Icon: FaYoutube,   href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-brand flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore column */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: "Home",             to: "/" },
                { label: "All Packages",     to: "/search" },
                { label: "Top Rated",        to: "/search?sort=packageRating" },
                { label: "Special Offers",   to: "/search?offer=true" },
                { label: "Latest Packages",  to: "/search?sort=createdAt" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-slate-400 hover:text-brand transition-colors duration-200 text-sm flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-brand transition-all duration-300 rounded-full inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us",     to: "/about" },
                { label: "Contact",      to: "/about" },
                { label: "Privacy Policy", to: "/about" },
                { label: "Terms of Service", to: "/about" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-slate-400 hover:text-brand transition-colors duration-200 text-sm flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-brand transition-all duration-300 rounded-full inline-block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <FiMail size={14} className="text-brand" />
                </span>
                hello@tripify.travel
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <FiPhone size={14} className="text-brand" />
                </span>
                +1 (800) TRIP-IFY
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <span className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <FiMapPin size={14} className="text-brand" />
                </span>
                San Francisco, CA 94102
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom divider + copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p className="text-slate-500">
            © {year} <span className="text-brand font-semibold">Tripify</span>. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs">
            Made with ♥ for curious travellers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
