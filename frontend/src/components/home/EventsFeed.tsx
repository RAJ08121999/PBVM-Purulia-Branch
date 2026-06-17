"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Calendar, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EventItem {
  id: string
  titleEn: string
  titleBn: string
  date: string
  venueEn: string
  venueBn: string
  descEn: string
  descBn: string
}

export const EventsFeed = () => {
  const { t } = useLanguage()

  const events: EventItem[] = [
    {
      id: "evt-1",
      titleEn: "Hands-on Astronomy Skywatching Camp",
      titleBn: "হাতে-কলমে আকাশ পর্যবেক্ষণ শিবির",
      date: "2026-06-25T18:00:00.000Z",
      venueEn: "Purulia Zilla School Ground",
      venueBn: "পুরুলিয়া জিলা স্কুল প্রাঙ্গণ",
      descEn: "Observe the rings of Saturn, craters of Moon, and constellations under telescope guidance.",
      descBn: "টেলিস্কোপের মাধ্যমে শনির বলয়, চাঁদের গহ্বর এবং বিভিন্ন নক্ষত্রমণ্ডল দেখার ব্যবহারিক শিবির।",
    },
    {
      id: "evt-2",
      titleEn: "Seminars on Scientific Temperament",
      titleBn: "বিজ্ঞান ও যুক্তিবাদী মননশীলতার সেমিনার",
      date: "2026-07-02T11:00:00.000Z",
      venueEn: "Rabindra Bhaban Auditorium, Purulia",
      venueBn: "রবীন্দ্র ভবন অডিটোরিয়াম, পুরুলিয়া",
      descEn: "Debating science vs superstition with talks by popular rationalists and science authors.",
      descBn: "কুসংস্কার বনাম বিজ্ঞান বিতর্ক এবং বিজ্ঞান লেখকদের নিয়ে বিশেষ আলোচনা সভা।",
    },
    {
      id: "evt-3",
      titleEn: "Afforestation & Wetland Protection Campaign",
      titleBn: "বৃক্ষরোপণ ও জলাভূমি সংরক্ষণ প্রচার অভিযান",
      date: "2026-07-10T09:00:00.000Z",
      venueEn: "Joypur Block Forest Area",
      venueBn: "জয়পুর ব্লক বনভূমি অঞ্চল",
      descEn: "Community plantation drive and awareness program about saving wetlands of Purulia.",
      descBn: "স্থানীয় জলাশয় রক্ষা ও নতুন বৃক্ষরোপণ নিয়ে গণ-সচেতনতামূলক ক্যাম্প ও র‍্যালি।",
    },
  ]

  const getCalendarDay = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.getDate()
  }

  const getCalendarMonth = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
        <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-white">
          {t("Upcoming Events & Programs", "আসন্ন ইভেন্ট ও কর্মসূচী")}
        </h3>
        <Link href="/events" className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
          {t("View Archive", "আর্কাইভ দেখুন")} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((evt) => (
          <div
            key={evt.id}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "1.25rem",
              borderRadius: "16px",
              background: "#ffffff",
              border: "1px solid #E2E8F0",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Date Box / Calendar styling */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "3rem",
                  width: "3rem",
                  borderRadius: "12px",
                  background: "#F0FDFA",
                  color: "#0D9488",
                  flexShrink: 0,
                  border: "1px solid #CCFBF1",
                }}>
                  <span style={{ fontSize: "1.05rem", fontWeight: 900, lineHeight: 1 }}>{getCalendarDay(evt.date)}</span>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "0.125rem" }}>{getCalendarMonth(evt.date)}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
                  <h4 style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#1E293B",
                    lineHeight: 1.35,
                    margin: 0,
                  }}>
                    {t(evt.titleEn, evt.titleBn)}
                  </h4>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>
                    <MapPin style={{ width: "0.75rem", height: "0.75rem", color: "#64748B" }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>{t(evt.venueEn, evt.venueBn)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "#64748B",
                lineHeight: 1.6,
                minHeight: "3rem",
                margin: 0,
                textAlign: "left",
              }}>
                {t(evt.descEn, evt.descBn)}
              </p>
            </div>

            {/* Read more Link */}
            <div style={{
              marginTop: "1.25rem",
              paddingTop: "1rem",
              borderTop: "1px solid #F1F5F9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Link href={`/events/${evt.id}`} style={{ textDecoration: "none" }}>
                <span style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#0D9488",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                }}>
                  {t("More Details", "বিস্তারিত জানুন")}
                  <ArrowRight style={{ width: "0.875rem", height: "0.875rem" }} />
                </span>
              </Link>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
export default EventsFeed
