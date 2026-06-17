"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { ACTIVITY_META } from "@/lib/utils"
import { ArrowLeft, CheckCircle, BarChart3, Clock, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default function ActivityDetailPage({ params }: PageProps) {
  const { language, t } = useLanguage()
  const resolvedParams = React.use(params)
  const slug = resolvedParams.slug

  const meta = ACTIVITY_META[slug]

  // Mock data for impact stats and written reports for each of the 10 slugs
  const dataStore: Record<
    string,
    {
      introEn: string
      introBn: string
      objectives: string[]
      stats: { labelEn: string; labelBn: string; value: string }[]
      reports: { titleEn: string; titleBn: string; date: string; contentEn: string; contentBn: string }[]
    }
  > = {
    "environment-biodiversity": {
      introEn: "Protecting the fragile ecosystem of Purulia by involving students and local citizens in conservation.",
      introBn: "শিক্ষার্থী ও স্থানীয় নাগরিকদের বনায়ন ও জলাভূমি সংরক্ষণে যুক্ত করে পুরুলিয়ার ভঙ্গুর পরিবেশ রক্ষা করা।",
      objectives: [
        "Creation of People's Biodiversity Registers (PBR) to document local species flora and fauna.",
        "Wetland protection campaigns, preventing toxic waste dump in Ajodhya Hills water bodies.",
        "Afforestation drives, planting local saplings like Sal, Palash, and Mahua to counter aridity."
      ],
      stats: [
        { labelEn: "Trees Planted", labelBn: "রোপণ করা বৃক্ষ", value: "5,000+" },
        { labelEn: "PBR Registers", labelBn: "জীববৈচিত্র্য রেজিস্টার", value: "12" },
        { labelEn: "Clean-up Drives", labelBn: "পরিচ্ছন্নতা অভিযান", value: "45" }
      ],
      reports: [
        {
          titleEn: "Monsoon Tree Plantation Drive in Balarampur Block",
          titleBn: "বলরামপুর ব্লকে বর্ষাকালীন বৃক্ষরোপণ কর্মসূচি",
          date: "June 2026",
          contentEn: "Planted over 1000 saplings with active help from local schools and forest department.",
          contentBn: "স্থানীয় স্কুল ও বন দপ্তরের সক্রিয় সহায়তায় ১০০০টিরও বেশি চারা রোপণ করা হয়েছে।"
        }
      ]
    },
    health: {
      introEn: "Promoting community health checkups and hygiene camps, focusing on under-served tribal blocks.",
      introBn: "সুবিধাবঞ্চিত আদিবাসী ব্লকগুলিতে মনোযোগ দিয়ে সামগ্রিক স্বাস্থ্য এবং ঋতুচক্র সচেতনতা শিবির পরিচালনা করা।",
      objectives: [
        "Organizing blood donation awareness and managing volunteer donor panels for Purulia Sadar Hospital.",
        "Hygiene education, clean drinking water awareness, and snake-bite management protocols.",
        "Dispelling traditional health myths (witch doctors, exorcists) in remote areas."
      ],
      stats: [
        { labelEn: "Health Camps Held", labelBn: "স্বাস্থ্য শিবির সংখ্যা", value: "65+" },
        { labelEn: "Blood Donors Listed", labelBn: "তালিকাভুক্ত রক্তদাতা", value: "250+" },
        { labelEn: "Seminars Conducted", labelBn: "সেমিনার সংখ্যা", value: "40" }
      ],
      reports: [
        {
          titleEn: "Blood Donation Camp at Purulia Sadar Hospital",
          titleBn: "পুরুলিয়া সদর হাসপাতালে রক্তদান শিবির",
          date: "May 2026",
          contentEn: "Collected 45 units of blood to address seasonal shortage during summer.",
          contentBn: "গ্রীষ্মকালীন তীব্র রক্তের সংকট মেটাতে ৪৫ ইউনিট রক্ত সংগ্রহ করা হয়েছে।"
        }
      ]
    },
    agriculture: {
      introEn: "Supporting sustainable farming methods to empower smallholders in the drought-prone district of Purulia.",
      introBn: "অনাবৃষ্টিপ্রবণ পুরুলিয়া জেলার প্রান্তিক কৃষকদের স্বনির্ভর করতে টেকসই ও বৈজ্ঞানিক চাষবাস পদ্ধতির প্রসার ঘটানো।",
      objectives: [
        "Facilitating low-cost soil testing guides to prevent over-utilization of chemical fertilizers.",
        "Introducing organic composting and eco-friendly vermiculture kits to rural cooperative networks.",
        "Advising on drought-tolerant crops (millets, pulses) that require minimal groundwater."
      ],
      stats: [
        { labelEn: "Soil Tests Completed", labelBn: "মাটি পরীক্ষা সম্পন্ন", value: "300+" },
        { labelEn: "Farmers Trained", labelBn: "প্রশিক্ষিত কৃষক সংখ্যা", value: "1,200+" },
        { labelEn: "Vermi-Kits Distributed", labelBn: "কেঁচো সার কীট বিতরণ", value: "150" }
      ],
      reports: [
        {
          titleEn: "Millet Farming Workshop in Jhalda",
          titleBn: "ঝালদায় জোয়ার-বাজরা চাষের কর্মশালা",
          date: "April 2026",
          contentEn: "Demonstrated modern low-water irrigation and organic methods for high millet yield.",
          contentBn: "অল্প জল সেচ ও জৈব উপায়ে জোয়ার-বাজরার ফলন বৃদ্ধির পদ্ধতি প্রদর্শন করা হয়েছে।"
        }
      ]
    },
    "childrens-science": {
      introEn: "Promoting scientific rationalism and logic in school curriculums to fight blind memorization.",
      introBn: "মুখস্থ বিদ্যার বদ অভ্যাসের বিরুদ্ধে লড়তে স্কুলের পাঠ্যক্রমে যুক্তিবাদ ও বৈজ্ঞানিক চেতনার বিকাশ ঘটানো।",
      objectives: [
        "Conducting the Annual Purulia Science Talent Search Exam across block schools.",
        "Organizing District Science Exhibitions and Children's Science Congress events.",
        "Setting up model science libraries and laboratory modules in secondary schools."
      ],
      stats: [
        { labelEn: "Students Registered", labelBn: "নিবন্ধিত শিক্ষার্থী", value: "15,000+" },
        { labelEn: "Participating Schools", labelBn: "অংশগ্রহণকারী স্কুল", value: "120+" },
        { labelEn: "Awards Distributed", labelBn: "পুরস্কার বিতরণ", value: "500+" }
      ],
      reports: [
        {
          titleEn: "Talent Search Prize Ceremony in Purulia Town",
          titleBn: "পুরুলিয়া শহরে প্রতিভা সন্ধান পুরস্কার বিতরণী",
          date: "March 2026",
          contentEn: "Distributed scholarships and science kits to top performers across block levels.",
          contentBn: "ব্লক স্তরের শীর্ষ পারফর্মারদের মধ্যে স্কলারশিপ এবং সায়েন্স কিট বিতরণ করা হয়েছে।"
        }
      ]
    },
    "jatha-cultural": {
      introEn: "Using theatre and science marches to address harmful superstitions like witch-hunting in rural Purulia.",
      introBn: "গ্রামীণ পুরুলিয়ায় ডাইনি শিকারের মতো কুপ্রথার বিরুদ্ধে পথনাটক ও বিজ্ঞান যাত্রার মাধ্যমে সামাজিক জাগরণ।",
      objectives: [
        "Performing anti-superstition street plays focusing on scientific reasons behind diseases.",
        "Conducting mobile science marches (Jatha) with simple visual science experiment counters.",
        "Publishing booklets addressing local myths (e.g. ghost sightings, black magic)."
      ],
      stats: [
        { labelEn: "Shows Performed", labelBn: "পথনাটক প্রদর্শনী", value: "110+" },
        { labelEn: "Villages Reached", labelBn: "সচেতন করা গ্রাম", value: "85" },
        { labelEn: "Booklets Sold/Given", labelBn: "বইপত্র বিলি", value: "3,500+" }
      ],
      reports: [
        {
          titleEn: "Anti-Superstition Campaign in Bundwan Block",
          titleBn: "বান্দোয়ান ব্লকে কুসংস্কার বিরোধী প্রচার অভিযান",
          date: "May 2026",
          contentEn: "Held street play sessions demonstrating magic trick science and exposing fake godmen.",
          contentBn: "জাদুর পিছনে থাকা বিজ্ঞান প্রদর্শন করে ভুয়ো ওঝা-গুণিনদের ভাঁওতাবাজি ফাঁস করা হয়েছে।"
        }
      ]
    },
    "technology-application": {
      introEn: "Developing and teaching daily technology upgrades to reduce firewood dependency and manual labor.",
      introBn: "জ্বালানি কাঠ ও শারীরিক খাটুনি কমাতে দৈনন্দিন ব্যবহারিক প্রযুক্তিগত আপগ্রেড তৈরি ও শেখানো।",
      objectives: [
        "Training rural communities to construct and repair smokeless clay stoves (chulha).",
        "Introducing eco-friendly sanitation design kits for village households.",
        "Demonstrating solar energy units for water pumps and domestic lighting."
      ],
      stats: [
        { labelEn: "Stoves Constructed", labelBn: "ধোঁয়াহীন উনুন তৈরি", value: "800+" },
        { labelEn: "Artisans Trained", labelBn: "প্রশিক্ষিত কারিগর", value: "140" },
        { labelEn: "Solar Units Pinned", labelBn: "সৌর বিদ্যুৎ ইউনিট স্থাপন", value: "28" }
      ],
      reports: [
        {
          titleEn: "Smokeless Chulha Building Camp in Hura",
          titleBn: "হুড়ায় ধোঁয়াহীন উনুন তৈরির কর্মশালা",
          date: "February 2026",
          contentEn: "Trained 35 rural women to build and sell smokeless fuel-efficient clay stoves.",
          contentBn: "৩৫ জন গ্রামীণ মহিলাকে জ্বালানি সাশ্রয়ী ধোঁয়াহীন উনুন তৈরি ও বিপণনের প্রশিক্ষণ দেওয়া হয়।"
        }
      ]
    },
    "st-application-centre": {
      introEn: "Vocational and digital training center for rural youth to build self-reliance.",
      introBn: "গ্রামীণ যুবকদের স্বনির্ভরতা বাড়াতে বৃত্তিমূলক এবং ডিজিটাল কম্পিউটার দক্ষতা প্রশিক্ষণ কেন্দ্র।",
      objectives: [
        "Running free computer literacy and basic hardware training workshops.",
        "Teaching electronics maintenance, repair of solar lanterns and household units.",
        "Hosting vocational tailoring, food preservation, and cottage operations classes."
      ],
      stats: [
        { labelEn: "Students Graduated", labelBn: "প্রশিক্ষিত ছাত্রছাত্রী", value: "650+" },
        { labelEn: "Placement Support", labelBn: "কর্মসংস্থান সহায়তা", value: "45%" },
        { labelEn: "Cottage Startups", labelBn: "ক্ষুদ্র স্বনির্ভর উদ্যোগ", value: "15" }
      ],
      reports: [
        {
          titleEn: "Computer Literacy Graduation Ceremony",
          titleBn: "কম্পিউটার সাক্ষরতা শংসাপত্র বিতরণ",
          date: "April 2026",
          contentEn: "Awarded certificates to 42 rural students who completed the basic IT training course.",
          contentBn: "বেসিক আইটি প্রশিক্ষণ সম্পন্ন করা ৪২ জন গ্রামীণ ছাত্রছাত্রীর হাতে শংসাপত্র তুলে দেওয়া হয়।"
        }
      ]
    },
    "hands-on-experiments": {
      introEn: "Taking science laboratories directly to secondary schools that lack proper infrastructure.",
      introBn: "প্রয়োজনীয় ল্যাব পরিকাঠামো নেই এমন প্রত্যন্ত অঞ্চলের মাধ্যমিক স্কুলগুলিতে ল্যাবরেটরি নিয়ে যাওয়া।",
      objectives: [
        "Conducting interactive physics and chemistry experiment classes for state board students.",
        "Utilizing everyday items (vinegar, baking soda, magnets) to demonstrate principles.",
        "Developing low-cost laboratory manuals for secondary school teachers."
      ],
      stats: [
        { labelEn: "Schools Visited", labelBn: "পরিদর্শন করা বিদ্যালয়", value: "95+" },
        { labelEn: "Classes Conducted", labelBn: "পরিচালিত ক্লাস সংখ্যা", value: "240" },
        { labelEn: "Teachers Trained", labelBn: "প্রশিক্ষিত শিক্ষক সংখ্যা", value: "120" }
      ],
      reports: [
        {
          titleEn: "Science Lab Camp in Neturia Block Schools",
          titleBn: "নেতুড়িয়া ব্লকের বিদ্যালয়গুলিতে বিজ্ঞান ল্যাব শিবির",
          date: "June 2026",
          contentEn: "Conducted chemical reaction and refraction demonstrations for class 9 students.",
          contentBn: "নবম শ্রেণীর শিক্ষার্থীদের জন্য রাসায়নিক বিক্রিয়া ও আলোর প্রতিসরণের ব্যবহারিক ক্লাস নেওয়া হয়।"
        }
      ]
    },
    samata: {
      introEn: "Empowering women by promoting hygienic practices, reproductive education, and financial networks.",
      introBn: "স্বাস্থ্যবিধি, প্রজনন স্বাস্থ্য সচেতনতা এবং আর্থিক স্বনির্ভরতা বাড়িয়ে নারীদের ক্ষমতায়ন।",
      objectives: [
        "Distributing and spreading awareness about sanitary hygiene and menstrual health management.",
        "Formulating self-help and small vocational micro-credit unions for tribal women.",
        "Conducting seminars on child marriage issues and family planning myths."
      ],
      stats: [
        { labelEn: "Hygiene Kits Given", labelBn: "স্বাস্থ্য কিট বিতরণ", value: "2,000+" },
        { labelEn: "Women Registered", labelBn: "নিবন্ধিত নারী সদস্য", value: "450+" },
        { labelEn: "Literacy Programs", labelBn: "সাক্ষরতা সচেতনতা", value: "32" }
      ],
      reports: [
        {
          titleEn: "Menstrual Health Awareness Camp in Puncha Block",
          titleBn: "পুঞ্চা ব্লকে ঋতুচক্র স্বাস্থ্য সচেতনতা শিবির",
          date: "April 2026",
          contentEn: "Distributed biodegradable sanitary pads and discussed female hygiene with 150 participants.",
          contentBn: "১৫০ জন মহিলার মধ্যে স্বাস্থ্যসম্মত প্যাড বিতরণ ও নারী স্বাস্থ্যবিধি নিয়ে বিশেষ আলোচনা করা হয়।"
        }
      ]
    },
    skywatching: {
      introEn: "Spreading astronomy knowledge and logic to challenge astrology and planetary fate myths.",
      introBn: "জ্যোতির্বিজ্ঞানকে হাতিয়ার করে ফলিত জ্যোতিষ ও কুসংস্কারের অপবিজ্ঞান খণ্ডন করা।",
      objectives: [
        "Organizing open-air telescope viewing events for solar systems and moon craters.",
        "Explaining eclipses and astronomical occurrences to schools during transits.",
        "Challenging blind faith in gemstones and planetary chart predictions."
      ],
      stats: [
        { labelEn: "Sky Camps Organized", labelBn: "আকাশ পর্যবেক্ষণ শিবির", value: "120+" },
        { labelEn: "Telescopes Active", labelBn: "সক্রিয় টেলিস্কোপ", value: "4" },
        { labelEn: "Astro-Quiz Entries", labelBn: "জ্যোতির্বিজ্ঞান কুইজ", value: "800+" }
      ],
      reports: [
        {
          titleEn: "Comet Observation Night Camp in Purulia Town",
          titleBn: "পুরুলিয়া শহরে ধূমকেতু পর্যবেক্ষণ নৈশ শিবির",
          date: "March 2026",
          contentEn: "Over 300 students observed the seasonal comet passing using high-magnification lens telescopes.",
          contentBn: "উচ্চক্ষমতার দূরবীক্ষণ যন্ত্রের সাহায্যে ৩০০টির বেশি ছাত্রছাত্রী নৈশ আকাশে ধূমকেতু প্রত্যক্ষ করেন।"
        }
      ]
    }
  }

  const data = dataStore[slug]

  if (!meta || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="font-heading text-2xl font-black text-zinc-900 dark:text-white">
          {t("Activity Not Found", "কর্মসূচিটি পাওয়া যায়নি")}
        </h2>
        <p className="font-body text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
          {t("The activity slug you are trying to visit does not exist.", "আপনি যে কর্মসূচির পাতাটি দেখার চেষ্টা করছেন তা আমাদের তালিকায় নেই।")}
        </p>
        <Link href="/activities">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full">
            &larr; {t("Back to Activities", "সকল কর্মসূচিতে ফিরে যান")}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      
      {/* Activity Header Banner */}
      <section
        className="relative w-full py-24 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${meta.color}dd, ${meta.color}99), url('/grid-pattern.svg')`,
          backgroundColor: meta.color,
        }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 flex flex-col gap-6">
          <Link href="/activities" className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/80 hover:text-white hover:underline w-fit">
            <ArrowLeft className="h-4 w-4" />
            {t("All Activities", "সকল কর্মসূচি")}
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-5xl">{meta.icon}</span>
            <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight leading-none">
              {language === "bn" ? meta.titleBn : meta.titleEn}
            </h1>
          </div>
          <p className="font-body text-base sm:text-lg text-white/90 max-w-3xl leading-relaxed">
            {language === "bn" ? data.introBn : data.introEn}
          </p>
        </div>
      </section>

      {/* Main Grid: Objectives & Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* Objectives Column (left) */}
            <div className="lg:col-span-2 flex flex-col gap-6 bg-white dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 shadow-sm">
              <h2 className="font-heading text-xl lg:text-2xl font-black text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-900 pb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-teal-600" />
                {t("Core Objectives", "মূল লক্ষ্য ও উদ্দেশ্যসমূহ")}
              </h2>
              <ul className="flex flex-col gap-4 font-body text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                {data.objectives.map((obj, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="h-5 w-5 rounded-full bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center text-teal-600 font-bold text-xs shrink-0 mt-0.5">{i+1}</span>
                    <span className="leading-relaxed">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Impact / Stats Column (right) */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              
              {/* Stats Card */}
              <div className="bg-white dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-900 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
                <h3 className="font-heading text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  {t("Impact in Purulia", "পুরুলিয়ায় আমাদের প্রভাব")}
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {data.stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col border-b border-zinc-50 dark:border-zinc-900/50 pb-4 last:border-b-0 last:pb-0">
                      <span className="font-heading text-3xl font-black text-zinc-900 dark:text-white">
                        {stat.value}
                      </span>
                      <span className="font-body text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-1">
                        {t(stat.labelEn, stat.labelBn)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="py-16 bg-zinc-100/40 dark:bg-zinc-950/10 border-t border-zinc-100 dark:border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-heading text-2xl font-black text-zinc-900 dark:text-white border-b-2 border-teal-500 pb-3 w-fit mb-8 flex items-center gap-2">
            <Clock className="h-5.5 w-5.5 text-teal-600" />
            {t("Recent Activity Reports", "সাম্প্রতিক কাজের বিবরণী")}
          </h2>
          <div className="flex flex-col gap-8">
            {data.reports.map((rep, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-black border border-zinc-100 dark:border-zinc-900 rounded-2xl p-6 shadow-sm flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-50 dark:border-zinc-900/50 pb-3">
                  <h3 className="font-heading text-base sm:text-lg font-black text-zinc-900 dark:text-white">
                    {t(rep.titleEn, rep.titleBn)}
                  </h3>
                  <span className="font-body text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full dark:bg-teal-950/30 dark:text-teal-400">
                    {rep.date}
                  </span>
                </div>
                <p className="font-body text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {t(rep.contentEn, rep.contentBn)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
