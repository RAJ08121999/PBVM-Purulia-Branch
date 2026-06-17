"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { ACTIVITY_META } from "@/lib/utils"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ActivitiesPage() {
  const { language, t } = useLanguage()

  // Descriptions and targets for all 10 activities
  const activityDetails: Record<string, { descEn: string; descBn: string; objectives: string[] }> = {
    "environment-biodiversity": {
      descEn: "Mobilizing communities to conserve wetlands, plant native trees, monitor regional pollution levels, and compile local people's biodiversity registers (PBR) across Purulia blocks.",
      descBn: "পুরুলিয়া জেলার ব্লকগুলিতে জলাশয় সংরক্ষণ, দেশীয় বৃক্ষ রোপণ, স্থানীয় দূষণ মাত্রা পর্যবেক্ষণ এবং গণ-জীববৈচিত্র্য রেজিস্টার (PBR) সংকলনে স্থানীয় মানুষদের সংগঠিত করা।",
      objectives: [
        "Create People's Biodiversity Registers (PBR) in villages",
        "Lead massive afforestation and water conservation campaigns",
        "Promote plastic-free initiatives in municipal markets",
      ],
    },
    health: {
      descEn: "Spreading consciousness on public health, organizing primary checkup camps in remote villages, blood donation drives, maternal healthcare advice, and countering superstitions around diseases.",
      descBn: "জনস্বাস্থ্য নিয়ে সচেতনতা ছড়ানো, প্রত্যন্ত গ্রামীণ এলাকায় প্রাথমিক স্বাস্থ্য শিবির ও রক্তদান শিবিরের আয়োজন, মাতৃত্বকালীন স্বাস্থ্য পরামর্শ এবং রোগ সংক্রান্ত কুসংস্কারের বিরুদ্ধে প্রতিরোধ গড়ে তোলা।",
      objectives: [
        "Organize local blood donation camps",
        "Promote clean drinking water and sanitation practices",
        "Counter medical myths and superstition-driven treatments",
      ],
    },
    agriculture: {
      descEn: "Supporting smallholders with soil testing guidelines, promoting organic farming, spreading pesticide toxicity awareness, and guiding crop rotation suited for Purulia's arid soil.",
      descBn: "ক্ষুদ্র ও প্রান্তিক কৃষকদের মাটি পরীক্ষার নির্দেশিকা প্রদান, জৈব চাষের প্রচার, রাসায়নিক কীটনাশকের ক্ষতিকর প্রভাব সম্পর্কে সচেতনতা তৈরি এবং পুরুলিয়ার শুষ্ক মাটির উপযোগী ফসল আবর্তনের পরামর্শ দেওয়া।",
      objectives: [
        "Guide farmers in sustainable, low-cost agriculture",
        "Facilitate scientific soil testing workshops",
        "Promote local seed storage and native farming methods",
      ],
    },
    "childrens-science": {
      descEn: "Running the Purulia Science Talent Search Exam, coordinating children's science congresses, school exhibitions, and promoting logic over rot-learning in secondary educational institutions.",
      descBn: "পুরুলিয়া জেলা বিজ্ঞান প্রতিভা সন্ধান পরীক্ষা পরিচালনা, শিশু বিজ্ঞান কংগ্রেসের সমন্বয় সাধন, স্কুল বিজ্ঞান প্রদর্শনীর আয়োজন এবং মাধ্যমিক স্তরের শিক্ষাপ্রতিষ্ঠানগুলিতে মুখস্থ বিদ্যার বদলে যুক্তিভিত্তিক শিক্ষার প্রচার।",
      objectives: [
        "Host the Purulia District Science Talent Search Test",
        "Organize block-level and district-level Science Congresses",
        "Distribute free science kit boxes in village schools",
      ],
    },
    "jatha-cultural": {
      descEn: "Using cultural media, street plays, songs, and science marches (jathas) to expose rational trickery and raise community awareness against social evils like witch-hunting and witch craft.",
      descBn: "সাংস্কৃতিক মাধ্যম, পথনাটক, গান এবং শিক্ষামূলক বিজ্ঞান যাত্রার (জঠা) মাধ্যমে কুসংস্কার বিরোধী প্রচার চালানো এবং ডাইনি শিকার প্রথার মতো সামাজিক ব্যাধিগুলির বিরুদ্ধে রুখে দাঁড়ানো।",
      objectives: [
        "Run mobile rationalism campaigns (Science Jatha)",
        "Perform street plays targeting witch-hunting beliefs",
        "Distribute booklets explaining rationalism and scientific thinking",
      ],
    },
    "technology-application": {
      descEn: "Training villagers to construct low-cost smokeless clay stoves (chulha), eco-sanitation units, and simple everyday equipment designed to reduce labor and carbon footprint.",
      descBn: "গ্রামীণ স্তরে কম খরচে ধোঁয়াহীন উন্নত উনুন, পরিবেশ-বান্ধব স্যানিটেশন ইউনিট এবং পরিশ্রম ও কার্বন নির্গমন কমানোর উদ্দেশ্যে দৈনন্দিন সহজ যন্ত্রপাতি তৈরির প্রশিক্ষণ দেওয়া।",
      objectives: [
        "Train rural artisans in building smokeless chulhas",
        "Introduce low-cost building and waste-management models",
        "Coordinate technological training camps",
      ],
    },
    "st-application-centre": {
      descEn: "Coordinating youth training programs at the science and technology application facility, teaching computing, basic electronics, cottage food operations, and tailors.",
      descBn: "বিজ্ঞান ও প্রযুক্তি প্রয়োগ কেন্দ্রের মাধ্যমে গ্রামীণ যুবকদের বৃত্তিমূলক কাজের প্রশিক্ষণ দেওয়া, যেমন - কম্পিউটার স্বাক্ষরতা, বৈদ্যুতিন সরঞ্জাম মেরামত এবং অন্যান্য স্বনির্ভর কর্মসূচি।",
      objectives: [
        "Provide vocational computing and digital literacy courses",
        "Promote local youth self-employment setups",
        "Support hands-on engineering training camps",
      ],
    },
    "hands-on-experiments": {
      descEn: "Conducting lab experiments classes directly in schools using daily kitchen ingredients, proving complex physics, chemistry, and biology laws to make classroom education exciting.",
      descBn: "দৈনন্দিন রান্নাঘরের উপাদান ব্যবহার করে সরাসরি স্কুলগুলিতে ভৌতবিজ্ঞান, রসায়ন ও জীববিজ্ঞানের জটিল সূত্রগুলি রোমাঞ্চকর উপায়ে পরীক্ষা করে দেখানো।",
      objectives: [
        "Conduct active laboratory classes in village classrooms",
        "Train high-school science teachers in easy experiment kits",
        "Publish booklets for low-cost student experiments",
      ],
    },
    samata: {
      descEn: "Fostering gender parity and women's self-reliance through health and hygiene camps, scientific literacy campaigns, and establishing supportive self-help groups in tribal pockets.",
      descBn: "স্বাস্থ্য ও ঋতুচক্র সচেতনতা শিবিরের আয়োজন, বৈজ্ঞানিক শিক্ষাদান এবং আদিবাসী অধ্যুষিত এলাকায় স্বনির্ভর গোষ্ঠী গড়ে তোলার মাধ্যমে লিঙ্গসাম্য প্রতিষ্ঠা ও নারীর ক্ষমতায়ন।",
      objectives: [
        "Conduct hygiene awareness campaigns for rural girls",
        "Provide scientific literacy to self-help group members",
        "Address maternal nutrition and family planning myths",
      ],
    },
    skywatching: {
      descEn: "Arranging night skywatching telescope camps, solar eclipse projection programs, and astronomy workshops to introduce young minds to cosmos and demystify astrological claims.",
      descBn: "টেলিস্কোপ দিয়ে নৈশ আকাশ পর্যবেক্ষণ শিবির, সূর্যগ্রহণ প্রজেকশন প্রদর্শন এবং জ্যোতির্বিজ্ঞান কর্মশালার আয়োজন করে কিশোর মনে বিশ্বব্রহ্মাণ্ডের বাস্তব ধারণা দেওয়া ও ফলিত জ্যোতিষশাস্ত্রের অপপ্রচার খণ্ডন করা।",
      objectives: [
        "Host telescope skywatching programs in schools and communities",
        "Build solar filters and eclipse observation projections",
        "Demystify astrology and explain cosmos coordinates scientifically",
      ],
    },
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      
      {/* Header Banner */}
      <section className="relative w-full py-20 bg-gradient-to-r from-teal-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col gap-4 z-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight">
            {t("Our Scientific & Social Activities", "আমাদের মূল বৈজ্ঞানিক ও সামাজিক কর্মসূচি")}
          </h1>
          <p className="font-body text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            {t(
              "Explore details about the 10 core domains where PBVM Purulia active volunteers work to make science simple and functional for every citizen.",
              "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ পুরুলিয়া শাখার সক্রিয় স্বেচ্ছাসেবক দল যে ১০টি ক্ষেত্রে দৈনন্দিন জীবনে বিজ্ঞানকে সহজ ও কার্যকরী করতে কাজ করে, তার বিস্তারিত জানুন।"
            )}
          </p>
        </div>
      </section>

      {/* Main List Section */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-12">
            {Object.entries(ACTIVITY_META).map(([slug, meta]) => {
              const details = activityDetails[slug] || { descEn: "", descBn: "", objectives: [] }
              return (
                <Card
                  key={slug}
                  className="group relative overflow-hidden bg-white border border-zinc-100 hover:border-zinc-200 dark:bg-zinc-950/20 dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-md"
                >
                  {/* Color strip accent */}
                  <div
                    className="absolute top-0 left-0 w-3 lg:w-4 h-full"
                    style={{ backgroundColor: meta.color }}
                  />

                  <div className="pl-6 lg:pl-8 pr-6 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                      
                      {/* Left: Icon and Intro */}
                      <div className="lg:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl text-2.5xl shadow-sm shrink-0"
                            style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                          >
                            {meta.icon}
                          </div>
                          <h2 className="font-heading text-xl lg:text-2xl font-black text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {language === "bn" ? meta.titleBn : meta.titleEn}
                          </h2>
                        </div>
                        <p className="font-body text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                          {language === "bn" ? details.descBn : details.descEn}
                        </p>
                      </div>

                      {/* Right: Key Objectives List and Action */}
                      <div className="flex flex-col gap-5 justify-between h-full">
                        <div className="flex flex-col gap-2.5">
                          <h4 className="font-heading text-xs font-bold uppercase tracking-widest text-zinc-400">
                            {t("Key Focus Areas", "মূল ক্ষেত্রসমূহ")}
                          </h4>
                          <ul className="grid gap-1.5 font-body text-xs text-zinc-500 dark:text-zinc-400">
                            {details.objectives.slice(0, 3).map((obj, i) => (
                              <li key={i} className="flex gap-2 items-start">
                                <span className="text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">&bull;</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link href={`/activities/${slug}`}>
                          <Button
                            className="w-full text-white font-bold rounded-lg shadow-sm"
                            style={{ backgroundColor: meta.color }}
                          >
                            {t("Detailed Objectives", "বিস্তারিত উদ্দেশ্য")}
                          </Button>
                        </Link>
                      </div>

                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
