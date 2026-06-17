"use client"

import React from "react"
import HeroBanner from "@/components/home/HeroBanner"
import AboutPreview from "@/components/home/AboutPreview"
import ActivitiesGrid from "@/components/home/ActivitiesGrid"
import NotificationsFeed from "@/components/home/NotificationsFeed"
import EventsFeed from "@/components/home/EventsFeed"
import PhotoHighlights from "@/components/home/PhotoHighlights"
import JoinCTA from "@/components/home/JoinCTA"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Chunk 2: Hero Slider */}
      <HeroBanner />

      {/* Main Feeds Block: Dual columns on desktop */}
      <section className="py-16 bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Main Content: Events and Photo Highlights */}
            <div className="lg:col-span-3 flex flex-col gap-16">
              {/* Chunk 3: Events Grid */}
              <EventsFeed />

              {/* Chunk 3: Gallery Highlights */}
              <PhotoHighlights />
            </div>

            {/* Right Sidebar: Latest Announcements */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                {/* Chunk 3: Notifications */}
                <NotificationsFeed />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Chunk 2: About Overview */}
      <AboutPreview />

      {/* Chunk 2: Activities Grid Dashboard */}
      <ActivitiesGrid />

      {/* Chunk 3: Membership CTA Callout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <JoinCTA />
      </div>

    </div>
  )
}
