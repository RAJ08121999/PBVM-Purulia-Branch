"use client"

import React, { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { GALLERY_CATEGORIES } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { Image as ImageIcon, ZoomIn } from "lucide-react"

interface GalleryItem {
  id: string
  titleEn: string
  titleBn: string
  category: typeof GALLERY_CATEGORIES[number]
  svgBg: string
}

export default function GalleryPage() {
  const { language, t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1)

  // Mock gallery items corresponding to FR-GAL
  const galleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      titleEn: "Annual Children's Science Congress 2026",
      titleBn: "বার্ষিক শিশু বিজ্ঞান কংগ্রেস ২০২৬",
      category: "Science Camps",
      svgBg: "bg-gradient-to-tr from-blue-700 to-indigo-900",
    },
    {
      id: "gal-2",
      titleEn: "Skywatching and Constellation Camp",
      titleBn: "আকাশ পর্যবেক্ষণ ও নক্ষত্র চেনার শিবির",
      category: "Skywatching",
      svgBg: "bg-gradient-to-tr from-slate-900 to-zinc-900",
    },
    {
      id: "gal-3",
      titleEn: "Tree Plantation Drive in Baghmundi Block",
      titleBn: "বাঘমুন্ডি ব্লকে বৃক্ষরোপণ কর্মসূচি",
      category: "Environmental Activities",
      svgBg: "bg-gradient-to-tr from-teal-700 to-emerald-800",
    },
    {
      id: "gal-4",
      titleEn: "Anti-Superstition Street Theatre Play",
      titleBn: "কুসংস্কার বিরোধী পথনাটক পরিবেশনা",
      category: "Awareness Campaigns",
      svgBg: "bg-gradient-to-tr from-orange-600 to-red-800",
    },
    {
      id: "gal-5",
      titleEn: "Vocational Clay Stove Building Class",
      titleBn: "ধোঁয়াহীন উন্নত উনুন তৈরির ক্লাস",
      category: "Workshops",
      svgBg: "bg-gradient-to-tr from-zinc-700 to-slate-800",
    },
    {
      id: "gal-6",
      titleEn: "District Level Model Exhibition 2026",
      titleBn: "জেলা স্তরের বিজ্ঞান মডেল প্রদর্শনী ২০২৬",
      category: "Exhibitions",
      svgBg: "bg-gradient-to-tr from-rose-700 to-purple-800",
    },
  ]

  // Filter items
  const filteredItems = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory)

  // Slides for yet-another-react-lightbox
  // Since we are using beautiful colored visual placeholders, we'll render custom content in the slides,
  // or define fallback colored slide placeholders.
  // The slides array expects object with `src` or custom nodes. We will generate nice mock color canvas URLs
  // or simple color slides. To keep it completely standard, we'll map color overlays as placeholders.
  const slides = filteredItems.map((item) => ({
    src: `https://placehold.co/800x600/${item.svgBg.includes("blue") ? "3b82f6" : item.svgBg.includes("teal") ? "0f766e" : item.svgBg.includes("orange") ? "ea580c" : "1e293b"}/ffffff?text=${encodeURIComponent(language === "bn" ? item.titleBn : item.titleEn)}`,
  }))

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      
      {/* Header Banner */}
      <section className="relative w-full py-20 bg-gradient-to-r from-blue-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-4 z-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight">
            {t("Activity Photo Gallery", "কর্মসূচির চিত্র গ্যালারি")}
          </h1>
          <p className="font-body text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {t(
              "Browse through the memories and pictures of our science camps, public seminars, and environmental drives in Purulia.",
              "পুরুলিয়া জেলায় আমাদের বিজ্ঞান শিবির, সাধারণ সেমিনার এবং পরিবেশ সচেতনতা কর্মসূচির বিভিন্ন ছবি ও স্মৃতি দেখুন।"
            )}
          </p>
        </div>
      </section>

      {/* Filter Options */}
      <section className="py-8 bg-white border-b border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-900 sticky top-16 z-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            
            {/* "All" Filter Button */}
            <Button
              variant={activeCategory === "All" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("All")}
              className="rounded-full font-body font-bold"
            >
              {t("All Categories", "সব ছবি")}
            </Button>

            {/* Sub-Category Buttons */}
            {GALLERY_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="rounded-full font-body font-bold"
              >
                {t(cat, cat === "Science Camps" ? "বিজ্ঞান শিবির" : cat === "Exhibitions" ? "বিজ্ঞান প্রদর্শনী" : cat === "Awareness Campaigns" ? "সচেতনতা প্রচার" : cat === "Skywatching" ? "আকাশ পর্যবেক্ষণ" : cat === "Environmental Activities" ? "পরিবেশ কর্মসূচি" : "কর্মশালা")}
              </Button>
            ))}

          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <ImageIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="font-body text-sm text-zinc-500 dark:text-zinc-400">
                {t("No images found in this category.", "এই বিভাগে কোনো ছবি খুঁজে পাওয়া যায়নি।")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative flex flex-col justify-end aspect-4/3 rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer border border-zinc-100 dark:border-zinc-900"
                >
                  {/* Colored simulation image */}
                  <div className={`absolute inset-0 ${item.svgBg} transition-transform duration-500 group-hover:scale-105`} />
                  
                  {/* Hover icon */}
                  <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm flex items-center justify-center text-white">
                    <ZoomIn className="h-4.5 w-4.5" />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Content details */}
                  <div className="relative p-5 flex flex-col gap-1 text-white z-10">
                    <span className="font-body text-xxs font-black uppercase tracking-widest text-teal-400">
                      {t(item.category, item.category === "Science Camps" ? "বিজ্ঞান শিবির" : item.category === "Exhibitions" ? "বিজ্ঞান প্রদর্শনী" : item.category === "Awareness Campaigns" ? "সচেতনতা প্রচার" : item.category === "Skywatching" ? "আকাশ পর্যবেক্ষণ" : item.category === "Environmental Activities" ? "পরিবেশ কর্মসূচি" : "কর্মশালা")}
                    </span>
                    <h3 className="font-heading text-sm sm:text-base font-extrabold leading-snug">
                      {t(item.titleEn, item.titleBn)}
                    </h3>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Lightbox Trigger */}
      {lightboxIndex >= 0 && (
        <Lightbox
          index={lightboxIndex}
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          slides={slides}
        />
      )}

    </div>
  )
}
