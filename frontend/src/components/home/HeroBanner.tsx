"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight, FlaskConical } from "lucide-react"

export const HeroBanner = () => {
  const { t } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      titleEn: "Promoting Scientific Temperament for a Rational Society",
      titleBn: "যুক্তিবাদী সমাজ গঠনে বিজ্ঞান মানসিকতার প্রসার",
      descEn:
        "Empowering children and communities through science camps, exhibitions, and hands-on learning.",
      descBn:
        "বিজ্ঞান শিবির, প্রদর্শনী এবং হাতে-কলমে শিক্ষার মাধ্যমে শিশু ও সমাজকে ক্ষমতায়ন করা।",
      bgFrom: "#0B1F4A",
      bgTo: "#0A3D32",
      accent: "#2DD4BF",
      accentBg: "rgba(45,212,191,0.18)",
    },
    {
      titleEn: "Exploring the Wonders of the Universe",
      titleBn: "মহাবিশ্বের বিস্ময় অন্বেষণ",
      descEn:
        "Join our popular skywatching camps, telescope observations, and astronomy workshops.",
      descBn:
        "আমাদের জনপ্রিয় আকাশ পর্যবেক্ষণ শিবির, টেলিস্কোপ পর্যবেক্ষণ এবং জ্যোতির্বিজ্ঞান কর্মশালায় যোগ দিন।",
      bgFrom: "#0D0D2B",
      bgTo: "#1A1A4E",
      accent: "#F97316",
      accentBg: "rgba(249,115,22,0.18)",
    },
    {
      titleEn: "Environmental Action & Biodiversity",
      titleBn: "পরিবেশ রক্ষা ও জীববৈচিত্র্য সংরক্ষণ",
      descEn:
        "Empowering local citizens to act on climate change, tree plantations, and water body conservations.",
      descBn:
        "জলবায়ু পরিবর্তন, বৃক্ষরোপণ এবং জলাশয় সংরক্ষণে কাজ করতে স্থানীয় নাগরিকদের ক্ষমতায়ন করা।",
      bgFrom: "#052E16",
      bgTo: "#0F3460",
      accent: "#4ADE80",
      accentBg: "rgba(74,222,128,0.18)",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const slide = slides[currentSlide]

  return (
    <section
      className="relative w-full overflow-hidden flex items-center"
      style={{ minHeight: "620px" }}
    >
      {/* ── Animated Background ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${slide.bgFrom} 0%, ${slide.bgTo} 100%)`,
          }}
        />
      </AnimatePresence>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px), linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Bottom fade to page */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)",
        }}
      />

      {/* ── Main Content ── */}
      <div
        className="relative z-10 w-full"
        style={{ padding: "80px 0 80px" }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 2rem",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ y: 28, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.55 }}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                maxWidth: "720px",
              }}
            >
              {/* ── Badge ── */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: slide.accentBg,
                    border: `1px solid ${slide.accent}`,
                  }}
                >
                  <FlaskConical
                    size={15}
                    style={{ color: slide.accent }}
                  />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: slide.accent,
                  }}
                >
                  {t("Purulia Branch Movement", "পুরুলিয়া শাখা আন্দোলন")}
                </span>
              </div>

              {/* ── Heading ── */}
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                  fontWeight: 800,
                  lineHeight: 1.15,
                  color: "#FFFFFF",
                  letterSpacing: "-0.01em",
                  textShadow: "0 2px 20px rgba(0,0,0,0.45)",
                }}
              >
                {t(slide.titleEn, slide.titleBn)}
              </h1>

              {/* ── Description ── */}
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(0.95rem, 1.8vw, 1.15rem)",
                  color: "rgba(255,255,255,0.82)",
                  lineHeight: 1.75,
                  maxWidth: "560px",
                }}
              >
                {t(slide.descEn, slide.descBn)}
              </p>

              {/* ── Buttons ── */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1rem",
                  marginTop: "0.5rem",
                }}
              >
                {/* Primary CTA */}
                <Link href="/join-us">
                  <button
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "0.85rem 2.2rem",
                      borderRadius: "9999px",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      border: "none",
                      background:
                        "linear-gradient(135deg, #2563EB 0%, #0EA5E9 100%)",
                      color: "#FFFFFF",
                      boxShadow:
                        "0 4px 24px rgba(37,99,235,0.45), 0 1px 4px rgba(0,0,0,0.2)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      letterSpacing: "0.01em",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)"
                      e.currentTarget.style.boxShadow =
                        "0 8px 32px rgba(37,99,235,0.55), 0 2px 8px rgba(0,0,0,0.25)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow =
                        "0 4px 24px rgba(37,99,235,0.45), 0 1px 4px rgba(0,0,0,0.2)"
                    }}
                  >
                    {t("Join Us", "যোগদান করুন")}
                    <ArrowRight size={18} />
                  </button>
                </Link>

                {/* Secondary CTA — always visible */}
                <Link href="/activities">
                  <button
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "0.85rem 2.2rem",
                      borderRadius: "9999px",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      cursor: "pointer",
                      background: "rgba(255,255,255,0.12)",
                      color: "#FFFFFF",
                      border: "2px solid rgba(255,255,255,0.55)",
                      backdropFilter: "blur(8px)",
                      transition:
                        "background 0.2s ease, border-color 0.2s ease, transform 0.2s ease",
                      letterSpacing: "0.01em",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.22)"
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.85)"
                      e.currentTarget.style.transform = "translateY(-2px)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.12)"
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.55)"
                      e.currentTarget.style.transform = "translateY(0)"
                    }}
                  >
                    {t("Explore Activities", "কর্মসূচি দেখুন")}
                  </button>
                </Link>
              </div>

              {/* ── Trust Indicators ── */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  marginTop: "0.25rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {[
                  { value: "40", label: t("Years Active", "বছর সক্রিয়") },
                  {
                    value: "500+",
                    label: t("Members", "সদস্য"),
                  },
                  {
                    value: "1000+",
                    label: t("Camps & Events", "শিবির ও ইভেন্ট"),
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{ display: "flex", alignItems: "baseline", gap: "6px" }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "1.35rem",
                        color: slide.accent,
                        lineHeight: 1,
                      }}
                    >
                      {stat.value}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.65)",
                        fontWeight: 500,
                      }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Prev / Next Controls ── */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        style={{
          position: "absolute",
          left: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(0,0,0,0.6)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(0,0,0,0.35)")
        }
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        style={{
          position: "absolute",
          right: "16px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 20,
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
          border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(0,0,0,0.6)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "rgba(0,0,0,0.35)")
        }
      >
        <ChevronRight size={22} />
      </button>

      {/* ── Slide Dot Indicators ── */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 20,
        }}
      >
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Slide ${idx + 1}`}
            style={{
              height: "8px",
              width: currentSlide === idx ? "32px" : "8px",
              borderRadius: "9999px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.35s ease",
              background:
                currentSlide === idx
                  ? slides[currentSlide].accent
                  : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </section>
  )
}
export default HeroBanner
