"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { Award, Users, BookOpen, Star } from "lucide-react"

export const AboutPreview = () => {
  const { t } = useLanguage()

  const stats = [
    {
      icon: <Award className="h-6 w-6 text-orange-500" />,
      value: "35+",
      labelEn: "Years of Service",
      labelBn: "বছরের সেবা ও আন্দোলন",
    },
    {
      icon: <Users className="h-6 w-6 text-teal-500" />,
      value: "500+",
      labelEn: "Active Members",
      labelBn: "সক্রিয় সদস্য",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      value: "10+",
      labelEn: "Scientific Sectors",
      labelBn: "বিজ্ঞান ভিত্তিক খাত",
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      value: "1000+",
      labelEn: "Camps & Seminars",
      labelBn: "শিবির ও সেমিনার",
    },
  ]

  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text & Context */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
                {t("Who We Are", "আমরা কে")}
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white leading-tight">
                {t("Spreading Scientific Temperament", "বিজ্ঞান চেতনার জাগরণে আমরা")}
              </h2>
            </div>
            
            <p className="font-body text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t(
                "Paschim Banga Vigyan Mancha (PBVM), Purulia District Branch, is a non-governmental people's science organization. We work tirelessly to propagate scientific logic, eradicate deep-rooted superstitions, and protect local biodiversity. We empower citizens to analyze their surroundings through a lens of reasons and rationalism.",
                "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া জেলা শাখা, একটি অলাভজনক গণ-বিজ্ঞান সংগঠন। আমরা বিজ্ঞানভিত্তিক দৃষ্টিভঙ্গি প্রচার করতে, সমাজ থেকে কুসংস্কার দূর করতে এবং স্থানীয় জীববৈচিত্র্য রক্ষা করতে অক্লান্ত পরিশ্রম করি। আমরা সাধারণ মানুষকে যুক্তি ও বিজ্ঞানভিত্তিক চিন্তাধারার মাধ্যমে তাদের চারপাশের পরিস্থিতি বিশ্লেষণ করতে সাহায্য করি।"
              )}
            </p>

            <p className="font-body text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t(
                "From health camps and astronomy skywatching workshops to hands-on experiment classes in schools, our programs are customized to serve students, teachers, and local citizens of Purulia.",
                "স্বাস্থ্য শিবির ও জ্যোতির্বিজ্ঞানের আকাশ পর্যবেক্ষণ কর্মশালা থেকে শুরু করে স্কুলে হাতে-কলমে বিজ্ঞানের পরীক্ষা ক্লাস পর্যন্ত, আমাদের কর্মসূচিগুলি পুরুলিয়ার ছাত্র, শিক্ষক এবং সাধারণ মানুষের সেবায় ডিজাইন করা হয়েছে।"
              )}
            </p>

            <div className="mt-4">
              <Link href="/about">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-6">
                  {t("Learn More About Us", "আমাদের সম্পর্কে আরও জানুন")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-md"
              >
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900">
                  {stat.icon}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-3xl font-extrabold text-zinc-900 dark:text-white leading-none">
                    {stat.value}
                  </span>
                  <span className="font-body text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                    {t(stat.labelEn, stat.labelBn)}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
export default AboutPreview
