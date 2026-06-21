"use client"

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Edit, Save, X, Plus, Trash2, ArrowLeft, Image as ImageIcon, Video, HelpCircle } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, publicApi } from "@/lib/api";

interface BilingualString {
  en: string;
  bn: string;
}

interface ImpactStat {
  label: BilingualString;
  value: string;
}

interface ActivityData {
  _id: string;
  slug: string;
  title: BilingualString;
  bannerImage: string;
  introduction: BilingualString;
  objectives: BilingualString[];
  gallery: string[];
  reports: BilingualString[];
  videoEmbedUrl?: string;
  impactStats: ImpactStat[];
}

export default function AdminActivities() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);

  // Form Fields
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [introEn, setIntroEn] = useState("");
  const [introBn, setIntroBn] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [objectives, setObjectives] = useState<BilingualString[]>([]);
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([]);
  const [reports, setReports] = useState<BilingualString[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  
  // File state
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const fetchActivities = async () => {
    try {
      const res = await publicApi.getActivities();
      if (res.data.success) {
        setActivities(res.data.activities || []);
      }
    } catch (error) {
      console.error("[FETCH ACTIVITIES ERROR]", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const startEdit = (activity: ActivityData) => {
    setSelectedActivity(activity);
    setTitleEn(activity.title.en);
    setTitleBn(activity.title.bn);
    setIntroEn(activity.introduction.en);
    setIntroBn(activity.introduction.bn);
    setVideoUrl(activity.videoEmbedUrl || "");
    setObjectives([...activity.objectives]);
    setImpactStats([...activity.impactStats]);
    setReports([...activity.reports]);
    setExistingGallery([...activity.gallery]);
    
    // Clear files
    setBannerFile(null);
    setBannerPreview(activity.bannerImage);
    setNewGalleryFiles([]);
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const arr = Array.from(files);
      setNewGalleryFiles((prev) => [...prev, ...arr]);
    }
  };

  // Objectives Dynamic Array
  const addObjective = () => {
    setObjectives((prev) => [...prev, { en: "", bn: "" }]);
  };
  const updateObjective = (index: number, lang: "en" | "bn", value: string) => {
    setObjectives((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [lang]: value };
      return clone;
    });
  };
  const removeObjective = (index: number) => {
    setObjectives((prev) => prev.filter((_, i) => i !== index));
  };

  // Impact Stats Dynamic Array
  const addImpactStat = () => {
    setImpactStats((prev) => [...prev, { label: { en: "", bn: "" }, value: "" }]);
  };
  const updateImpactStat = (index: number, field: "en" | "bn" | "value", val: string) => {
    setImpactStats((prev) => {
      const clone = [...prev];
      if (field === "value") {
        clone[index] = { ...clone[index], value: val };
      } else {
        clone[index] = {
          ...clone[index],
          label: { ...clone[index].label, [field]: val },
        };
      }
      return clone;
    });
  };
  const removeImpactStat = (index: number) => {
    setImpactStats((prev) => prev.filter((_, i) => i !== index));
  };

  // Reports Dynamic Array
  const addReport = () => {
    setReports((prev) => [...prev, { en: "", bn: "" }]);
  };
  const updateReport = (index: number, lang: "en" | "bn", val: string) => {
    setReports((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [lang]: val };
      return clone;
    });
  };
  const removeReport = (index: number) => {
    setReports((prev) => prev.filter((_, i) => i !== index));
  };

  // Gallery Deletion
  const removeExistingGalleryImage = (imgUrl: string) => {
    setExistingGallery((prev) => prev.filter((u) => u !== imgUrl));
  };

  const removeNewGalleryImage = (index: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;

    setSaving(true);
    const formData = new FormData();

    formData.append("title", JSON.stringify({ en: titleEn, bn: titleBn }));
    formData.append("introduction", JSON.stringify({ en: introEn, bn: introBn }));
    formData.append("objectives", JSON.stringify(objectives));
    formData.append("impactStats", JSON.stringify(impactStats));
    formData.append("reports", JSON.stringify(reports));
    formData.append("videoEmbedUrl", videoUrl);
    formData.append("existingGallery", JSON.stringify(existingGallery));

    if (bannerFile) {
      formData.append("bannerImage", bannerFile);
    }

    newGalleryFiles.forEach((file) => {
      formData.append("gallery", file);
    });

    try {
      const res = await adminApi.updateActivity(selectedActivity._id, formData);
      if (res.data.success) {
        toast.success("Activity details updated successfully!");
        setSelectedActivity(null);
        fetchActivities();
      }
    } catch (error: any) {
      console.error("[SAVE ACTIVITY ERROR]", error);
      toast.error(error.response?.data?.message || "Failed to update activity");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* Header Block */}
        {!selectedActivity && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            </div>
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Core Activities</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Configure the banner, text objectives, statistics, and reports for the 10 main activity pages.
            </p>
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: "180px" }} />
            ))}
          </div>
        ) : !selectedActivity ? (
          /* Activities Grid List */
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {activities.map((act) => (
              <div key={act._id} className="card" style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ position: "relative", height: "140px", backgroundColor: "var(--color-mid-gray)" }}>
                  <img src={act.bannerImage} alt={act.title.en} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", display: "flex", alignItems: "flex-end", padding: "1rem" }}>
                    <h3 style={{ color: "#ffffff", fontSize: "1.1rem", margin: 0, fontWeight: 700 }}>
                      {act.title.en}
                    </h3>
                  </div>
                </div>
                <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Slug: /{act.slug}
                    </span>
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", margin: "0.5rem 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {act.introduction.en}
                    </p>
                  </div>
                  <button
                    onClick={() => startEdit(act)}
                    className="btn btn-secondary"
                    style={{ width: "100%", padding: "0.5rem 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", borderRadius: "var(--radius-md)", fontSize: "0.875rem", marginTop: "1rem" }}
                  >
                    <Edit size={14} /> Configure Content
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Activity Content Editing Form */
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Form Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                onClick={() => setSelectedActivity(null)}
                style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "transparent", border: "none", color: "var(--color-text-muted)", cursor: "pointer", fontSize: "0.9rem" }}
              >
                <ArrowLeft size={16} /> Cancel Editing
              </button>
              <h2 style={{ fontSize: "1.5rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>
                Edit: {selectedActivity.title.en}
              </h2>
            </div>

            <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
              {/* Row 1: Title & Banner */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
                <div className="card" style={{ padding: "2rem", background: "#ffffff" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--color-deep-blue)", fontWeight: 700 }}>
                    Section Titles
                  </h3>
                  <div className="form-group">
                    <label className="form-label">English Title</label>
                    <input type="text" className="form-input" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bengali Title (Unicode)</label>
                    <input type="text" className="form-input" value={titleBn} onChange={(e) => setTitleBn(e.target.value)} required />
                  </div>
                </div>

                <div className="card" style={{ padding: "2rem", background: "#ffffff" }}>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--color-deep-blue)", fontWeight: 700 }}>
                    Banner Image
                  </h3>
                  <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                    <div style={{ width: "120px", height: "80px", borderRadius: "8px", overflow: "hidden", backgroundColor: "var(--color-mid-gray)" }}>
                      <img src={bannerPreview} alt="Banner Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-secondary"
                        style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-md)" }}
                      >
                        Change Image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleBannerChange}
                        style={{ display: "none" }}
                      />
                      <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                        Landscape format recommended. Compression done on upload.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Introduction Block */}
              <div className="card" style={{ padding: "2rem", background: "#ffffff" }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--color-deep-blue)", fontWeight: 700 }}>
                  Introduction Paragraphs
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <div className="form-group">
                    <label className="form-label">English Introduction</label>
                    <textarea className="form-input" style={{ minHeight: "150px" }} value={introEn} onChange={(e) => setIntroEn(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bengali Introduction</label>
                    <textarea className="form-input" style={{ minHeight: "150px" }} value={introBn} onChange={(e) => setIntroBn(e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Row 3: Objectives & Video Embed */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "2rem" }}>
                {/* Objectives */}
                <div className="card" style={{ padding: "2rem", background: "#ffffff", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                    <h3 style={{ fontSize: "1.1rem", color: "var(--color-deep-blue)", fontWeight: 700, margin: 0 }}>
                      Activity Objectives
                    </h3>
                    <button
                      type="button"
                      onClick={addObjective}
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "0.25rem" }}
                      className="btn btn-secondary"
                    >
                      <Plus size={12} /> Add
                    </button>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflowY: "auto", maxHeight: "350px" }}>
                    {objectives.map((obj, i) => (
                      <div key={i} style={{ border: "1px solid var(--color-mid-gray)", padding: "1rem", borderRadius: "8px", position: "relative" }}>
                        <button
                          type="button"
                          onClick={() => removeObjective(i)}
                          style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="form-group" style={{ marginBottom: "0.5rem" }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
                            placeholder="Objective English"
                            value={obj.en}
                            onChange={(e) => updateObjective(i, "en", e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
                            placeholder="Objective Bengali"
                            value={obj.bn}
                            onChange={(e) => updateObjective(i, "bn", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video URL & Stats */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {/* Video Embed */}
                  <div className="card" style={{ padding: "2rem", background: "#ffffff" }}>
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "1.25rem", color: "var(--color-deep-blue)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Video size={16} /> Video Presentation
                    </h3>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">YouTube Embed URL</label>
                      <input
                        type="url"
                        className="form-input"
                        placeholder="https://www.youtube.com/embed/..."
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                      />
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem", display: "block" }}>
                        Make sure the URL is in the correct <strong>/embed/</strong> format.
                      </span>
                    </div>
                  </div>

                  {/* Impact Stats */}
                  <div className="card" style={{ padding: "2rem", background: "#ffffff", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                      <h3 style={{ fontSize: "1.1rem", color: "var(--color-deep-blue)", fontWeight: 700, margin: 0 }}>
                        Impact Statistics
                      </h3>
                      <button
                        type="button"
                        onClick={addImpactStat}
                        style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "0.25rem" }}
                        className="btn btn-secondary"
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflowY: "auto", maxHeight: "200px" }}>
                      {impactStats.map((stat, i) => (
                        <div key={i} style={{ border: "1px solid var(--color-mid-gray)", padding: "1rem", borderRadius: "8px", position: "relative" }}>
                          <button
                            type="button"
                            onClick={() => removeImpactStat(i)}
                            style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "transparent", border: "none", color: "#ef4444", cursor: "pointer" }}
                          >
                            <Trash2 size={14} />
                          </button>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "0.5rem" }}>
                            <input
                              type="text"
                              className="form-input"
                              style={{ fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
                              placeholder="Label En (e.g. Camps)"
                              value={stat.label.en}
                              onChange={(e) => updateImpactStat(i, "en", e.target.value)}
                              required
                            />
                            <input
                              type="text"
                              className="form-input"
                              style={{ fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
                              placeholder="Label Bn (e.g. শিবির)"
                              value={stat.label.bn}
                              onChange={(e) => updateImpactStat(i, "bn", e.target.value)}
                              required
                            />
                          </div>
                          <input
                            type="text"
                            className="form-input"
                            style={{ fontSize: "0.85rem", padding: "0.4rem 0.6rem" }}
                            placeholder="Value (e.g. 42+)"
                            value={stat.value}
                            onChange={(e) => updateImpactStat(i, "value", e.target.value)}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Photo Gallery Editor */}
              <div className="card" style={{ padding: "2rem", background: "#ffffff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ fontSize: "1.1rem", color: "var(--color-deep-blue)", fontWeight: 700, margin: 0 }}>
                    Activity Photo Gallery
                  </h3>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="btn btn-secondary"
                    style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-md)" }}
                  >
                    <Plus size={14} /> Add Images
                  </button>
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryChange}
                    style={{ display: "none" }}
                  />
                </div>

                {/* Gallery Images List */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "1rem" }}>
                  {/* Existing gallery */}
                  {existingGallery.map((imgUrl, i) => (
                    <div key={`exist-${i}`} style={{ position: "relative", aspectRatio: "4/3", borderRadius: "6px", overflow: "hidden", border: "1px solid var(--color-mid-gray)" }}>
                      <img src={imgUrl} alt={`Gallery ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button
                        type="button"
                        onClick={() => removeExistingGalleryImage(imgUrl)}
                        style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(239, 68, 68, 0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {/* New files gallery */}
                  {newGalleryFiles.map((file, i) => {
                    const localPreview = URL.createObjectURL(file);
                    return (
                      <div key={`new-${i}`} style={{ position: "relative", aspectRatio: "4/3", borderRadius: "6px", overflow: "hidden", border: "2px dashed var(--color-teal)" }}>
                        <img src={localPreview} alt={`New Gallery ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => removeNewGalleryImage(i)}
                          style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(239, 68, 68, 0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        >
                          <X size={10} />
                        </button>
                        <span style={{ position: "absolute", bottom: "4px", left: "4px", fontSize: "0.6rem", background: "rgba(0,137,123,0.9)", color: "#fff", padding: "1px 4px", borderRadius: "2px" }}>
                          New
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Save Button */}
              <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setSelectedActivity(null)}
                  className="btn btn-secondary"
                  style={{ borderRadius: "var(--radius-md)", padding: "0.75rem 2rem" }}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ borderRadius: "var(--radius-md)", padding: "0.75rem 2.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}
                  disabled={saving}
                >
                  <Save size={16} />
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
