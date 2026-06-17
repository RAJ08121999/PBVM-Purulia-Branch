import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ─── Tailwind class merger ─────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Format date ──────────────────────────────────────────
export function formatDate(dateString: string, locale: "en" | "bn" = "en"): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === "bn" ? "bn-IN" : "en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Truncate text ────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "…";
}

// ─── Slugify ──────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

// ─── Activity metadata ────────────────────────────────────
export const ACTIVITY_META: Record<
  string,
  { titleEn: string; titleBn: string; icon: string; color: string }
> = {
  "environment-biodiversity": {
    titleEn: "Environment & Biodiversity",
    titleBn: "পরিবেশ ও জীববৈচিত্র্য",
    icon: "🌿",
    color: "#43A047",
  },
  health: {
    titleEn: "Health",
    titleBn: "স্বাস্থ্য",
    icon: "🏥",
    color: "#00897B",
  },
  agriculture: {
    titleEn: "Agriculture",
    titleBn: "কৃষি",
    icon: "🌾",
    color: "#8BC34A",
  },
  "childrens-science": {
    titleEn: "Children's Science Activities",
    titleBn: "শিশু বিজ্ঞান কার্যক্রম",
    icon: "🔬",
    color: "#FF9800",
  },
  "jatha-cultural": {
    titleEn: "Jatha & Cultural Activities",
    titleBn: "যাত্রা ও সাংস্কৃতিক কার্যক্রম",
    icon: "🎭",
    color: "#E91E63",
  },
  "technology-application": {
    titleEn: "Technology Application",
    titleBn: "প্রযুক্তি প্রয়োগ",
    icon: "⚙️",
    color: "#0B3D91",
  },
  "st-application-centre": {
    titleEn: "S&T Application Centre",
    titleBn: "বিজ্ঞান ও প্রযুক্তি প্রয়োগ কেন্দ্র",
    icon: "🏛️",
    color: "#5C6BC0",
  },
  "hands-on-experiments": {
    titleEn: "Hands-on Experiments",
    titleBn: "হাতে-কলমে পরীক্ষা-নিরীক্ষা",
    icon: "🧪",
    color: "#AB47BC",
  },
  samata: {
    titleEn: "Samata",
    titleBn: "সমতা",
    icon: "🤝",
    color: "#00ACC1",
  },
  skywatching: {
    titleEn: "Skywatching",
    titleBn: "আকাশ পর্যবেক্ষণ",
    icon: "🔭",
    color: "#1565C0",
  },
};

// ─── Gallery categories ───────────────────────────────────
export const GALLERY_CATEGORIES = [
  "Science Camps",
  "Exhibitions",
  "Awareness Campaigns",
  "Skywatching",
  "Environmental Activities",
  "Workshops",
] as const;

// ─── Policy topic tags ────────────────────────────────────
export const POLICY_TAGS = [
  "Environment",
  "Public Health",
  "Education",
  "Science Policy",
  "Technology Policy",
  "Climate Change",
  "Anti-superstition Awareness",
] as const;

// ─── Download categories ──────────────────────────────────
export const DOWNLOAD_CATEGORIES = [
  "Membership Forms",
  "Event Brochures",
  "Awareness Materials",
  "Posters",
  "Reports",
  "Publications",
] as const;

// ─── Publication categories ───────────────────────────────
export const PUBLICATION_CATEGORIES = [
  "Magazine",
  "Newsletter",
  "Report",
  "Booklet",
  "Awareness Material",
] as const;

// ─── Brand colors (aligned with SRS 5.9) ─────────────────
export const BRAND_COLORS = {
  deepBlue: "#0B3D91",
  scienceTeal: "#00897B",
  white: "#FFFFFF",
  lightGray: "#F5F7FA",
  orange: "#FF9800",
  green: "#43A047",
} as const;
