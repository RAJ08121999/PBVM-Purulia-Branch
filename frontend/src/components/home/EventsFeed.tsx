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
            className="flex flex-col justify-between p-5 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex flex-col gap-4">
              {/* Date Box / Calendar styling */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center h-12 w-12 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 shrink-0 font-sans border border-teal-100 dark:border-teal-900/50">
                  <span className="text-base font-black leading-none">{getCalendarDay(evt.date)}</span>
                  <span className="text-xxs font-bold uppercase tracking-wider mt-0.5">{getCalendarMonth(evt.date)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-heading text-sm font-black text-zinc-900 dark:text-white leading-tight line-clamp-1">
                    {t(evt.titleEn, evt.titleBn)}
                  </span>
                  <div className="flex items-center gap-1 mt-0.5 font-body text-xs text-zinc-400 dark:text-zinc-500 font-semibold">
                    <MapPin className="h-3 w-3 text-zinc-400" />
                    <span className="line-clamp-1">{t(evt.venueEn, evt.venueBn)}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed min-h-[48px]">
                {t(evt.descEn, evt.descBn)}
              </p>
            </div>

            {/* Read more Link */}
            <div className="mt-6 pt-4 border-t border-zinc-50 dark:border-zinc-900/50 flex justify-between items-center">
              <Link href={`/events/${evt.id}`}>
                <span className="font-body text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline cursor-pointer flex items-center gap-1">
                  {t("More Details", "বিস্তারিত জানুন")}
                  <ArrowRight className="h-3.5 w-3.5" />
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
