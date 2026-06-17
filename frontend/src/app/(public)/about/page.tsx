"use client"

import React from "react"
import { useLanguage } from "@/context/LanguageContext"
import {
  Compass,
  Target,
  Sparkles,
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

  // 9 core objectives defined in SRS
  const objectives = [
    {
      icon: <Trees className="h-6 w-6 text-emerald-500" />,
      titleEn: "Environmental Awareness & Conservation",
      titleBn: "পরিবেশ সচেতনতা ও সংরক্ষণ",
      descEn: "Promoting forestation, protecting wetlands, and building local awareness to counter climate change.",
      descBn: "বনায়ন বাড়ানো, জলাভূমি রক্ষা করা এবং জলবায়ু পরিবর্তনের বিরুদ্ধে স্থানীয় সচেতনতা তৈরি করা।",
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-red-500" />,
      titleEn: "Public Health Campaigns",
      titleBn: "জনস্বাস্থ্য আন্দোলন",
      descEn: "Organizing health checkup camps, safe drinking water campaigns, and nutrition education.",
      descBn: "বিনামূল্যে স্বাস্থ্য শিবির, বিশুদ্ধ পানীয় জল ব্যবহার ও পুষ্টি সংক্রান্ত শিক্ষা প্রচার করা।",
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-blue-500" />,
      titleEn: "Science Education Popularization",
      titleBn: "বিজ্ঞান শিক্ষার প্রসার ও সরলীকরণ",
      descEn: "Conducting science search exams and congresses to develop curiosity in school kids.",
      descBn: "স্কুল পড়ুয়াদের মধ্যে অনুসন্ধিৎসা বাড়াতে বিজ্ঞান পরীক্ষা ও বিজ্ঞান কংগ্রেসের আয়োজন করা।",
    },
    {
      icon: <Ban className="h-6 w-6 text-orange-500" />,
      titleEn: "Anti-Superstition Movements",
      titleBn: "কুসংস্কার ও অপবিজ্ঞানের বিরুদ্ধে সংগ্রাম",
      descEn: "Eradicating deep-rooted superstitions and rationalizing logic through public street theatres.",
      descBn: "পথনাটক ও জাদুর পিছনের বিজ্ঞান দেখিয়ে কুসংস্কার দূরীকরণ ও যুক্তিবাদী সমাজ গড়া।",
    },
    {
      icon: <Microscope className="h-6 w-6 text-indigo-500" />,
      titleEn: "Scientific Research Promotion",
      titleBn: "বিজ্ঞান গবেষণার অগ্রগতি",
      descEn: "Encouraging scientific inquiries and resource mapping of Purulia's environmental resources.",
      descBn: "পুরুলিয়ার স্থানীয় প্রাকৃতিক সম্পদ ও পরিবেশ নিয়ে বৈজ্ঞানিক অনুসন্ধান উৎসাহিত করা।",
    },
    {
      icon: <Languages className="h-6 w-6 text-teal-500" />,
      titleEn: "Mother-Tongue Science Education",
      titleBn: "মাতৃভাষায় বিজ্ঞান শিক্ষা",
      descEn: "Publishing books, pamphlets, and folders in Bengali to make science accessible for all.",
      descBn: "মাতৃভাষা বাংলায় সহজপাঠ্য বিজ্ঞান বই ও পত্রিকা প্রকাশ করে বিজ্ঞানকে সহজলভ্য করা।",
    },
    {
      icon: <Scale className="h-6 w-6 text-slate-500" />,
      titleEn: "People's Science Policy Advocacy",
      titleBn: "জনমুখী বিজ্ঞান নীতি সমর্থন",
      descEn: "Reviewing government development programs to ensure they support local environment and citizens.",
      descBn: "সরকারি বিভিন্ন উন্নয়ন প্রকল্পের পর্যালোচনা করা যাতে তা জনমুখী ও পরিবেশ-বান্ধব হয়।",
    },
    {
      icon: <Activity className="h-6 w-6 text-pink-500" />,
      titleEn: "Peaceful Application of Science",
      titleBn: "শান্তির উদ্দেশ্যে বিজ্ঞানের ব্যবহার",
      descEn: "Advocating for the utilization of scientific resources for human welfare and global peace.",
      descBn: "মানবকল্যাণ এবং বিশ্বশান্তি বজায় রাখতে বৈজ্ঞানিক সম্পদের গঠনমূলক ব্যবহার সুনিশ্চিত করা।",
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
      titleEn: "Self-Reliance & Local Technology",
      titleBn: "স্বনির্ভরতা ও স্থানীয় প্রযুক্তি",
      descEn: "Supporting rural artisans with simple technology applications and cottage training setups.",
      descBn: "সহজ প্রযুক্তি প্রয়োগের মাধ্যমে গ্রামীণ শিল্পী ও যুবকদের বৃত্তিমূলক স্বনির্ভরতা বাড়ানো।",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      
      {/* Header Banner */}
      <section className="relative w-full py-24 bg-gradient-to-r from-blue-900 to-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-4 z-10">
          <h1 className="font-heading text-4xl sm:text-5xl font-black tracking-tight">
            {t("About PBVM Purulia", "আমাদের সম্পর্কে")}
          </h1>
          <p className="font-body text-sm sm:text-base text-zinc-350 max-w-2xl mx-auto leading-relaxed">
            {t(
              "Learn about the history, mission, vision, and core scientific objectives guiding Paschim Banga Vigyan Mancha, Purulia District Branch.",
              "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া জেলা শাখার ইতিহাস, লক্ষ্য, দৃষ্টিভঙ্গি এবং মূল উদ্দেশ্যসমূহ সম্পর্কে বিস্তারিত জানুন।"
            )}
          </p>
        </div>
      </section>

      {/* Origin & History Section */}
      <section className="py-20 bg-white dark:bg-zinc-950/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Text */}
            <div className="lg:col-span-8 flex flex-col gap-6 text-center lg:text-left">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white border-b-2 border-teal-500 pb-3 w-fit mx-auto lg:mx-0">
                {t("Our Story & Origin", "আমাদের ইতিহাস ও সূচনা")}
              </h2>
              <div className="font-body text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed flex flex-col gap-4">
                <p>
                  {t(
                    "Paschim Banga Vigyan Mancha (PBVM) was established in 1986 as the premier people's science organization in West Bengal. It was founded with the dream of creating a rational, progressive society by spreading scientific consciousness and logical reasoning among the masses.",
                    "১৯৮৬ সালে পশ্চিমবঙ্গে বিজ্ঞান সচেতনতা ও যুক্তিবাদী দৃষ্টিভঙ্গির প্রসার ঘটিয়ে একটি প্রগতিশীল সমাজ গঠনের স্বপ্ন নিয়ে পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ (PBVM) প্রতিষ্ঠিত হয়। এটি রাজ্যের বৃহত্তম গণ-বিজ্ঞান সংগঠন হিসেবে পরিচিত।"
                  )}
                </p>
                <p>
                  {t(
                    "The Purulia District Branch was set up to bring this movement to the grassroot level of Purulia. The district presents unique geographic and economic challenges. Over the decades, our branch has actively mobilized teachers, students, social workers, doctors, and farmers. We lead efforts in local afforestation, coordinate blood donation awareness, and run anti-superstition campaigns in remote villages.",
                    "পুরুলিয়া জেলা শাখা এই আন্দোলনকে জেলার প্রতিটি প্রান্তে পৌঁছে দেওয়ার উদ্দেশ্যে গঠিত হয়। পুরুলিয়া জেলার ভৌগোলিক ও অর্থনৈতিক বৈচিত্র্যের কথা মাথায় রেখে, আমাদের শাখা কয়েক দশক ধরে শিক্ষক, ছাত্র, সমাজকর্মী, চিকিৎসক ও কৃষকদের একত্রিত করেছে। আমরা স্থানীয় বনায়ন, রক্তদানে উৎসাহ প্রদান এবং প্রত্যন্ত গ্রামগুলিতে ডাইনি বা ডাইনি শিকার প্রথার মতো সামাজিক কুসংস্কার ও কুপ্রথার বিরুদ্ধে লাগাতার প্রচার চালিয়ে আসছি।"
                  )}
                </p>
              </div>
            </div>

            {/* Official Logo Frame */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="p-8 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl flex items-center justify-center max-w-[250px] w-full aspect-square hover:scale-105 transition-transform duration-300">
                <img
                  src="/logo.png"
                  alt="Official PBVM Logo"
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 bg-zinc-50 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            
            {/* Mission Card */}
            <div className="p-8 rounded-2xl bg-white border border-zinc-150/40 dark:bg-zinc-950/40 dark:border-zinc-900/80 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 dark:bg-teal-950/20 dark:text-teal-400 shadow-sm">
                <Compass className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-white">
                {t("Our Mission", "আমাদের লক্ষ্য")}
              </h3>
              <p className="font-body text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
                {t(
                  "To popularize science in daily life, build analytical capability, and advocate for human-centric science policies that secure local ecology and public health.",
                  "দৈনন্দিন জীবনে বিজ্ঞানকে জনপ্রিয় করা, মানুষের বিশ্লেষণাত্মক ক্ষমতা বাড়ানো এবং জনস্বার্থ ও পরিবেশ রক্ষা করে এমন মানুষমুখী বিজ্ঞান ও প্রযুক্তি নীতির পক্ষে সওয়াল করা।"
                )}
              </p>
            </div>

            {/* Vision Card */}
            <div className="p-8 rounded-2xl bg-white border border-zinc-150/40 dark:bg-zinc-950/40 dark:border-zinc-900/80 shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 shadow-sm">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-900 dark:text-white">
                {t("Our Vision", "আমাদের দৃষ্টিভঙ্গি")}
              </h3>
              <p className="font-body text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm">
                {t(
                  "A rational, just, and self-reliant society where scientific knowledge is utilized solely for peace, environmental harmony, and the well-being of all individuals.",
                  "একটি যুক্তিবাদী, ন্যায়পরায়ণ এবং স্বনির্ভর সমাজ গঠন যেখানে বৈজ্ঞানিক জ্ঞান শুধুমাত্র শান্তি, পরিবেশের ভারসাম্য রক্ষা এবং মানুষের সামগ্রিক কল্যাণের জন্য ব্যবহৃত হবে।"
                )}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-white dark:bg-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col items-center text-center gap-4 mb-16 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 dark:text-teal-400">
              {t("Our Goals", "আমাদের উদ্দেশ্য")}
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-zinc-900 dark:text-white">
              {t("Core Organizational Objectives", "সংগঠনের মূল উদ্দেশ্যসমূহ")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {objectives.map((obj, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-50 hover:bg-white border border-zinc-100 hover:border-zinc-200/80 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/20 dark:border-zinc-900 dark:hover:border-zinc-800 transition-all hover:shadow-md duration-300 gap-4"
              >
                <div className="p-3 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm shrink-0 flex items-center justify-center">
                  {obj.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-sm font-black text-zinc-900 dark:text-white leading-tight">
                    {t(obj.titleEn, obj.titleBn)}
                  </h3>
                  <p className="font-body text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[240px] mx-auto">
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
