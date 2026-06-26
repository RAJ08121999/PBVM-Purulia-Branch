"use client"

import React, { useEffect, useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { Bell, Pin, Calendar } from "lucide-react"
import { publicApi } from "@/lib/api"

interface NotificationItem {
  _id: string
  title: string
  body?: string
  isPinned: boolean
  createdAt: string
}

export const NotificationsFeed = () => {
  const { t } = useLanguage()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await publicApi.getNotifications()
        setNotifications(response.data.notifications || [])
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load notifications"
        setError(errorMessage)
        console.error("Error fetching notifications:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [])

  // Sort: pinned first, then by date descending (already sorted by backend, but ensuring consistency)
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const formatFeedDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
  }

  if (loading) {
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
        <div className="text-center py-8 text-zinc-500">
          {t("Loading notifications...", "বিজ্ঞপ্তি লোড হচ্ছে...")}
        </div>
      </div>
    )
  }

  if (error) {
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
        <div className="text-center py-8 text-red-500">
          {t("Failed to load notifications", "বিজ্ঞপ্তি লোড করতে ব্যর্থ")}
        </div>
      </div>
    )
  }

  if (sortedNotifications.length === 0) {
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
        <div className="text-center py-8 text-zinc-500">
          {t("No notifications yet", "এখনো কোনো বিজ্ঞপ্তি নেই")}
        </div>
      </div>
    )
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
            key={notif._id}
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
                  {notif.title}
                </p>
                {notif.body && (
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      color: "#64748B",
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {notif.body}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase", fontWeight: 600 }}>
                  <Calendar style={{ width: "0.75rem", height: "0.75rem" }} />
                  <span>{formatFeedDate(notif.createdAt)}</span>
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
