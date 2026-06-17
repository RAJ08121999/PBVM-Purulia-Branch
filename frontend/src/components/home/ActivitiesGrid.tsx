"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { ACTIVITY_META } from "@/lib/utils"

export const ActivitiesGrid = () => {
  const { language, t } = useLanguage()

  const activityTeasers: Record<string, { descEn: string; descBn: string }> = {
    "environment-biodiversity": {
      descEn: "Plantation drives, wetland protection, and biodiversity registration campaigns in Purulia.",
      descBn: "পুরুলিয়ার বৃক্ষরোপণ অভিযান, জলাভূমি রক্ষা এবং জীববৈচিত্র্য নিবন্ধন কর্মসূচী।",
    },
    health: {
      descEn: "Promoting public health awareness, blood donation drives, and medical checkup camps.",
      descBn: "জনস্বাস্থ্য সচেতনতা, রক্তদান শিবির এবং প্রাথমিক স্বাস্থ্য পরীক্ষা শিবিরের আয়োজন।",
    },
    agriculture: {
      descEn: "Assisting farmers with soil testing, eco-friendly farming, and pesticide awareness.",
      descBn: "মাটি পরীক্ষা, পরিবেশ-বান্ধব চাষবাস ও কীটনাশক সচেতনতায় কৃষকদের সহায়তা।",
    },
    "childrens-science": {
      descEn: "Organizing science talent search exams, science congresses, and rational education programs.",
      descBn: "বিজ্ঞান প্রতিভা সন্ধান পরীক্ষা, শিশু বিজ্ঞান কংগ্রেস ও যুক্তিভিত্তিক শিক্ষা কর্মসূচির আয়োজন।",
    },
    "jatha-cultural": {
      descEn: "Anti-superstition street theatre, cultural assemblies, and educational jatha (marches).",
      descBn: "কুসংস্কারবিরোধী পথনাটক, সাংস্কৃতিক সমাবেশ এবং শিক্ষামূলক বিজ্ঞান যাত্রা।",
    },
    "technology-application": {
      descEn: "Promoting low-cost housing models, clay stove designs, and daily technology utility lessons.",
      descBn: "স্বল্পমূল্যের আবাসন মডেল, উন্নত উনান তৈরি ও দৈনন্দিন প্রযুক্তি ব্যবহারের শিক্ষা।",
    },
    "st-application-centre": {
      descEn: "Training rural youth in vocational skills, computer literacy, and cottage industry operations.",
      descBn: "গ্রামীণ যুবকদের বৃত্তিমূলক দক্ষতা, কম্পিউটার শিক্ষা ও কুটির শিল্পে প্রশিক্ষণ।",
    },
    "hands-on-experiments": {
      descEn: "Demonstrating physics, chemistry, and biology experiments to government school students.",
      descBn: "সরকারি স্কুলের শিক্ষার্থীদের সামনে বিজ্ঞানের রোমাঞ্চকর পরীক্ষা প্রদর্শন।",
    },
    samata: {
      descEn: "Empowering women through scientific understanding, self-help groups, and health awareness.",
      descBn: "বিজ্ঞানসম্মত দৃষ্টিভঙ্গি ও স্বাস্থ্য সচেতনতার মাধ্যমে গ্রামীণ নারীদের আত্মনির্ভরশীলতা বৃদ্ধি।",
    },
    skywatching: {
      descEn: "Telescope observation camps, solar eclipse awareness, and astronomy lessons under dark skies.",
      descBn: "টেলিস্কোপ দিয়ে আকাশ পর্যবেক্ষণ, সূর্যগ্রহণ সচেতনতা ও নক্ষত্র চেনার শিক্ষামূলক শিবির।",
    },
  }

  return (
    <section
      style={{
        width: "100%",
        padding: "5rem 0",
        background: "#ffffff",
        borderTop: "1px solid #f1f5f9",
      }}
    >
      <div className="page-container">
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1rem",
            marginBottom: "3.5rem",
            maxWidth: "640px",
            margin: "0 auto 3.5rem auto",
          }}
        >
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
            {t("Core Domains", "কর্মক্ষেত্র")}
          </span>
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
            {t("Our Areas of Activity", "আমাদের মূল কর্মসূচি ও কার্যক্রমসমূহ")}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1rem",
              color: "#64748B",
              lineHeight: 1.75,
              maxWidth: "560px",
            }}
          >
            {t(
              "We coordinate 10 key scientific and social activities designed to engage communities, schools, and farmers throughout Purulia District.",
              "আমরা পুরুলিয়া জেলা জুড়ে সমাজ, স্কুল এবং কৃষকদের জড়িত করতে ১০টি মূল বিজ্ঞান ও সামাজিক কার্যক্রম পরিচালনা করি।"
            )}
          </p>
        </div>

        {/* Activities Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {Object.entries(ACTIVITY_META).map(([slug, meta]) => {
            const teaser = activityTeasers[slug] || { descEn: "", descBn: "" }
            return (
              <div
                key={slug}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "1.5rem",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  background: "#FAFAFA",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"
                  e.currentTarget.style.background = "#ffffff"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)"
                  e.currentTarget.style.background = "#FAFAFA"
                }}
              >
                {/* Top accent bar */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: meta.color,
                    borderRadius: "16px 16px 0 0",
                  }}
                />

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {/* Icon */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      fontSize: "1.5rem",
                      background: `${meta.color}18`,
                      color: meta.color,
                      transition: "transform 0.2s",
                    }}
                  >
                    {meta.icon}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#0F172A",
                      lineHeight: 1.35,
                    }}
                  >
                    {language === "bn" ? meta.titleBn : meta.titleEn}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: "#64748B",
                      lineHeight: 1.65,
                    }}
                  >
                    {language === "bn" ? teaser.descBn : teaser.descEn}
                  </p>
                </div>

                {/* Link */}
                <div style={{ marginTop: "1.25rem" }}>
                  <Link href={`/activities/${slug}`}>
                    <span
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: meta.color,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        textDecoration: "none",
                      }}
                    >
                      {t("View Details", "বিস্তারিত দেখুন")} →
                    </span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All CTA */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "3rem",
          }}
        >
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
                background: "transparent",
                color: "#0B3D91",
                border: "2px solid #0B3D91",
                transition: "all 0.2s ease",
                letterSpacing: "0.01em",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0B3D91"
                e.currentTarget.style.color = "#ffffff"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
                e.currentTarget.style.color = "#0B3D91"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              {t("Explore All Activities", "সকল কর্মসূচি দেখুন")}
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
export default ActivitiesGrid
