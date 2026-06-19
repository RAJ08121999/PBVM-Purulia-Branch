"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { MapPin, Phone, Mail, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

const FacebookIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const YoutubeIcon = (props: React.ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
  </svg>
)

export const Footer = () => {
  const { t } = useLanguage()

  const quickLinks = [
    { href: "/about", labelEn: "About Us", labelBn: "আমাদের সম্পর্কে" },
    { href: "/activities", labelEn: "Our Activities", labelBn: "আমাদের কর্মসূচি" },
    { href: "/events", labelEn: "Upcoming Events", labelBn: "ইভেন্টসমূহ" },
    { href: "/gallery", labelEn: "Photo Gallery", labelBn: "ছবি গ্যালারি" },
    { href: "/publications", labelEn: "Publications", labelBn: "প্রকাশনা" },
    { href: "/policy-issues", labelEn: "Policy Issues", labelBn: "নীতিমালা" },
    { href: "/downloads", labelEn: "Downloads", labelBn: "ডাউনলোড" },
  ]

  return (
    <footer style={{ width: "100%", background: "#09090B", color: "#D4D4D8", padding: "4rem 0 2rem 0", borderTop: "1px solid #18181B" }}>
      <div className="page-container">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Column 1: About PBVM */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", borderBottom: "1px solid #27272A", paddingBottom: "0.5rem", width: "fit-content" }}>
              <img src="/logo.png" alt="PBVM Logo" style={{ height: "2rem", width: "2rem", objectFit: "contain" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", margin: 0 }}>
                {t("PBVM Purulia", "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ")}
              </h3>
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#A1A1AA", lineHeight: 1.6, margin: 0 }}>
              {t(
                "Paschim Banga Vigyan Mancha (West Bengal Science Forum) Purulia Branch is dedicated to promoting scientific temperament, rational thinking, and eradicating superstitions to build a progressive society.",
                "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ পুরুলিয়া জেলা শাখা বিজ্ঞান মানসিকতা ও যুক্তিবাদী চিন্তাধারার প্রসার ঘটাতে এবং একটি প্রগতিশীল সমাজ গড়ে তোলার লক্ষ্যে কুসংস্কার দূর করতে নিয়োজিত।"
              )}
            </p>
            {/* Social Links */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem" }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", height: "2.25rem", width: "2.25rem", alignItems: "center", justifyItems: "center", justifyContent: "center", borderRadius: "50%", background: "#18181B", color: "#A1A1AA", transition: "all 0.2s" }} className="hover:bg-blue-600 hover:text-white">
                <FacebookIcon style={{ height: "1.25rem", width: "1.25rem" }} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ display: "flex", height: "2.25rem", width: "2.25rem", alignItems: "center", justifyItems: "center", justifyContent: "center", borderRadius: "50%", background: "#18181B", color: "#A1A1AA", transition: "all 0.2s" }} className="hover:bg-red-600 hover:text-white">
                <YoutubeIcon style={{ height: "1.25rem", width: "1.25rem" }} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", borderBottom: "2px solid #0D9488", paddingBottom: "0.5rem", width: "fit-content", margin: 0 }}>
              {t("Quick Links", "দ্রুত লিঙ্ক")}
            </h3>
            <ul style={{ display: "grid", gridTemplateColumns: "1fr", gap: "0.5rem", listStyle: "none", padding: 0, margin: 0 }}>
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#A1A1AA", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-white hover:underline">
                    {t(link.labelEn, link.labelBn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", borderBottom: "2px solid #0D9488", paddingBottom: "0.5rem", width: "fit-content", margin: 0 }}>
              {t("Contact Us", "যোগাযোগ")}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#A1A1AA" }}>
              <div style={{ display: "flex", gap: "0.625rem", alignItems: "start" }}>
                <MapPin style={{ width: "1.25rem", height: "1.25rem", color: "#0D9488", flexShrink: 0, marginTop: "0.125rem" }} />
                <span>
                  {t(
                    "Students Health Home Near Purulia Municipality, North Lake Road, Purulia, West Bengal, Pin - 723101",
                    "ছাত্র-ছাত্রী স্বাস্থ্য ভবন, পুরুলিয়া পৌরসভা সংলগ্ন, উত্তর লেক রোড, পুরুলিয়া, পশ্চিমবঙ্গ, পিন - ৭২৩১০১"
                  )}
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                <Phone style={{ width: "1.25rem", height: "1.25rem", color: "#0D9488", flexShrink: 0 }} />
                <span>+91 3252 222413</span>
              </div>
              <div style={{ display: "flex", gap: "0.625rem", alignItems: "center" }}>
                <Mail style={{ width: "1.25rem", height: "1.25rem", color: "#0D9488", flexShrink: 0 }} />
                <span>purulia.pbvm@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter / Membership Call to Action */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", textAlign: "left" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 600, color: "#ffffff", borderBottom: "2px solid #0D9488", paddingBottom: "0.5rem", width: "fit-content", margin: 0 }}>
              {t("Newsletter", "খবরের চিঠি")}
            </h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#A1A1AA", lineHeight: 1.6, margin: 0 }}>
              {t(
                "Subscribe to get notifications about upcoming science events, camps, and activities.",
                "আসন্ন বিজ্ঞান ইভেন্ট, শিবির এবং কার্যক্রম সম্পর্কে বিজ্ঞপ্তি পেতে সাবস্ক্রাইব করুন।"
              )}
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.25rem", width: "100%" }}>
              <input
                type="email"
                placeholder={t("Your Email", "আপনার ইমেল")}
                style={{
                  width: "100%",
                  background: "#18181B",
                  border: "1px solid #27272A",
                  borderRadius: "8px",
                  padding: "0.5rem 0.75rem",
                  fontSize: "0.875rem",
                  color: "#ffffff",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              <Button size="icon" style={{ background: "#0D9488", color: "#ffffff", flexShrink: 0 }} className="hover:bg-teal-700">
                <Send style={{ width: "1rem", height: "1rem" }} />
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid #18181B", paddingTop: "2rem", display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#71717A", margin: 0 }}>
            &copy; {new Date().getFullYear()} {t("PBVM Purulia Branch. All rights reserved.", "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া শাখা। সর্বস্বত্ব সংরক্ষিত।")}
          </p>
          <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#71717A" }}>
            <Link href="/join-us" style={{ color: "#71717A", textDecoration: "none" }} className="hover:text-white">{t("Become a Member", "সদস্য হন")}</Link>
            <span>&bull;</span>
            <Link href="/admin/login" style={{ color: "#71717A", textDecoration: "none" }} className="hover:text-white">{t("Admin Login", "অ্যাডমিন লগইন")}</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
export default Footer
