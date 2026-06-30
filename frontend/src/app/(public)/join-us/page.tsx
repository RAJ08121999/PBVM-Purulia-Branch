"use client"

import React, { useState, useRef } from "react"
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
import { CheckCircle2, UserPlus, Check, Image as ImageIcon, Upload, X } from "lucide-react"

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

// Volunteer Skills options
const volunteerSkillsOptions = [
  { id: "Teaching", labelEn: "Teaching", labelBn: "শিক্ষাদান" },
  { id: "Event Management", labelEn: "Event Management", labelBn: "অনুষ্ঠান পরিচালনা" },
  { id: "Photography", labelEn: "Photography", labelBn: "ফটোগ্রাফি" },
  { id: "Social Media", labelEn: "Social Media", labelBn: "সোশ্যাল মিডিয়া" },
  { id: "Graphic Design", labelEn: "Graphic Design", labelBn: "গ্রাফিক ডিজাইন" },
  { id: "Writing", labelEn: "Writing", labelBn: "লেখালেখি" },
  { id: "Public Speaking", labelEn: "Public Speaking", labelBn: "বক্তৃতা ও উপস্থাপনা" },
  { id: "Science Demonstration", labelEn: "Science Demonstration", labelBn: "বিজ্ঞান প্রদর্শনী" },
  { id: "Technical Support", labelEn: "Technical Support", labelBn: "প্রযুক্তিগত সহায়তা" },
  { id: "Translation", labelEn: "Translation", labelBn: "অনুবাদ" },
  { id: "Fundraising", labelEn: "Fundraising", labelBn: "তহবিল সংগ্রহ" },
  { id: "Other", labelEn: "Other", labelBn: "অন্যান্য" },
]

// Create bilingual membership schema with conditional volunteer fields
const createMembershipSchema = (t: (en: string, bn: string) => string) =>
  z.object({
    membershipType: z.enum(["member", "volunteer"]),
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

    // Photo field
    photo: z.any().optional(),

    // Volunteer fields (conditionally validated below)
    availability: z.string().optional(),
    timeContribution: z.string().optional(),
    skills: z.array(z.string()).optional(),
    previousExperienceNGO: z.enum(["Yes", "No"]).optional(),
    previousExperienceDetails: z.string().optional(),
    canTravel: z.string().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactRelation: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    bloodGroup: z.string().optional(),
  }).superRefine((data, ctx) => {
    if (data.membershipType === "volunteer") {
      if (!data.availability) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["availability"],
          message: t("Availability is required for volunteers.", "স্বেচ্ছাসেবকদের কাজের সময় নির্বাচন করা আবশ্যক।")
        })
      }
      if (!data.bloodGroup) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["bloodGroup"],
          message: t("Blood group is required for volunteers.", "স্বেচ্ছাসেবকদের জন্য রক্তের গ্রুপ আবশ্যক।")
        })
      }
      if (!data.timeContribution) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["timeContribution"],
          message: t("Time contribution is required for volunteers.", "সাপ্তাহিক সময় অবদান উল্লেখ করা আবশ্যক।")
        })
      }
      if (!data.canTravel) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["canTravel"],
          message: t("Travel preference is required for volunteers.", "ভ্রমণের অনুমতি উল্লেখ করা আবশ্যক।")
        })
      }
      if (!data.emergencyContactName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emergencyContactName"],
          message: t("Emergency contact name is required.", "জরুরী যোগাযোগের নাম আবশ্যক।")
        })
      }
      if (!data.emergencyContactRelation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emergencyContactRelation"],
          message: t("Emergency contact relation is required.", "সম্পর্ক উল্লেখ করা আবশ্যক।")
        })
      }
      if (!data.emergencyContactPhone || !/^[0-9]{10}$/.test(data.emergencyContactPhone)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emergencyContactPhone"],
          message: t("Emergency contact phone must be 10 digits.", "জরুরী যোগাযোগ ফোন নম্বরটি ১০ সংখ্যার হতে হবে।")
        })
      }
      if (data.previousExperienceNGO === "Yes" && (!data.previousExperienceDetails || data.previousExperienceDetails.length < 5)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["previousExperienceDetails"],
          message: t("Please describe your previous experience.", "অনুগ্রহ করে আপনার পূর্ব অভিজ্ঞতা সংক্ষেপে লিখুন।")
        })
      }
    }
  })

export default function JoinUsPage() {
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Photo preview states
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState("")

  const membershipSchema = createMembershipSchema(t)
  type MembershipFormValues = z.infer<typeof membershipSchema>

  const form = useForm<MembershipFormValues>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      membershipType: "member",
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
      photo: undefined,
      availability: "",
      timeContribution: "",
      skills: [],
      previousExperienceNGO: "No",
      previousExperienceDetails: "",
      canTravel: "",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      bloodGroup: "",
    },
  })

  // Watch membershipType to show/hide conditional sections
  const watchedMembershipType = form.watch("membershipType")
  const watchedExperienceNGO = form.watch("previousExperienceNGO")

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t("Photo size should be less than 2MB", "ছবির সাইজ ২ এমবি-র কম হতে হবে"));
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      form.setValue("photo", file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    form.setValue("photo", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (values: MembershipFormValues) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData();
      formData.append("membershipType", values.membershipType);
      formData.append("fullName", values.fullName);
      formData.append("dateOfBirth", values.dateOfBirth);
      formData.append("gender", values.gender);
      formData.append("occupation", values.occupation);
      formData.append("educationalQualification", values.educationalQualification);
      formData.append("address", values.address);
      formData.append("district", values.district);
      formData.append("state", values.state);
      formData.append("phoneNumber", values.phoneNumber);
      formData.append("email", values.email);
      formData.append("areasOfInterest", JSON.stringify(values.areasOfInterest));
      formData.append("motivation", values.motivation);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      if (values.membershipType === "volunteer") {
        formData.append("availability", values.availability || "");
        formData.append("timeContribution", values.timeContribution || "");
        formData.append("skills", JSON.stringify(values.skills || []));
        formData.append("previousExperienceNGO", values.previousExperienceNGO || "No");
        formData.append("previousExperienceDetails", values.previousExperienceDetails || "");
        formData.append("canTravel", values.canTravel || "");
        formData.append("bloodGroup", values.bloodGroup || "");

        formData.append("emergencyContact", JSON.stringify({
          name: values.emergencyContactName || "",
          relation: values.emergencyContactRelation || "",
          phone: values.emergencyContactPhone || "",
        }));
      }

      await publicApi.submitMembership(formData)
      toast.success(
        t(
          "Success! Your application has been submitted.",
          "ধন্যবাদ! আপনার আবেদনটি সফলভাবে জমা নেওয়া হয়েছে।"
        )
      )
      setIsSuccess(true)
      form.reset()
      removePhoto()
    } catch (error: any) {
      console.error("Failed to submit application", error)
      toast.error(
        t(
          "Submission failed. Please check your network and try again.",
          "আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট কানেকশন যাচাই করে পুনরায় চেষ্টা করুন।"
        )
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Checkbox Toggles
  const handleCheckboxChange = (id: string, checked: boolean, currentFields: string[], fieldName: "areasOfInterest" | "skills") => {
    if (checked) {
      form.setValue(fieldName, [...currentFields, id], { shouldValidate: true })
    } else {
      form.setValue(
        fieldName,
        currentFields.filter((item) => item !== id),
        { shouldValidate: true }
      )
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "#F8FAFC" }}>

      {/* Header Banner */}
      <section
        className="py-12 sm:py-16 md:py-20 px-4"
        style={{
          width: "100%",
          background: "linear-gradient(135deg, #0B1F4A 0%, #0B3D91 60%, #0A3D32 100%)",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
          padding: "4rem",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="page-container" style={{ position: "relative", zIndex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.8rem,4.5vw,3rem)", fontWeight: 800, color: "#ffffff", marginBottom: "1rem", lineHeight: 1.2 }}>
            {t("Join Pashchim Banga Vigyan Mancha", "বিজ্ঞান মঞ্চে যোগদান করুন")}
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "rgba(255,255,255,0.78)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.75 }}>
            {t(
              "Become a part of the Purulia District Branch. Join us either as a General Member or commit your valuable skills as a Volunteer.",
              "পুরুলিয়া জেলা শাখার সাথে যুক্ত হোন। একজন সাধারণ সদস্য হিসেবে যোগ দিন অথবা আপনার মূল্যবান দক্ষতা নিয়ে স্বেচ্ছাসেবক হিসেবে অবদান রাখুন।"
            )}
          </p>
        </div>
      </section>

      {/* Main Form Grid */}
      <section className="py-8 sm:py-12 md:py-16 px-4" style={{ width: "100%" }}>
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">

            {/* Left Side: Why Join Column */}
            <div
              style={{ paddingTop: "2rem" }}
              className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">

              {/* Benefits of Joining Card */}
              <div className="rounded-3xl overflow-hidden shadow-lg relative" style={{ background: "linear-gradient(160deg, #0b2259 0%, #0B3D91 55%, #0a3d32 100%)", padding: "1rem" }}>
                <div className="absolute top-0 right-0 h-56 w-56 bg-white/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-40 w-40 bg-teal-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

                <div className="relative z-10 p-7 sm:p-8">
                  {/* Header */}
                  <div
                    style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                    className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0" style={{ marginTop: "-1rem" }}>
                      <UserPlus className="h-5 w-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-black text-white leading-tight" style={{ color: "white", }}>
                        {t("Why Join PBVM?", "কেন বিজ্ঞান মঞ্চে যোগ দেবেন?")}
                      </h3>
                      <p className="font-body text-xs text-white/60 mt-0.5" style={{ marginBottom: "1rem", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        {t("Purulia District Branch", "পুরুলিয়া জেলা শাখা")}
                      </p>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <ul className="flex flex-col gap-3 mb-6">
                    {[
                      { en: "Be part of India's largest grassroots science movement", bn: "ভারতের বৃহত্তম বিজ্ঞান আন্দোলনের অংশ হোন" },
                      { en: "Fight superstition & spread rational thinking in Purulia", bn: "পুরুলিয়ায় কুসংস্কার দূর করুন ও যুক্তিবাদ প্রসার করুন" },
                      { en: "Access science camps, workshops & training programs", bn: "বিজ্ঞান শিবির, কর্মশালা ও প্রশিক্ষণ কার্যক্রমে অংশ নিন" },
                      { en: "Receive PBVM's journal, newsletters & publications free", bn: "বিজ্ঞান মঞ্চের পত্রিকা, নিউজলেটার ও প্রকাশনা বিনামূল্যে পান" },
                      { en: "Work with students, teachers & community leaders", bn: "শিক্ষার্থী, শিক্ষক ও সমাজের নেতৃস্থানীয়দের সাথে কাজ করুন" },
                      { en: "Contribute to environmental & public health campaigns", bn: "পরিবেশ ও জন-স্বাস্থ্য কার্যক্রমে অবদান রাখুন" },
                      { en: "Build a scientific and superstition-free society", bn: "কুসংস্কারমুক্ত ও বিজ্ঞানমনস্ক সমাজ গঠনে সহায়তা করুন" },
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="h-5 w-5 rounded-full bg-teal-400/20 border border-teal-400/40 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-teal-400" />
                        </span>
                        <span className="font-body text-xs sm:text-sm text-white/85 leading-relaxed">
                          {t(item.en, item.bn)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div style={{ paddingTop: "1rem" }} className="border-t border-white/10 pt-5 mb-5">
                    <p className="font-heading text-xs font-black text-white/70 uppercase tracking-wider mb-3">{t("Choose Your Role", "আপনার ভূমিকা চয়ন করুন")}</p>
                    <div className="flex flex-col gap-3">
                      <div style={{ padding: "1rem" }} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h5 className="font-heading text-sm font-black text-teal-400 mb-1">{t("General Member", "সাধারণ সদস্য")}</h5>
                        <p className="font-body text-xs text-white/70 leading-relaxed">{t("Receive publications, attend meetings, and support local campaigns at your own pace.", "প্রকাশনা সংগ্রহ করুন, সভায় যোগ দিন এবং নিজের গতিতে স্থানীয় প্রচারণায় সহায়তা করুন।")}</p>
                      </div>
                      <div style={{ padding: "1rem" }} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <h5 className="font-heading text-sm font-black text-orange-400 mb-1">{t("Volunteer", "স্বেচ্ছাসেবক")}</h5>
                        <p className="font-body text-xs text-white/70 leading-relaxed">{t("Commit your time and skills to coordinate camps, conduct programmes, and drive field activities.", "সময় ও দক্ষতা নিয়ে শিবির পরিচালনা, কার্যক্রম পরিচালনা ও মাঠ কাজে সক্রিয়ভাবে অংশ নিন।")}</p>
                      </div>
                    </div>
                  </div>

                  <p
                    style={{ padding: "1rem" }}
                    className="font-body text-xxs text-white/40 italic">
                    {t(
                      "* All applications are reviewed by the district executive committee before final approval.",
                      "* সমস্ত আবেদনপত্র জেলা কার্যনির্বাহী কমিটির দ্বারা পর্যালোচনা করার পর চূড়ান্ত অনুমোদন করা হয়।"
                    )}
                  </p>
                </div>
              </div>

              {/* Help Card */}
              <div
                style={{ marginBottom: "4rem" }}
                className="p-6 rounded-2xl border border-zinc-100 bg-white dark:bg-zinc-950/20 dark:border-zinc-900 shadow-sm flex flex-col gap-3 text-left">
                <h4 className="font-heading text-xs font-black text-zinc-900 dark:text-white uppercase tracking-wider">
                  {t("Need help with application?", "আবেদন করতে সমস্যা হচ্ছে?")}
                </h4>
                <p className="font-body text-xs text-zinc-500 dark:text-zinc-400">
                  {t(
                    "You can also download the physical membership form from our Downloads page, fill it, and submit it directly to our Purulia district office.",
                    "আপনি ডাউনলোড পেজ থেকে শারীরিক ফর্মটি পিডিএফ ডাউনলোড করে প্রিন্ট করতে পারেন, এবং পূরণ করে আমাদের জেলা দপ্তরে জমা দিতে পারেন।"
                  )}
                </p>
              </div>
            </div>

            {/* Right Side: Membership Application Form Card */}
            <div
              style={{ paddingTop: "2rem" }}
              className="lg:col-span-7">
              <div
                className="rounded-3xl bg-white border border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-900 shadow-md"
                style={{
                  textAlign: "center",
                  padding: "2.5rem",
                  marginBottom: "4rem"
                }}
              >

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
                        "Your application has been registered successfully. Our organizers will verify your details and connect with you via email or phone.",
                        "আপনার আবেদনপত্রটি সফলভাবে নথিভুক্ত করা হয়েছে। আমাদের আয়োজকরা বিবরণ যাচাই করে শীঘ্রই আপনার সাথে যোগাযোগ করবেন।"
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
                    <h3
                      style={{ paddingTop: "1rem", paddingBottom: "1rem" }}
                      className="font-heading text-lg sm:text-xl font-black text-zinc-900 dark:text-white mb-1">
                      {t("Join Us Form", "যোগদান ফর্ম")}
                    </h3>
                    <p className="font-body text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                      {t(
                        "Please fill in your details accurately to register your application in the Purulia Branch.",
                        "অনুগ্রহ করে আপনার সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন।"
                      )}
                    </p>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-left">

                        {/* STEP 1: Membership Type Selection */}
                        <div
                          style={{ padding: "1rem" }}
                          className="p-6 rounded-2xl bg-zinc-50 border border-zinc-100 dark:bg-zinc-900/10 dark:border-zinc-900 space-y-4">
                          <FormField
                            control={form.control}
                            name="membershipType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="font-heading text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider">
                                  {t("I Want to Join As (Required)", "আমি হিসেবে যোগদান করতে চাই (আবশ্যক)")}
                                </FormLabel>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                  <label
                                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:bg-white select-none ${field.value === "member"
                                      ? "border-blue-600 bg-white shadow-sm ring-1 ring-blue-600"
                                      : "border-zinc-200"
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name="membershipType"
                                      value="member"
                                      checked={field.value === "member"}
                                      onChange={() => form.setValue("membershipType", "member")}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                      <span className="font-heading text-sm font-bold text-zinc-900 block">
                                        {t("General Member", "সাধারণ সদস্য")}
                                      </span>
                                      <span className="font-body text-xxs text-zinc-400">
                                        {t("Receive publications & updates", "পত্রিকা ও সংবাদ আপডেট পেতে")}
                                      </span>
                                    </div>
                                  </label>

                                  <label
                                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:bg-white select-none ${field.value === "volunteer"
                                      ? "border-blue-600 bg-white shadow-sm ring-1 ring-blue-600"
                                      : "border-zinc-200"
                                      }`}
                                  >
                                    <input
                                      type="radio"
                                      name="membershipType"
                                      value="volunteer"
                                      checked={field.value === "volunteer"}
                                      onChange={() => form.setValue("membershipType", "volunteer")}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div>
                                      <span className="font-heading text-sm font-bold text-zinc-900 block">
                                        {t("Volunteer", "স্বেচ্ছাসেবক")}
                                      </span>
                                      <span className="font-body text-xxs text-zinc-400">
                                        {t("Commit time & work in Purulia", "সময় ও শ্রম অবদান দিতে")}
                                      </span>
                                    </div>
                                  </label>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        {/* Section 1: Common / Personal Details */}
                        <div
                          className="border-b border-zinc-100 dark:border-zinc-800"
                          style={{
                            paddingTop: "1rem",
                          }}
                        >
                          <h4 className="font-heading text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-900">
                            {t("1. Personal Details", "১. ব্যক্তিগত বিবরণ")}
                          </h4>

                          <div
                            style={{ padding: "1rem" }}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-5">

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
                                        style={{ paddingLeft: "1rem" }}
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
                                      <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 focus:bg-white text-sm" style={{ paddingLeft: "1rem" }}>
                                        <SelectValue placeholder={t("Select", "নির্বাচন করুন")} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-xl">
                                      <SelectItem value="Male" style={{ padding: "0.5rem 1rem" }}>{t("Male", "পুরুষ")}</SelectItem>
                                      <SelectItem value="Female" style={{ padding: "0.5rem 1rem" }}>{t("Female", "মহিলা")}</SelectItem>
                                      <SelectItem value="Other" style={{ padding: "0.5rem 1rem" }}>{t("Other", "অন্যান্য")}</SelectItem>
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
                                      style={{ paddingLeft: "1rem" }}
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
                                      style={{ paddingLeft: "1rem" }}
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
                                      style={{ paddingLeft: "1rem" }}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Photo Upload Field */}
                            <div
                              className="sm:col-span-3">
                              <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300 block mb-2">
                                {t("Upload Passport Photo", "পাসপোর্ট ছবি আপলোড")}
                              </FormLabel>
                              <div
                                style={{ paddingTop: "1rem" }}
                                className="flex items-center gap-4">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors text-sm font-semibold text-zinc-500"
                                >
                                  <Upload size={16} />
                                  {t("Choose Image File", "ছবি ফাইল নির্বাচন করুন")}
                                </button>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  onChange={handlePhotoUpload}
                                  accept="image/*"
                                  style={{ display: "none" }}
                                />
                                {photoPreview && (
                                  <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-zinc-200">
                                    <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={removePhoto}
                                      className="absolute top-0 right-0 p-0.5 bg-black/70 text-white rounded-bl-lg hover:bg-black"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <span className="text-xxs text-zinc-400 mt-1 block">Max size: 2MB (.jpg, .png, .webp)</span>
                            </div>

                          </div>
                        </div>

                        {/* Section 2: Contact Details */}
                        <div
                          className="border-b border-zinc-100 dark:border-zinc-800"
                          style={{
                            paddingTop: "1rem",
                            paddingBottom: "2.5rem",
                            marginBottom: "2.5rem",
                          }}
                        >
                          <h4 className="font-heading text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider border-b border-zinc-100 dark:border-zinc-900 pb-2" style={{ paddingBottom: "1rem" }}>
                            {t("2. Contact & Address Details", "২. যোগাযোগের ঠিকানা ও বিবরণ")}
                          </h4>

                          <div
                            style={{ paddingTop: "1rem" }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-6">

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
                                      style={{ paddingLeft: "1rem" }}
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
                                      style={{ paddingLeft: "1rem" }}
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
                                        style={{ paddingLeft: "1rem", paddingTop: "0.5rem" }}
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
                                      style={{ paddingLeft: "1rem" }}
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
                                      style={{ paddingLeft: "1rem" }}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                          </div>
                        </div>

                        {/* STEP 3: Volunteer-Only Information Section */}
                        {watchedMembershipType === "volunteer" && (
                          <div
                            className="border-b border-zinc-100 dark:border-zinc-800"
                            style={{
                              paddingBottom: "2.5rem",
                              marginBottom: "2.5rem",
                            }}
                          >
                            <h4 className="font-heading text-xs font-black uppercase text-orange-600 dark:text-orange-400 tracking-wider border-b border-orange-100 dark:border-orange-900 pb-2" style={{ paddingBottom: "1rem" }}>
                              {t("3. Volunteer Commitment Details", "৩. স্বেচ্ছাসেবক প্রতিশ্রুতির বিবরণ")}
                            </h4>

                            <div
                              style={{ paddingTop: "1rem" }}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                              {/* Blood Group */}
                              <FormField
                                control={form.control}
                                name="bloodGroup"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("Blood Group", "রক্তের গ্রুপ")}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 bg-white focus:bg-white text-sm" style={{ paddingLeft: "1rem" }}>
                                          <SelectValue placeholder={t("Select Blood Group", "রক্তের গ্রুপ নির্বাচন করুন")} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-white border border-zinc-100 rounded-xl">
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                          <SelectItem key={bg} value={bg} style={{ padding: "0.5rem 1rem" }}>{bg}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Availability */}
                              <FormField
                                control={form.control}
                                name="availability"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("Availability", "কাজের সময় প্রাপ্যতা")}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 bg-white focus:bg-white text-sm" style={{ paddingLeft: "1rem" }}>
                                          <SelectValue placeholder={t("Select Availability", "প্রাপ্যতা নির্বাচন করুন")} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-white border border-zinc-100 rounded-xl">
                                        <SelectItem value="Weekdays" style={{ padding: "0.5rem 1rem" }}>{t("Weekdays", "কর্মদিবস (সোম - শুক্র)")}</SelectItem>
                                        <SelectItem value="Weekends" style={{ padding: "0.5rem 1rem" }}>{t("Weekends", "সাপ্তাহিক ছুটি (শনি - রবি)")}</SelectItem>
                                        <SelectItem value="Any Time" style={{ padding: "0.5rem 1rem" }}>{t("Any Time", "যেকোনো সময়")}</SelectItem>
                                        <SelectItem value="Occasionally" style={{ padding: "0.5rem 1rem" }}>{t("Occasionally", "মাঝে মাঝে")}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* How much time can you contribute? */}
                              <FormField
                                control={form.control}
                                name="timeContribution"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("How much time can you contribute?", "আপনি কতটা সময় অবদান দিতে পারেন?")}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 bg-white focus:bg-white text-sm" style={{ paddingLeft: "1rem" }}>
                                          <SelectValue placeholder={t("Select Hours", "সময় নির্বাচন করুন")} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-white border border-zinc-100 rounded-xl">
                                        <SelectItem value="2-4 hrs/week" style={{ padding: "0.5rem 1rem" }}>2-4 hrs/week</SelectItem>
                                        <SelectItem value="5-10 hrs/week" style={{ padding: "0.5rem 1rem" }}>5-10 hrs/week</SelectItem>
                                        <SelectItem value="10+ hrs/week" style={{ padding: "0.5rem 1rem" }}>10+ hrs/week</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Volunteer Skills */}
                              <div
                                style={{ paddingBottom: "1rem" }}
                                className="sm:col-span-2 space-y-2">
                                <FormLabel
                                  style={{ paddingBottom: "1rem" }}
                                  className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                  {t("Skills (Select all that apply)", "দক্ষতা (সব প্রযোজ্য নির্বাচন করুন)")}
                                </FormLabel>
                                <FormField
                                  control={form.control}
                                  name="skills"
                                  render={({ field }) => (
                                    <FormItem>
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-1">
                                        {volunteerSkillsOptions.map((opt) => {
                                          const isChecked = (field.value || []).includes(opt.id);
                                          return (
                                            <label
                                              key={opt.id}
                                              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer bg-white transition-all select-none text-xs ${isChecked
                                                ? "border-orange-500 bg-orange-50/10"
                                                : "border-zinc-100"
                                                }`}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={(e) =>
                                                  handleCheckboxChange(opt.id, e.target.checked, field.value || [], "skills")
                                                }
                                                className="h-3.5 w-3.5 rounded text-orange-600 focus:ring-orange-500 accent-orange-600 shrink-0"
                                              />
                                              <span className="text-zinc-700 font-semibold">
                                                {t(opt.labelEn, opt.labelBn)}
                                              </span>
                                            </label>
                                          );
                                        })}
                                      </div>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              {/* Previous Experience NGO */}
                              <FormField
                                control={form.control}
                                name="previousExperienceNGO"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-1">
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("NGO Experience?", "এনজিও-র সাথে কাজের অভিজ্ঞতা?")}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 bg-white focus:bg-white text-sm" style={{ paddingLeft: "1rem" }}>
                                          <SelectValue placeholder={t("Select Option", "বিকল্প নির্বাচন করুন")} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-white border border-zinc-100 rounded-xl">
                                        <SelectItem value="Yes" style={{ padding: "0.5rem 1rem" }}>{t("Yes", "হ্যাঁ")}</SelectItem>
                                        <SelectItem value="No" style={{ padding: "0.5rem 1rem" }}>{t("No", "না")}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Can you travel? */}
                              <FormField
                                control={form.control}
                                name="canTravel"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-1">
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("Can you travel?", "আপনি কি ভ্রমণ করতে পারবেন?")}
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 bg-white focus:bg-white text-sm" style={{ paddingLeft: "1rem" }}>
                                          <SelectValue placeholder={t("Select Travel preference", "ভ্রমণ বিকল্প নির্বাচন করুন")} />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="bg-white border border-zinc-100 rounded-xl">
                                        <SelectItem value="Within my block" style={{ padding: "0.5rem 1rem" }}>{t("Within my block", "আমার ব্লকের মধ্যে")}</SelectItem>
                                        <SelectItem value="Anywhere in Purulia" style={{ padding: "0.5rem 1rem" }}>{t("Anywhere in Purulia", "পুরুলিয়া জেলার যেকোনো স্থানে")}</SelectItem>
                                        <SelectItem value="Anywhere in West Bengal" style={{ padding: "0.5rem 1rem" }}>{t("Anywhere in West Bengal", "পশ্চিমবঙ্গের যেকোনো স্থানে")}</SelectItem>
                                        <SelectItem value="No" style={{ padding: "0.5rem 1rem" }}>{t("No", "না")}</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* If YES: Experience details */}
                              {watchedExperienceNGO === "Yes" && (
                                <div className="sm:col-span-2">
                                  <FormField
                                    control={form.control}
                                    name="previousExperienceDetails"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                          {t("Describe Previous Experience", "পূর্ব অভিজ্ঞতার বিবরণ দিন")}
                                        </FormLabel>
                                        <FormControl>
                                          <Textarea
                                            rows={2}
                                            placeholder={t("Briefly describe which NGO and the work you did...", "কোন সংগঠনে এবং কী কাজ করেছেন তা সংক্ষেপে লিখুন...")}
                                            className="rounded-xl border-zinc-200 dark:border-zinc-800 focus:bg-white text-sm bg-white"
                                            style={{ paddingLeft: "1rem", paddingTop: "0.5rem" }}
                                            {...field}
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}

                              {/* Emergency Contact Header */}
                              <div
                                style={{ paddingTop: "1rem" }}
                                className="sm:col-span-2 pt-2 border-t border-orange-100">
                                <h5 className="font-heading text-xs font-black uppercase text-orange-600">{t("Emergency Contact Details", "জরুরী যোগাযোগ বিবরণ")}</h5>
                              </div>

                              {/* Emergency Contact Name */}
                              <FormField
                                control={form.control}
                                name="emergencyContactName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("Contact Person Name", "যোগাযোগের ব্যক্তির নাম")}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder={t("e.g. Ramesh Mahato", "উদাঃ রমেশ মাহাতো")}
                                        className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 bg-white focus:bg-white text-sm"
                                        style={{ paddingLeft: "1rem" }}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Emergency Relation */}
                              <FormField
                                control={form.control}
                                name="emergencyContactRelation"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("Relation", "সম্পর্ক")}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder={t("e.g. Father / Mother / Spouse", "উদাঃ পিতা / মাতা / স্ত্রী")}
                                        className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 bg-white focus:bg-white text-sm"
                                        style={{ paddingLeft: "1rem" }}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              {/* Emergency Contact Phone */}
                              <FormField
                                control={form.control}
                                name="emergencyContactPhone"
                                render={({ field }) => (
                                  <FormItem className="sm:col-span-2">
                                    <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
                                      {t("Emergency Phone Number (10 digits)", "জরুরী ফোন নম্বর (১০ টি সংখ্যা)")}
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="9876543210"
                                        className="rounded-xl border-zinc-200 dark:border-zinc-800 h-11 bg-white focus:bg-white text-sm"
                                        style={{ paddingLeft: "1rem" }}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                            </div>
                          </div>
                        )}

                        {/* Section 4: Interests & Motivation */}
                        <div
                          className="border-b border-zinc-100 dark:border-zinc-800"
                          style={{
                            paddingBottom: "2.5rem",
                          }}
                        >  <h4 className="font-heading text-xs font-black uppercase text-teal-600 dark:text-teal-400 tracking-wider border-b border-zinc-100 dark:border-zinc-900 pb-2" style={{ paddingBottom: "1rem" }}>
                            {watchedMembershipType === "volunteer" ? t("4. Areas of Interest & Motivation", "৪. আগ্রহের ক্ষেত্র ও উদ্দেশ্য") : t("3. Areas of Interest & Motivation", "৩. আগ্রহের ক্ষেত্র ও উদ্দেশ্য")}
                          </h4>

                          {/* Checkbox Grid */}
                          <div className="space-y-3">
                            <FormLabel
                              style={{ paddingBottom: "1rem", paddingTop: "1rem" }}
                              className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300">
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
                                          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900/40 select-none ${isChecked
                                            ? "border-teal-500 bg-teal-50/20 dark:border-teal-500 dark:bg-teal-950/10"
                                            : "border-zinc-100 dark:border-zinc-900"
                                            }`}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) =>
                                              handleCheckboxChange(opt.id, e.target.checked, field.value, "areasOfInterest")
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
                                <FormLabel className="font-heading text-xs font-bold uppercase text-zinc-700 dark:text-zinc-300" style={{ paddingTop: "1.5rem", display: "inline-block" }}>
                                  {t("Why do you want to join Pashchim Banga Vigyan Mancha?", "আপনি কেন পশ্চিমবঙ্গ বিজ্ঞান মঞ্চে যোগ দিতে চান?")}
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
                                    style={{ paddingLeft: "1rem", paddingTop: "0.5rem" }}
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
