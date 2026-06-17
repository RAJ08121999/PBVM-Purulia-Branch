import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// ─── Request Interceptor: attach JWT ──────────────────────
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("pbvm_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle 401 ─────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("pbvm_token");
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Public API helpers ───────────────────────────────────
export const publicApi = {
  // Notifications
  getNotifications: () => api.get("/notifications"),

  // Activities
  getActivities: () => api.get("/activities"),
  getActivity: (slug: string) => api.get(`/activities/${slug}`),

  // Events
  getEvents: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get("/events", { params }),
  getEvent: (id: string) => api.get(`/events/${id}`),

  // Gallery
  getGallery: (params?: { category?: string; page?: number; limit?: number }) =>
    api.get("/gallery", { params }),

  // Publications
  getPublications: (params?: { category?: string; search?: string; page?: number }) =>
    api.get("/publications", { params }),

  // Policy Articles
  getPolicyArticles: (params?: { tag?: string; page?: number }) =>
    api.get("/policy", { params }),
  getPolicyArticle: (id: string) => api.get(`/policy/${id}`),

  // Downloads
  getDownloads: (params?: { category?: string }) =>
    api.get("/downloads", { params }),
  trackDownload: (id: string) => api.post(`/downloads/${id}/track`),

  // Contact
  submitContact: (data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) => api.post("/contact", data),

  // Membership
  submitMembership: (data: object) => api.post("/membership", data),
};

// ─── Admin API helpers ────────────────────────────────────
export const adminApi = {
  // Auth
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),

  // Notifications CRUD
  createNotification: (data: object) => api.post("/notifications", data),
  updateNotification: (id: string, data: object) => api.put(`/notifications/${id}`, data),
  deleteNotification: (id: string) => api.delete(`/notifications/${id}`),

  // Activities CRUD
  updateActivity: (id: string, data: FormData) =>
    api.put(`/activities/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),

  // Events CRUD
  createEvent: (data: FormData) =>
    api.post("/events", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updateEvent: (id: string, data: FormData) =>
    api.put(`/events/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),

  // Gallery
  uploadGalleryImages: (data: FormData) =>
    api.post("/gallery", data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteGalleryImage: (id: string) => api.delete(`/gallery/${id}`),

  // Publications
  createPublication: (data: FormData) =>
    api.post("/publications", data, { headers: { "Content-Type": "multipart/form-data" } }),
  updatePublication: (id: string, data: FormData) =>
    api.put(`/publications/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } }),
  deletePublication: (id: string) => api.delete(`/publications/${id}`),

  // Policy Articles
  createPolicyArticle: (data: object) => api.post("/policy", data),
  updatePolicyArticle: (id: string, data: object) => api.put(`/policy/${id}`, data),
  deletePolicyArticle: (id: string) => api.delete(`/policy/${id}`),

  // Downloads
  createDownload: (data: FormData) =>
    api.post("/downloads", data, { headers: { "Content-Type": "multipart/form-data" } }),
  deleteDownload: (id: string) => api.delete(`/downloads/${id}`),

  // Contact Inquiries
  getContactInquiries: (params?: { status?: string; page?: number }) =>
    api.get("/contact/admin", { params }),
  updateContactStatus: (id: string, status: string) =>
    api.put(`/contact/${id}/status`, { status }),
  exportContactInquiries: () =>
    api.get("/contact/export", { responseType: "blob" }),

  // Memberships
  getMemberships: (params?: { status?: string; page?: number }) =>
    api.get("/membership/admin", { params }),
  updateMembershipStatus: (id: string, status: string) =>
    api.put(`/membership/${id}/status`, { status }),
  exportMemberships: () =>
    api.get("/membership/export", { responseType: "blob" }),

  // Admin Management (Super Admin only)
  getAdmins: () => api.get("/auth/admins"),
  createAdmin: (data: object) => api.post("/auth/admins", data),
  deleteAdmin: (id: string) => api.delete(`/auth/admins/${id}`),
};
