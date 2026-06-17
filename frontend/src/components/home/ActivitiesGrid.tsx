"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { ACTIVITY_META } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export const ActivitiesGrid = () => {
  const { language, t } = useLanguage()

  // 10 core activities descriptions (bilingual)
  const activityTeasers: Record<string, { descEn: string; descBn: string }> = {
    "environment-biodiversity": {
      descEn: "Plantation drives, wetland protection, and biodiversity registration campaigns in Purulia.",
      descBn: "পুরুলিয়ার বৃক্ষরোপণ অভিযান, জলাভূমি রক্ষা এবং জীববৈচিত্র্য নিবন্ধন অভিযান কর্মসূচী।",
    },
    health: {
      descEn: "Promoting public health awareness, blood donation drives, and primary medical checkup camps.",
      descBn: "জনস্বাস্থ্য সচেতনতা, রক্তদান শিবির এবং প্রাথমিক স্বাস্থ্য পরীক্ষা শিবিরের আয়োজন করা।",
    },
    agriculture: {
      descEn: "Assisting farmers with soil testing guide, eco-friendly farming practices, and pesticide awareness.",
      descBn: "মাটি পরীক্ষা নির্দেশিকা, পরিবেশ-বান্ধব চাষবাস এবং কীটনাশক সচেতনতায় কৃষকদের সহায়তা করা।",
    },
    "childrens-science": {
      descEn: "Organizing science talent search exams, science congresses, and rational education programs.",
      descBn: "বিজ্ঞান প্রতিভা সন্ধান পরীক্ষা, শিশু বিজ্ঞান কংগ্রেস এবং যুক্তিভিত্তিক শিক্ষা কর্মসূচির আয়োজন।",
    },
    "jatha-cultural": {
      descEn: "Anti-superstition street theatre, cultural assemblies, and educational jatha (marches).",
      descBn: "কুসংস্কারবিরোধী পথনাটক, সাংস্কৃতিক সমাবেশ এবং শিক্ষামূলক বিজ্ঞান যাত্রা।",
    },
    "technology-application": {
      descEn: "Promoting low-cost housing models, clay stove designs, and daily technology utility lessons.",
      descBn: "স্বল্পমূল্যের আবাসন মডেল, উন্নত উনান তৈরি এবং দৈনন্দিন প্রযুক্তি ব্যবহারের ব্যবহারিক শিক্ষা।",
    },
    "st-application-centre": {
      descEn: "Training rural youth in vocational skills, computer literacy, and cottage industry operations.",
      descBn: "গ্রামীণ যুবকদের বৃত্তিমূলক দক্ষতা, কম্পিউটার শিক্ষা এবং কুটির শিল্প পরিচালনায় প্রশিক্ষণ প্রদান।",
    },
    "hands-on-experiments": {
      descEn: "Demonstrating physics, chemistry, and biology experiments to government school students.",
      descBn: "সরকারি স্কুলের শিক্ষার্থীদের সামনে ভৌতবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের রোমাঞ্চকর পরীক্ষা প্রদর্শন।",
    },
    samata: {
      descEn: "Empowering women through scientific understanding, self-help groups, and health awareness.",
      descBn: "বিজ্ঞানসম্মত দৃষ্টিভঙ্গি ও স্বাস্থ্য সচেতনতার মাধ্যমে গ্রামীণ নারীদের আত্মনির্ভরশীলতা বৃদ্ধি।",
    },
    skywatching: {
      descEn: "Telescope observation camps, solar eclipse awareness, and astronomy lessons under dark skies.",
      descBn: "টেলিস্কোপ দিয়ে আকাশ পর্যবেক্ষণ, সূর্যগ্রহণ সচেতনতা এবং নক্ষত্র চেনার শিক্ষামূলক শিবির।",
    },
  }

  return (
    <section className="py-24 bg-white dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col items-center text-center gap-4 mb-16 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
            {t("Core Domains", "কর্মক্ষেত্র")}
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
            {t("Our Areas of Activity", "আমাদের মূল কর্মসূচি ও কার্যক্রমসমূহ")}
          </h2>
          <p className="font-body text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {t(
              "We coordinate 10 key scientific and social activities designed to engage communities, schools, and farmers throughout Purulia District.",
              "আমরা পুরুলিয়া জেলা জুড়ে সমাজ, স্কুল এবং কৃষকদের জড়িত করতে ১০টি মূল বিজ্ঞান ও সামাজিক কার্যক্রম পরিচালনা করি।"
            )}
          </p>
        </div>

        {/* 10 Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {Object.entries(ACTIVITY_META).map(([slug, meta]) => {
            const teaser = activityTeasers[slug] || { descEn: "", descBn: "" }
            return (
              <div
                key={slug}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-zinc-100 hover:border-zinc-200 bg-zinc-50/50 hover:bg-white dark:border-zinc-900 dark:hover:border-zinc-800 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/40 transition-all hover:shadow-lg relative overflow-hidden"
              >
                {/* Visual Top Glow matching component color */}
                <div
                  className="absolute top-0 left-0 w-full h-[3px]"
                  style={{ backgroundColor: meta.color }}
                />

                <div className="flex flex-col gap-4">
                  {/* Icon Badge */}
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shadow-sm transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                  >
                    {meta.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-base font-extrabold text-zinc-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {language === "bn" ? meta.titleBn : meta.titleEn}
                  </h3>

                  {/* Teaser Description */}
                  <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {language === "bn" ? teaser.descBn : teaser.descEn}
                  </p>
                </div>

                {/* View Details Link */}
                <div className="mt-6">
                  <Link href={`/activities/${slug}`}>
                    <span
                      className="font-body text-xs font-bold transition-all inline-flex items-center gap-1 cursor-pointer hover:underline"
                      style={{ color: meta.color }}
                    >
                      {t("View Details", "বিস্তারিত দেখুন")} &rarr;
                    </span>
                  </Link>
                </div>

              </div>
            )
          })}
        </div>

        {/* View All CTAs */}
        <div className="flex justify-center mt-16">
          <Link href="/activities">
            <Button variant="outline" className="border-zinc-200 hover:bg-zinc-50 font-bold rounded-full px-8 dark:border-zinc-800 dark:hover:bg-zinc-900">
              {t("Explore Detailed Objectives", "কর্মসূচির বিস্তারিত উদ্দেশ্য দেখুন")}
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}
export default ActivitiesGrid
