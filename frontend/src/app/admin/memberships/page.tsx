"use client"

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Users, Trash2, ArrowLeft, Download, Eye, X, Check, XCircle } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { adminApi } from "@/lib/api";
import type { MembershipApplication, MembershipStatus } from "@/types";

type Membership = MembershipApplication;

const statusLabels: Record<MembershipStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export default function AdminMemberships() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  
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
        toast.success(`Membership status updated to ${statusLabels[newStatus]}`);
        
        // Update local state
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

    const headers = ["Full Name", "Email", "Phone", "Type", "Status", "DOB", "Occupation", "Address", "Date Applied"];
    const csvContent = [
      headers.join(","),
      ...memberships.map(m => [
        `"${m.fullName.replace(/"/g, '""')}"`,
        `"${m.email.replace(/"/g, '""')}"`,
        `"${m.phoneNumber.replace(/"/g, '""')}"`,
        `"Applicant"`,
        `"${statusLabels[m.status]}"`,
        `"${new Date(m.dateOfBirth).toLocaleDateString()}"`,
        `"${m.occupation.replace(/"/g, '""')}"`,
        `"${m.address.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        `"${new Date(m.submittedAt).toLocaleDateString()}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pbvm_memberships_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "pending": return "badge-orange";
      case "approved": return "badge-green";
      case "rejected": return "badge-blue";
      default: return "badge-orange";
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
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Membership Applications</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Review and manage new membership requests from the public.
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

        {/* Memberships Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        ) : memberships.length === 0 ? (
          <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <Users size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No membership applications found.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-light-gray)", textAlign: "left", color: "var(--color-text-muted)", fontSize: "0.85rem", backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Applicant</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Type</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Date Applied</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {memberships.map((m) => (
                  <tr key={m._id} style={{ borderBottom: "1px solid var(--color-light-gray)", transition: "background-color 0.2s" }} className="hover-bg">
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span className={`badge ${getStatusBadgeClass(m.status)}`} style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>
                        {statusLabels[m.status]}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ fontWeight: 600, color: "var(--color-deep-blue)" }}>{m.fullName}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{m.email} • {m.phoneNumber}</div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span className="badge badge-blue">
                        Applicant
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
                onClick={() => setSelectedMembership(null)}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={20} />
              </button>

              <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", color: "var(--color-deep-blue)", fontWeight: 700, paddingRight: "2rem" }}>
                Membership Application
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "1rem", borderBottom: "1px solid var(--color-light-gray)" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.2rem", color: "var(--color-deep-blue)" }}>{selectedMembership.fullName}</h4>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                      <span className="badge badge-blue" style={{ marginRight: "0.5rem" }}>Applicant</span>
                      Applied on: {new Date(selectedMembership.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Contact Info</h5>
                    <div style={{ fontSize: "0.95rem", color: "var(--color-dark-gray)", lineHeight: 1.6 }}>
                      <div><strong>Email:</strong> <a href={`mailto:${selectedMembership.email}`} style={{ color: "var(--color-deep-blue)" }}>{selectedMembership.email}</a></div>
                      <div><strong>Phone:</strong> <a href={`tel:${selectedMembership.phoneNumber}`} style={{ color: "var(--color-deep-blue)" }}>{selectedMembership.phoneNumber}</a></div>
                    </div>
                  </div>
                  <div>
                    <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Personal Info</h5>
                    <div style={{ fontSize: "0.95rem", color: "var(--color-dark-gray)", lineHeight: 1.6 }}>
                      <div><strong>DOB:</strong> {new Date(selectedMembership.dateOfBirth).toLocaleDateString()}</div>
                      <div><strong>Occupation:</strong> {selectedMembership.occupation}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.85rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Address</h5>
                  <div style={{ background: "var(--color-light-gray)", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.95rem", color: "var(--color-dark-gray)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {selectedMembership.address}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
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
    </AdminLayout>
  );
}
