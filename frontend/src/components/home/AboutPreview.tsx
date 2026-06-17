"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { Award, Users, BookOpen, Star, ArrowRight } from "lucide-react"

export const AboutPreview = () => {
  const { t } = useLanguage()

  const stats = [
    {
      icon: <Award size={24} style={{ color: "#F97316" }} />,
      value: "40",
      labelEn: "Years of Service",
      labelBn: "বছরের সেবা ও আন্দোলন",
      bg: "rgba(249,115,22,0.1)",
    },
    {
      icon: <Users size={24} style={{ color: "#2DD4BF" }} />,
      value: "500+",
      labelEn: "Active Members",
      labelBn: "সক্রিয় সদস্য",
      bg: "rgba(45,212,191,0.1)",
    },
    {
      icon: <BookOpen size={24} style={{ color: "#3B82F6" }} />,
      value: "10+",
      labelEn: "Scientific Sectors",
      labelBn: "বিজ্ঞান ভিত্তিক খাত",
      bg: "rgba(59,130,246,0.1)",
    },
    {
      icon: <Star size={24} style={{ color: "#EAB308" }} />,
      value: "1000+",
      labelEn: "Camps & Seminars",
      labelBn: "শিবির ও সেমিনার",
      bg: "rgba(234,179,8,0.1)",
    },
  ]

  return (
    <section
      style={{
        width: "100%",
        padding: "5rem 0",
        background: "#F8FAFC",
        borderTop: "1px solid #e2e8f0",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div className="page-container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3.5rem",
            alignItems: "center",
          }}
          className="about-preview-grid"
        >
          {/* Left Column: Text */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {/* Label */}
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0D9488",
              }}
            >
              {t("Who We Are", "আমরা কে")}
            </span>

            {/* Heading */}
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
              }}
            >
              {t(
                "Spreading Scientific Temperament Across Purulia",
                "পুরুলিয়া জুড়ে বিজ্ঞান চেতনার জাগরণে আমরা"
              )}
            </h2>

            {/* Accent line */}
            <div
              style={{
                width: "64px",
                height: "4px",
                borderRadius: "9999px",
                background: "linear-gradient(90deg, #0B3D91, #00897B)",
              }}
            />

            {/* Body text */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "#475569",
                lineHeight: 1.8,
              }}
            >
              {t(
                "Paschim Banga Vigyan Mancha (PBVM), Purulia District Branch, is a non-governmental people's science organization. We work tirelessly to propagate scientific logic, eradicate deep-rooted superstitions, and protect local biodiversity.",
                "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া জেলা শাখা, একটি অলাভজনক গণ-বিজ্ঞান সংগঠন। আমরা বিজ্ঞানভিত্তিক দৃষ্টিভঙ্গি প্রচার করতে, সমাজ থেকে কুসংস্কার দূর করতে এবং স্থানীয় জীববৈচিত্র্য রক্ষা করতে অক্লান্ত পরিশ্রম করি।"
              )}
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "#475569",
                lineHeight: 1.8,
              }}
            >
              {t(
                "From health camps and astronomy workshops to hands-on experiment classes in schools, our programs are designed to serve students, teachers, and local citizens of Purulia.",
                "স্বাস্থ্য শিবির ও জ্যোতির্বিজ্ঞান কর্মশালা থেকে শুরু করে স্কুলে হাতে-কলমে বিজ্ঞানের পরীক্ষা পর্যন্ত, আমাদের কর্মসূচি পুরুলিয়ার ছাত্র, শিক্ষক ও সাধারণ মানুষের সেবায় নিবেদিত।"
              )}
            </p>

            {/* CTA Button */}
            <div style={{ marginTop: "0.5rem" }}>
              <Link href="/about">
                <button
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "0.85rem 2rem",
                    borderRadius: "9999px",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    border: "none",
                    background: "linear-gradient(135deg, #0B3D91 0%, #00897B 100%)",
                    color: "#ffffff",
                    boxShadow: "0 4px 20px rgba(11,61,145,0.3)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    letterSpacing: "0.01em",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 8px 28px rgba(11,61,145,0.4)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(11,61,145,0.3)"
                  }}
                >
                  {t("Learn More About Us", "আমাদের সম্পর্কে আরও জানুন")}
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Stats Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
            }}
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)"
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: stat.bg,
                  }}
                >
                  {stat.icon}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#0B3D91",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "#64748B",
                    lineHeight: 1.4,
                  }}
                >
                  {t(stat.labelEn, stat.labelBn)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
export default AboutPreview
