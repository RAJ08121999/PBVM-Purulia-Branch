"use client"

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { FileDown, Plus, Trash2, X, Upload, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, publicApi } from "@/lib/api";

const DOWNLOAD_TYPES = ["Form", "Notice", "Result", "Other"];

interface Download {
  _id: string;
  title: { en: string; bn: string };
  type: string;
  fileUrl: string;
  uploadedAt: string;
}

export default function AdminDownloads() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [type, setType] = useState(DOWNLOAD_TYPES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDownloads = async () => {
    try {
      setLoading(true);
      const res = await publicApi.getDownloads({ limit: 100 });
      if (res.data.success) {
        setDownloads(res.data.downloads || []);
      }
    } catch (error) {
      console.error("[FETCH DOWNLOADS ERROR]", error);
      toast.error("Failed to load downloads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const openUploadModal = () => {
    setTitleEn("");
    setTitleBn("");
    setType(DOWNLOAD_TYPES[0]);
    setFile(null);
    setModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("A file is required");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", JSON.stringify({ en: titleEn, bn: titleBn }));
    formData.append("type", type);
    formData.append("file", file);

    try {
      const res = await adminApi.createDownload(formData);
      if (res.data.success) {
        toast.success("File uploaded successfully!");
        setModalOpen(false);
        fetchDownloads();
      }
    } catch (error: any) {
      console.error("[UPLOAD DOWNLOAD ERROR]", error);
      toast.error(error.response?.data?.message || "Failed to upload file");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await adminApi.deleteDownload(id);
      if (res.data.success) {
        toast.success("File deleted successfully");
        fetchDownloads();
      }
    } catch (error) {
      console.error("[DELETE DOWNLOAD ERROR]", error);
      toast.error("Failed to delete file");
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
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Downloads</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Upload and manage forms, notices, and results for public download.
            </p>
          </div>
          <button
            onClick={openUploadModal}
            className="btn btn-primary"
            style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={18} />
            Upload File
          </button>
        </div>

        {/* Downloads List */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        ) : downloads.length === 0 ? (
          <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <FileDown size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No downloadable files found.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: "0" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--color-light-gray)", textAlign: "left", color: "var(--color-text-muted)", fontSize: "0.85rem", backgroundColor: "#f8fafc" }}>
                    <th style={{ padding: "1rem 1.5rem" }}>Type</th>
                    <th style={{ padding: "1rem 1.5rem" }}>Title</th>
                    <th style={{ padding: "1rem 1.5rem" }}>Date</th>
                    <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.map((item) => (
                    <tr key={item._id} style={{ borderBottom: "1px solid var(--color-light-gray)", transition: "background-color 0.2s" }} className="hover-bg">
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span className="badge badge-blue">
                          {item.type}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <div style={{ fontWeight: 600, color: "var(--color-deep-blue)" }}>{item.title.en}</div>
                        <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", fontFamily: "var(--font-bengali)" }}>{item.title.bn}</div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                        {new Date(item.uploadedAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                            style={{ padding: "0.5rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}
                            title="Download"
                          >
                            <FileDown size={16} />
                          </a>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="btn"
                            style={{ background: "#fee2e2", color: "#ef4444", padding: "0.5rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                Upload New File
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

                <div className="form-group">
                  <label className="form-label">Category Type *</label>
                  <select
                    className="form-input"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                  >
                    {DOWNLOAD_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">File to Upload *</label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ border: "2px dashed var(--color-mid-gray)", padding: "2rem 1rem", textAlign: "center", borderRadius: "var(--radius-md)", cursor: "pointer", background: file ? "var(--color-light-gray)" : "transparent" }}
                  >
                    <FileText size={32} style={{ margin: "0 auto 0.75rem", color: file ? "var(--color-deep-blue)" : "var(--color-text-muted)" }} />
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-deep-blue)", marginBottom: "0.25rem" }}>
                      {file ? file.name : "Click to browse files"}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, DOCX, XLSX, JPG, PNG"}
                    </div>
                  </div>
                  <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: "none" }} />
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
                    disabled={submitting || !file}
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
