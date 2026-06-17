"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { ArrowRight, UserPlus } from "lucide-react"

export const JoinCTA = () => {
  const { t } = useLanguage()

  return (
    <section
      style={{
        padding: "4rem 3rem",
        borderRadius: "24px",
        background: "linear-gradient(135deg, #0B3D91 0%, #0D9488 60%, #065F46 100%)",
        color: "#ffffff",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(11,61,145,0.25)",
        textAlign: "center",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(to right,rgba(255,255,255,0.05) 1px,transparent 1px), linear-gradient(to bottom,rgba(255,255,255,0.05) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow orb */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          background: "rgba(45,212,191,0.15)",
          pointerEvents: "none",
          filter: "blur(40px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "640px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        {/* Icon badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.25)",
          }}
        >
          <UserPlus size={24} color="#ffffff" />
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          {t(
            "Ready to Make a Difference in Society?",
            "বিজ্ঞানের আন্দোলনে সামিল হতে চান?"
          )}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.82)",
            lineHeight: 1.75,
            maxWidth: "520px",
          }}
        >
          {t(
            "Join hands with Paschim Banga Vigyan Mancha, Purulia Branch. Whether you are a student, teacher, doctor, or a science enthusiast — your contribution matters.",
            "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া জেলা শাখার সাথে যুক্ত হন। আপনি ছাত্র, শিক্ষক, চিকিৎসক বা বিজ্ঞানপ্রেমী যাই হোন — আপনার অবদান গুরুত্বপূর্ণ।"
          )}
        </p>

        {/* Button */}
        <Link href="/join-us">
          <button
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "1rem 2.5rem",
              borderRadius: "9999px",
              fontFamily: "var(--font-heading)",
              fontWeight: 800,
              fontSize: "1rem",
              cursor: "pointer",
              background: "#ffffff",
              color: "#0B3D91",
              border: "none",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              letterSpacing: "0.01em",
              marginTop: "0.5rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)"
              e.currentTarget.style.boxShadow = "0 14px 40px rgba(0,0,0,0.3)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.2)"
            }}
          >
            {t("Apply for Membership", "সদস্যপদের জন্য আবেদন করুন")}
            <ArrowRight size={20} color="#0B3D91" />
          </button>
        </Link>
      </div>
    </section>
  )
}
export default JoinCTA
