"use client"

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, Edit, Trash2, Pin, Archive, Plus, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi, publicApi } from "@/lib/api";

interface Notification {
  _id: string;
  title: string;
  body?: string;
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await publicApi.getNotifications();
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (error) {
      console.error("[FETCH NOTIFS ERROR]", error);
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setTitle("");
    setBody("");
    setIsPinned(false);
    setIsArchived(false);
    setModalOpen(true);
  };

  const openEditModal = (notif: Notification) => {
    setEditId(notif._id);
    setTitle(notif.title);
    setBody(notif.body || "");
    setIsPinned(notif.isPinned);
    setIsArchived(notif.isArchived);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      toast.error("Title is required");
      return;
    }

    setSubmitting(true);
    const data = { title, body, isPinned, isArchived };

    try {
      if (editId) {
        const res = await adminApi.updateNotification(editId, data);
        if (res.data.success) {
          toast.success("Notification updated successfully!");
          setModalOpen(false);
          fetchNotifications();
        }
      } else {
        const res = await adminApi.createNotification(data);
        if (res.data.success) {
          toast.success("Notification created successfully!");
          setModalOpen(false);
          fetchNotifications();
        }
      }
    } catch (error: any) {
      console.error("[SUBMIT NOTIF ERROR]", error);
      toast.error(error.response?.data?.message || "Failed to save notification");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this notification?")) {
      return;
    }

    try {
      const res = await adminApi.deleteNotification(id);
      if (res.data.success) {
        toast.success("Notification deleted successfully!");
        fetchNotifications();
      }
    } catch (error) {
      console.error("[DELETE NOTIF ERROR]", error);
      toast.error("Failed to delete notification");
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
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Manage Notifications</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Create, update, or pin notifications displayed in the sidebar on the homepage.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn btn-primary"
            style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={18} />
            Add Notice
          </button>
        </div>

        {/* Notices Table / Grid */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: "80px" }} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <Bell size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No notifications found. Click "Add Notice" to publish your first announcement.</p>
          </div>
        ) : (
          <div className="card" style={{ overflowX: "auto", background: "#ffffff" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-mid-gray)", backgroundColor: "var(--color-light-gray)" }}>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Title</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Preview</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Flags</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Date</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", color: "var(--color-text-muted)", fontWeight: 600, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif) => (
                  <tr key={notif._id} style={{ borderBottom: "1px solid var(--color-mid-gray)" }} className="hover:bg-slate-50">
                    <td style={{ padding: "1.25rem 1.5rem", fontWeight: 600, color: "var(--color-text)", fontSize: "0.95rem" }}>
                      {notif.title}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.875rem", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {notif.body || "N/A"}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {notif.isPinned && (
                          <span className="badge badge-orange" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.65rem" }}>
                            <Pin size={10} /> Pinned
                          </span>
                        )}
                        {notif.isArchived && (
                          <span className="badge badge-gray" style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontSize: "0.65rem" }}>
                            <Archive size={10} /> Archived
                          </span>
                        )}
                        {!notif.isPinned && !notif.isArchived && (
                          <span className="badge badge-blue" style={{ fontSize: "0.65rem" }}>Active</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                      {new Date(notif.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                    </td>
                    <td style={{ padding: "1.25rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => openEditModal(notif)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-deep-blue)" }}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(notif._id)}
                          style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444" }}
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
        )}

        {/* Modal Dialog */}
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
                maxWidth: "550px",
                background: "#ffffff",
                padding: "2rem",
                position: "relative",
              }}
            >
              <button
                onClick={() => setModalOpen(false)}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={20} />
              </button>

              <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", color: "var(--color-deep-blue)", fontWeight: 700 }}>
                {editId ? "Edit Notification" : "Add Notification"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="notif-title">
                    Notice Title
                  </label>
                  <input
                    id="notif-title"
                    type="text"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Purulia Science Camp Registrations Open"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="notif-body">
                    Body Description
                  </label>
                  <textarea
                    id="notif-body"
                    className="form-input"
                    style={{ minHeight: "120px", resize: "vertical" }}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Provide details about the announcement..."
                  />
                </div>

                <div style={{ display: "flex", gap: "2rem", margin: "1.5rem 0" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <span>Pin notice to top of the list</span>
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.9rem" }}>
                    <input
                      type="checkbox"
                      checked={isArchived}
                      onChange={(e) => setIsArchived(e.target.checked)}
                      style={{ width: "16px", height: "16px" }}
                    />
                    <span>Archive (Hide from public)</span>
                  </label>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "0.6rem 0" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "0.6rem 0" }}
                    disabled={submitting}
                  >
                    {submitting ? "Saving..." : "Save Notice"}
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
