"use client"

import React from "react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"
import { ArrowLeft, Calendar, MapPin, Clock, Phone, AlertTriangle, Info, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{ id: string }>
}

interface EventDetail {
  id: string
  titleEn: string
  titleBn: string
  date: string
  time: string
  venueEn: string
  venueBn: string
  descEn: string
  descBn: string
  type: "Upcoming" | "Past"
  agendaEn: string[]
  agendaBn: string[]
  speakerEn: string
  speakerBn: string
  contactEn: string
  contactBn: string
  registrationInfoEn: string
  registrationInfoBn: string
}

export default function EventDetailPage({ params }: PageProps) {
  const { language, t } = useLanguage()
  const resolvedParams = React.use(params)
  const id = resolvedParams.id

  const eventsData: Record<string, EventDetail> = {
    "evt-1": {
      id: "evt-1",
      titleEn: "Hands-on Astronomy Skywatching Camp",
      titleBn: "হাতে-কলমে আকাশ পর্যবেক্ষণ শিবির",
      date: "2026-06-25",
      time: "6:00 PM - 9:00 PM",
      venueEn: "Purulia Zilla School Ground",
      venueBn: "পুরুলিয়া জিলা স্কুল প্রাঙ্গণ",
      descEn: "Observe the rings of Saturn, craters of Moon, and constellations under telescope guidance. This event is open to students and the general public to foster astronomical knowledge and combat astrological superstitions.",
      descBn: "টেলিস্কোপের মাধ্যমে শনির বলয়, চাঁদের গহ্বর এবং বিভিন্ন নক্ষত্রমণ্ডল দেখার ব্যবহারিক শিবির। ছাত্রছাত্রী ও সাধারণ মানুষের জন্য সম্পূর্ণ বিনামূল্যে উন্মুক্ত এই শিবিরের লক্ষ্য বিজ্ঞানমনস্কতা প্রসার ও অপবিজ্ঞান দূর করা।",
      type: "Upcoming",
      agendaEn: [
        "Introduction to astronomical telescopes and how they work",
        "Moon craters and lunar geography observation",
        "Spotting Saturn's rings and Jovian moons (Jupiter)",
        "Q&A session on constellations and stellar evolution"
      ],
      agendaBn: [
        "জ্যোতির্বৈজ্ঞানিক টেলিস্কোপ ও তার কার্যপ্রণালী পরিচিতি",
        "চাঁদের গহ্বর ও চন্দ্রপৃষ্ঠের ফাটল পর্যবেক্ষণ",
        "শনির বলয় ও বৃহস্পতির উপগ্রহসমূহ চিহ্নিতকরণ",
        "নক্ষত্রমণ্ডল ও মহাবিশ্ব সংক্রান্ত প্রশ্নোত্তর পর্ব"
      ],
      speakerEn: "Dr. Amitabha Mukhopadhyay (Astro-physicist) & PBVM Skywatching Cell Volunteers",
      speakerBn: "ডঃ অমিতাভ মুখোপাধ্যায় (জ্যোতির্বিজ্ঞানী) এবং পশ্চিমবঙ্গ বিজ্ঞান মঞ্চের স্বেচ্ছাসেবকবৃন্দ",
      contactEn: "Coordination Office (+91 3252 222413)",
      contactBn: "সমন্বয় শাখা (+৯১ ৩২৫২ ২২২৪১৩)",
      registrationInfoEn: "Free spot entry. Registration starts from 5:30 PM on-site.",
      registrationInfoBn: "সম্পূর্ণ বিনামূল্যে সরাসরি প্রবেশাধিকার। অনুষ্ঠানস্থলে বিকেল ৫:৩০ থেকে নাম নথিভুক্তকরণ শুরু হবে।"
    },
    "evt-2": {
      id: "evt-2",
      titleEn: "Seminars on Scientific Temperament",
      titleBn: "বিজ্ঞান ও যুক্তিবাদী মননশীলতার সেমিনার",
      date: "2026-07-02",
      time: "11:00 AM - 3:00 PM",
      venueEn: "Rabindra Bhaban Auditorium, Purulia",
      venueBn: "রবীন্দ্র ভবন অডিটোরিয়াম, পুরুলিয়া",
      descEn: "Debating science vs superstition with talks by popular rationalists and science authors. We will cover common magic tricks used by fake godmen and explain the biology behind neurological illnesses often misdiagnosed as paranormal.",
      descBn: "কুসংস্কার বনাম বিজ্ঞান বিতর্ক এবং বিজ্ঞান লেখকদের নিয়ে বিশেষ আলোচনা সভা। ভণ্ড ওঝা-গুণিনদের জাদুর পিছনের বিজ্ঞান ব্যাখ্যা এবং অলৌকিক বা ভূত-প্রেত বলে চালানো মানসিক ও স্নায়বিক রোগগুলোর বৈজ্ঞানিক কারণ আলোচনা করা হবে।",
      type: "Upcoming",
      agendaEn: [
        "Debunking local superstitions (witchcraft and daini beliefs)",
        "Exposing 'miracle' tricks using chemical reactions and physics setup",
        "Public health and logic in high-school education panel discussion",
        "Open-house interactive debate with students"
      ],
      agendaBn: [
        "আঞ্চলিক কুসংস্কারের (ডাইনি প্রথা ইত্যাদি) অসারতা উন্মোচন",
        "রাসায়নিক বিক্রিয়া ও ভৌতবিদ্যার কৌশল ব্যবহার করে 'অলৌকিক' ভেলকিবাজি ফাঁস",
        "উচ্চমাধ্যমিক শিক্ষায় জনস্বাস্থ্য ও বিজ্ঞানচেতনার ভূমিকা নিয়ে প্যানেল আলোচনা",
        "শিক্ষার্থীদের সাথে সরাসরি প্রশ্নোত্তর ও উন্মুক্ত বিতর্ক সভা"
      ],
      speakerEn: "Prof. Sumitra Chowdhury (Rationalist Author) & Dr. B. Sen (Psychiatrist)",
      speakerBn: "অধ্যাপিকা সুমিত্রা চৌধুরী (যুক্তিবাদী লেখিকা) এবং ডঃ বি সেন (মনোরোগ বিশেষজ্ঞ)",
      contactEn: "Science Publicity Cell (purulia.pbvm@gmail.com)",
      contactBn: "বিজ্ঞান প্রচার সেল (purulia.pbvm@gmail.com)",
      registrationInfoEn: "Pre-registration recommended. Please send your name via email.",
      registrationInfoBn: "আগে থেকে নাম নথিভুক্তকরণ বাঞ্ছনীয়। অনুগ্রহ করে ইমেলের মাধ্যমে আপনার নাম জানান।"
    },
    "evt-3": {
      id: "evt-3",
      titleEn: "Afforestation & Wetland Protection Campaign",
      titleBn: "বৃক্ষরোপণ ও জলাভূমি সংরক্ষণ প্রচার অভিযান",
      date: "2026-07-10",
      time: "9:00 AM - 1:00 PM",
      venueEn: "Joypur Block Forest Area",
      venueBn: "জয়পুর ব্লক বনভূমি অঞ্চল",
      descEn: "Community plantation drive and awareness program about saving wetlands of Purulia. Local volunteers will collaborate to plant native saplings and clean local water bodies.",
      descBn: "স্থানীয় জলাশয় রক্ষা ও নতুন বৃক্ষরোপণ নিয়ে গণ-সচেতনতামূলক ক্যাম্প ও র‍্যালি। স্থানীয় স্বেচ্ছাসেবকদের সহায়তায় দেশীয় গাছের চারা রোপণ ও জলাশয় পরিচ্ছন্ন করার কাজ করা হবে।",
      type: "Upcoming",
      agendaEn: [
        "Gathering and briefing of volunteers at Joypur Forest Gate",
        "Sapling plantation drive (Sal, Palash, Mahua)",
        "Wetland cleaning and plastic-waste clearing activity",
        "Distribution of environmental awareness booklets to villagers"
      ],
      agendaBn: [
        "জয়পুর ফরেস্ট গেটে স্বেচ্ছাসেবকদের জমায়েত ও নির্দেশিকা প্রদান",
        "দেশীয় গাছের চারা (শাল, পলাশ, মহুয়া) রোপণ অভিযান",
        "জলাভূমি ও জলাশয়ের চারপাশ থেকে প্লাস্টিক বর্জ্য অপসারণ",
        "স্থানীয় গ্রামবাসীদের মধ্যে পরিবেশ সচেতনতামূলক পুস্তিকা বিতরণ"
      ],
      speakerEn: "Sri Kalyan Mahato (District Forest Volunteer Coordinator)",
      speakerBn: "শ্রী কল্যাণ মাহাতো (জেলা বন স্বেচ্ছাসেবক সমন্বয়কারী)",
      contactEn: "Eco-Protection Wing",
      contactBn: "পরিবেশ রক্ষা শাখা",
      registrationInfoEn: "Volunteers receive free plants and certificates. Wear outdoor clothes.",
      registrationInfoBn: "অংশগ্রহণকারী স্বেচ্ছাসেবকদের চারাগাছ ও সার্টিফিকেট দেওয়া হবে। মাঠপর্যায়ের উপযুক্ত পোশাক পরিধান করুন।"
    },
    "evt-4": {
      id: "evt-4",
      titleEn: "Purulia District Science Congress 2026",
      titleBn: "পুরুলিয়া জেলা বিজ্ঞান কংগ্রেস ২০২৬",
      date: "2026-05-15",
      time: "10:00 AM - 5:00 PM",
      venueEn: "District Science Centre, Purulia",
      venueBn: "জেলা বিজ্ঞান কেন্দ্র, পুরুলিয়া",
      descEn: "Annual congregation of student projects, models, and research briefs from block-level schools. This event marked the final selection round for state-level delegates.",
      descBn: "ব্লক স্তরের স্কুলগুলির ছাত্রছাত্রীদের তৈরি বিজ্ঞান মডেল ও গবেষণা প্রস্তাবের বার্ষিক প্রদর্শনী ও আলোচনা সভা। এই ইভেন্টের মাধ্যমে রাজ্য স্তরের বিজ্ঞান কংগ্রেসের জন্য প্রতিনিধি নির্বাচন করা হয়।",
      type: "Past",
      agendaEn: [
        "Inauguration by Senior Scientists from NCL",
        "Exhibition stalls showcasing student-made models",
        "Evaluation rounds by the academic panel",
        "Prize distribution and selection announcement"
      ],
      agendaBn: [
        "এনসিএল (NCL) এর বর্ষীয়ান বিজ্ঞানীদের দ্বারা উদ্বোধন",
        "শিক্ষার্থীদের তৈরি বৈজ্ঞানিক মডেল প্রদর্শনীর স্টলসমূহ",
        "শিক্ষাবিদ প্যানেল দ্বারা মডেলসমূহের মূল্যায়ন পর্ব",
        "পুরস্কার বিতরণী ও রাজ্য স্তরের প্রতিনিধি তালিকা ঘোষণা"
      ],
      speakerEn: "Evaluation Panel chaired by Prof. D. Mukherjee (Science Centre Purulia)",
      speakerBn: "অধ্যাপক ডি মুখার্জি (জেলা বিজ্ঞান কেন্দ্র) এর সভাপতিত্বে বিচারক প্যানেল",
      contactEn: "Children's Science Congress Team",
      contactBn: "শিশু বিজ্ঞান কংগ্রেস টিম",
      registrationInfoEn: "Completed. Selected models were showcased on the state-level platform.",
      registrationInfoBn: "সম্পন্ন হয়েছে। নির্বাচিত প্রজেক্টগুলি রাজ্য স্তরের মঞ্চে উপস্থাপিত হয়েছিল।"
    },
    "evt-5": {
      id: "evt-5",
      titleEn: "Snakebite Awareness and First Aid Workshop",
      titleBn: "সর্পদংশন সচেতনতা ও প্রাথমিক চিকিৎসা কর্মশালা",
      date: "2026-05-20",
      time: "11:30 AM - 2:30 PM",
      venueEn: "Jhalda Community Hall",
      venueBn: "ঝালদা কমিউনিটি হল",
      descEn: "Training sessions on snake identification, myth-busting, and emergency protocols in village blocks. We aimed to reduce fatalities by teaching appropriate immediate first aid and preventing unscientific healing methods.",
      descBn: "গ্রামাঞ্চলের মানুষদের সর্পদংশন প্রতিরোধ, সাপ চেনার বিজ্ঞানসম্মত পদ্ধতি ও জরুরি চিকিৎসা বিষয়ক বিশেষ প্রশিক্ষণ শিবির। ভুল চিকিৎসার কারণে মৃত্যুহার কমানো এবং ওঝা-গুণিনের ঝাড়ফুঁকের কুফল সম্পর্কে মানুষকে সচেতন করাই এর উদ্দেশ্য।",
      type: "Past",
      agendaEn: [
        "Identification of venomous vs non-venomous snakes of Purulia",
        "Myth debunking (movies vs reality, local beliefs)",
        "Demonstration of correct first aid protocol (Splint and Immobilization)",
        "Contact list distribution of closest government hospitals stocking Anti-Snake Venom (ASV)"
      ],
      agendaBn: [
        "পুরুলিয়ার বিষধর বনাম বিষহীন সাপ চেনার কৌশল",
        "চলচ্চিত্রের ভ্রান্ত ধারণা ও লোকবিশ্বাসের অপব্যাখ্যা খণ্ডন",
        "সঠিক প্রাথমিক চিকিৎসা (অঙ্গ স্থির রাখা/ইমমোবিলাইজেশন) প্রদর্শন",
        "অ্যান্টি-স্নেক ভেনম (ASV) উপলব্ধ নিকটবর্তী সরকারি হাসপাতালের তালিকা বিতরণ"
      ],
      speakerEn: "Sri Sandip Mahato (Snake Expert) & District Health Officer",
      speakerBn: "শ্রী সন্দীপ মাহাতো (সর্প গবেষক) এবং জেলা স্বাস্থ্য কর্মকর্তা",
      contactEn: "Health Activists Forum",
      contactBn: "স্বাস্থ্যকর্মী ফোরাম",
      registrationInfoEn: "Completed. Over 150 local community leaders attended.",
      registrationInfoBn: "সম্পন্ন হয়েছে। ১৫০ জনেরও বেশি গ্রামীণ প্রতিনিধি উপস্থিত ছিলেন।"
    },
    "evt-6": {
      id: "evt-6",
      titleEn: "Summer Science Camp for High Schoolers",
      titleBn: "হাইস্কুল পড়ুয়াদের সামার বিজ্ঞান ক্যাম্প",
      date: "2026-06-10",
      time: "10:00 AM - 4:00 PM",
      venueEn: "Students Health Home, Purulia",
      venueBn: "ছাত্র-ছাত্রী স্বাস্থ্য ভবন, পুরুলিয়া",
      descEn: "A 3-day workshop showcasing low-cost hands-on chemistry, physics, and robotics projects. Students conducted experiments themselves to understand core textbook syllabus rules.",
      descBn: "কম খরচে হাতে-কলমে রসায়ন, পদার্থবিদ্যা এবং প্রাথমিক রোবোটিক্স মডেল তৈরির ৩ দিনের বিশেষ কর্মশালা। শিক্ষার্থীরা নিজেরা পরীক্ষা-নিরীক্ষা করে পাঠ্যপুস্তকের তত্ত্বসমূহ সহজ উপায়ে আয়ত্ত করে।",
      type: "Past",
      agendaEn: [
        "Day 1: Everyday Chemistry (pH testing, kitchen chemistry)",
        "Day 2: Fun Physics (electromagnetism, lens optics)",
        "Day 3: Electronics basics and low-cost sensor projects"
      ],
      agendaBn: [
        "দিন ১: রোজকার জীবনে রসায়ন (pH পরীক্ষা, পাকশালা রসায়ন)",
        "দিন ২: মজার ভৌতবিজ্ঞান (তড়িৎ-চুম্বকত্ব, আলো ও লেন্সের খেলা)",
        "দিন ৩: সহজ ইলেকট্রনিক্স ও কম খরচের সেন্সর প্রজেক্ট তৈরি"
      ],
      speakerEn: "PBVM Hands-on Science Committee Trainers",
      speakerBn: "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চের হাতে-কলমে বিজ্ঞান উপ-কমিটির প্রশিক্ষকগণ",
      contactEn: "Hands-on Science Committee",
      contactBn: "হাতে-কলমে বিজ্ঞান কমিটি",
      registrationInfoEn: "Completed. Science experiment kits were distributed to all participants.",
      registrationInfoBn: "সম্পন্ন হয়েছে। সকল অংশগ্রহণকারীকে বিজ্ঞানের ব্যবহারিক পরীক্ষার কিট বক্স দেওয়া হয়েছিল।"
    }
  }

  const evt = eventsData[id]

  if (!evt) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="font-heading text-2xl font-black text-zinc-900 dark:text-white">
          {t("Event Not Found", "ইভেন্টটি পাওয়া যায়নি")}
        </h2>
        <p className="font-body text-sm text-zinc-500 dark:text-zinc-400 mt-2 mb-6">
          {t("The event you are trying to visit does not exist or has been removed.", "আপনি যে ইভেন্টের পাতাটি দেখার চেষ্টা করছেন তা আমাদের তালিকায় নেই।")}
        </p>
        <Link href="/events">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full">
            &larr; {t("Back to Events", "সকল ইভেন্টে ফিরে যান")}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">

      {/* Event Header Banner */}
      <section
        className="relative w-full pt-20 pb-40 lg:pb-56 text-white overflow-hidden flex items-center justify-center"
        style={{
          background: evt.type === "Upcoming"
            ? "linear-gradient(135deg, #0A3D32 0%, #0B3D91 60%, #0D0D2B 100%)"
            : "linear-gradient(135deg, #3F3F46 0%, #18181B 100%)",
        }}
      >
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] rounded-full bg-white/10 blur-3xl" />

        <div className="relative w-full max-w-7xl px-6 lg:px-8 z-10 flex flex-col lg:flex-row gap-12 items-center justify-between mx-auto">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:w-2/3">
            <Link href="/events" className="flex items-center gap-2 text-sm font-bold text-white/90 hover:text-white transition-all group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full w-fit mb-2">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {t("Back to Events", "সকল ইভেন্টে ফিরে যান")}
            </Link>

            <span className="font-body uppercase tracking-widest w-fit"
              style={{
                backgroundColor: evt.type === "Upcoming" ? "#E0F2FE" : "#F4F4F5",
                color: evt.type === "Upcoming" ? "#0369A1" : "#71717A",
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
              {t(evt.type, evt.type === "Upcoming" ? "আসন্ন ইভেন্ট" : "বিগত কর্মসূচি")}
            </span>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] drop-shadow-sm"
              style={{
                color: "#F1F5F9",
              }}
            >
              {language === "bn" ? evt.titleBn : evt.titleEn}
            </h1>
          </div>

          <div className="hidden lg:flex lg:w-1/3 justify-center lg:justify-end pr-0 lg:pr-8">
            <div className="h-56 w-56 xl:h-64 xl:w-64 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-[6px] border-white/30 shadow-[0_0_40px_rgba(0,0,0,0.2)] relative">
              <span className="text-7xl xl:text-8xl z-10">
                {evt.type === "Upcoming" ? "🌟" : "📅"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Grid */}
      <section className="relative -mt-24 lg:-mt-36 px-4 sm:px-6 lg:px-8 z-20 w-full flex justify-center" style={{ marginBottom: "2rem" }}>
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

          {/* Main Info */}
          <div className="lg:col-span-8 flex flex-col justify-center items-center text-center gap-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-solid border-zinc-300 dark:border-zinc-700 rounded-3xl" style={{ padding: "2.5rem", marginTop: "1rem" }}>

            {/* Description */}
            <div className="w-full text-left flex flex-col gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-6">
              <h2 className="font-heading text-xl lg:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-teal-600" />
                {t("Event Description", "কর্মসূচির বিবরণ")}
              </h2>
              <p className="font-body text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                {language === "bn" ? evt.descBn : evt.descEn}
              </p>
            </div>

            {/* Agenda/Focus Points */}
            <div className="w-full text-left flex flex-col gap-4">
              <h2 className="font-heading text-xl lg:text-2xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-teal-600" />
                {t("Key Focus & Agenda", "মূল আলোচ্য বিষয় ও কর্মসূচি")}
              </h2>
              <ul className="flex flex-col gap-4 font-body text-sm sm:text-base text-zinc-700 dark:text-zinc-300 w-full" style={{ paddingLeft: "1rem" }}>
                {(language === "bn" ? evt.agendaBn : evt.agendaEn).map((point, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="text-teal-600 dark:text-teal-400 shrink-0 mt-1 font-black">&bull;</span>
                    <span className="leading-relaxed font-semibold">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Sidebar Info Card */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center text-center gap-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-2xl border border-solid border-zinc-300 dark:border-zinc-700 rounded-3xl" style={{ padding: "2rem", marginTop: "1rem" }}>
            <h3 className="font-heading text-lg lg:text-xl font-black text-zinc-900 dark:text-white border-b border-zinc-100 dark:border-zinc-800 pb-4 w-full text-left">
              {t("Logistics & Contact", "যোগাযোগ ও সময়সূচী")}
            </h3>

            <div className="flex flex-col items-start gap-6 w-full text-left font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">

              {/* Date */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">{t("Date", "তারিখ")}</span>
                  <span className="font-black text-zinc-800 dark:text-white">{evt.date}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">{t("Time", "সময়")}</span>
                  <span className="font-black text-zinc-800 dark:text-white">{evt.time}</span>
                </div>
              </div>

              {/* Venue */}
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">{t("Venue", "স্থান")}</span>
                  <span className="font-black text-zinc-800 dark:text-white">{language === "bn" ? evt.venueBn : evt.venueEn}</span>
                </div>
              </div>

              {/* Speaker */}
              {evt.speakerEn && (
                <div className="flex items-start gap-3 border-t border-zinc-50 dark:border-zinc-900 w-full pt-4">
                  <div>
                    <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">{t("Speaker / Trainers", "প্রশিক্ষক / বক্তা")}</span>
                    <span className="font-semibold text-zinc-800 dark:text-white leading-relaxed block mt-1">{language === "bn" ? evt.speakerBn : evt.speakerEn}</span>
                  </div>
                </div>
              )}

              {/* Registration */}
              <div className="flex items-start gap-3 border-t border-zinc-50 dark:border-zinc-900 w-full pt-4">
                <div>
                  <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">{t("Registration", "নিবন্ধন")}</span>
                  <span className="font-semibold text-teal-600 dark:text-teal-400 leading-relaxed block mt-1">{language === "bn" ? evt.registrationInfoBn : evt.registrationInfoEn}</span>
                </div>
              </div>

              {/* Contact */}
              <div className="flex items-start gap-3 border-t border-zinc-50 dark:border-zinc-900 w-full pt-4">
                <Phone className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-zinc-400 uppercase text-xxs tracking-wider">{t("Contact Desk", "যোগাযোগ ডেস্ক")}</span>
                  <span className="font-black text-zinc-800 dark:text-white">{language === "bn" ? evt.contactBn : evt.contactEn}</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
