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
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      
      {/* Header Banner */}
      <section className="relative w-full py-20 bg-gradient-to-r from-blue-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-4 z-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight">
            {t("Downloads Library", "প্রয়োজনীয় ডাউনলোড ফাইলসমূহ")}
          </h1>
          <p className="font-body text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {t(
              "Access official membership sheets, event leaflets, campaign posters, and research reports in PDF format.",
              "অফিসিয়াল সদস্যপদ আবেদনপত্র, ইভেন্টের লিফলেট, প্রচারমূলক পোস্টার এবং গবেষণা রিপোর্ট পিডিএফ ফরম্যাটে ডাউনলোড করুন।"
            )}
          </p>
        </div>
      </section>

      {/* Category Selection Filter */}
      <section className="py-8 bg-white border-b border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-900 sticky top-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap gap-2 justify-center">
          
          <Button
            variant={selectedCategory === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("All")}
            className="rounded-full font-body font-bold"
          >
            {t("All Resources", "সব ফাইল")}
          </Button>

          {DOWNLOAD_CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className="rounded-full font-body font-bold"
            >
              {t(cat, cat === "Membership Forms" ? "সদস্যপদ ফর্ম" : cat === "Event Brochures" ? "ইভেন্ট লিফলেট" : cat === "Awareness Materials" ? "সচেতনতা লিপি" : cat === "Posters" ? "পোস্টার" : cat === "Reports" ? "রিপোর্ট" : "প্রকাশনা")}
            </Button>
          ))}

        </div>
      </section>

      {/* Downloads Catalog list */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
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
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-sm gap-4"
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
