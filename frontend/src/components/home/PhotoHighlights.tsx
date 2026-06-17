"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Image as ImageIcon, ArrowRight } from "lucide-react"

interface HighlightItem {
  id: string
  titleEn: string
  titleBn: string
  categoryEn: string
  categoryBn: string
  svgBg: string
}

export const PhotoHighlights = () => {
  const { t } = useLanguage()

  const items: HighlightItem[] = [
    {
      id: "h-1",
      titleEn: "Annual Science Congress 2026",
      titleBn: "বার্ষিক শিশু বিজ্ঞান কংগ্রেস ২০২৬",
      categoryEn: "Science Camps",
      categoryBn: "বিজ্ঞান শিবির",
      svgBg: "bg-gradient-to-tr from-blue-600 to-indigo-900",
    },
    {
      id: "h-2",
      titleEn: "Jupiter & Saturn Telescope Observation",
      titleBn: "টেলিস্কোপে বৃহস্পতি ও শনি পর্যবেক্ষণ",
      categoryEn: "Skywatching",
      categoryBn: "আকাশ পর্যবেক্ষণ",
      svgBg: "bg-gradient-to-tr from-slate-900 to-indigo-950",
    },
    {
      id: "h-3",
      titleEn: "Tree Plantation in Purulia Blocks",
      titleBn: "পুরুলিয়া ব্লকসমূহে বৃক্ষরোপণ কর্মসূচি",
      categoryEn: "Environmental Activities",
      categoryBn: "পরিবেশ কর্মসূচি",
      svgBg: "bg-gradient-to-tr from-teal-700 to-emerald-900",
    },
    {
      id: "h-4",
      titleEn: "Anti-Superstition Awareness Rally",
      titleBn: "কুসংস্কার বিরোধী সচেতনতা প্রচার",
      categoryEn: "Awareness Campaigns",
      categoryBn: "সচেতনতা প্রচার",
      svgBg: "bg-gradient-to-tr from-orange-600 to-red-800",
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 pb-4">
        <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-white">
          {t("Recent Activity Photos", "সাম্প্রতিক কর্মসূচির চিত্রসমূহ")}
        </h3>
        <Link href="/gallery" className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">
          {t("View Gallery", "গ্যালারি দেখুন")} &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link
            key={item.id}
            href="/gallery"
            className="group relative flex flex-col justify-end aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            {/* Visual Colored Graphic Container simulating a photo */}
            <div className={`absolute inset-0 ${item.svgBg} transition-transform duration-500 group-hover:scale-105`} />
            
            {/* Styled Icon indicating it is a photo */}
            <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
              <ImageIcon className="h-4.5 w-4.5" />
            </div>

            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Card Content details */}
            <div className="relative p-5 flex flex-col gap-1 z-10 text-white">
              <span className="font-body text-xxs font-black uppercase tracking-widest text-teal-400">
                {t(item.categoryEn, item.categoryBn)}
              </span>
              <h4 className="font-heading text-sm font-extrabold leading-snug line-clamp-2">
                {t(item.titleEn, item.titleBn)}
              </h4>
            </div>

          </Link>
        ))}
      </div>
    </div>
  )
}
export default PhotoHighlights
