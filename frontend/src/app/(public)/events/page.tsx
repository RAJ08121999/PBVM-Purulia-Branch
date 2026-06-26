"use client"

import React, { useState , useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, MapPin, ArrowRight,} from "lucide-react"
import { publicApi } from "@/lib/api"
import Image from "next/image"

interface EventItem {
  _id: string
  title: {
    en: string
    bn: string
  }
  description: {
    en: string
    bn: string
  }
  venue: string
  date: string
  registrationLink: string
  gallery: string[]
  status: "upcoming" | "past"
}

export default function EventsPage() {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"All" | "Upcoming" | "Past">("All")

  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          publicApi.getEvents({
            status: "upcoming",
            limit: 100,
          }),
          publicApi.getEvents({
            status: "past",
            limit: 100,
          }),
        ])
  
        setEvents([
          ...upcomingRes.data.events,
          ...pastRes.data.events,
        ])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  
    fetchEvents()
  }, []);

  // Filter & Search Logic
  const filteredEvents = events.filter((evt) => {
    const title = language === "bn" ? evt.title.bn : evt.title.en
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter =
      selectedFilter === "All" ||
      (selectedFilter === "Upcoming" && evt.status === "upcoming") ||
      (selectedFilter === "Past" && evt.status === "past")
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
        {loading ? (
            <div className="py-20 text-center">
              {t("Loading events...", "ইভেন্ট লোড হচ্ছে...")}
            </div>
          ) : filteredEvents.length === 0 ? (
                    
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
                  key={evt._id}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-md relative overflow-hidden"
                  style={{
                    padding: "1.5rem",
                    margin: "0.5rem",
                  }}
                >
                  {evt.gallery.length > 0 && (
                    <Image
                      src={evt.gallery[0]}
                      width={600}
                      height={300}
                      alt={t(evt.title.en, evt.title.bn)}
                      className="w-full h-52 object-cover rounded-xl mb-4"
                    />
                  )}
                  <div className="flex flex-col" style={{ gap: "1rem" }}>
                    {/* Badge and Type */}
                    <div className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-900" style={{ paddingBottom: "0.75rem" }}>
                      <span
                        className="font-body text-xxs font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: evt.status === "upcoming" ? "#E0F2FE" : "#F4F4F5",
                          color: evt.status === "upcoming" ? "#0369A1" : "#71717A",
                        }}
                      >
                        {t(
                            evt.status === "upcoming"
                              ? "Upcoming"
                              : "Past",
                            evt.status === "upcoming"
                              ? "আসন্ন"
                              : "বিগত"
                          )}
                      </span>
                      <span className="font-body text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-semibold">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(evt.date).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-snug">
                      {t(evt.title.en, evt.title.bn)}
                    </h3>

                    <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {t(evt.description.en, evt.description.bn)}
                    </p>

                    {/* Venue & Time details */}
                    <div className="flex flex-col gap-1.5 mt-2 font-body text-xxs text-zinc-500 dark:text-zinc-400 border-t border-zinc-50 dark:border-zinc-900" style={{ paddingTop: "0.75rem" }}>
                      <div className="flex items-center gap-1.5 font-bold">
                        <MapPin className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                        <span>{t(evt.venue, evt.venue)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-semibold">
                        <span className="text-zinc-400 dark:text-zinc-600 font-black">&bull;</span>
                        <span>
                          {new Date(evt.date).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-50 dark:border-zinc-900/50" style={{ marginTop: "1.5rem", paddingTop: "1rem" }}>
                    <Link href={`/events/${evt._id}`} className="w-full">
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
