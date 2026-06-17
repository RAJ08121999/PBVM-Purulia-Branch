"use client"

import React from "react"
import HeroBanner from "@/components/home/HeroBanner"
import AboutPreview from "@/components/home/AboutPreview"
import ActivitiesGrid from "@/components/home/ActivitiesGrid"
import NotificationsFeed from "@/components/home/NotificationsFeed"
import EventsFeed from "@/components/home/EventsFeed"
import PhotoHighlights from "@/components/home/PhotoHighlights"
import JoinCTA from "@/components/home/JoinCTA"

const sectionStyle: React.CSSProperties = {
  width: "100%",
  padding: "5rem 0",
}

const containerStyle: React.CSSProperties = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0 2rem",
  width: "100%",
}

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Hero Slider */}
      <HeroBanner />

      {/* Main Feeds Block: Events + Gallery + Sidebar */}
      <section style={{ ...sectionStyle, background: "#ffffff" }}>
        <div style={containerStyle}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(1, 1fr)",
              gap: "3rem",
            }}
            className="home-main-grid"
          >
            {/* Left Main Content */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4rem" }}
              className="home-main-content"
            >
              <EventsFeed />
              <PhotoHighlights />
            </div>

            {/* Right Sidebar */}
            <div className="home-sidebar">
              <div style={{ position: "sticky", top: "80px" }}>
                <NotificationsFeed />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Overview */}
      <AboutPreview />

      {/* Activities Grid */}
      <ActivitiesGrid />

      {/* Membership CTA */}
      <section style={{ ...sectionStyle, background: "#f8fafc" }}>
        <div style={containerStyle}>
          <JoinCTA />
        </div>
      </section>
    </div>
  )
}
