"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Button } from "@/components/ui/button"
import { ArrowRight, UserPlus } from "lucide-react"

export const JoinCTA = () => {
  const { t } = useLanguage()

  return (
    <section className="py-16 bg-gradient-to-r from-blue-900 to-teal-900 text-white rounded-3xl overflow-hidden relative shadow-lg my-12">
      
      {/* Decorative Grid Patterns for Premium Science Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 bg-radial-gradient from-teal-500/20 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 text-center flex flex-col items-center gap-6 z-10">
        
        {/* Icon Accent */}
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-teal-400">
          <UserPlus className="h-6 w-6" />
        </div>

        {/* Heading */}
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
          {t("Ready to Make a Difference in Society?", "বিজ্ঞানের আন্দোলনে সামিল হতে চান?")}
        </h2>

        {/* Subtitle */}
        <p className="font-body text-sm sm:text-base text-zinc-200 max-w-2xl leading-relaxed">
          {t(
            "Join hands with Paschim Banga Vigyan Mancha, Purulia Branch. Whether you are a student, teacher, doctor, or a science enthusiast, your contribution can help us popularize science and eradicate superstitions.",
            "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া জেলা শাখার সাথে যুক্ত হন। আপনি ছাত্র, শিক্ষক, চিকিৎসক বা বিজ্ঞানপ্রেমী যাই হোন না কেন, আপনার মূল্যবান অবদান বিজ্ঞান চেতনার বিস্তার এবং কুসংস্কার দূরীকরণে অগ্রণী ভূমিকা নিতে পারে।"
          )}
        </p>

        {/* Button Trigger */}
        <div className="mt-4">
          <Link href="/join-us">
            <Button size="lg" className="bg-white hover:bg-zinc-100 text-blue-950 font-black rounded-full px-8 flex items-center gap-2 shadow-xl shadow-black/25">
              {t("Apply for Membership", "সদস্যপদের জন্য আবেদন করুন")}
              <ArrowRight className="h-5 w-5 text-blue-900" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  )
}
export default JoinCTA
