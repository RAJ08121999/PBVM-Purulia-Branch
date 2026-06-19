"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, MapPin, ArrowRight, Sparkles } from "lucide-react"

interface EventItem {
  id: string
  titleEn: string
  titleBn: string
  date: string
  venueEn: string
  venueBn: string
  descEn: string
  descBn: string
  type: "Upcoming" | "Past"
  time: string
  contactEn: string
  contactBn: string
}

export default function EventsPage() {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Upcoming" | "Past">("All")

  const events: EventItem[] = [
    {
      id: "evt-1",
      titleEn: "Hands-on Astronomy Skywatching Camp",
      titleBn: "হাতে-কলমে আকাশ পর্যবেক্ষণ শিবির",
      date: "2026-06-25",
      time: "6:00 PM - 9:00 PM",
      venueEn: "Purulia Zilla School Ground",
      venueBn: "পুরুলিয়া জিলা স্কুল প্রাঙ্গণ",
      descEn: "Observe the rings of Saturn, craters of Moon, and constellations under telescope guidance.",
      descBn: "টেলিস্কোপের মাধ্যমে শনির বলয়, চাঁদের গহ্বর এবং বিভিন্ন নক্ষত্রমণ্ডল দেখার ব্যবহারিক শিবির।",
      type: "Upcoming",
      contactEn: "Coordination Office (+91 3252 222413)",
      contactBn: "সমন্বয় শাখা (+৯১ ৩২৫২ ২২২৪১৩)",
    },
    {
      id: "evt-2",
      titleEn: "Seminars on Scientific Temperament",
      titleBn: "বিজ্ঞান ও যুক্তিবাদী মননশীলতার সেমিনার",
      date: "2026-07-02",
      time: "11:00 AM - 3:00 PM",
      venueEn: "Rabindra Bhaban Auditorium, Purulia",
      venueBn: "রবীন্দ্র ভবন অডিটোরিয়াম, পুরুলিয়া",
      descEn: "Debating science vs superstition with talks by popular rationalists and science authors.",
      descBn: "কুসংস্কার বনাম বিজ্ঞান বিতর্ক এবং বিজ্ঞান লেখকদের নিয়ে বিশেষ আলোচনা সভা।",
      type: "Upcoming",
      contactEn: "Science Publicity Cell",
      contactBn: "বিজ্ঞান প্রচার সেল",
    },
    {
      id: "evt-3",
      titleEn: "Afforestation & Wetland Protection Campaign",
      titleBn: "বৃক্ষরোপণ ও জলাভূমি সংরক্ষণ প্রচার অভিযান",
      date: "2026-07-10",
      time: "9:00 AM - 1:00 PM",
      venueEn: "Joypur Block Forest Area",
      venueBn: "জয়পুর ব্লক বনভূমি অঞ্চল",
      descEn: "Community plantation drive and awareness program about saving wetlands of Purulia.",
      descBn: "স্থানীয় জলাশয় রক্ষা ও নতুন বৃক্ষরোপণ নিয়ে গণ-সচেতনতামূলক ক্যাম্প ও র‍্যালি।",
      type: "Upcoming",
      contactEn: "Eco-Protection Wing",
      contactBn: "পরিবেশ রক্ষা শাখা",
    },
    {
      id: "evt-4",
      titleEn: "Purulia District Science Congress 2026",
      titleBn: "পুরুলিয়া জেলা বিজ্ঞান কংগ্রেস ২০২৬",
      date: "2026-05-15",
      time: "10:00 AM - 5:00 PM",
      venueEn: "District Science Centre, Purulia",
      venueBn: "জেলা বিজ্ঞান কেন্দ্র, পুরুলিয়া",
      descEn: "Annual congregation of student projects, models, and research briefs from block-level schools.",
      descBn: "ব্লক স্তরের স্কুলগুলির ছাত্রছাত্রীদের তৈরি বিজ্ঞান মডেল ও গবেষণা প্রস্তাবের বার্ষিক প্রদর্শনী ও আলোচনা সভা।",
      type: "Past",
      contactEn: "Children's Science Congress Team",
      contactBn: "শিশু বিজ্ঞান কংগ্রেস টিম",
    },
    {
      id: "evt-5",
      titleEn: "Snakebite Awareness and First Aid Workshop",
      titleBn: "সর্পদংশন সচেতনতা ও প্রাথমিক চিকিৎসা কর্মশালা",
      date: "2026-05-20",
      time: "11:30 AM - 2:30 PM",
      venueEn: "Jhalda Community Hall",
      venueBn: "ঝালদা কমিউনিটি হল",
      descEn: "Training sessions on snake identification, myth-busting, and emergency protocols in village blocks.",
      descBn: "গ্রামাঞ্চলের মানুষদের সর্পদংশন প্রতিরোধ, সাপ চেনার বিজ্ঞানসম্মত পদ্ধতি ও জরুরি চিকিৎসা বিষয়ক বিশেষ প্রশিক্ষণ শিবির।",
      type: "Past",
      contactEn: "Health Activists Forum",
      contactBn: "স্বাস্থ্যকর্মী ফোরাম",
    },
    {
      id: "evt-6",
      titleEn: "Summer Science Camp for High Schoolers",
      titleBn: "হাইস্কুল পড়ুয়াদের সামার বিজ্ঞান ক্যাম্প",
      date: "2026-06-10",
      time: "10:00 AM - 4:00 PM",
      venueEn: "Students Health Home, Purulia",
      venueBn: "ছাত্র-ছাত্রী স্বাস্থ্য ভবন, পুরুলিয়া",
      descEn: "A 3-day workshop showcasing low-cost hands-on chemistry, physics, and robotics projects.",
      descBn: "কম খরচে হাতে-কলমে রসায়ন, পদার্থবিদ্যা এবং প্রাথমিক রোবোটিক্স মডেল তৈরির ৩ দিনের বিশেষ কর্মশালা।",
      type: "Past",
      contactEn: "Hands-on Science Committee",
      contactBn: "হাতে-কলমে বিজ্ঞান কমিটি",
    },
  ]

  // Filter & Search Logic
  const filteredEvents = events.filter((evt) => {
    const title = language === "bn" ? evt.titleBn : evt.titleEn
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "All" || evt.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8FAFC" }}>

      {/* Header Banner */}
      <section
        style={{
          width: "100%",
          padding: "5rem 0 4rem",
          background: "linear-gradient(135deg, #0A3D32 0%, #0B3D91 60%, #0D0D2B 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="page-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", lineHeight: 1.2 }}>
            {t("Science Events & Campaigns", "বিজ্ঞান ইভেন্ট ও প্রচার অভিযান")}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.78)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
            {t(
              "Participate in our upcoming astronomical skywatching camps, scientific seminars, and ecological campaigns in Purulia district.",
              "পুরুলিয়া জেলা জুড়ে আমাদের আসন্ন জ্যোতির্বিজ্ঞান আকাশ পর্যবেক্ষণ শিবির, বৈজ্ঞানিক সেমিনার এবং পরিবেশ সচেতনতা কর্মসূচিতে অংশগ্রহণ করুন।"
            )}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ width: "100%", padding: "1.5rem 0", background: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: "64px", zIndex: 20 }}>
        <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>

            {/* Search Box */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder={t("Search events...", "ইভেন্ট খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-full bg-zinc-50 border-zinc-200 text-sm focus:bg-white dark:bg-zinc-900 dark:border-zinc-800"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
              <Button
                variant={selectedFilter === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("All")}
                style={{
                  borderRadius: "9999px",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  height: "auto",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {t("All Events", "সব ইভেন্ট")}
              </Button>
              <Button
                variant={selectedFilter === "Upcoming" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("Upcoming")}
                style={{
                  borderRadius: "9999px",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  height: "auto",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {t("Upcoming", "আসন্ন")}
              </Button>
              <Button
                variant={selectedFilter === "Past" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("Past")}
                style={{
                  borderRadius: "9999px",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  height: "auto",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
              >
                {t("Past Campaigns", "বিগত কর্মসূচি")}
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section style={{ width: "100%", padding: "3.5rem 0" }}>
        <div className="page-container">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <Calendar className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="font-body text-sm text-zinc-500 dark:text-zinc-400">
                {t("No events found matching your criteria.", "কোনো ইভেন্ট খুঁজে পাওয়া যায়নি।")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-md relative overflow-hidden"
                  style={{
                    padding: "1.5rem",
                    margin: "0.5rem",
                  }}
                >
                  <div className="flex flex-col" style={{ gap: "1rem" }}>
                    {/* Badge and Type */}
                    <div className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-900" style={{ paddingBottom: "0.75rem" }}>
                      <span
                        className="font-body text-xxs font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: evt.type === "Upcoming" ? "#E0F2FE" : "#F4F4F5",
                          color: evt.type === "Upcoming" ? "#0369A1" : "#71717A",
                        }}
                      >
                        {t(evt.type, evt.type === "Upcoming" ? "আসন্ন" : "বিগত")}
                      </span>
                      <span className="font-body text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-semibold">
                        <Calendar className="h-3.5 w-3.5" />
                        {evt.date}
                      </span>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-snug">
                      {t(evt.titleEn, evt.titleBn)}
                    </h3>

                    <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {t(evt.descEn, evt.descBn)}
                    </p>

                    {/* Venue & Time details */}
                    <div className="flex flex-col gap-1.5 mt-2 font-body text-xxs text-zinc-500 dark:text-zinc-400 border-t border-zinc-50 dark:border-zinc-900" style={{ paddingTop: "0.75rem" }}>
                      <div className="flex items-center gap-1.5 font-bold">
                        <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{t(evt.venueEn, evt.venueBn)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span className="text-zinc-400 dark:text-zinc-600 font-black">&bull;</span>
                        <span>{evt.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-50 dark:border-zinc-900/50" style={{ marginTop: "1.5rem", paddingTop: "1rem" }}>
                    <Link href={`/events/${evt.id}`} className="w-full">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                        style={{
                          padding: "0.75rem 1.5rem",
                          height: "auto",
                          cursor: "pointer",
                        }}
                      >
                        {t("More Details", "বিস্তারিত জানুন")}
                        <ArrowRight className="h-4.5 w-4.5" />
                      </Button>
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
