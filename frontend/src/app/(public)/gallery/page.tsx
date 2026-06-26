"use client"

import React, { useState , useEffect } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { GALLERY_CATEGORIES } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { Image as ImageIcon, ZoomIn } from "lucide-react"
import { publicApi } from "@/lib/api";
import Image from "next/image"

interface GalleryItem {
  _id: string;
  fileUrl: string;
  category: typeof GALLERY_CATEGORIES[number];
  caption?: {
    en: string;
    bn: string;
  };
}

export default function GalleryPage() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1)

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await publicApi.getGallery();
        setGalleryItems(res.data.images);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      }
    };
  
    fetchGallery();
  }, []);

  // Filter items
  const filteredItems = activeCategory === "All"
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory)

  // Slides for yet-another-react-lightbox
  // Since we are using beautiful colored visual placeholders, we'll render custom content in the slides,
  // or define fallback colored slide placeholders.
  // The slides array expects object with `src` or custom nodes. We will generate nice mock color canvas URLs
  const slides = filteredItems.map((item) => ({
    src: item.fileUrl,
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8FAFC" }}>
      
      {/* Header Banner */}
      <section
        style={{
          width: "100%",
          padding: "5rem 0 4rem",
          background: "linear-gradient(135deg, #0B1F4A 0%, #0B3D91 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="page-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", lineHeight: 1.2 }}>
            {t("Activity Photo Gallery", "কর্মসূচির চিত্র গ্যালারি")}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.78)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
            {t(
              "Browse through the memories and pictures of our science camps, public seminars, and environmental drives in Purulia.",
              "পুরুলিয়া জেলায় আমাদের বিজ্ঞান শিবির, সাধারণ সেমিনার এবং পরিবেশ সচেতনতা কর্মসূচির বিভিন্ন ছবি ও স্মৃতি দেখুন।"
            )}
          </p>
        </div>
      </section>

      {/* Filter Options */}
      <section style={{ width: "100%", padding: "1.5rem 0", background: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: "64px", zIndex: 20 }}>
        <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", overflowX: "auto" }}>
          <div style={{ display: "flex", flexWrap: "nowrap", alignItems: "center", justifyContent: "center", gap: "0.65rem", padding: "0.25rem 0", minWidth: "max-content", margin: "0 auto" }}>
            
            {/* "All" Filter Button */}
            <Button
              variant={activeCategory === "All" ? "default" : "outline"}
              onClick={() => setActiveCategory("All")}
              style={{
                borderRadius: "9999px",
                padding: "0.5rem 1.25rem",
                fontSize: "0.85rem",
                fontWeight: 700,
                height: "auto",
                cursor: "pointer",
                boxSizing: "border-box",
                whiteSpace: "nowrap",
              }}
              className="font-body"
            >
              {t("All Categories", "সব ছবি")}
            </Button>

            {/* Sub-Category Buttons */}
            {GALLERY_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                onClick={() => setActiveCategory(cat)}
                style={{
                  borderRadius: "9999px",
                  padding: "0.5rem 1.25rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  height: "auto",
                  cursor: "pointer",
                  boxSizing: "border-box",
                  whiteSpace: "nowrap",
                }}
                className="font-body"
              >
                {t(cat, cat === "Science Camps" ? "বিজ্ঞান শিবির" : cat === "Exhibitions" ? "বিজ্ঞান প্রদর্শনী" : cat === "Awareness Campaigns" ? "সচেতনতা প্রচার" : cat === "Skywatching" ? "আকাশ পর্যবেক্ষণ" : cat === "Environmental Activities" ? "পরিবেশ কর্মসূচি" : "কর্মশালা")}
              </Button>
            ))}

          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={{ width: "100%", padding: "3.5rem 0" }}>
        <div className="page-container">
          
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <ImageIcon className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="font-body text-sm text-zinc-500 dark:text-zinc-400">
                {t("No images found in this category.", "এই বিভাগে কোনো ছবি খুঁজে পাওয়া যায়নি।")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item, idx) => (
                <div
                  key={item._id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative flex flex-col justify-end aspect-4/3 rounded-2xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer border border-zinc-100 dark:border-zinc-900"
                >
                  <Image
                    src={item.fileUrl}
                    alt={t(item.caption?.en || "Gallery Image", item.caption?.bn || "গ্যালারির ছবি")}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />                                    
                  {/* Hover icon */}
                  <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm flex items-center justify-center text-white">
                    <ZoomIn className="h-4.5 w-4.5" />
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Content details */}
                  <div className="relative flex flex-col text-white z-10" style={{ padding: "1.25rem 1.75rem", gap: "0.375rem" }}>
                    <span className="font-body text-xxs font-black uppercase tracking-widest text-teal-400">
                      {t(item.category, item.category === "Science Camps" ? "বিজ্ঞান শিবির" : item.category === "Exhibitions" ? "বিজ্ঞান প্রদর্শনী" : item.category === "Awareness Campaigns" ? "সচেতনতা প্রচার" : item.category === "Skywatching" ? "আকাশ পর্যবেক্ষণ" : item.category === "Environmental Activities" ? "পরিবেশ কর্মসূচি" : "কর্মশালা")}
                    </span>
                    <h3 className="font-heading text-sm sm:text-base font-extrabold leading-snug">
                      {t(item.caption?.en || "", item.caption?.bn || "")}
                    </h3>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Lightbox Trigger */}
      {lightboxIndex >= 0 && (
        <Lightbox
          index={lightboxIndex}
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          slides={slides}
        />
      )}

    </div>
  )
}
