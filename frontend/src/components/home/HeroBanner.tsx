"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const HeroBanner = () => {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      titleEn: "Promoting Scientific Temperament for a Rational Society",
      titleBn: "যুক্তিবাদী সমাজ গঠনে বিজ্ঞান মানসিকতার প্রসার",
      descEn: "Empowering children and communities through science camps, exhibitions, and hands-on learning.",
      descBn: "বিজ্ঞান শিবির, প্রদর্শনী এবং হাতে-কলমে শিক্ষার মাধ্যমে শিশু ও সমাজকে ক্ষমতায়ন করা।",
      bgClass: "from-blue-900 via-indigo-950 to-teal-950",
      accentClass: "bg-teal-500",
    },
    {
      titleEn: "Exploring the Wonders of the Universe",
      titleBn: "মহাবিশ্বের বিস্ময় অন্বেষণ",
      descEn: "Join our popular skywatching camps, telescope observations, and astronomy workshops.",
      descBn: "আমাদের জনপ্রিয় আকাশ পর্যবেক্ষণ শিবির, টেলিস্কোপ পর্যবেক্ষণ এবং জ্যোতির্বিজ্ঞান কর্মশালায় যোগ দিন।",
      bgClass: "from-zinc-950 via-slate-900 to-indigo-950",
      accentClass: "bg-orange-500",
    },
    {
      titleEn: "Environmental Action & Biodiversity",
      titleBn: "পরিবেশ রক্ষা ও জীববৈচিত্র্য সংরক্ষণ",
      descEn: "Empowering local citizens to act on climate change, tree plantations, and water body conservations.",
      descBn: "জলবায়ু পরিবর্তন, বৃক্ষরোপণ এবং জলাশয় সংরক্ষণে কাজ করতে স্থানীয় নাগরিকদের ক্ষমতায়ন করা।",
      bgClass: "from-teal-950 via-emerald-950 to-zinc-950",
      accentClass: "bg-green-500",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative w-full h-[550px] sm:h-[600px] lg:h-[650px] overflow-hidden bg-black flex items-center">
      
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgClass} opacity-90`}
        />
      </AnimatePresence>

      {/* Decorative Grid Overlay for Modern Technical Aesthetic */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />

      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6"
            >
              {/* Category Accent Badge */}
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${slides[currentSlide].accentClass} animate-pulse`} />
                <span className="font-body text-xs font-bold uppercase tracking-widest text-teal-400">
                  {t("Purulia Branch Movement", "পুরুলিয়া শাখা আন্দোলন")}
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
                {t(slides[currentSlide].titleEn, slides[currentSlide].titleBn)}
              </h1>

              {/* Description */}
              <p className="font-body text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed">
                {t(slides[currentSlide].descEn, slides[currentSlide].descBn)}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <Link href="/join-us">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full px-8 flex items-center gap-2 shadow-lg shadow-blue-900/30">
                    {t("Join Us", "যোগদান করুন")}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/activities">
                  <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10 font-bold rounded-full px-8">
                    {t("Explore Activities", "কর্মসূচি দেখুন")}
                  </Button>
                </Link>
              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 z-20 p-2 rounded-full border border-white/20 bg-black/30 hover:bg-black/60 text-white transition-colors"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 z-20 p-2 rounded-full border border-white/20 bg-black/30 hover:bg-black/60 text-white transition-colors"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "w-8 bg-teal-400" : "w-2.5 bg-white/40"
            }`}
          />
        ))}
      </div>

    </section>
  )
}
export default HeroBanner
