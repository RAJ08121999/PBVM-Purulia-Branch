"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { ArrowLeft, Calendar, MapPin,AlertTriangle, Info} from "lucide-react"
import { Button } from "@/components/ui/button"
import { publicApi } from "@/lib/api"

interface PageProps {
  params: Promise<{ id: string }>
}

interface EventDetail {
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

  createdAt: string
  updatedAt: string
}

const getAssetUrl = (url?: string) => {
  if (!url) return ""
  if (/^https?:\/\//i.test(url)) return url

  const base = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/api$/, "")
  return `${base}${url.startsWith("/") ? "" : "/"}${url}`
}

export default function EventDetailPage({ params }: PageProps) {
  const { language, t } = useLanguage()
  const resolvedParams = React.use(params)
  const id = resolvedParams.id

  const [event, setEvent] = React.useState<EventDetail | null>(null)
  const [loading, setLoading] = React.useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await publicApi.getEvent(id)
        setEvent(res.data.event)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
  
    if (id) {
      fetchEvent()
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>{t("Loading event...", "ইভেন্ট লোড হচ্ছে...")}</p>
      </div>
    )
  }
  
  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="font-heading text-2xl font-black">
          {t("Event Not Found", "ইভেন্টটি পাওয়া যায়নি")}
        </h2>
  
        <Link href="/events">
          <Button className="mt-6">
            {t("Back to Events", "সকল ইভেন্টে ফিরে যান")}
          </Button>
        </Link>
      </div>
    )
  }



  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="font-heading text-2xl font-black text-zinc-900 dark:text-white">
          {t("Event Not Found", "ইভেন্টটি পাওয়া যায়নি")}
        </h2>
        <p className="font-body text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
          {t("The event you are trying to visit does not exist or has been removed.", "আপনি যে ইভেন্টের পাতাটি দেখার চেষ্টা করছেন তা আমাদের তালিকায় নেই।")}
        </p>
        <Link href="/events">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full">
            &larr; {t("Back to Events", "সকল ইভেন্টে ফিরে যান")}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">

      {/* Event Header Banner */}
      <section
        className="relative w-full pt-20 pb-40 lg:pb-56 text-white overflow-hidden"
        style={{
          background: event.status === "upcoming"
            ? "linear-gradient(135deg, #0A3D32 0%, #0B3D91 60%, #0D0D2B 100%)"
            : "linear-gradient(135deg, #3F3F46 0%, #18181B 100%)",
          padding:"1rem"
        }}
      >
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div
        className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-125 h-125 rounded-full bg-white/10 blur-3xl" />

        <div
        className="relative w-full max-w-10xl px-6 lg:px-8 z-10 mx-auto">

          {/* Top bar: back button + status badge — sits above the image, never overlapping it */}
          <div className="relative z-20 flex items-center justify-between gap-4 mb-8">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-md text-white text-sm font-bold transition-colors hover:bg-white/20"
              style={{
                padding: "0.75rem 1rem",
              }}
            >
              <span className="text-lg font-extrabold"><ArrowLeft/></span>
              <span className="sr-only">{t("Back to Events", "সকল ইভেন্টে ফিরে যান")}</span>
            </Link>

            <span
              className="font-body uppercase tracking-widest w-fit rounded-full text-xs font-bold border border-white/25 bg-white/10 backdrop-blur-md text-white"
              style={{
                padding: "0.6rem 1rem",
              }}
            >
              {t(event.status, event.status === "upcoming" ? "আসন্ন ইভেন্ট" : "বিগত কর্মসূচি")}
            </span>
          </div>

          <div className="mb-8 mt-6 overflow-hidden rounded-[2rem] h-64 sm:h-72 md:h-80 lg:hidden">
            {event.gallery?.[0] ? (
              <img
                src={getAssetUrl(event.gallery[0])}
                alt={language === "bn" ? event.title.bn : event.title.en}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/10 text-7xl text-white/80">
                {event.status === "upcoming" ? "🌟" : "📅"}
              </div>
            )}
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center justify-between">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:w-2/3">
              <h1
                className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] drop-shadow-sm"
                style={{
                  color: "#F1F5F9",
                  paddingLeft:"2rem"
                }}
              >
                {language === "bn" ? event.title.bn : event.title.en}
              </h1>
            </div>

            <div className="hidden lg:flex lg:w-1/3 justify-center lg:justify-end pr-0 lg:pr-8">
              <div className="h-56 w-56 xl:h-64 xl:w-64 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-[6px] border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.2)] relative overflow-hidden">
                {event.gallery?.[0] ? (
                  <img
                    src={getAssetUrl(event.gallery[0])}
                    alt={language === "bn" ? event.title.bn : event.title.en}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-7xl xl:text-8xl z-10">
                    {event.status === "upcoming" ? "🌟" : "📅"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Grid */}
      <section className="relative -mt-24 lg:-mt-36 px-4 sm:px-6 lg:px-8 z-20 w-full flex justify-center" style={{ marginBottom: "2rem" }}>
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* Main Info */}
          <div className="lg:col-span-8 flex flex-col justify-center items-center text-center gap-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-solid border-zinc-300 dark:border-zinc-700 rounded-3xl" style={{ padding: "2.5rem", marginTop: "1rem" }}>

            {/* Description */}
            <div className="w-full text-left flex flex-col gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
              <h2 className="font-heading text-xl lg:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-teal-600" />
                {t("Event Description", "কর্মসূচির বিবরণ")}
              </h2>
              <p className="font-body text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {language === "bn" ? event.description.bn : event.description.en}
              </p>
            </div>
          </div>

          {/* Sidebar Info Card */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center text-center gap-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-solid border-zinc-300 dark:border-zinc-700 rounded-3xl" style={{ padding: "2rem", marginTop: "1rem" }}>
            <h3 className="font-heading text-lg lg:text-xl font-black text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-4 w-full text-left">
              {t("Logistics & Contact", "যোগাযোগ ও সময়সূচী")}
            </h3>

            <div className="flex flex-col items-start gap-6 w-full text-left font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">

              {/* Date */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">{t("Date", "তারিখ")}</span>
                  <span className="font-black text-zinc-800 dark:text-white">{new Date(event.date).toLocaleDateString("en-IN")}</span>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">{t("Venue", "স্থান")}</span>
                  <span className="font-black text-zinc-800 dark:text-white">{language === "bn" ? event.venue : event.venue}</span>
                </div>
              </div>

              {/* Registration */}
              {event.registrationLink && (
                <div className="flex items-start gap-3 border-t border-zinc-50 dark:border-zinc-900 w-full pt-4">
                  <div>
                    <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">
                      {t("Registration", "নিবন্ধন")}
                    </span>

                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-teal-600 hover:underline"
                    >
                      {t("Register Here", "এখানে নিবন্ধন করুন")}
                    </a>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  )
}