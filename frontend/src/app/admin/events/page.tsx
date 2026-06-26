"use client"

import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Calendar, Plus, Edit, Trash2, X, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { adminApi, publicApi } from "@/lib/api";

interface BilingualString {
  en: string;
  bn: string;
}

interface Event {
  _id: string;
  title: BilingualString;
  date: string;
  venue: string;
  description: BilingualString;
  registrationLink?: string;
  gallery: string[];
  status: "upcoming" | "past";
}

export default function AdminEvents() {
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  // Form Fields
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [regLink, setRegLink] = useState("");
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const refetchEvents = async () => {
    try {
      const res = await publicApi.getEvents({ limit: 100 });
      if (res.data.success) {
        setEvents(res.data.events || []);
      }
    } catch (error) {
      console.error("[FETCH EVENTS ERROR]", error);
      toast.error("Failed to load events");
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await publicApi.getEvents({ limit: 100 });
        if (res.data.success) {
          setEvents(res.data.events || []);
        }
      } catch (error) {
        console.error("[FETCH EVENTS ERROR]", error);
        toast.error("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setEditId(null);
    setTitleEn("");
    setTitleBn("");
    setDate("");
    setVenue("");
    setDescriptionEn("");
    setDescriptionBn("");
    setRegLink("");
    setExistingGallery([]);
    setNewGalleryFiles([]);
    setModalOpen(true);
  };

  const openEditModal = (evt: Event) => {
    setEditId(evt._id);
    setTitleEn(evt.title.en);
    setTitleBn(evt.title.bn);
    // Format date string to fit datetime-local input
    const formattedDate = new Date(evt.date).toISOString().slice(0, 16);
    setDate(formattedDate);
    setVenue(evt.venue);
    setDescriptionEn(evt.description.en);
    setDescriptionBn(evt.description.bn);
    setRegLink(evt.registrationLink || "");
    setExistingGallery(evt.gallery || []);
    setNewGalleryFiles([]);
    setModalOpen(true);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setNewGalleryFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeExistingPhoto = (url: string) => {
    setExistingGallery((prev) => prev.filter((u) => u !== url));
  };

  const removeNewPhoto = (index: number) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn || !titleBn || !date || !venue || !descriptionEn || !descriptionBn) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", JSON.stringify({ en: titleEn, bn: titleBn }));
    formData.append("date", date);
    formData.append("venue", venue);
    formData.append("description", JSON.stringify({ en: descriptionEn, bn: descriptionBn }));
    formData.append("registrationLink", regLink);
    formData.append("existingGallery", JSON.stringify(existingGallery));

    newGalleryFiles.forEach((file) => {
      formData.append("gallery", file);
    });

    try {
      if (editId) {
        const res = await adminApi.updateEvent(editId, formData);
        if (res.data.success) {
          toast.success("Event updated successfully!");
          setModalOpen(false);
          refetchEvents();
        }
      } else {
        const res = await adminApi.createEvent(formData);
        if (res.data.success) {
          toast.success("Event created successfully!");
          setModalOpen(false);
          refetchEvents();
        }
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      console.error("[SUBMIT EVENT ERROR]", error);
      toast.error(axiosError.response?.data?.message || "Failed to save event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const res = await adminApi.deleteEvent(id);
      if (res.data.success) {
        toast.success("Event deleted successfully!");
        refetchEvents();
      }
    } catch (error) {
      console.error("[DELETE EVENT ERROR]", error);
      toast.error("Failed to delete event");
    }
  };

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
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Manage Events</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Add and manage science seminars, jathas, public meetings, and camps.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="btn btn-primary"
            style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Plus size={18} />
            Add Event
          </button>
        </div>

        {/* Events List */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: "200px" }} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="card" style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <Calendar size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No events found. Click &quot;Add Event&quot; to publish your first event listing.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
            {events.map((evt) => (
              <div key={evt._id} className="card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                {evt.gallery && evt.gallery.length > 0 && (
                  <div style={{ height: "150px", overflow: "hidden", backgroundColor: "var(--color-mid-gray)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={evt.gallery[0]} alt={evt.title.en} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                )}
                <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                        {new Date(evt.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                      </span>
                      <span className={`badge ${evt.status === "upcoming" ? "badge-green" : "badge-gray"}`} style={{ fontSize: "0.65rem" }}>
                        {evt.status}
                      </span>
                    </div>

                    <h3 style={{ fontSize: "1.15rem", color: "var(--color-text)", fontWeight: 700, marginBottom: "0.5rem" }}>
                      {evt.title.en}
                    </h3>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>
                      <MapPin size={12} />
                      {evt.venue}
                    </div>

                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {evt.description.en}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", borderTop: "1px solid var(--color-mid-gray)", paddingTop: "1rem" }}>
                    <button
                      onClick={() => openEditModal(evt)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: "0.4rem 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem", fontSize: "0.8rem", borderRadius: "var(--radius-md)" }}
                    >
                      <Edit size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(evt._id)}
                      className="btn btn-orange"
                      style={{ flex: 1, padding: "0.4rem 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem", fontSize: "0.8rem", borderRadius: "var(--radius-md)", background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#ef4444", boxShadow: "none" }}
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                maxWidth: "680px",
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
                {editId ? "Edit Event" : "Create Event"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="form-group">
                    <label className="form-label">English Title</label>
                    <input type="text" className="form-input" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bengali Title</label>
                    <input type="text" className="form-input" value={titleBn} onChange={(e) => setTitleBn(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="form-group">
                    <label className="form-label">Date & Time</label>
                    <input type="datetime-local" className="form-input" value={date} onChange={(e) => setDate(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Venue Location</label>
                    <input type="text" className="form-input" placeholder="e.g. Purulia Town Hall" value={venue} onChange={(e) => setVenue(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div className="form-group">
                    <label className="form-label">English Description</label>
                    <textarea className="form-input" style={{ minHeight: "100px" }} value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bengali Description</label>
                    <textarea className="form-input" style={{ minHeight: "100px" }} value={descriptionBn} onChange={(e) => setDescriptionBn(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Registration URL Link (Optional)</label>
                  <input type="url" className="form-input" placeholder="https://forms.gle/..." value={regLink} onChange={(e) => setRegLink(e.target.value)} />
                </div>

                {/* Event Photo Manager */}
                <div className="form-group">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                    <span className="form-label">Event Photos</span>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current?.click()}
                      className="btn btn-secondary"
                      style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem", borderRadius: "var(--radius-sm)" }}
                    >
                      Choose Images
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

                  {/* Photo List Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem", border: "1px solid var(--color-mid-gray)", padding: "1rem", borderRadius: "var(--radius-md)", minHeight: "80px", backgroundColor: "var(--color-light-gray)" }}>
                    {/* Existing */}
                    {existingGallery.map((url, i) => (
                      <div key={`exist-${i}`} style={{ position: "relative", aspectRatio: "4/3", borderRadius: "4px", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Event Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(url)}
                          style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(239, 68, 68, 0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                        >
                          <X size={8} />
                        </button>
                      </div>
                    ))}
                    {/* New */}
                    {newGalleryFiles.map((file, i) => {
                      const localPreview = URL.createObjectURL(file);
                      return (
                        <div key={`new-${i}`} style={{ position: "relative", aspectRatio: "4/3", borderRadius: "4px", overflow: "hidden", border: "2px dashed var(--color-teal)" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={localPreview} alt="Event Photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => removeNewPhoto(i)}
                            style={{ position: "absolute", top: "2px", right: "2px", background: "rgba(239, 68, 68, 0.9)", color: "#fff", border: "none", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                          >
                            <X size={8} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
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
                    {submitting ? "Saving..." : "Save Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}
