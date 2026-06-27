"use client"

import React, { useEffect, useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { PUBLICATION_CATEGORIES } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Download, BookOpen } from "lucide-react"
import { publicApi } from "@/lib/api"
import { toast } from "sonner"
import Image from "next/image";

interface Publication {
  _id: string;
  title: {
    en: string;
    bn: string;
  };
  category: string;
  description?: {
    en: string;
    bn: string;
  };
  author?: string;
  publishDate: string;
  pdfFile: string;
  thumbnailImage?: string;
}

export default function PublicationsPage() {
  const { language, t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
  
        const res = await publicApi.getPublications({
          limit: 100,
        });
  
        if (res.data.success) {
          setPublications(res.data.publications ?? []);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load publications");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPublications();
  }, []);

  if (loading) {
    return (
        <div className="page-container py-20 text-center">
            Loading publications...
        </div>
    );
}

  // Filter & Search Logic
  const filteredPublications = publications.filter((pub) => {
    const title = language === "bn" ? pub.title.bn : pub.title.en;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || pub.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(
      language === "bn" ? "bn-BD" : "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8FAFC" }}>

      {/* Header Banner */}
      <section
        style={{
          width: "100%",
          padding: "5rem 0 4rem",
          background: "linear-gradient(135deg, #0B1F4A 0%, #0B3D91 60%, #0A3D32 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="page-container" style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", lineHeight: 1.2 }}>
            {t("Publications Library", "বিজ্ঞান প্রকাশনা লাইব্রেরি")}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.78)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
            {t(
              "Explore and download our official science booklets, local environment reports, newsletters, and quarterly magazines.",
              "আমাদের প্রকাশিত বিজ্ঞান ভিত্তিক পুস্তিকা, স্থানীয় পরিবেশ রিপোর্ট, বুলেটিন এবং ত্রৈমাসিক পত্রিকাগুলি সংগ্রহ করুন।"
            )}
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section style={{ width: "100%", padding: "1.5rem 0", background: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: "64px", zIndex: 20 }}>
        <div className="page-container" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>

            {/* Search Box */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder={t("Search by title...", "নাম দিয়ে খুঁজুন...")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 rounded-full bg-zinc-50 border-zinc-200 text-sm focus:bg-white dark:bg-zinc-900 dark:border-zinc-800"
              />
            </div>

            {/* Category Dropdown or Filters */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-end">
              <Button
                variant={selectedCategory === "All" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("All")}
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
              >
                {t("All", "সব")}
              </Button>
              {PUBLICATION_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
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
                >
                  {t(cat, cat === "Magazine" ? "পত্রিকা" : cat === "Booklet" ? "পুস্তিকা" : cat === "Report" ? "রিপোর্ট" : cat === "Awareness Material" ? "সচেতনতা লিপি" : "নিউজলেটার")}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section style={{ width: "100%", padding: "3.5rem 0" }}>
        <div className="page-container">
          {filteredPublications.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20">
              <BookOpen className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="font-body text-sm text-zinc-500 dark:text-zinc-400">
                {t("No publications found matching your search.", "কোনো প্রকাশনা খুঁজে পাওয়া যায়নি।")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPublications.map((pub) => (
                <div
                  key={pub._id}
                  className="flex flex-col justify-between rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-md"
                  style={{
                    padding: "0.8rem",
                    margin: "0.5rem",
                  }}
                >
                  <div className="flex flex-col" style={{ gap: "1rem" }}>
                    {pub.thumbnailImage && (
                      <div
                        style={{
                          width: "100%",
                          height: "190px",
                          position: "relative",
                          overflow: "hidden",
                          borderRadius: "12px",
                        }}
                      >
                        <Image
                          src={pub.thumbnailImage}
                          alt={pub.title.en}
                          fill
                          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-900" style={{ paddingBottom: "0.75rem" }}>
                      <span className="font-body text-xxs font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">
                        {t(pub.category, pub.category === "Magazine" ? "পত্রিকা" : pub.category === "Booklet" ? "পুস্তিকা" : pub.category === "Report" ? "রিপোর্ট" : pub.category === "Awareness Material" ? "সচেতনতা লিপি" : "নিউজলেটার")}
                      </span>
                      <span className="font-body text-xs text-zinc-400 dark:text-zinc-500">
                      {formatDate(pub.publishDate)}
                      </span>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-black text-zinc-900 dark:text-white leading-snug">
                      {t(pub.title.en, pub.title.bn)}
                    </h3>

                    <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {t(
                          pub.description?.en ?? "",
                          pub.description?.bn ?? ""
                      )}
                    </p>
                    <p className="text-xs text-zinc-400 truncate font-medium">
                      {decodeURIComponent(
                        (pub.pdfFile.split("/").pop() ?? "").replace(".pdf", "")
                      )}
                    </p>

                  </div>

                  <div className="border-t border-zinc-50 dark:border-zinc-900/50" style={{ marginTop: "2rem", paddingTop: "1rem" }}>
                    <a href={pub.pdfFile} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2"
                        style={{
                          padding: "0.75rem 1.5rem",
                          height: "auto",
                          cursor: "pointer",
                        }}
                      >
                        <Download className="h-4.5 w-4.5" />
                        {t("Download PDF", "ডাউনলোড করুন")}
                      </Button>
                    </a>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
