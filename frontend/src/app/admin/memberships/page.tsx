"use client"

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Users, Trash2, ArrowLeft, Download, Eye, X, Check, XCircle, UserCircle, Award } from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import type { MembershipApplication, MembershipStatus } from "@/types";

type Membership = MembershipApplication;

const statusLabels: Record<MembershipStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const membershipTypeLabel = (type?: string) => {
  if (type === "volunteer") return "Volunteer";
  return "General Member";
};

// Resolve photo URL: if absolute (Cloudinary), use as-is; if relative, prepend backend base
const resolvePhotoUrl = (photo: string | undefined, backendBase: string): string => {
  if (!photo) return "";
  if (photo.startsWith("http://") || photo.startsWith("https://")) return photo;
  return `${backendBase}${photo}`;
};

const membershipTypeBadgeStyle = (type?: string) => {
  if (type === "volunteer") return { background: "#fff3e0", color: "#f57c00", border: "1px solid #ffe0b2" };
  return { background: "#e3f2fd", color: "#1565c0", border: "1px solid #bbdefb" };
};

export default function AdminMemberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "member" | "volunteer">("all");
  
  // View Modal State
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  const fetchMemberships = useCallback(async () => {
    try {
      const res = await adminApi.getMemberships();
      if (res.data.success) {
        setMemberships(res.data.memberships || []);
      }
    } catch (error) {
      console.error("[FETCH MEMBERSHIPS ERROR]", error);
      toast.error("Failed to load memberships");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchMemberships();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchMemberships]);

  const handleStatusUpdate = async (id: string, newStatus: MembershipStatus) => {
    try {
      const res = await adminApi.updateMembershipStatus(id, newStatus);
      if (res.data.success) {
        toast.success(`Status updated to ${statusLabels[newStatus]}`);
        
        setMemberships(prev => prev.map(m => 
          m._id === id ? { ...m, status: newStatus } : m
        ));
        
        if (selectedMembership && selectedMembership._id === id) {
          setSelectedMembership({ ...selectedMembership, status: newStatus });
        }
      }
    } catch (error) {
      console.error("[UPDATE MEMBERSHIP STATUS ERROR]", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this membership application?")) return;

    try {
      const res = await adminApi.deleteMembership(id);
      if (res.data.success) {
        toast.success("Membership application deleted successfully");
        setMemberships(prev => prev.filter(m => m._id !== id));
        if (selectedMembership && selectedMembership._id === id) {
          setSelectedMembership(null);
        }
      }
    } catch (error) {
      console.error("[DELETE MEMBERSHIP ERROR]", error);
      toast.error("Failed to delete membership application");
    }
  };

  const exportToCSV = () => {
    if (memberships.length === 0) {
      toast.error("No data to export");
      return;
    }

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "Membership Type",
      "Full Name",
      "Email",
      "Phone",
      "Status",
      "DOB",
      "Gender",
      "Occupation",
      "Educational Qualification",
      "Address",
      "District",
      "State",
      "Areas of Interest",
      "Motivation",
      "Availability",
      "Time Contribution",
      "Skills",
      "Previous NGO Experience",
      "Experience Details",
      "Can Travel",
      "Emergency Contact Name",
      "Emergency Contact Relation",
      "Emergency Contact Phone",
      "Date Applied",
    ];

    const rows = memberships.map(m => [
      escapeCSV(membershipTypeLabel(m.membershipType)),
      escapeCSV(m.fullName),
      escapeCSV(m.email),
      escapeCSV(m.phoneNumber),
      escapeCSV(statusLabels[m.status]),
      escapeCSV(m.dateOfBirth ? new Date(m.dateOfBirth).toLocaleDateString() : ""),
      escapeCSV(m.gender),
      escapeCSV(m.occupation),
      escapeCSV(m.educationalQualification),
      escapeCSV(m.address?.replace(/\n/g, ' ')),
      escapeCSV(m.district),
      escapeCSV(m.state),
      escapeCSV((m.areasOfInterest || []).join(" | ")),
      escapeCSV(m.motivation),
      escapeCSV(m.availability || ""),
      escapeCSV(m.timeContribution || ""),
      escapeCSV((m.skills || []).join(" | ")),
      escapeCSV(m.previousExperienceNGO || ""),
      escapeCSV(m.previousExperienceDetails || ""),
      escapeCSV(m.canTravel || ""),
      escapeCSV(m.emergencyContact?.name || ""),
      escapeCSV(m.emergencyContact?.relation || ""),
      escapeCSV(m.emergencyContact?.phone || ""),
      escapeCSV(m.submittedAt ? new Date(m.submittedAt).toLocaleDateString() : ""),
    ].join(","));

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pbvm_memberships_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "pending": return "badge-orange";
      case "approved": return "badge-green";
      case "rejected": return "badge-blue";
      default: return "badge-orange";
    }
  };

  const filteredMemberships = memberships.filter(m => {
    if (filterType === "all") return true;
    if (filterType === "volunteer") return m.membershipType === "volunteer";
    return m.membershipType === "member" || !m.membershipType;
  });

  const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            </div>
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Membership Applications</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Review and manage membership and volunteer applications.
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="btn btn-secondary"
            style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
            disabled={memberships.length === 0}
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {(["all", "member", "volunteer"] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className="btn"
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 600,
                background: filterType === type ? "var(--color-deep-blue)" : "var(--color-light-gray)",
                color: filterType === type ? "#fff" : "var(--color-dark-gray)",
                border: "none",
                cursor: "pointer",
              }}
            >
              {type === "all" ? `All (${memberships.length})` : type === "volunteer" ? `Volunteers (${memberships.filter(m => m.membershipType === "volunteer").length})` : `General Members (${memberships.filter(m => m.membershipType === "member" || !m.membershipType).length})`}
            </button>
          ))}
        </div>

        {/* Memberships Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        ) : filteredMemberships.length === 0 ? (
          <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <Users size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No {filterType !== "all" ? filterType : ""} applications found.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-light-gray)", textAlign: "left", color: "var(--color-text-muted)", fontSize: "0.85rem", backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Applicant</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Role</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Date Applied</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMemberships.map((m) => (
                  <tr key={m._id} style={{ borderBottom: "1px solid var(--color-light-gray)", transition: "background-color 0.2s" }} className="hover-bg">
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span className={`badge ${getStatusBadgeClass(m.status)}`} style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>
                        {statusLabels[m.status]}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {m.photo ? (
                          <img
                            src={resolvePhotoUrl(m.photo, backendUrl)}
                            alt={m.fullName}
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--color-light-gray)", flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--color-light-gray)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <UserCircle size={22} style={{ color: "var(--color-text-muted)" }} />
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: 600, color: "var(--color-deep-blue)" }}>{m.fullName}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{m.email} • {m.phoneNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          ...membershipTypeBadgeStyle(m.membershipType),
                        }}
                      >
                        {m.membershipType === "volunteer" && <Award size={11} />}
                        {membershipTypeLabel(m.membershipType)}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                      {new Date(m.submittedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        {m.status === "pending" && (
                          <button
                            onClick={() => handleStatusUpdate(m._id, "approved")}
                            className="btn btn-primary"
                            style={{ padding: "0.5rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", background: "#16a34a", borderColor: "#16a34a" }}
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedMembership(m)}
                          className="btn btn-secondary"
                          style={{ padding: "0.5rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(m._id)}
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
        )}

        {/* View Details Modal */}
        {selectedMembership && (
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
            }}
          >
            <div
              className="card animate-fade-in"
              style={{
                width: "100%",
                maxWidth: "700px",
                background: "#ffffff",
                padding: "2rem",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <button
                onClick={() => setSelectedMembership(null)}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", paddingBottom: "1.25rem", borderBottom: "1px solid var(--color-light-gray)", marginBottom: "1.5rem" }}>
                {selectedMembership.photo ? (
                  <img
                    src={resolvePhotoUrl(selectedMembership.photo, backendUrl)}
                    alt={selectedMembership.fullName}
                    style={{ width: 72, height: 72, borderRadius: "12px", objectFit: "cover", border: "2px solid var(--color-light-gray)", flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: "12px", background: "var(--color-light-gray)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <UserCircle size={38} style={{ color: "var(--color-text-muted)" }} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <h3 style={{ fontSize: "1.25rem", color: "var(--color-deep-blue)", fontWeight: 700, margin: 0 }}>
                      {selectedMembership.fullName}
                    </h3>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0.2rem 0.6rem",
                        borderRadius: "999px",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        ...membershipTypeBadgeStyle(selectedMembership.membershipType),
                      }}
                    >
                      {selectedMembership.membershipType === "volunteer" && <Award size={10} />}
                      {membershipTypeLabel(selectedMembership.membershipType)}
                    </span>
                  </div>
                  <div style={{ color: "var(--color-text-muted)", fontSize: "0.85rem", marginTop: "0.4rem" }}>
                    Applied on: {new Date(selectedMembership.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <select
                    value={selectedMembership.status}
                    onChange={(e) => handleStatusUpdate(selectedMembership._id, e.target.value as MembershipStatus)}
                    className="form-input"
                    style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", height: "auto", minHeight: "0", fontWeight: 600, color: selectedMembership.status === "approved" ? "#16a34a" : selectedMembership.status === "rejected" ? "#ef4444" : "#f59e0b" }}
                  >
                    <option value="pending">Status: Pending</option>
                    <option value="approved">Status: Approved</option>
                    <option value="rejected">Status: Rejected</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                {/* Contact & Personal Info */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Info</h5>
                    <div style={{ fontSize: "0.9rem", color: "var(--color-dark-gray)", lineHeight: 1.7 }}>
                      <div><strong>Email:</strong> <a href={`mailto:${selectedMembership.email}`} style={{ color: "var(--color-deep-blue)" }}>{selectedMembership.email}</a></div>
                      <div><strong>Phone:</strong> <a href={`tel:${selectedMembership.phoneNumber}`} style={{ color: "var(--color-deep-blue)" }}>{selectedMembership.phoneNumber}</a></div>
                    </div>
                  </div>
                  <div>
                    <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Personal Info</h5>
                    <div style={{ fontSize: "0.9rem", color: "var(--color-dark-gray)", lineHeight: 1.7 }}>
                      <div><strong>DOB:</strong> {new Date(selectedMembership.dateOfBirth).toLocaleDateString()}</div>
                      <div><strong>Gender:</strong> {selectedMembership.gender}</div>
                      <div><strong>Occupation:</strong> {selectedMembership.occupation}</div>
                      <div><strong>Qualification:</strong> {selectedMembership.educationalQualification}</div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Address</h5>
                  <div style={{ background: "var(--color-light-gray)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.9rem", color: "var(--color-dark-gray)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {selectedMembership.address}, {selectedMembership.district}, {selectedMembership.state}
                  </div>
                </div>

                {/* Areas of Interest */}
                {selectedMembership.areasOfInterest?.length > 0 && (
                  <div>
                    <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Areas of Interest</h5>
                    <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                      {selectedMembership.areasOfInterest.map(area => (
                        <span key={area} style={{ background: "#e3f2fd", color: "#1565c0", padding: "0.2rem 0.6rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600 }}>
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Motivation */}
                <div>
                  <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Motivation</h5>
                  <div style={{ background: "var(--color-light-gray)", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", fontSize: "0.9rem", color: "var(--color-dark-gray)", whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                    {selectedMembership.motivation}
                  </div>
                </div>

                {/* Volunteer-Only Section */}
                {selectedMembership.membershipType === "volunteer" && (
                  <div style={{ border: "1px solid #ffe0b2", borderRadius: "var(--radius-md)", padding: "1.25rem", background: "#fffbf5" }}>
                    <h5 style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "#e65100", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <Award size={14} /> Volunteer Details
                    </h5>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", fontSize: "0.9rem", color: "var(--color-dark-gray)", lineHeight: 1.7 }}>
                      <div>
                        <strong style={{ color: "var(--color-text-muted)", fontSize: "0.78rem", textTransform: "uppercase" }}>Availability</strong>
                        <div>{selectedMembership.availability || "—"}</div>
                      </div>
                      <div>
                        <strong style={{ color: "var(--color-text-muted)", fontSize: "0.78rem", textTransform: "uppercase" }}>Time Contribution</strong>
                        <div>{selectedMembership.timeContribution || "—"}</div>
                      </div>
                      <div>
                        <strong style={{ color: "var(--color-text-muted)", fontSize: "0.78rem", textTransform: "uppercase" }}>Can Travel</strong>
                        <div>{selectedMembership.canTravel || "—"}</div>
                      </div>
                      <div>
                        <strong style={{ color: "var(--color-text-muted)", fontSize: "0.78rem", textTransform: "uppercase" }}>NGO Experience</strong>
                        <div>
                          {selectedMembership.previousExperienceNGO === "Yes"
                            ? `Yes — ${selectedMembership.previousExperienceDetails || ""}`
                            : "No"}
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    {selectedMembership.skills && selectedMembership.skills.length > 0 && (
                      <div style={{ marginTop: "0.75rem" }}>
                        <strong style={{ color: "var(--color-text-muted)", fontSize: "0.78rem", textTransform: "uppercase" }}>Skills</strong>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginTop: "0.35rem" }}>
                          {selectedMembership.skills.map(skill => (
                            <span key={skill} style={{ background: "#fff3e0", color: "#e65100", border: "1px solid #ffe0b2", padding: "0.2rem 0.55rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 600 }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Emergency Contact */}
                    {selectedMembership.emergencyContact?.name && (
                      <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #ffe0b2" }}>
                        <strong style={{ color: "var(--color-text-muted)", fontSize: "0.78rem", textTransform: "uppercase" }}>Emergency Contact</strong>
                        <div style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                          {selectedMembership.emergencyContact.name}
                          {selectedMembership.emergencyContact.relation && ` (${selectedMembership.emergencyContact.relation})`}
                          {" — "}
                          <a href={`tel:${selectedMembership.emergencyContact.phone}`} style={{ color: "var(--color-deep-blue)" }}>
                            {selectedMembership.emergencyContact.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                  {selectedMembership.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedMembership._id, "approved")}
                        className="btn"
                        style={{ flex: 1, borderRadius: "var(--radius-md)", background: "#dcfce7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                      >
                        <Check size={18} /> Approve
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(selectedMembership._id, "rejected")}
                        className="btn"
                        style={{ flex: 1, borderRadius: "var(--radius-md)", background: "#fee2e2", color: "#b91c1c", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                      >
                        <XCircle size={18} /> Reject
                      </button>
                    </>
                  )}
                  <a
                    href={`mailto:${selectedMembership.email}`}
                    className="btn btn-primary"
                    style={{ flex: 1, borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                  >
                    Email Applicant
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
