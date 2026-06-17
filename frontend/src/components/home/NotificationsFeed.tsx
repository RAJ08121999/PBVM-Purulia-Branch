"use client"

import React from "react"
import { useLanguage } from "@/context/LanguageContext"
import { Bell, Pin, Calendar } from "lucide-react"

interface NotificationItem {
  id: string
  titleEn: string
  titleBn: string
  date: string
  isPinned: boolean
}

export const NotificationsFeed = () => {
  const { t } = useLanguage()

  // Mock notifications matching SRS conceptual data schema
  const notifications: NotificationItem[] = [
    {
      id: "1",
      titleEn: "Purulia District Science Talent Search Test 2026 — Register online now!",
      titleBn: "পুরুলিয়া জেলা বিজ্ঞান প্রতিভা অন্বেষণ পরীক্ষা ২০২৬ — অনলাইনে নাম নথিভুক্ত করুন!",
      date: "2026-06-15T10:00:00.000Z",
      isPinned: true,
    },
    {
      id: "2",
      titleEn: "Hands-on Astronomy & Skywatching Camp at Purulia Zilla School Ground on June 25",
      titleBn: "২৫শে জুন পুরুলিয়া জেলা স্কুল প্রাঙ্গণে হাতে-কলমে জ্যোতির্বিজ্ঞান ও আকাশ পর্যবেক্ষণ শিবির",
      date: "2026-06-10T12:00:00.000Z",
      isPinned: false,
    },
    {
      id: "3",
      titleEn: "Seminars on Environmental Awareness & Water Conservation in Purulia blocks",
      titleBn: "পুরুলিয়া ব্লকসমূহে পরিবেশ সচেতনতা ও জল সংরক্ষণ নিয়ে শিক্ষামূলক সেমিনার",
      date: "2026-06-05T09:00:00.000Z",
      isPinned: false,
    },
  ]

  // Sort: pinned first, then by date descending
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const formatFeedDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-white border border-zinc-100 dark:bg-black dark:border-zinc-900 shadow-sm">
      <div className="flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-900 pb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-950/20 dark:text-red-400">
          <Bell className="h-4.5 w-4.5 animate-bounce" />
        </div>
        <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-white">
          {t("Latest Notifications", "সর্বশেষ বিজ্ঞপ্তি")}
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {sortedNotifications.map((notif) => (
          <div
            key={notif.id}
            style={{
              padding: "1.25rem",
              borderRadius: "16px",
              border: "1px solid",
              borderColor: notif.isPinned ? "#FDE68A" : "#E2E8F0",
              background: notif.isPinned ? "rgba(254, 243, 199, 0.4)" : "rgba(248, 250, 252, 0.5)",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              width: "100%",
              boxSizing: "border-box",
            }}
            className="group"
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", width: "100%" }}>
              {notif.isPinned && (
                <Pin
                  style={{
                    width: "0.875rem",
                    height: "0.875rem",
                    color: "#D97706",
                    flexShrink: 0,
                    marginTop: "0.25rem",
                    transform: "rotate(45deg)",
                  }}
                />
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%", textAlign: "left" }}>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "#1E293B",
                    lineHeight: 1.4,
                    margin: 0,
                  }}
                  className="group-hover:text-blue-600 transition-colors"
                >
                  {t(notif.titleEn, notif.titleBn)}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 600 }}>
                  <Calendar style={{ width: "0.75rem", height: "0.75rem" }} />
                  <span>{formatFeedDate(notif.date)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default NotificationsFeed
