"use client"

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { FileText, Edit, Trash2, Plus, X, ArrowLeft, Image as ImageIcon, Globe } from "lucide-react";
import Link from "next/link";
import { adminApi, publicApi } from "@/lib/api";
import { POLICY_TAGS } from "@/lib/utils";

interface BilingualString {
  en: string;
  bn: string;
}

interface PolicyArticle {
  _id: string;
  title: BilingualString;
  body: BilingualString;
  topicTags: string[];
  coverImage?: string;
  status: "draft" | "published";
  publishDate?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminPolicyIssues() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [articles, setArticles] = useState<PolicyArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "published" | "draft">("all");

  // Form State
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyBn, setBodyBn] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Fetch both published and drafts to show to admins
      const [pubRes, draftRes] = await Promise.all([
        publicApi.getPolicyArticles({ status: "published", limit: 100 }),
        publicApi.getPolicyArticles({ status: "draft", limit: 100 }),
      ]);

      const pubList = pubRes.data.articles || [];
      const draftList = draftRes.data.articles || [];

      // Combine them and remove duplicates (just in case)
      const combined = [...pubList, ...draftList];
      const unique = combined.filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);
      
      // Sort by updatedAt descending
      unique.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setArticles(unique);
    } catch (error) {
      console.error("[FETCH POLICIES ERROR]", error);
      toast.error("Failed to load news & updates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const openCreateModal = () => {
    setEditId(null);
    setTitleEn("");
    setTitleBn("");
    setBodyEn("");
    setBodyBn("");
    setSelectedTags([]);
    setStatus("draft");
    setCoverFile(null);
    setCoverPreview("");
    setModalOpen(true);
  };

  const openEditModal = (article: PolicyArticle) => {
    setEditId(article._id);
    setTitleEn(article.title.en);
    setTitleBn(article.title.bn);
    setBodyEn(article.body.en);
    setBodyBn(article.body.bn);
    setSelectedTags(article.topicTags);
    setStatus(article.status);
    setCoverFile(null);
    setCoverPreview(article.coverImage ? (article.coverImage.startsWith("http") ? article.coverImage : `http://localhost:5000${article.coverImage}`) : "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleBn || !bodyEn || !bodyBn) {
      toast.error("All title and body fields are required");
      return;
    }
    if (selectedTags.length === 0) {
      toast.error("Please select at least one topic tag");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    
    // Structure as backend safeParse expects
    formData.append("title", JSON.stringify({ en: titleEn, bn: titleBn }));
    formData.append("body", JSON.stringify({ en: bodyEn, bn: bodyBn }));
    formData.append("topicTags", JSON.stringify(selectedTags));
    formData.append("status", status);
    
    if (coverFile) {
      formData.append("coverImage", coverFile);
    }

    try {
      if (editId) {
        const res = await adminApi.updatePolicyArticle(editId, formData);
        if (res.data.success) {
          toast.success("News & Updates updated successfully!");
          setModalOpen(false);
          fetchArticles();
        }
      } else {
        const res = await adminApi.createPolicyArticle(formData);
        if (res.data.success) {
          toast.success("News & Updates created successfully!");
          setModalOpen(false);
          fetchArticles();
        }
      }
    } catch (error: any) {
      console.error("[SUBMIT POLICY ERROR]", error);
      toast.error(error.response?.data?.message || "Failed to save news & updates");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this News article?")) {
      return;
    }

    try {
      const res = await adminApi.deletePolicyArticle(id);
      if (res.data.success) {
        toast.success("News article deleted successfully!");
        fetchArticles();
      }
    } catch (error) {
      console.error("[DELETE POLICY ERROR]", error);
      toast.error("Failed to delete news article");
    }
  };

  const filteredArticles = articles.filter(art => {
    if (activeTab === "published") return art.status === "published";
    if (activeTab === "draft") return art.status === "draft";
    return true;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
          <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Manage News & Updates </h1>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
            Publish research articles, scientific viewpoint papers, and news & updates alerts for Purulia.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="btn btn-primary"
          style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <Plus size={18} />
          Add News Article
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--color-mid-gray)", gap: "1.5rem" }}>
        <button
          onClick={() => setActiveTab("all")}
          style={{
            padding: "0.75rem 0.5rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "all" ? "3px solid var(--color-deep-blue)" : "3px solid transparent",
            color: activeTab === "all" ? "var(--color-deep-blue)" : "var(--color-text-muted)",
            fontWeight: activeTab === "all" ? 700 : 500,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          All Articles ({articles.length})
        </button>
        <button
          onClick={() => setActiveTab("published")}
          style={{
            padding: "0.75rem 0.5rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "published" ? "3px solid var(--color-deep-blue)" : "3px solid transparent",
            color: activeTab === "published" ? "var(--color-deep-blue)" : "var(--color-text-muted)",
            fontWeight: activeTab === "published" ? 700 : 500,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Published ({articles.filter(a => a.status === "published").length})
        </button>
        <button
          onClick={() => setActiveTab("draft")}
          style={{
            padding: "0.75rem 0.5rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "draft" ? "3px solid var(--color-deep-blue)" : "3px solid transparent",
            color: activeTab === "draft" ? "var(--color-deep-blue)" : "var(--color-text-muted)",
            fontWeight: activeTab === "draft" ? 700 : 500,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Drafts ({articles.filter(a => a.status === "draft").length})
        </button>
      </div>

      {/* Table / Grid */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: "100px" }} />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
          <FileText size={48} style={{ margin: "0 auto 1.5rem", opacity: 0.4, color: "var(--color-deep-blue)" }} />
          <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>No articles found</p>
          <p style={{ fontSize: "0.9rem" }}>{`Get started by clicking the "Add News Article" button above.`}</p>
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ overflowX: "auto", background: "#ffffff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-mid-gray)", backgroundColor: "var(--color-light-gray)" }}>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600, width: "80px" }}>Cover</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Title</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Tags</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Updated</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((art) => (
                <tr key={art._id} style={{ borderBottom: "1px solid var(--color-mid-gray)" }} className="hover:bg-slate-50">
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ width: "50px", height: "40px", borderRadius: "4px", backgroundColor: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyItems: "center" }}>
                      {art.coverImage ? (
                        <img
                          src={art.coverImage.startsWith("http") ? art.coverImage : `http://localhost:5000${art.coverImage}`}
                          alt="Cover"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <ImageIcon size={18} style={{ margin: "auto", color: "var(--color-text-muted)" }} />
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ fontWeight: 600, color: "var(--color-text)", fontSize: "0.95rem" }}>
                      {art.title.en}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.15rem" }}>
                      {art.title.bn}
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", maxWidth: "200px" }}>
                      {art.topicTags.map((tag) => (
                        <span
                          key={tag}
                          className="badge"
                          style={{
                            fontSize: "0.65rem",
                            backgroundColor: "rgba(0, 137, 123, 0.08)",
                            color: "var(--color-teal)",
                            padding: "0.15rem 0.4rem"
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span className={`badge ${art.status === "published" ? "badge-green" : "badge-gray"}`}>
                      {art.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                    {new Date(art.updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => openEditModal(art)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-deep-blue)" }}
                        title="Edit Article"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(art._id)}
                        style={{ background: "transparent", border: "none", cursor: "pointer", color: "red" }}
                        title="Delete Article"
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
      )}

      {/* Editor Modal */}
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
            padding: "1rem",
            boxSizing: "border-box"
          }}
        >
          <div
            className="card animate-fade-in"
            style={{
              width: "100%",
              maxWidth: "800px",
              maxHeight: "90vh",
              background: "#ffffff",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <button
              onClick={() => setModalOpen(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-muted)",
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Header */}
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--color-mid-gray)" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 750, color: "var(--color-deep-blue)", margin: 0 }}>
                {editId ? "Edit News Article" : "Create News Article"}
              </h3>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} style={{ overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Title Section */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="grid grid-cols-1 md:grid-cols-2">
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Globe size={14} /> Title (English)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Deforestation impact in Ajodhya hills"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    Title (Bengali)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="উদাঃ অযোধ্যা পাহাড়ের তীব্র জলসংকট"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Topic Tags Checkboxes */}
              <div>
                <label className="form-label">Topic Tags (Select all that apply)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
                  {POLICY_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "var(--radius-sm)",
                          border: isSelected ? "1px solid var(--color-teal)" : "1px solid var(--color-mid-gray)",
                          backgroundColor: isSelected ? "rgba(0, 137, 123, 0.08)" : "transparent",
                          color: isSelected ? "var(--color-teal)" : "var(--color-text)",
                          fontSize: "0.8rem",
                          fontWeight: isSelected ? 700 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Body Section */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <Globe size={14} /> Full Body Content (English)
                  </label>
                  <textarea
                    className="form-input"
                    rows={6}
                    placeholder="Write full article description here..."
                    value={bodyEn}
                    onChange={(e) => setBodyEn(e.target.value)}
                    required
                    style={{ resize: "vertical", fontFamily: "var(--font-body)" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Full Body Content (Bengali)</label>
                  <textarea
                    className="form-input"
                    rows={6}
                    placeholder="এখানে আপনার সম্পূর্ণ প্রবন্ধটি লিখুন..."
                    value={bodyBn}
                    onChange={(e) => setBodyBn(e.target.value)}
                    required
                    style={{ resize: "vertical", fontFamily: "var(--font-body)" }}
                  />
                </div>
              </div>

              {/* Cover Image upload & status */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Image Upload */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Cover Image (Optional)</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: "0.6rem 1rem",
                        borderRadius: "var(--radius-md)",
                        border: "2px dashed var(--color-mid-gray)",
                        background: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.85rem",
                        color: "var(--color-text-muted)"
                      }}
                    >
                      <ImageIcon size={16} /> Choose Image
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                    {coverPreview && (
                      <div style={{ position: "relative", width: "50px", height: "40px", borderRadius: "4px", overflow: "hidden" }}>
                        <img src={coverPreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => {
                            setCoverFile(null);
                            setCoverPreview("");
                          }}
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            width: "16px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                          }}
                        >
                          <X size={10} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Publish Status */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Publishing Status</label>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="status"
                        checked={status === "draft"}
                        onChange={() => setStatus("draft")}
                        style={{ accentColor: "var(--color-deep-blue)" }}
                      />
                      Draft
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem", cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="status"
                        checked={status === "published"}
                        onChange={() => setStatus("published")}
                        style={{ accentColor: "var(--color-green)" }}
                      />
                      Published
                    </label>
                  </div>
                </div>

              </div>

              {/* Modal Footer Buttons */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", borderTop: "1px solid var(--color-mid-gray)", paddingTop: "1.5rem" }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "0.6rem 0" }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "0.6rem 0" }}
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save News Article"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
