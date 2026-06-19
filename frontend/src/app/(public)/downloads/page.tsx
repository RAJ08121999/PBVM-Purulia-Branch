"use client"

import React, { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { DOWNLOAD_CATEGORIES } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Download, ArrowDownToLine } from "lucide-react"
import { toast } from "sonner"

interface DownloadItem {
  id: string
  titleEn: string
  titleBn: string
  category: typeof DOWNLOAD_CATEGORIES[number]
  fileSize: string
  downloads: number
}

export default function DownloadsPage() {
  const { language, t } = useLanguage()
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [items, setItems] = useState<DownloadItem[]>([
    {
      id: "d-1",
      titleEn: "Official PBVM Purulia Membership Form",
      titleBn: "অফিসিয়াল পিবিভিএম পুরুলিয়া সদস্যপদ ফর্ম",
      category: "Membership Forms",
      fileSize: "245 KB",
      downloads: 142,
    },
    {
      id: "d-2",
      titleEn: "Annual Science Talent Search Syllabus & Guidelines",
      titleBn: "বার্ষিক বিজ্ঞান প্রতিভা অন্বেষণ সিলেবাস ও নির্দেশিকা",
      category: "Event Brochures",
      fileSize: "512 KB",
      downloads: 389,
    },
    {
      id: "d-3",
      titleEn: "How to Detect Adulterated Food: Household Magic Exposes",
      titleBn: "কীভাবে ভেজাল খাদ্য সনাক্ত করবেন: ঘরোয়া পরীক্ষার সহজ লিপি",
      category: "Awareness Materials",
      fileSize: "1.2 MB",
      downloads: 504,
    },
    {
      id: "d-4",
      titleEn: "Protect Purulia Water Resource & Wetlands Poster",
      titleBn: "পুরুলিয়ার জলসম্পদ ও জলাভূমি রক্ষা করুন পোস্টার",
      category: "Posters",
      fileSize: "4.8 MB",
      downloads: 92,
    },
    {
      id: "d-5",
      titleEn: "Annual Science Congress District Report 2025",
      titleBn: "বার্ষিক বিজ্ঞান কংগ্রেস জেলা সমীক্ষা রিপোর্ট ২০২৫",
      category: "Reports",
      fileSize: "2.1 MB",
      downloads: 67,
    },
  ])

  // Filter items
  const filteredItems = selectedCategory === "All"
    ? items
    : items.filter(item => item.category === selectedCategory)

  // Track download mock action
  const handleDownload = (id: string, name: string) => {
    // Increment the download count locally
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, downloads: item.downloads + 1 } : item
      )
    )
    toast.success(`${t("Downloading", "ডাউনলোড হচ্ছে")}: ${name}`)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8FAFC" }}>

      {/* Header Banner */}
      <section
        style={{
          width: "100%",
          padding: "5rem 0 4rem",
          background: "linear-gradient(135deg, #0B1F4A 0%, #0B3D91 60%, #0A3D32 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="page-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", lineHeight: 1.2 }}>
            {t("Downloads Library", "প্রয়োজনীয় ডাউনলোড ফাইলসমূহ")}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.78)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
            {t(
              "Access official membership sheets, event leaflets, campaign posters, and research reports in PDF format.",
              "অফিসিয়াল সদস্যপদ আবেদনপত্র, ইভেন্টের লিফলেট, প্রচারমূলক পোস্টার এবং গবেষণা রিপোর্ট পিডিএফ ফরম্যাটে ডাউনলোড করুন।"
            )}
          </p>
        </div>
      </section>

      {/* Category Selection Filter */}
      <section style={{ width: "100%", padding: "1.5rem 0", background: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: "64px", zIndex: 20 }}>
        <div className="page-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>

          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
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
            {t("All Resources", "সব ফাইল")}
          </Button>

          {DOWNLOAD_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
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
              {t(cat, cat === "Membership Forms" ? "সদস্যপদ ফর্ম" : cat === "Event Brochures" ? "ইভেন্ট লিফলেট" : cat === "Awareness Materials" ? "সচেতনতা লিপি" : cat === "Posters" ? "পোস্টার" : cat === "Reports" ? "রিপোর্ট" : "প্রকাশনা")}
            </Button>
          ))}

        </div>
      </section>

      {/* Downloads Catalog list */}
      <section style={{ width: "100%", padding: "3.5rem 0" }}>
        <div className="page-container" style={{ maxWidth: "800px" }}>

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-zinc-100 rounded-3xl dark:bg-black dark:border-zinc-900">
              <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="font-body text-sm text-zinc-500 dark:text-zinc-400">
                {t("No download files in this category yet.", "এই বিভাগে এখনও কোনো ফাইল পাওয়া যায়নি।")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-sm gap-4"
                  style={{ padding: "1rem" }}
                >

                  {/* File Metadata Details */}
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-sm sm:text-base font-black text-zinc-900 dark:text-white leading-tight">
                        {t(item.titleEn, item.titleBn)}
                      </span>
                      <div className="flex items-center gap-2 mt-1 font-body text-xxs text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">
                        <span>{t(item.category, item.category === "Membership Forms" ? "সদস্যপদ ফর্ম" : item.category === "Event Brochures" ? "ইভেন্ট লিফলেট" : item.category === "Awareness Materials" ? "সচেতনতা লিপি" : item.category === "Posters" ? "পোস্টার" : item.category === "Reports" ? "রিপোর্ট" : "প্রকাশনা")}</span>
                        <span>&bull;</span>
                        <span>{item.fileSize}</span>
                        <span>&bull;</span>
                        <span className="text-teal-600 dark:text-teal-400">{item.downloads} {t("downloads", "ডাউনলোড")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Trigger */}
                  <Button
                    onClick={() => handleDownload(item.id, t(item.titleEn, item.titleBn))}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shrink-0"
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
                    <Download className="h-4.5 w-4.5" />
                    {t("Download", "ডাউনলোড")}
                  </Button>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  )
}
