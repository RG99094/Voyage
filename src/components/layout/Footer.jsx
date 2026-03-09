// src/components/layout/Footer.jsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail,
  Send,
  ArrowRight,
  Compass,
} from "lucide-react";
import { cn } from "../../utils/helpers";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Packages", path: "/packages" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const supportLinks = [
    { name: "FAQ", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cancellation Policy", href: "#" },
  ];

  return (
    <footer
      className={cn(
        // Light theme
        "bg-gradient-to-b from-slate-800 to-slate-900 text-slate-300",
        // Dark theme
        "dark:from-slate-900 dark:to-slate-950"
      )}
    >
      {/* ── Decorative top border ── */}
      <div className="h-1 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400" />

      {/* ── Main Footer Content ── */}
      <div className="container mx-auto px-6 pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* ── Brand Column ── */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <Compass
                className="text-teal-400 group-hover:rotate-45 transition-transform duration-500"
                size={28}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
                Voyage
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Crafting unforgettable journeys to the world's most wondrous
              destinations. Your adventure starts here.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-5">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Instagram, label: "Instagram" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                    "bg-slate-700/60 hover:bg-teal-500 text-slate-400 hover:text-white",
                    "dark:bg-slate-800 dark:hover:bg-teal-500"
                  )}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Support ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight
                      size={12}
                      className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter ── */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Stay Connected
            </h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Subscribe for exclusive deals and travel inspiration.
            </p>

            <form onSubmit={handleSubscribe}>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className={cn(
                    "w-full rounded-lg pl-4 pr-12 py-2.5 text-sm transition-all duration-300",
                    "bg-slate-700/60 border border-slate-600/50 text-slate-200 placeholder-slate-500",
                    "focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500",
                    "dark:bg-slate-800 dark:border-slate-700 dark:focus:ring-teal-500/40"
                  )}
                />
                <button
                  type="submit"
                  className={cn(
                    "absolute right-1.5 top-1/2 -translate-y-1/2",
                    "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-300",
                    "bg-teal-500 hover:bg-teal-400 text-white hover:shadow-lg hover:shadow-teal-500/25"
                  )}
                >
                  <Send size={14} />
                </button>
              </div>

              {subscribed && (
                <p className="text-emerald-400 text-xs mt-2 animate-pulse">
                  ✓ Thank you for subscribing!
                </p>
              )}
            </form>

            {/* Contact info */}
            <div className="mt-5 space-y-2">
              <a
                href="mailto:hello@voyage.com"
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-teal-400 transition-colors"
              >
                <Mail size={13} />
                hello@voyage.com
              </a>
              <a
                href="tel:+1234567890"
                className="flex items-center gap-2 text-xs text-slate-500 hover:text-teal-400 transition-colors"
              >
                <Phone size={13} />
                +1 (234) 567-890
              </a>
            </div>
          </div>
        </div>

        {/* ── Footer Bottom ── */}
        <div
          className={cn(
            "mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3",
            "border-t border-slate-700/60 dark:border-slate-800"
          )}
        >
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Voyage. All rights reserved.
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-700">
            Designed with ♥ for travelers worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
