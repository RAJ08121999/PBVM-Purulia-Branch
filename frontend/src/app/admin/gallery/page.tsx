"use client"

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Image as ImageIcon, Plus, Trash2, X, Upload, ArrowLeft, Filter } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, publicApi } from "@/lib/api";

const CATEGORIES = [
  "Science Camps",
  "Exhibitions",
  "Awareness Campaigns",
  "Skywatching",
  "Environmental Activities",
  "Workshops",
];

interface GalleryImage {
  _id: string;
  fileUrl: string;
  category: string;
  caption?: { en: string; bn: string };
  uploadedAt: string;
}

export default function AdminGallery() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [captionEn, setCaptionEn] = useState("");
  const [captionBn, setCaptionBn] = useState("");
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await publicApi.getGallery({ category: activeCategory, limit: 100 });
      if (res.data.success) {
        setImages(res.data.images || []);
      }
    } catch (error) {
      console.error("[FETCH GALLERY ERROR]", error);
      toast.error("Failed to load gallery images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [activeCategory]);

  const openUploadModal = () => {
    setSelectedCategory(CATEGORIES[0]);
    setCaptionEn("");
    setCaptionBn("");
    setUploadFiles([]);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0) {
      toast.error("Please select at least one image to upload");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("category", selectedCategory);
    if (captionEn || captionBn) {
      formData.append("caption", JSON.stringify({ en: captionEn, bn: captionBn }));
    }

    uploadFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await adminApi.uploadGalleryImages(formData);
      if (res.data.success) {
        toast.success(`${res.data.images?.length || 0} images uploaded successfully!`);
        setModalOpen(false);
        fetchImages();
      }
    } catch (error: any) {
      console.error("[UPLOAD GALLERY ERROR]", error);
      toast.error(error.response?.data?.message || "Failed to upload images");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await adminApi.deleteGalleryImage(id);
      if (res.data.success) {
        toast.success("Image deleted successfully");
        fetchImages();
      }
    } catch (error) {
      console.error("[DELETE GALLERY ERROR]", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            </div>
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Photo Gallery</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Upload and manage images for the public gallery grid.
            </p>
          </div>
          <button
            onClick={openUploadModal}
            className="btn btn-primary"
            style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Upload size={18} />
            Upload Images
          </button>
        </div>

        {/* Filter Bar */}
        <div className="card" style={{ padding: "1rem 1.5rem", background: "#ffffff", display: "flex", alignItems: "center", gap: "1rem", overflowX: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-muted)", fontWeight: 600, fontSize: "0.9rem" }}>
            <Filter size={16} /> Filter:
          </div>
          <button
            onClick={() => setActiveCategory("")}
            className={`btn ${activeCategory === "" ? "btn-primary" : "btn-secondary"}`}
            style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-full)", whiteSpace: "nowrap" }}
          >
            All Images
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`btn ${activeCategory === cat ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "0.4rem 1rem", fontSize: "0.85rem", borderRadius: "var(--radius-full)", whiteSpace: "nowrap" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Image Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton" style={{ height: "180px" }} />
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <ImageIcon size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No images found in this category.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {images.map((img) => (
              <div key={img._id} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ position: "relative", aspectRatio: "4/3", backgroundColor: "var(--color-mid-gray)" }}>
                  <img src={img.fileUrl} alt="Gallery" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem", display: "flex", gap: "0.25rem" }}>
                    <button
                      onClick={() => handleDelete(img._id)}
                      style={{ background: "rgba(239, 68, 68, 0.9)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}
                      title="Delete Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem" }}>
                    <span className="badge badge-blue" style={{ fontSize: "0.6rem", backdropFilter: "blur(4px)", background: "rgba(11, 61, 145, 0.8)" }}>
                      {img.category}
                    </span>
                  </div>
                </div>
                {img.caption?.en && (
                  <div style={{ padding: "0.75rem", fontSize: "0.8rem", color: "var(--color-text-muted)", borderTop: "1px solid var(--color-mid-gray)" }}>
                    <p style={{ margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{img.caption.en}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal Dialog */}
        {modalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
            }}
          >
            <div
              className="card animate-fade-in"
              style={{
                width: "100%",
                maxWidth: "650px",
                background: "#ffffff",
                padding: "2rem",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <button
                onClick={() => setModalOpen(false)}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={20} />
              </button>

              <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", color: "var(--color-deep-blue)", fontWeight: 700 }}>
                Bulk Upload Gallery Images
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="form-group">
                    <label className="form-label">Global Caption - English (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Science Camp at Purulia High School"
                      value={captionEn}
                      onChange={(e) => setCaptionEn(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Global Caption - Bengali (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. পুরুলিয়া হাই স্কুলে বিজ্ঞান শিবির"
                      value={captionBn}
                      onChange={(e) => setCaptionBn(e.target.value)}
                    />
                  </div>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "-0.5rem", marginBottom: "1.5rem" }}>
                  * The caption will be applied to all images selected in this upload batch.
                </p>

                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <label className="form-label" style={{ margin: 0 }}>Select Image Files</label>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="btn btn-secondary"
                      style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
                    >
                      <Plus size={14} /> Add Files
                    </button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />

                  {/* Selected Files Grid */}
                  <div style={{ 
                    border: "2px dashed var(--color-mid-gray)", 
                    borderRadius: "var(--radius-md)", 
                    padding: "1.5rem", 
                    minHeight: "150px",
                    backgroundColor: "var(--color-light-gray)",
                    display: uploadFiles.length > 0 ? "grid" : "flex",
                    gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                    gap: "1rem",
                    alignItems: uploadFiles.length > 0 ? "start" : "center",
                    justifyContent: uploadFiles.length > 0 ? "start" : "center"
                  }}>
                    {uploadFiles.length === 0 ? (
                      <div style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                        <Upload size={32} style={{ margin: "0 auto 0.5rem", opacity: 0.5 }} />
                        <p style={{ fontSize: "0.85rem", margin: 0 }}>Click "Add Files" to select images.</p>
                      </div>
                    ) : (
                      uploadFiles.map((file, i) => {
                        const localPreview = URL.createObjectURL(file);
                        return (
                          <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--color-mid-gray)" }}>
                            <img src={localPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(239, 68, 68, 0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                            >
                              <X size={12} />
                            </button>
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "0.6rem", padding: "0.15rem 0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {file.name}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                    Select up to 15 images at a time. JPEG, PNG, WEBP.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "0.75rem 0" }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "0.75rem 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                    disabled={submitting || uploadFiles.length === 0}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">Uploading...</span>
                    ) : (
                      <><Upload size={18} /> Upload {uploadFiles.length} Image(s)</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
