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
    <footer className="w-full bg-zinc-950 text-zinc-300 pt-16 pb-8 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: About PBVM */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-bold text-white border-b-2 border-teal-500 pb-2 w-fit">
              {t("PBVM Purulia", "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ")}
            </h3>
            <p className="font-body text-sm text-zinc-400 leading-relaxed">
              {t(
                "Paschim Banga Vigyan Mancha (West Bengal Science Forum) Purulia Branch is dedicated to promoting scientific temperament, rational thinking, and eradicating superstitions to build a progressive society.",
                "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ পুরুলিয়া জেলা শাখা বিজ্ঞান মানসিকতা ও যুক্তিবাদী চিন্তাধারার প্রসার ঘটাতে এবং একটি প্রগতিশীল সমাজ গড়ে তোলার লক্ষ্যে কুসংস্কার দূর করতে নিয়োজিত।"
              )}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 hover:bg-blue-600 text-zinc-400 hover:text-white transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 hover:bg-red-600 text-zinc-400 hover:text-white transition-colors">
                <YoutubeIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-bold text-white border-b-2 border-teal-500 pb-2 w-fit">
              {t("Quick Links", "দ্রুত লিঙ্ক")}
            </h3>
            <ul className="grid grid-cols-1 gap-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm hover:text-white transition-colors hover:underline">
                    {t(link.labelEn, link.labelBn)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-bold text-white border-b-2 border-teal-500 pb-2 w-fit">
              {t("Contact Us", "যোগাযোগ")}
            </h3>
            <div className="flex flex-col gap-3 font-body text-sm">
              <div className="flex gap-2.5 items-start">
                <MapPin className="h-5 w-5 text-teal-500 shrink-0 mt-0.5" />
                <span className="text-zinc-400">
                  {t(
                    "District Science Centre Campus, North Lake Road, Purulia, West Bengal, Pin - 723101",
                    "জেলা বিজ্ঞান কেন্দ্র প্রাঙ্গণ, উত্তর লেক রোড, পুরুলিয়া, পশ্চিমবঙ্গ, পিন - ৭২৩১০১"
                  )}
                </span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Phone className="h-5 w-5 text-teal-500 shrink-0" />
                <span className="text-zinc-400">+91 3252 222413</span>
              </div>
              <div className="flex gap-2.5 items-center">
                <Mail className="h-5 w-5 text-teal-500 shrink-0" />
                <span className="text-zinc-400">purulia.pbvm@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter / Membership Call to Action */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-lg font-bold text-white border-b-2 border-teal-500 pb-2 w-fit">
              {t("Newsletter", "খবরের চিঠি")}
            </h3>
            <p className="font-body text-sm text-zinc-400 leading-relaxed">
              {t(
                "Subscribe to get notifications about upcoming science events, camps, and activities.",
                "আসন্ন বিজ্ঞান ইভেন্ট, শিবির এবং কার্যক্রম সম্পর্কে বিজ্ঞপ্তি পেতে সাবস্ক্রাইব করুন।"
              )}
            </p>
            <div className="flex gap-2 mt-1">
              <input
                type="email"
                placeholder={t("Your Email", "আপনার ইমেল")}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500"
              />
              <Button size="icon" className="bg-teal-600 hover:bg-teal-700 text-white shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <p className="font-body text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} {t("PBVM Purulia Branch. All rights reserved.", "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া শাখা। সর্বস্বত্ব সংরক্ষিত।")}
          </p>
          <div className="flex gap-4 text-xs text-zinc-500">
            <Link href="/join-us" className="hover:text-white transition-colors">{t("Become a Member", "সদস্য হন")}</Link>
            <span>&bull;</span>
            <Link href="/admin/login" className="hover:text-white transition-colors">{t("Admin Login", "অ্যাডমিন লগইন")}</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
export default Footer
