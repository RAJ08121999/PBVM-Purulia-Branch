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
        },
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
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">

      {/* Activity Header Banner */}
      <section
        className="relative w-full pt-20 pb-40 lg:pb-56 text-white overflow-hidden flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${meta.color}, ${meta.color}dd)`,
        }}
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] rounded-full bg-black/10 blur-3xl" />

        <div className="relative w-full max-w-7xl px-6 lg:px-8 z-10 flex flex-col lg:flex-row gap-12 items-center justify-between mx-auto">
          {/* Left: Text Content */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:w-2/3">
            <Link href="/activities" className="flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white transition-all group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full w-fit mb-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t("Back to Activities", "সকল কর্মসূচিতে ফিরে যান")}
            </Link>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] drop-shadow-sm">
              {language === "bn" ? meta.titleBn : meta.titleEn}
            </h1>

            <p className="font-body text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed font-medium max-w-2xl drop-shadow-sm">
              {language === "bn" ? data.introBn : data.introEn}
            </p>
          </div>

          {/* Right: Big Icon (Desktop Only) */}
          <div className="hidden lg:flex lg:w-1/3 justify-center lg:justify-end pr-0 lg:pr-8">
            <div className="h-56 w-56 xl:h-64 xl:w-64 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-[6px] border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.2)] relative transform hover:scale-105 transition-transform duration-500">
              <span className="text-8xl xl:text-9xl drop-shadow-2xl z-10">{meta.icon}</span>
              <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-[ping_3s_ease-in-out_infinite] opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content: Objectives & Stats */}
      <section className="relative -mt-24 lg:-mt-36 px-4 sm:px-6 lg:px-8 z-20 w-full flex justify-center mb-16">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* Objectives Container */}
          <div
            className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center items-center text-center gap-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-solid border-zinc-300 dark:border-zinc-700 rounded-3xl p-8 lg:p-12 shadow-2xl shadow-black/5 dark:shadow-black/40 transition-transform duration-300 hover:shadow-3xl"
            style={{ marginTop: "1rem" }}
          >
            <h2 className="font-heading text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-6 flex flex-col items-center justify-center gap-4 w-full">
              <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-2xl text-teal-600 shadow-inner">
                <CheckCircle className="h-8 w-8" />
              </div>
              {t("Core Objectives", "মূল লক্ষ্য ও উদ্দেশ্যসমূহ")}
            </h2>
            <ul className="flex flex-col gap-6 font-body text-base lg:text-lg text-zinc-700 dark:text-zinc-300 w-full" style={{ paddingLeft: "1rem" }}>
              {data.objectives.map((obj, i) => (
                <li key={i} className="flex flex-row gap-5 items-start text-left group">
                  <span className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-400 font-black text-base shrink-0 shadow-sm group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed font-medium pt-2">{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Impact Stats Container */}
          <div
            className="lg:col-span-5 xl:col-span-4 flex flex-col justify-center items-center text-center gap-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-solid border-zinc-300 dark:border-zinc-700 rounded-3xl p-8 lg:p-10 shadow-2xl shadow-black/5 dark:shadow-black/40"
            style={{ marginTop: "1rem" }}
          >
            <h3 className="font-heading text-xl lg:text-2xl font-black text-zinc-900 dark:text-white flex flex-col items-center justify-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6 w-full">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 shadow-inner">
                <BarChart3 className="h-7 w-7" />
              </div>
              {t("Impact in Purulia", "পুরুলিয়ায় আমাদের প্রভাব")}
            </h3>
            <div className="flex flex-col items-center gap-8 w-full">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center w-full border-b border-zinc-100 dark:border-zinc-800/80 pb-6 last:border-b-0 last:pb-0 group">
                  <span className="font-heading text-4xl lg:text-5xl xl:text-6xl font-black text-zinc-900 dark:text-white tracking-tight group-hover:scale-105 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all origin-center">
                    {stat.value}
                  </span>
                  <span className="font-body text-sm xl:text-base font-bold text-zinc-500 dark:text-zinc-400 mt-2 uppercase tracking-wider text-center">
                    {t(stat.labelEn, stat.labelBn)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Reports Section */}
      <section className="w-full flex justify-center pb-48 pt-8">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-8">
          <div className="flex flex-col gap-16 items-center">

            {/* Centered Header */}
            <div className="flex flex-col items-center justify-center gap-4 w-full" style={{ marginTop: "2rem" }}>
              <div className="p-3 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 shadow-sm shrink-0 w-fit">
                <Clock className="h-8 w-8" />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="font-heading text-3xl lg:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
                  {t("Recent Activity Reports", "সাম্প্রতিক কাজের বিবরণী")}
                </h2>
                <div className="h-1.5 w-24 bg-teal-500 rounded-full"></div>
              </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full" style={{ marginBottom: "2rem" }}>
              {data.reports.map((rep, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-zinc-900 border border-solid border-zinc-300 dark:border-zinc-700 rounded-3xl p-10 lg:p-14 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center gap-8 group md:col-span-1 data-[single=true]:md:col-span-2 data-[single=true]:max-w-3xl data-[single=true]:mx-auto"
                  data-single={data.reports.length === 1}
                >
                  <div className="flex flex-col items-center gap-5 border-b border-zinc-100 dark:border-zinc-800 pb-6 w-full">
                    <span className="font-body text-xs lg:text-sm font-bold text-teal-700 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400 px-5 py-2.5 rounded-full border border-teal-100 dark:border-teal-800/50 w-fit mx-auto shadow-sm">
                      {rep.date}
                    </span>
                    <h3 className="font-heading text-xl lg:text-2xl xl:text-3xl font-black text-zinc-900 dark:text-white group-hover:text-teal-600 transition-colors leading-tight">
                      {t(rep.titleEn, rep.titleBn)}
                    </h3>
                  </div>
                  <p className="font-body text-base lg:text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium max-w-2xl mx-auto">
                    {t(rep.contentEn, rep.contentBn)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

