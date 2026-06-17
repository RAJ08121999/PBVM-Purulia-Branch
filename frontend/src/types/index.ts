// ============================================================
// PBVM Purulia Website — Shared TypeScript Types
// ============================================================

// ─── Bilingual String ─────────────────────────────────────
export interface BilingualString {
  en: string;
  bn: string;
}

// ─── Admin / Auth ─────────────────────────────────────────
export type AdminRole = "Administrator" | "SuperAdministrator";

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
}

// ─── Notification ─────────────────────────────────────────
export interface Notification {
  _id: string;
  title: string;
  body?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdBy: string | Admin;
  createdAt: string;
  updatedAt: string;
}

// ─── Activity ─────────────────────────────────────────────
export type ActivitySlug =
  | "environment-biodiversity"
  | "health"
  | "agriculture"
  | "childrens-science"
  | "jatha-cultural"
  | "technology-application"
  | "st-application-centre"
  | "hands-on-experiments"
  | "samata"
  | "skywatching";

export interface ImpactStat {
  label: BilingualString;
  value: string;
}

export interface Activity {
  _id: string;
  slug: ActivitySlug | string;
  title: BilingualString;
  bannerImage: string;
  introduction: BilingualString;
  objectives: BilingualString[];
  gallery: string[];
  reports: BilingualString[];
  videoEmbedUrl?: string;
  impactStats: ImpactStat[];
  createdAt: string;
  updatedAt: string;
}

// ─── Event ────────────────────────────────────────────────
export type EventStatus = "upcoming" | "past";

export interface Event {
  _id: string;
  title: BilingualString;
  date: string;
  venue: string;
  description: BilingualString;
  registrationLink?: string;
  gallery: string[];
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Gallery Image ────────────────────────────────────────
export type GalleryCategory =
  | "Science Camps"
  | "Exhibitions"
  | "Awareness Campaigns"
  | "Skywatching"
  | "Environmental Activities"
  | "Workshops";

export interface GalleryImage {
  _id: string;
  fileUrl: string;
  category: GalleryCategory;
  caption?: BilingualString;
  relatedActivity?: string;
  relatedEvent?: string;
  uploadedAt: string;
}

// ─── Publication ──────────────────────────────────────────
export type PublicationCategory =
  | "Magazine"
  | "Newsletter"
  | "Report"
  | "Booklet"
  | "Awareness Material";

export interface Publication {
  _id: string;
  title: BilingualString;
  category: PublicationCategory;
  description?: BilingualString;
  thumbnailImage?: string;
  pdfFile: string;
  publishDate: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Policy Article ───────────────────────────────────────
export type PolicyTopicTag =
  | "Environment"
  | "Public Health"
  | "Education"
  | "Science Policy"
  | "Technology Policy"
  | "Climate Change"
  | "Anti-superstition Awareness";

export type ArticleStatus = "draft" | "published";

export interface PolicyArticle {
  _id: string;
  title: BilingualString;
  topicTags: PolicyTopicTag[];
  body: BilingualString;
  coverImage?: string;
  status: ArticleStatus;
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Downloadable Resource ────────────────────────────────
export type DownloadCategory =
  | "Membership Forms"
  | "Event Brochures"
  | "Awareness Materials"
  | "Posters"
  | "Reports"
  | "Publications";

export interface Download {
  _id: string;
  title: BilingualString;
  category: DownloadCategory;
  file: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Contact Inquiry ──────────────────────────────────────
export type ContactStatus = "new" | "reviewed";

export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  submittedAt: string;
  status: ContactStatus;
}

// ─── Membership Application ───────────────────────────────
export type MembershipStatus = "pending" | "approved" | "rejected";

export interface MembershipApplication {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  occupation: string;
  educationalQualification: string;
  address: string;
  district: string;
  state: string;
  phoneNumber: string;
  email: string;
  areasOfInterest: string[];
  motivation: string;
  status: MembershipStatus;
  submittedAt: string;
}

// ─── API Response Helpers ─────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}
