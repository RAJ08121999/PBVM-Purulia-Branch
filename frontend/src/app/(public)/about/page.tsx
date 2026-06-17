"use client"

import React from "react"
import { useLanguage } from "@/context/LanguageContext"
import {
  Compass,
  Target,
  Trees,
  HeartPulse,
  GraduationCap,
  Ban,
  Microscope,
  Languages,
  Scale,
  Activity,
  Lightbulb,
} from "lucide-react"

export default function AboutPage() {
  const { t } = useLanguage()

  const objectives = [
    {
      icon: <Trees size={22} color="#10B981" />,
      iconBg: "rgba(16,185,129,0.12)",
      titleEn: "Environmental Awareness & Conservation",
      titleBn: "পরিবেশ সচেতনতা ও সংরক্ষণ",
      descEn: "Promoting forestation, protecting wetlands, and building local awareness to counter climate change.",
      descBn: "বনায়ন বাড়ানো, জলাভূমি রক্ষা করা এবং জলবায়ু পরিবর্তনের বিরুদ্ধে স্থানীয় সচেতনতা তৈরি করা।",
    },
    {
      icon: <HeartPulse size={22} color="#EF4444" />,
      iconBg: "rgba(239,68,68,0.12)",
      titleEn: "Public Health Campaigns",
      titleBn: "জনস্বাস্থ্য আন্দোলন",
      descEn: "Organizing health checkup camps, safe drinking water campaigns, and nutrition education.",
      descBn: "বিনামূল্যে স্বাস্থ্য শিবির, বিশুদ্ধ পানীয় জল ব্যবহার ও পুষ্টি সংক্রান্ত শিক্ষা প্রচার করা।",
    },
    {
      icon: <GraduationCap size={22} color="#3B82F6" />,
      iconBg: "rgba(59,130,246,0.12)",
      titleEn: "Science Education Popularization",
      titleBn: "বিজ্ঞান শিক্ষার প্রসার ও সরলীকরণ",
      descEn: "Conducting science search exams and congresses to develop curiosity in school kids.",
      descBn: "স্কুল পড়ুয়াদের মধ্যে অনুসন্ধিৎসা বাড়াতে বিজ্ঞান পরীক্ষা ও বিজ্ঞান কংগ্রেসের আয়োজন করা।",
    },
    {
      icon: <Ban size={22} color="#F97316" />,
      iconBg: "rgba(249,115,22,0.12)",
      titleEn: "Anti-Superstition Movements",
      titleBn: "কুসংস্কার ও অপবিজ্ঞানের বিরুদ্ধে সংগ্রাম",
      descEn: "Eradicating deep-rooted superstitions and rationalizing logic through public street theatres.",
      descBn: "পথনাটক ও জাদুর পিছনের বিজ্ঞান দেখিয়ে কুসংস্কার দূরীকরণ ও যুক্তিবাদী সমাজ গড়া।",
    },
    {
      icon: <Microscope size={22} color="#8B5CF6" />,
      iconBg: "rgba(139,92,246,0.12)",
      titleEn: "Scientific Research Promotion",
      titleBn: "বিজ্ঞান গবেষণার অগ্রগতি",
      descEn: "Encouraging scientific inquiries and resource mapping of Purulia's environmental resources.",
      descBn: "পুরুলিয়ার স্থানীয় প্রাকৃতিক সম্পদ ও পরিবেশ নিয়ে বৈজ্ঞানিক অনুসন্ধান উৎসাহিত করা।",
    },
    {
      icon: <Languages size={22} color="#0D9488" />,
      iconBg: "rgba(13,148,136,0.12)",
      titleEn: "Mother-Tongue Science Education",
      titleBn: "মাতৃভাষায় বিজ্ঞান শিক্ষা",
      descEn: "Publishing books, pamphlets, and folders in Bengali to make science accessible for all.",
      descBn: "মাতৃভাষা বাংলায় সহজপাঠ্য বিজ্ঞান বই ও পত্রিকা প্রকাশ করে বিজ্ঞানকে সহজলভ্য করা।",
    },
    {
      icon: <Scale size={22} color="#64748B" />,
      iconBg: "rgba(100,116,139,0.12)",
      titleEn: "People's Science Policy Advocacy",
      titleBn: "জনমুখী বিজ্ঞান নীতি সমর্থন",
      descEn: "Reviewing government development programs to ensure they support local environment and citizens.",
      descBn: "সরকারি বিভিন্ন উন্নয়ন প্রকল্পের পর্যালোচনা করা যাতে তা জনমুখী ও পরিবেশ-বান্ধব হয়।",
    },
    {
      icon: <Activity size={22} color="#EC4899" />,
      iconBg: "rgba(236,72,153,0.12)",
      titleEn: "Peaceful Application of Science",
      titleBn: "শান্তির উদ্দেশ্যে বিজ্ঞানের ব্যবহার",
      descEn: "Advocating for the utilization of scientific resources for human welfare and global peace.",
      descBn: "মানবকল্যাণ এবং বিশ্বশান্তি বজায় রাখতে বৈজ্ঞানিক সম্পদের গঠনমূলক ব্যবহার সুনিশ্চিত করা।",
    },
    {
      icon: <Lightbulb size={22} color="#EAB308" />,
      iconBg: "rgba(234,179,8,0.12)",
      titleEn: "Self-Reliance & Local Technology",
      titleBn: "স্বনির্ভরতা ও স্থানীয় প্রযুক্তি",
      descEn: "Supporting rural artisans with simple technology applications and cottage training setups.",
      descBn: "সহজ প্রযুক্তি প্রয়োগের মাধ্যমে গ্রামীণ শিল্পী ও যুবকদের বৃত্তিমূলক স্বনির্ভরতা বাড়ানো।",
    },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8FAFC" }}>

      {/* ── Page Banner ── */}
      <section
        style={{
          width: "100%",
          padding: "6rem 0 5rem",
          background: "linear-gradient(135deg, #0B1F4A 0%, #0B3D91 50%, #0A3D32 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px), linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        <div className="page-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.35rem 1.2rem",
              borderRadius: "9999px",
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              fontFamily: "var(--font-body)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2DD4BF",
              marginBottom: "1.25rem",
            }}
          >
            {t("About Us", "আমাদের সম্পর্কে")}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              marginBottom: "1.25rem",
            }}
          >
            {t("About PBVM Purulia", "আমাদের সম্পর্কে")}
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              color: "rgba(255,255,255,0.78)",
              lineHeight: 1.75,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {t(
              "Learn about the history, mission, vision, and core scientific objectives guiding Paschim Banga Vigyan Mancha, Purulia District Branch.",
              "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া জেলা শাখার ইতিহাস, লক্ষ্য, দৃষ্টিভঙ্গি এবং মূল উদ্দেশ্যসমূহ সম্পর্কে বিস্তারিত জানুন।"
            )}
          </p>
        </div>
      </section>

      {/* ── Origin & History ── */}
      <section style={{ width: "100%", padding: "5rem 0", background: "#ffffff" }}>
        <div className="page-container">
          <div
            style={{
              display: "grid",
              gap: "3.5rem",
              alignItems: "center",
            }}
            className="about-preview-grid"
          >
            {/* Story Text */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                  fontWeight: 800,
                  color: "#0F172A",
                  lineHeight: 1.3,
                  paddingBottom: "0.75rem",
                  borderBottom: "3px solid #0D9488",
                  display: "inline-block",
                }}
              >
                {t("Our Story & Origin", "আমাদের ইতিহাস ও সূচনা")}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#475569", lineHeight: 1.8 }}>
                  {t(
                    "Paschim Banga Vigyan Mancha (PBVM) was established in 1986 as the premier people's science organization in West Bengal. It was founded with the dream of creating a rational, progressive society by spreading scientific consciousness and logical reasoning among the masses.",
                    "১৯৮৬ সালে পশ্চিমবঙ্গে বিজ্ঞান সচেতনতা ও যুক্তিবাদী দৃষ্টিভঙ্গির প্রসার ঘটিয়ে একটি প্রগতিশীল সমাজ গঠনের স্বপ্ন নিয়ে পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ (PBVM) প্রতিষ্ঠিত হয়।"
                  )}
                </p>
                <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "#475569", lineHeight: 1.8 }}>
                  {t(
                    "The Purulia District Branch was set up to bring this movement to the grassroot level. Over the decades, our branch has actively mobilized teachers, students, social workers, doctors, and farmers to lead efforts in local afforestation, blood donation awareness, and anti-superstition campaigns in remote villages.",
                    "পুরুলিয়া জেলা শাখা এই আন্দোলনকে জেলার প্রতিটি প্রান্তে পৌঁছে দেওয়ার উদ্দেশ্যে গঠিত হয়। আমাদের শাখা কয়েক দশক ধরে শিক্ষক, ছাত্র, সমাজকর্মী, চিকিৎসক ও কৃষকদের একত্রিত করেছে।"
                  )}
                </p>
              </div>
            </div>

            {/* Logo */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: "220px",
                  height: "220px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 16px 48px rgba(11,61,145,0.14)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2rem",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <img
                  src="/logo.png"
                  alt="Official PBVM Logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "0.75rem",
              marginBottom: "3rem",
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
              {t("Our Purpose", "আমাদের উদ্দেশ্য")}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.25,
              }}
            >
              {t("Mission & Vision", "লক্ষ্য ও দৃষ্টিভঙ্গি")}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
              maxWidth: "860px",
              margin: "0 auto",
            }}
          >
            {/* Mission */}
            {[
              {
                Icon: Compass,
                color: "#0D9488",
                bg: "rgba(13,148,136,0.1)",
                titleEn: "Our Mission",
                titleBn: "আমাদের লক্ষ্য",
                descEn:
                  "To popularize science in daily life, build analytical capability, and advocate for human-centric science policies that secure local ecology and public health.",
                descBn:
                  "দৈনন্দিন জীবনে বিজ্ঞানকে জনপ্রিয় করা, মানুষের বিশ্লেষণাত্মক ক্ষমতা বাড়ানো এবং জনস্বার্থ ও পরিবেশ রক্ষা করে এমন মানুষমুখী বিজ্ঞান নীতির পক্ষে সওয়াল করা।",
              },
              {
                Icon: Target,
                color: "#2563EB",
                bg: "rgba(37,99,235,0.1)",
                titleEn: "Our Vision",
                titleBn: "আমাদের দৃষ্টিভঙ্গি",
                descEn:
                  "A rational, just, and self-reliant society where scientific knowledge is utilized solely for peace, environmental harmony, and the well-being of all individuals.",
                descBn:
                  "একটি যুক্তিবাদী, ন্যায়পরায়ণ এবং স্বনির্ভর সমাজ গঠন যেখানে বৈজ্ঞানিক জ্ঞান শুধুমাত্র শান্তি, পরিবেশের ভারসাম্য রক্ষা এবং মানুষের সামগ্রিক কল্যাণের জন্য ব্যবহৃত হবে।",
              },
            ].map((card) => (
              <div
                key={card.titleEn}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "1.25rem",
                  padding: "2.5rem 2rem",
                  borderRadius: "20px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    background: card.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <card.Icon size={28} color={card.color} />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "#0F172A",
                  }}
                >
                  {t(card.titleEn, card.titleBn)}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.92rem",
                    color: "#64748B",
                    lineHeight: 1.75,
                  }}
                >
                  {t(card.descEn, card.descBn)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Objectives ── */}
      <section style={{ width: "100%", padding: "5rem 0", background: "#ffffff" }}>
        <div className="page-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "0.75rem",
              marginBottom: "3rem",
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
              {t("Our Goals", "আমাদের উদ্দেশ্য")}
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
                fontWeight: 800,
                color: "#0F172A",
                lineHeight: 1.25,
              }}
            >
              {t("Core Organizational Objectives", "সংগঠনের মূল উদ্দেশ্যসমূহ")}
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {objectives.map((obj, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "1rem",
                  padding: "2rem 1.5rem",
                  borderRadius: "16px",
                  background: "#FAFAFA",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)"
                  e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,0.08)"
                  e.currentTarget.style.background = "#ffffff"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)"
                  e.currentTarget.style.background = "#FAFAFA"
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: obj.iconBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {obj.icon}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      color: "#0F172A",
                      lineHeight: 1.35,
                    }}
                  >
                    {t(obj.titleEn, obj.titleBn)}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      color: "#64748B",
                      lineHeight: 1.7,
                    }}
                  >
                    {t(obj.descEn, obj.descBn)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
