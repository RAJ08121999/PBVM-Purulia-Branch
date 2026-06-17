"use client"

import React, { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { POLICY_TAGS } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Calendar, Tag, BookOpen } from "lucide-react"

interface ArticleItem {
  id: string
  titleEn: string
  titleBn: string
  tags: typeof POLICY_TAGS[number][]
  date: string
  summaryEn: string
  summaryBn: string
  bodyEn: string
  bodyBn: string
}

export default function PolicyIssuesPage() {
  const { language, t } = useLanguage()
  const [selectedTag, setSelectedTag] = useState<string>("All")
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null)

  const articles: ArticleItem[] = [
    {
      id: "pol-1",
      titleEn: "Addressing the Severe Water Crisis in Ajodhya Hills",
      titleBn: "অযোধ্যা পাহাড়ের তীব্র জলসংকট নিরসনের উপায়",
      tags: ["Environment", "Climate Change"],
      date: "2026-06-12",
      summaryEn: "A study on how deforestation and shifting monsoons affect the local springs and tribal villages in Purulia.",
      summaryBn: "অযোধ্যা পাহাড়ের বনায়ন হ্রাস এবং বৃষ্টিপাতের খামখেয়ালিপনা কীভাবে স্থানীয় ঝর্ণা ও আদিবাসী গ্রামগুলিতে প্রভাব ফেলছে তার একটি সমীক্ষা রিপোর্ট।",
      bodyEn: "The Ajodhya Hills region in Purulia has seen a consistent drop in water levels in natural springs (jhornas). Deforestation for commercial projects, coupled with irregular monsoon rains driven by global climate change, has forced tribal villagers to walk miles for safe drinking water. We propose immediate construction of community check dams, water-harvesting soil bunds, and banning commercial deep borewells. Scientific forest restoration of native species like Sal and Palash is key to restoring the water table.",
      bodyBn: "পুরুলিয়ার অযোধ্যা পাহাড় অঞ্চলে প্রাকৃতিক ঝর্ণার জলের স্তর ক্রমশ কমছে। বাণিজ্যিক স্বার্থে বন উজাড় এবং বৈশ্বিক জলবায়ু পরিবর্তনের কারণে অনিয়মিত বৃষ্টিপাতের ফলে আদিবাসী মানুষরা পানীয় জলের জন্য চরম কষ্টের সম্মুখীন হচ্ছেন। আমরা অবিলম্বে চেক ড্যাম নির্মাণ, বৃষ্টির জল সংরক্ষণের ব্যবস্থা এবং পাহাড়ি এলাকায় গভীর নলকূপ খনন নিষিদ্ধ করার প্রস্তাব রাখছি। শাল ও পলাশের মতো দেশীয় গাছের বৈজ্ঞানিক বনায়ন মাটির তলার জল ধরে রাখতে অত্যন্ত জরুরি।",
    },
    {
      id: "pol-2",
      titleEn: "Eradicating Witch-Hunting Through Scientific Literacy & Law",
      titleBn: "বিজ্ঞানচেতনা ও আইনের প্রয়োগে ডাইনি প্রথার বিলোপ সাধন",
      tags: ["Anti-superstition Awareness"],
      date: "2026-05-28",
      summaryEn: "Why laws alone cannot prevent witch-hunting unless we improve scientific literacy and village health centers.",
      summaryBn: "কেবলমাত্র আইনের মাধ্যমে ডাইনি প্রথা দূর করা সম্ভব নয়, এর জন্য প্রয়োজন বিজ্ঞান মানসিকতার জাগরণ ও প্রাথমিক স্বাস্থ্য পরিষেবা উন্নয়ন।",
      bodyEn: "Witch-hunting (Daini Protha) is a tragic social evil that persists in some rural pockets of Purulia. Our field studies show that the root cause is double-headed: lack of scientific understanding of common neurological or biological illnesses, and the absence of nearby primary health centers. When a family member falls sick, villagers resort to witch doctors (Ojha). When the treatment fails, the Ojha blames an elderly woman as a 'witch'. We must increase scientific workshops, show magic tricks science in schools, and ensure functional healthcare centers in every village.",
      bodyBn: "ডাইনি প্রথা একটি দুঃখজনক সামাজিক ব্যাধি যা পুরুলিয়ার কিছু গ্রামীণ পকেটে এখনও বিদ্যমান। আমাদের মাঠপর্যায়ের সমীক্ষা বলছে, এর মূল কারণ দ্বিমুখী: সাধারণ রোগ বা মানসিক অসুস্থতার পিছনে থাকা চিকিৎসা বিজ্ঞানের অজ্ঞতা এবং কাছাকাছি প্রাথমিক স্বাস্থ্য কেন্দ্রের অভাব। মানুষ অসুস্থ হলে ওঝার কাছে যান, আর ওঝা নিজের ব্যর্থতা ঢাকতে কোনো বৃদ্ধা বা অসহায় মহিলাকে 'ডাইনি' বলে চিহ্নিত করে। আমাদের গ্রামে গ্রামে বিজ্ঞান কর্মশালা বাড়াতে হবে, স্কুলে জাদুর পিছনে থাকা বিজ্ঞান শেখাতে হবে এবং গ্রামীণ স্বাস্থ্য কেন্দ্রগুলির কার্যকারিতা সুনিশ্চিত করতে হবে।",
    },
    {
      id: "pol-3",
      titleEn: "Mother-Tongue Science Education: Access & Impact",
      titleBn: "মাতৃভাষায় বিজ্ঞান শিক্ষা: সুযোগ ও সামাজিক প্রভাব",
      tags: ["Education"],
      date: "2026-05-02",
      summaryEn: "Analyzing the impact of teaching school science in regional languages like Bengali and Santali in Purulia blocks.",
      summaryBn: "পুরুলিয়ার ব্লকগুলিতে বাংলা ও সাঁওতালির মতো আঞ্চলিক ভাষায় বিজ্ঞান শেখানোর প্রভাব ও উপযোগিতা বিশ্লেষণ।",
      bodyEn: "Teaching science in English or unfamiliar vocabulary creates a cognitive barrier for first-generation learners in rural Purulia. Science is about observing surroundings, and doing this in mother tongues like Bengali or Santali increases engagement. We advocate for simplifying textbook translations, printing low-cost bilingual practical lab guides, and training teachers to use local colloquial examples instead of rigid definitions.",
      bodyBn: "ইংরেজি বা কঠিন পরিভাষার মাধ্যমে বিজ্ঞান শেখানো গ্রামীণ পুরুলিয়ার প্রথম প্রজন্মের শিক্ষার্থীদের মধ্যে একটি ভীতি তৈরি করে। বিজ্ঞান হলো আশপাশ পর্যবেক্ষণ করা, এবং এটি বাংলা বা সাঁওতালির মতো মাতৃভাষায় শিখলে বোঝার গভীরতা বাড়ে। আমরা স্কুলের পাঠ্যপুস্তকের পরিভাষা সহজ করার, কম খরচে দ্বিভাষিক ল্যাব নির্দেশিকা ছাপানোর এবং শিক্ষকদের স্থানীয় উদাহরণ ব্যবহার করে বিজ্ঞান শেখানোর প্রশিক্ষণ দেওয়ার পক্ষে সওয়াল করছি।",
    },
  ]

  // Filter Logic
  const filteredArticles = selectedTag === "All"
    ? articles
    : articles.filter(art => art.tags.includes(selectedTag as any))

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
            {t("Policy Issues & Editorial Articles", "নীতিমালা ও বিজ্ঞান প্রবন্ধ")}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.78)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
            {t(
              "Read research articles, environmental warnings, and scientific viewpoints on water, public health, education, and anti-superstition campaigns in Purulia.",
              "পুরুলিয়ার জলসংকট, জনস্বাস্থ্য, শিক্ষা ব্যবস্থা এবং কুসংস্কার বিরোধী আন্দোলনের উপর আমাদের বিজ্ঞানকর্মী ও গবেষকদের বিভিন্ন প্রবন্ধ পড়ুন।"
            )}
          </p>
        </div>
      </section>

      {/* Topic Tag Filter Bar */}
      <section style={{ width: "100%", padding: "1.5rem 0", background: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: "64px", zIndex: 20 }}>
        <div className="page-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.5rem" }}>
          
          <Button
            variant={selectedTag === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag("All")}
            className="rounded-full font-body font-bold"
          >
            {t("All Topics", "সব বিষয়")}
          </Button>

          {POLICY_TAGS.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className="rounded-full font-body font-bold"
            >
              {t(tag, tag === "Environment" ? "পরিবেশ" : tag === "Public Health" ? "জনস্বাস্থ্য" : tag === "Education" ? "শিক্ষা" : tag === "Science Policy" ? "বিজ্ঞান নীতি" : tag === "Technology Policy" ? "প্রযুক্তি নীতি" : tag === "Climate Change" ? "জলবায়ু পরিবর্তন" : "কুসংস্কার বিরোধী")}
            </Button>
          ))}

        </div>
      </section>

      {/* Articles Grid Listing */}
      <section style={{ width: "100%", padding: "3.5rem 0" }}>
        <div className="page-container" style={{ maxWidth: "800px" }}>
          
          {filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-20 bg-white border border-zinc-100 rounded-3xl dark:bg-black dark:border-zinc-900">
              <FileText className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
              <p className="font-body text-sm text-zinc-500 dark:text-zinc-400">
                {t("No articles found in this category.", "এই বিষয়ে এখনও কোনো প্রবন্ধ প্রকাশ করা হয়নি।")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className="group flex flex-col gap-4 p-6 rounded-2xl bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-black dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-sm cursor-pointer"
                >
                  
                  {/* Article Title & Date */}
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {art.tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-xxs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/20 px-2 py-0.5 rounded-md">
                          <Tag className="h-2.5 w-2.5" />
                          {t(tag, tag === "Environment" ? "পরিবেশ" : tag === "Public Health" ? "জনস্বাস্থ্য" : tag === "Education" ? "শিক্ষা" : tag === "Science Policy" ? "বিজ্ঞান নীতি" : tag === "Technology Policy" ? "প্রযুক্তি নীতি" : tag === "Climate Change" ? "জলবায়ু পরিবর্তন" : "কুসংস্কার বিরোধী")}
                        </span>
                      ))}
                      <span className="flex items-center gap-1 text-xxs font-body text-zinc-400 dark:text-zinc-500 font-semibold uppercase ml-auto">
                        <Calendar className="h-3.5 w-3.5" />
                        {art.date}
                      </span>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-black text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t(art.titleEn, art.titleBn)}
                    </h3>
                  </div>

                  {/* Summary */}
                  <p className="font-body text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                    {t(art.summaryEn, art.summaryBn)}
                  </p>

                  <span className="font-body text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 mt-2">
                    {t("Read Full Article", "সম্পূর্ণ প্রবন্ধটি পড়ুন")} &rarr;
                  </span>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Expandable Article Modal Dialog */}
      <Dialog open={!!activeArticle} onOpenChange={() => setActiveArticle(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-100 dark:border-zinc-900">
          {activeArticle && (
            <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto pr-2">
              
              <DialogHeader className="text-left border-b border-zinc-50 dark:border-zinc-900 pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {activeArticle.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xxs font-black uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md">
                      {t(tag, tag === "Environment" ? "পরিবেশ" : tag === "Public Health" ? "জনস্বাস্থ্য" : tag === "Education" ? "শিক্ষা" : tag === "Science Policy" ? "বিজ্ঞান নীতি" : tag === "Technology Policy" ? "প্রযুক্তি নীতি" : tag === "Climate Change" ? "জলবায়ু পরিবর্তন" : "কুসংস্কার বিরোধী")}
                    </span>
                  ))}
                  <span className="text-xxs text-zinc-400 dark:text-zinc-500 font-semibold uppercase flex items-center gap-1 ml-auto">
                    <Calendar className="h-3 w-3" />
                    {activeArticle.date}
                  </span>
                </div>
                <DialogTitle className="font-heading text-lg sm:text-xl font-black text-zinc-900 dark:text-white leading-tight">
                  {t(activeArticle.titleEn, activeArticle.titleBn)}
                </DialogTitle>
                <DialogDescription className="hidden">
                  Full text for {activeArticle.titleEn}
                </DialogDescription>
              </DialogHeader>

              {/* Article Full Body */}
              <div className="font-body text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-4">
                {t(activeArticle.bodyEn, activeArticle.bodyBn).split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}
