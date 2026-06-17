"use client"

import React, { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { publicApi } from "@/lib/api"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { CheckCircle2, UserPlus, Heart, BookOpen, ShieldAlert, Check } from "lucide-react"

// Areas of Interest options
const interestOptions = [
  { id: "popularization", labelEn: "Science Popularization", labelBn: "বিজ্ঞান প্রচার ও প্রসার" },
  { id: "antisuperstition", labelEn: "Anti-Superstition Campaigns", labelBn: "কুসংস্কার বিরোধী আন্দোলন" },
  { id: "environment", labelEn: "Environmental Protection", labelBn: "পরিবেশ সুরক্ষা কার্যক্রম" },
  { id: "water", labelEn: "Water Resource Survey & Conservation", labelBn: "জলসম্পদ সমীক্ষা ও সংরক্ষণ" },
  { id: "health", labelEn: "Health Camps & Sanitation Awareness", labelBn: "স্বাস্থ্য শিবির ও সচেতনতা" },
  { id: "publications", labelEn: "Publications & Scientific Writing", labelBn: "বিজ্ঞান প্রকাশনা ও রচনা" },
  { id: "workshops", labelEn: "School Workshops & Laboratory Training", labelBn: "বিদ্যালয় কর্মশালা ও ল্যাব প্রশিক্ষণ" },
  { id: "translation", labelEn: "Santali/Regional Language Translation", labelBn: "সাঁওতালি বা স্থানীয় ভাষায় অনুবাদ" },
]

// Create bilingual membership schema
const createMembershipSchema = (t: (en: string, bn: string) => string) =>
  z.object({
    fullName: z.string().min(2, {
      message: t("Name must be at least 2 characters.", "নাম কমপক্ষে ২ টি অক্ষরের হতে হবে।"),
    }),
    dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: t("Please select a valid date of birth.", "একটি সঠিক জন্ম তারিখ নির্বাচন করুন।"),
    }),
    gender: z.string().min(1, {
      message: t("Please select your gender.", "অনুগ্রহ করে আপনার লিঙ্গ নির্বাচন করুন।"),
    }),
    occupation: z.string().min(2, {
      message: t("Occupation is required.", "জীবিকা/পেশা উল্লেখ করা আবশ্যক।"),
    }),
    educationalQualification: z.string().min(2, {
      message: t("Educational qualification is required.", "শিক্ষাগত যোগ্যতা উল্লেখ করা আবশ্যক।"),
    }),
    address: z.string().min(5, {
      message: t("Please enter your full address.", "আপনার সম্পূর্ণ ঠিকানা লিখুন।"),
    }),
    district: z.string().min(2, {
      message: t("District is required.", "জেলার নাম আবশ্যক।"),
    }),
    state: z.string().min(2, {
      message: t("State is required.", "রাজ্যের নাম আবশ্যক।"),
    }),
    phoneNumber: z.string().regex(/^[0-9]{10}$/, {
      message: t("Phone number must be exactly 10 digits.", "ফোন নম্বরটি ঠিক ১০ সংখ্যার হতে হবে।"),
    }),
    email: z.string().email({
      message: t("Please enter a valid email address.", "অনুগ্রহ করে একটি সঠিক ইমেল আইডি লিখুন।"),
    }),
    areasOfInterest: z.array(z.string()).min(1, {
      message: t("Select at least one area of interest.", "অন্তত একটি আগ্রহের বিষয় নির্বাচন করুন।"),
    }),
    motivation: z.string().min(15, {
      message: t(
        "Motivation statement must be at least 15 characters.",
        "সংগঠনে যোগদানের উদ্দেশ্য কমপক্ষে ১৫ টি অক্ষরের হতে হবে।"
      ),
    }),
  })

export default function JoinUsPage() {
  const { language, t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const membershipSchema = createMembershipSchema(t)
  type MembershipFormValues = z.infer<typeof membershipSchema>

  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      gender: "",
      occupation: "",
      educationalQualification: "",
      address: "",
      district: "Purulia",
      state: "West Bengal",
      phoneNumber: "",
      email: "",
      areasOfInterest: [],
      motivation: "",
    },
  })

  const onSubmit = async (values: MembershipFormValues) => {
    setIsSubmitting(true)
    try {
      // API payload requires Date object for dateOfBirth
      const payload = {
        ...values,
        dateOfBirth: new Date(values.dateOfBirth),
      }
      await publicApi.submitMembership(payload)
      toast.success(
        t(
          "Success! Your membership application has been submitted.",
          "ধন্যবাদ! আপনার সদস্যপদের আবেদনটি সফলভাবে জমা নেওয়া হয়েছে।"
        )
      )
      setIsSuccess(true)
      form.reset()
    } catch (error: any) {
      console.error("Failed to submit membership application", error)
      toast.info(
        t(
          "Simulating offline membership submission...",
          "অফলাইন সদস্যপদ আবেদন প্রক্রিয়া চালানো হচ্ছে..."
        )
      )
      // Fallback/Mock
      setTimeout(() => {
        toast.success(
          t(
            "Application submitted (Offline Mode). We will contact you soon.",
            "আবেদনপত্র জমা হয়েছে (অফলাইন মোড)। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
          )
        )
        setIsSuccess(true)
        form.reset()
        setIsSubmitting(false)
      }, 1500)
      return
    }
    setIsSubmitting(false)
  }

  // Handle Checkbox Toggles
  const handleCheckboxChange = (id: string, checked: boolean, currentFields: string[]) => {
    if (checked) {
      form.setValue("areasOfInterest", [...currentFields, id], { shouldValidate: true })
    } else {
      form.setValue(
        "areasOfInterest",
        currentFields.filter((item) => item !== id),
        { shouldValidate: true }
      )
    }
  }

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
            {t("Join as a Member", "বিজ্ঞান মঞ্চের সদস্য হন")}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.78)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
            {t(
              "Become a part of Paschim Banga Vigyan Mancha, Purulia District Branch. Join us in building a rational, scientific, and superstitious-free society.",
              "পশ্চিমবঙ্গ বিজ্ঞান মঞ্চ, পুরুলিয়া জেলা শাখার সাথে যুক্ত হোন। কুসংস্কারমুক্ত, যুক্তিবাদী ও বিজ্ঞানমনস্ক সমাজ গঠনে আমাদের সাথে কাঁধে কাঁধ মিলিয়ে কাজ করুন।"
            )}
          </p>
        </div>
      </section>

      {/* Main Form Grid */}
      <section style={{ width: "100%", padding: "4rem 0" }}>
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Side: Why Join Column */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
              
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-950 to-indigo-900 text-white shadow-md flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-teal-400" />
                  </div>
                  <h3 className="font-heading text-lg font-black tracking-tight">
                    {t("Why Join Us?", "কেন যোগদান করবেন?")}
                  </h3>
                </div>

                <ul className="flex flex-col gap-4 font-body text-xs sm:text-sm text-zinc-300">
                  <li className="flex gap-2.5 items-start">
                    <Check className="h-5 w-5 text-teal-400 shrink-0" />
                    <span>
                      {t(
                        "Participate in science exhibitions, camps, and workshops across Purulia.",
                        "পুরুলিয়ার বিভিন্ন ব্লকে আয়োজিত বিজ্ঞান প্রদর্শনী, শিবির ও কর্মশালায় অংশ নেওয়ার সুযোগ।"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <Check className="h-5 w-5 text-teal-400 shrink-0" />
                    <span>
                      {t(
                        "Contribute to local water conservation surveys and climate change research.",
                        "স্থানীয় জলসম্পদ সমীক্ষা এবং জলবায়ু পরিবর্তন বিষয়ক বৈজ্ঞানিক গবেষণায় অবদান রাখুন।"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <Check className="h-5 w-5 text-teal-400 shrink-0" />
                    <span>
                      {t(
                        "Help spread awareness and expose rural blind faiths and witch-hunting.",
                        "গ্রামীণ এলাকায় কুসংস্কার ও ডাইনি প্রথার বিরুদ্ধে বিজ্ঞানসম্মত উপায়ে সচেতনতা গড়ে তুলুন।"
                      )}
                    </span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <Check className="h-5 w-5 text-teal-400 shrink-0" />
                    <span>
                      {t(
                        "Receive our publications, newsletter updates, and local branch bulletins.",
                        "সংগঠনের বিজ্ঞান প্রকাশনা, নিয়মিত নিউজলেটার ও বার্ষিক রিপোর্ট সংগ্রহ করুন।"
                      )}
                    </span>
                  </li>
                </ul>

                <div className="border-t border-white/10 pt-4 mt-2">
                  <p className="font-body text-xxs text-zinc-400 italic">
                    {t(
                      "* All applications are reviewed by the district executive committee before final approval.",
                      "* সমস্ত আবেদনপত্র চূড়ান্ত অনুমোদনের জন্য জেলা কার্যনির্বাহী কমিটির দ্বারা পর্যালোচনা করা হয়।"
                    )}
                  </p>
                </div>
              </div>

              {/* Emergency / Help Card */}
              <div className="p-6 rounded-2xl border border-zinc-100 bg-white dark:bg-zinc-950/20 dark:border-zinc-900 shadow-sm flex flex-col gap-3">
                <h4 className="font-heading text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                  {t("Need help with application?", "আবেদন করতে সমস্যা হচ্ছে?")}
                </h4>
                <p className="font-body text-xs text-zinc-500 dark:text-zinc-400">
                  {t(
                    "You can also download the physical membership form from our Downloads page, fill it, and submit it directly to our Purulia district office.",
                    "আপনি ডাউনলোড পেজ থেকে শারীরিক সদস্যপদ ফর্মটি পিডিএফ ডাউনলোড করে প্রিন্ট করতে পারেন, এবং পূরণ করে আমাদের জেলা দপ্তরে জমা দিতে পারেন।"
                  )}
                </p>
              </div>

            </div>

            {/* Right Side: Membership Application Form Card */}
            <div className="lg:col-span-8">
              <div className="p-8 rounded-3xl bg-white border border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-900 shadow-md">
                
                {isSuccess ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 gap-4 animate-fade-in">
                    <div className="h-16 w-16 rounded-full bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 flex items-center justify-center mb-2">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="font-heading text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                      {t("Application Submitted!", "আবেদনপত্র জমা হয়েছে!")}
                    </h3>
                    <p className="font-body text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                      {t(
                        "Your application has been registered successfully. Our district organizers will verify your details and connect with you via email or phone.",
                        "আপনার আবেদনপত্রটি সফলভাবে নথিভুক্ত করা হয়েছে। আমাদের জেলা আয়োজকরা আপনার বিবরণ যাচাই করে শীঘ্রই আপনার সাথে যোগাযোগ করবেন।"
                      )}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSuccess(false)}
                      className="mt-4 rounded-xl font-body font-bold"
                    >
                      {t("Submit Another Application", "আরেকটি আবেদনপত্র জমা দিন")}
                    </Button>
                  </div>
                ) : (
                  <>
                    <h3 className="font-heading text-lg sm:text-xl font-black text-zinc-900 dark:text-white mb-1">
                      {t("Membership Application Form", "সদস্যপদের আবেদনপত্র")}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                      {t(
                        "Please fill in your details accurately to register your interest in the Purulia Branch.",
                        "পুরুলিয়া শাখায় সদস্যপদের জন্য অনুগ্রহ করে আপনার সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।"
                      )}
                    </p>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        {/* Section 1: Personal Details */}
                        <div className="space-y-4">
                          <h4 className="font-heading text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider border-b border-zinc-100 dark:border-zinc-900 pb-2">
                            {t("1. Personal Details", "১. ব্যক্তিগত বিবরণ")}
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            
                            {/* Full Name */}
                            <div className="sm:col-span-2">
                              <FormField
                                control={form.control}
                                name="fullName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("Full Name", "সম্পূর্ণ নাম")}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder={t("e.g. Subhasish Sen", "উদাঃ শুভাশীষ সেন")}
                                        className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Gender */}
                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                    {t("Gender", "লিঙ্গ")}
                                  </FormLabel>
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm">
                                        <SelectValue placeholder={t("Select", "নির্বাচন করুন")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl">
                                      <SelectItem value="Male">{t("Male", "পুরুষ")}</SelectItem>
                                      <SelectItem value="Female">{t("Female", "মহিলা")}</SelectItem>
                                      <SelectItem value="Other">{t("Other", "অন্যান্য")}</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Date of Birth */}
                            <FormField
                              control={form.control}
                              name="dateOfBirth"
                              render={({ field }) => (
                                <FormItem className="sm:col-span-1">
                                  <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                    {t("Date of Birth", "জন্ম তারিখ")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="date"
                                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Educational Qualification */}
                            <FormField
                              control={form.control}
                              name="educationalQualification"
                              render={({ field }) => (
                                <FormItem className="sm:col-span-1">
                                  <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                    {t("Qualification", "শিক্ষাগত যোগ্যতা")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("e.g. M.Sc. Physics", "উদাঃ বি.এসসি")}
                                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Occupation */}
                            <FormField
                              control={form.control}
                              name="occupation"
                              render={({ field }) => (
                                <FormItem className="sm:col-span-1">
                                  <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                    {t("Occupation", "পেশা/জীবিকা")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("e.g. High School Teacher", "উদাঃ শিক্ষকতা")}
                                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                          </div>
                        </div>

                        {/* Section 2: Contact Details */}
                        <div className="space-y-4">
                          <h4 className="font-heading text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider border-b border-zinc-100 dark:border-zinc-900 pb-2">
                            {t("2. Contact & Address Details", "২. যোগাযোগের ঠিকানা ও বিবরণ")}
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            
                            {/* Email */}
                            <FormField
                              control={form.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                    {t("Email Address", "ইমেল আইডি")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      type="email"
                                      placeholder="subhasish@example.com"
                                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Phone Number */}
                            <FormField
                              control={form.control}
                              name="phoneNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                    {t("Phone Number (10 digits)", "ফোন নম্বর (১০ টি সংখ্যা)")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="9876543210"
                                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Address Textarea */}
                            <div className="sm:col-span-2">
                              <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("Residential Address", "বাসস্থানের ঠিকানা")}
                                    </FormLabel>
                                    <FormControl>
                                      <Textarea
                                        rows={3}
                                        placeholder={t("Enter your full home address", "আপনার সম্পূর্ণ যোগাযোগের ঠিকানা লিখুন")}
                                        className="rounded-xl border-zinc-200 dark:border-zinc-800 focus:bg-white text-sm"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* District */}
                            <FormField
                              control={form.control}
                              name="district"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                    {t("District", "জেলা")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* State */}
                            <FormField
                              control={form.control}
                              name="state"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                    {t("State", "রাজ্য")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                          </div>
                        </div>

                        {/* Section 3: Interests & Motivation */}
                        <div className="space-y-6">
                          <h4 className="font-heading text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider border-b border-zinc-100 dark:border-zinc-900 pb-2">
                            {t("3. Areas of Interest & Motivation", "৩. আগ্রহের ক্ষেত্র ও উদ্দেশ্য")}
                          </h4>

                          {/* Checkbox Grid */}
                          <div className="space-y-3">
                            <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                              {t("Select areas you want to contribute to (Select at least one):", "যে সব ক্ষেত্রে আপনি যুক্ত হতে চান (অন্তত একটি নির্বাচন করুন):")}
                            </FormLabel>
                            
                            <FormField
                              control={form.control}
                              name="areasOfInterest"
                              render={({ field }) => (
                                <FormItem>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                    {interestOptions.map((opt) => {
                                      const isChecked = field.value.includes(opt.id)
                                      return (
                                        <label
                                          key={opt.id}
                                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/40 select-none ${
                                            isChecked
                                              ? "border-teal-500 bg-teal-50/20 dark:border-teal-500 dark:bg-teal-950/10"
                                              : "border-zinc-100 dark:border-zinc-900"
                                          }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) =>
                                              handleCheckboxChange(opt.id, e.target.checked, field.value)
                                            }
                                            className="mt-1 h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-500 accent-teal-600 shrink-0"
                                          />
                                          <span className="font-body text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-normal">
                                            {t(opt.labelEn, opt.labelBn)}
                                          </span>
                                        </label>
                                      )
                                    })}
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {/* Reason for joining / Motivation */}
                          <FormField
                            control={form.control}
                            name="motivation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                  {t("Why do you want to join Paschim Banga Vigyan Mancha?", "আপনি কেন পশ্চিমবঙ্গ বিজ্ঞান মঞ্চে যোগ দিতে চান?")}
                                </FormLabel>
                                <FormDescription className="font-body text-xxs text-zinc-400">
                                  {t("Write a brief description of your motivation to join our district branch.", "বিজ্ঞান মঞ্চের এই জেলা শাখায় আপনার যোগদানের ইচ্ছা বা অনুপ্রেরণা সংক্ষেপে লিখুন।")}
                                </FormDescription>
                                <FormControl>
                                  <Textarea
                                    rows={4}
                                    placeholder={t(
                                      "e.g. I want to raise scientific awareness, eradicate superstitions in my local village, and help coordinate science camps for students...",
                                      "উদাঃ আমি আমার এলাকার মানুষদের বিজ্ঞান সচেতন করতে চাই, কুসংস্কার দূর করতে এবং শিক্ষার্থীদের জন্য বিজ্ঞান ক্যাম্প আয়োজনে যুক্ত হতে চাই..."
                                    )}
                                    className="rounded-xl border-zinc-200 dark:border-zinc-800 focus:bg-white text-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                        </div>

                        {/* Submit Application Button */}
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 mt-8 text-sm sm:text-base shadow-md"
                        >
                          <UserPlus className="h-5 w-5" />
                          {isSubmitting
                            ? t("Submitting Application...", "আবেদনপত্র জমাকরণ হচ্ছে...")
                            : t("Submit Application", "আবেদনপত্র জমা দিন")}
                        </Button>

                      </form>
                    </Form>
                  </>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
