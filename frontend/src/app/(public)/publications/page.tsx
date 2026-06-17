"use client"

import React, { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { PUBLICATION_CATEGORIES } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, BookOpen } from "lucide-react"

interface PublicationItem {
  id: string
  titleEn: string
  titleBn: string
  category: typeof PUBLICATION_CATEGORIES[number]
  descEn: string
  descBn: string
  date: string
  pdfUrl: string
}

export default function PublicationsPage() {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const publications: PublicationItem[] = [
    {
      id: "pub-1",
      titleEn: "Vigyan Bhabna — Summer Issue 2026",
      titleBn: "বিজ্ঞান ভাবনা — গ্রীষ্মকালীন সংখ্যা ২০২৬",
      category: "Magazine",
      descEn: "Our flagship quarterly magazine covering topics on biotechnology, local climate, and rational thinking.",
      descBn: "আমাদের ফ্ল্যাগশিপ ত্রৈমাসিক পত্রিকা, যাতে বায়োটেকনোলজি, স্থানীয় জলবায়ু এবং যুক্তিবাদী চিন্তাধারা নিয়ে প্রবন্ধ রয়েছে।",
      date: "2026-06-01",
      pdfUrl: "#",
    },
    {
      id: "pub-2",
      titleEn: "Superstition vs Science: A Guide for Teachers",
      titleBn: "কুসংস্কার বনাম বিজ্ঞান: শিক্ষকদের জন্য নির্দেশিকা",
      category: "Booklet",
      descEn: "Hands-on guide with experiments designed to expose common blind faiths and magic tricks.",
      descBn: "সাধারণ কুসংস্কার ও অলৌকিক বুজরুকি ফাঁস করার জন্য বিভিন্ন পরীক্ষা সম্বলিত শিক্ষকদের সহায়িকা পুস্তিকা।",
      date: "2026-05-15",
      pdfUrl: "#",
    },
    {
      id: "pub-3",
      titleEn: "Purulia District Groundwater Resource Report 2025",
      titleBn: "পুরুলিয়া জেলা ভূগর্ভস্থ জলসম্পদ রিপোর্ট ২০২৫",
      category: "Report",
      descEn: "Scientific study report mapping the water bodies, groundwater level, and drought actions for blocks.",
      descBn: "পুরুলিয়া জেলার বিভিন্ন ব্লকের জলাশয়, ভূগর্ভস্থ জলের স্তর এবং খরা প্রতিরোধ ব্যবস্থার বৈজ্ঞানিক সমীক্ষা রিপোর্ট।",
      date: "2025-12-10",
      pdfUrl: "#",
    },
    {
      id: "pub-4",
      titleEn: "Snakebite Prevention & First Aid Protocols",
      titleBn: "সর্পদংশন প্রতিরোধ ও প্রাথমিক চিকিৎসা নির্দেশিকা",
      category: "Awareness Material",
      descEn: "Bilingual poster detailing snake identification, bite symptoms, and immediate emergency contact guidelines.",
      descBn: "সাপ চেনা, কামড়ের উপসর্গ এবং তাৎক্ষণিক জরুরি চিকিৎসা নির্দেশাবলী সম্বলিত সচেতনতামূলক পুস্তিকা।",
      date: "2026-04-20",
      pdfUrl: "#",
    },
    {
      id: "pub-5",
      titleEn: "District Science Bulletin — Spring 2026",
      titleBn: "জেলা বিজ্ঞান বুলেটিন — বসন্ত ২০২৬",
      category: "Newsletter",
      descEn: "Monthly newsletter detailing activities, upcoming camps, and membership news of the branch.",
      descBn: "আমাদের শাখার মাসিক প্রচারপত্র, যাতে কর্মসূচি, আসন্ন ক্যাম্প এবং সংগঠনের খবরাখবর রয়েছে।",
      date: "2026-03-15",
      pdfUrl: "#",
    },
  ]

  // Filter & Search Logic
  const filteredPublications = publications.filter((pub) => {
    const title = language === "bn" ? pub.titleBn : pub.titleEn
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || pub.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      
      {/* Header Banner */}
      <section className="relative w-full py-20 bg-gradient-to-r from-blue-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-4 z-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight">
            {t("Publications Library", "বিজ্ঞান প্রকাশনা লাইব্রেরি")}
          </h1>
          <p className="font-body text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {t(
              "Explore and download our official science booklets, local environment reports, newsletters, and quarterly magazines.",
              "আমাদের প্রকাশিত বিজ্ঞান ভিত্তিক পুস্তিকা, স্থানীয় পরিবেশ রিপোর্ট, বুলেটিন এবং ত্রৈমাসিক পত্রিকাগুলি সংগ্রহ করুন।"
            )}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="py-8 bg-white border-b border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-900 sticky top-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              type="text"
              placeholder={t("Search by title...", "নাম দিয়ে খুঁজুন...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full bg-zinc-50 border-zinc-200 text-sm focus:bg-white dark:bg-zinc-900 dark:border-zinc-800"
            />
          </div>

          {/* Category Dropdown or Filters */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
            <Button
              variant={selectedCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("All")}
              className="rounded-full font-body font-bold"
            >
              {t("All", "সব")}
            </Button>
            {PUBLICATION_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="rounded-full font-body font-bold"
              >
                {t(cat, cat === "Magazine" ? "পত্রিকা" : cat === "Booklet" ? "পুস্তিকা" : cat === "Report" ? "রিপোর্ট" : cat === "Awareness Material" ? "সচেতনতা লিপি" : "নিউজলেটার")}
              </Button>
            ))}
          </div>

        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredPublications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <BookOpen className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="font-body text-sm text-zinc-500 dark:text-zinc-400">
                {t("No publications found matching your search.", "কোনো প্রকাশনা খুঁজে পাওয়া যায়নি।")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPublications.map((pub) => (
                <div
                  key={pub.id}
                  className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-md"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-900 pb-3">
                      <span className="font-body text-xxs font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
                        {t(pub.category, pub.category === "Magazine" ? "পত্রিকা" : pub.category === "Booklet" ? "পুস্তিকা" : pub.category === "Report" ? "রিপোর্ট" : pub.category === "Awareness Material" ? "সচেতনতা লিপি" : "নিউজলেটার")}
                      </span>
                      <span className="font-body text-xs text-zinc-400 dark:text-zinc-500">
                        {pub.date}
                      </span>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-snug">
                      {t(pub.titleEn, pub.titleBn)}
                    </h3>

                    <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {t(pub.descEn, pub.descBn)}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-zinc-50 dark:border-zinc-900/50">
                    <a href={pub.pdfUrl} download className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2">
                        <Download className="h-4.5 w-4.5" />
                        {t("Download PDF", "ডাউনলোড করুন")}
                      </Button>
                    </a>
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
