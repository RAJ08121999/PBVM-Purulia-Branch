"use client"

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Book, Plus, Trash2, X, Upload, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, publicApi } from "@/lib/api";

const PUBLICATION_TYPES = ["Book", "Magazine", "Report", "Other"];

interface Publication {
  _id: string;
  title: { en: string; bn: string };
  type: string;
  pdfUrl: string;
  coverImageUrl?: string;
  publishedDate: string;
  author?: string;
}

export default function AdminPublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [type, setType] = useState(PUBLICATION_TYPES[0]);
  const [author, setAuthor] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const res = await publicApi.getPublications({ limit: 100 });
      if (res.data.success) {
        setPublications(res.data.publications || []);
      }
    } catch (error) {
      console.error("[FETCH PUBLICATIONS ERROR]", error);
      toast.error("Failed to load publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const openUploadModal = () => {
    setTitleEn("");
    setTitleBn("");
    setType(PUBLICATION_TYPES[0]);
    setAuthor("");
    setPublishedDate(new Date().toISOString().split("T")[0]);
    setPdfFile(null);
    setCoverFile(null);
    setModalOpen(true);
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      setPdfFile(file);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file for the cover");
        return;
      }
      setCoverFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error("A PDF file is required");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", JSON.stringify({ en: titleEn, bn: titleBn }));
    formData.append("type", type);
    if (author) formData.append("author", author);
    if (publishedDate) formData.append("publishedDate", publishedDate);
    formData.append("pdf", pdfFile);
    if (coverFile) {
      formData.append("cover", coverFile);
    }

    try {
      const res = await adminApi.createPublication(formData);
      if (res.data.success) {
        toast.success("Publication uploaded successfully!");
        setModalOpen(false);
        fetchPublications();
      }
    } catch (error: any) {
      console.error("[UPLOAD PUBLICATION ERROR]", error);
      toast.error(error.response?.data?.message || "Failed to upload publication");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this publication?")) return;

    try {
      const res = await adminApi.deletePublication(id);
      if (res.data.success) {
        toast.success("Publication deleted successfully");
        fetchPublications();
      }
    } catch (error) {
      console.error("[DELETE PUBLICATION ERROR]", error);
      toast.error("Failed to delete publication");
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
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Publications</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Upload and manage books, magazines, and reports (PDFs).
            </p>
          </div>
          <button
            onClick={openUploadModal}
            className="btn btn-primary"
            style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={18} />
            Upload Publication
          </button>
        </div>

        {/* Publications Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: "300px" }} />
            ))}
          </div>
        ) : publications.length === 0 ? (
          <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <Book size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No publications found.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {publications.map((pub) => (
              <div key={pub._id} className="card" style={{ display: "flex", flexDirection: "column", overflow: "hidden", position: "relative" }}>
                <div style={{ position: "relative", aspectRatio: "3/4", backgroundColor: "var(--color-light-gray)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {pub.coverImageUrl ? (
                    <img src={pub.coverImageUrl} alt={pub.title.en} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <FileText size={64} style={{ color: "var(--color-mid-gray)" }} />
                  )}
                  <div style={{ position: "absolute", top: "0.5rem", right: "0.5rem" }}>
                    <span className="badge badge-orange" style={{ backdropFilter: "blur(4px)", background: "rgba(224, 122, 95, 0.9)" }}>
                      {pub.type}
                    </span>
                  </div>
                </div>
                
                <div style={{ padding: "1.25rem", display: "flex", flexDirection: "column", flex: 1, gap: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-deep-blue)", margin: 0, lineHeight: 1.3 }}>
                    {pub.title.en}
                  </h3>
                  <h4 style={{ fontSize: "0.95rem", color: "var(--color-text-muted)", margin: 0, fontWeight: 400, fontFamily: "var(--font-bengali)" }}>
                    {pub.title.bn}
                  </h4>
                  <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: "auto", paddingTop: "0.5rem" }}>
                    {pub.author && <div><strong>Author:</strong> {pub.author}</div>}
                    <div><strong>Published:</strong> {new Date(pub.publishedDate).toLocaleDateString()}</div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: "0.5rem", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem", borderRadius: "var(--radius-sm)" }}
                    >
                      <FileText size={14} /> View PDF
                    </a>
                    <button
                      onClick={() => handleDelete(pub._id)}
                      className="btn"
                      style={{ background: "#fee2e2", color: "#ef4444", padding: "0.5rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
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
                maxWidth: "600px",
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
                Upload New Publication
              </h3>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Title (English) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Title (Bengali) *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={titleBn}
                      onChange={(e) => setTitleBn(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div className="form-group">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-input"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      required
                    >
                      {PUBLICATION_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Published Date *</label>
                    <input
                      type="date"
                      className="form-input"
                      value={publishedDate}
                      onChange={(e) => setPublishedDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Author / Editor (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "0.5rem" }}>
                  {/* PDF Upload */}
                  <div className="form-group">
                    <label className="form-label">PDF File *</label>
                    <div 
                      onClick={() => pdfInputRef.current?.click()}
                      style={{ border: "2px dashed var(--color-mid-gray)", padding: "1.5rem 1rem", textAlign: "center", borderRadius: "var(--radius-md)", cursor: "pointer", background: pdfFile ? "var(--color-light-gray)" : "transparent" }}
                    >
                      <FileText size={24} style={{ margin: "0 auto 0.5rem", color: pdfFile ? "var(--color-deep-blue)" : "var(--color-text-muted)" }} />
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-blue)", marginBottom: "0.25rem" }}>
                        {pdfFile ? pdfFile.name : "Select PDF File"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : "Required"}
                      </div>
                    </div>
                    <input ref={pdfInputRef} type="file" accept="application/pdf" onChange={handlePdfChange} style={{ display: "none" }} />
                  </div>

                  {/* Cover Upload */}
                  <div className="form-group">
                    <label className="form-label">Cover Image (Optional)</label>
                    <div 
                      onClick={() => coverInputRef.current?.click()}
                      style={{ border: "2px dashed var(--color-mid-gray)", padding: "1.5rem 1rem", textAlign: "center", borderRadius: "var(--radius-md)", cursor: "pointer", background: coverFile ? "var(--color-light-gray)" : "transparent" }}
                    >
                      <ImageIcon size={24} style={{ margin: "0 auto 0.5rem", color: coverFile ? "var(--color-deep-blue)" : "var(--color-text-muted)" }} />
                      <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-blue)", marginBottom: "0.25rem" }}>
                        {coverFile ? coverFile.name : "Select Cover Image"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {coverFile ? `${(coverFile.size / 1024 / 1024).toFixed(2)} MB` : "JPEG, PNG, WEBP"}
                      </div>
                    </div>
                    <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverChange} style={{ display: "none" }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, borderRadius: "var(--radius-md)" }}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                    disabled={submitting || !pdfFile}
                  >
                    {submitting ? "Uploading..." : <><Upload size={18} /> Upload</>}
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

// Need to import ImageIcon locally inside the file since it's used but not imported
function ImageIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
}
