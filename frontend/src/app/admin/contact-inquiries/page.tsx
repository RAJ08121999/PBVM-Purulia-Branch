"use client"

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { MessageSquare, Trash2, ArrowLeft, Download, Eye, X, Check } from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api";
import type { ContactStatus } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactStatus;
  submittedAt: string;
}

const statusLabels: Record<ContactStatus, string> = {
  new: "New",
  reviewed: "Reviewed",
};

export default function AdminContactInquiries() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // View Modal State
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiry | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [replyInquiry, setReplyInquiry] = useState<ContactInquiry | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      const res = await adminApi.getContactInquiries();
      if (res.data.success) {
        setInquiries(res.data.inquiries || []);
      }
    } catch (error) {
      console.error("[FETCH INQUIRIES ERROR]", error);
      toast.error("Failed to load inquiries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchInquiries();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchInquiries]);

  const handleStatusUpdate = async (id: string, newStatus: ContactStatus) => {
    try {
      const res = await adminApi.updateContactStatus(id, newStatus);
      if (res.data.success) {
        toast.success(`Status updated to ${statusLabels[newStatus]}`);
        
        // Update local state instead of refetching to be snappier
        setInquiries(prev => prev.map(inq => 
          inq._id === id ? { ...inq, status: newStatus } : inq
        ));
        
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (error) {
      console.error("[UPDATE STATUS ERROR]", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;

    try {
      const res = await adminApi.deleteContactInquiry(id);
      if (res.data.success) {
        toast.success("Inquiry deleted successfully");
        setInquiries(prev => prev.filter(inq => inq._id !== id));
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      console.error("[DELETE INQUIRY ERROR]", error);
      toast.error("Failed to delete inquiry");
    }
  };

  const handleSendReply = async () => {
    if (!replyInquiry) return;
  
    if (!replySubject.trim() || !replyMessage.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
  
    try {
      setSendingReply(true);
  
      const res = await adminApi.replyToContactInquiry(
        replyInquiry._id,
        replySubject,
        replyMessage
      );
  
      if (res.data.success) {
        toast.success("Reply sent successfully.");
  
        setShowReplyModal(false);
        setReplyInquiry(null);
        setReplySubject("");
        setReplyMessage("");
  
        // Optional: automatically mark as reviewed
        if (replyInquiry.status !== "reviewed") {
          await handleStatusUpdate(replyInquiry._id, "reviewed");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reply.");
    } finally {
      setSendingReply(false);
    }
  };

  const exportToCSV = () => {
    if (inquiries.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Name", "Email", "Phone", "Status", "Date Submitted", "Message"];
    const csvContent = [
      headers.join(","),
      ...inquiries.map(inq => [
        `"${inq.name.replace(/"/g, '""')}"`,
        `"${inq.email.replace(/"/g, '""')}"`,
        `"${(inq.phone || "").replace(/"/g, '""')}"`,
        `"${statusLabels[inq.status]}"`,
        `"${new Date(inq.submittedAt).toLocaleDateString()}"`,
        `"${inq.message.replace(/"/g, '""').replace(/\n/g, ' ')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pbvm_inquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case "new": return "badge-orange";
      case "reviewed": return "badge-green";
      default: return "badge-orange";
    }
  };

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
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Contact Inquiries</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              View and manage messages submitted through the website contact form.
            </p>
          </div>
          <button
            onClick={exportToCSV}
            className="btn btn-secondary"
            style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
            disabled={inquiries.length === 0}
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>

        {/* Inquiries Table */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="skeleton" style={{ height: "60px", borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <MessageSquare size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No contact inquiries found.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-light-gray)", textAlign: "left", color: "var(--color-text-muted)", fontSize: "0.85rem", backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem 1.5rem" }}>Status</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Name</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Message</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Date</th>
                  <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq) => (
                  <tr key={inq._id} style={{ borderBottom: "1px solid var(--color-light-gray)", transition: "background-color 0.2s" }} className="hover-bg">
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span className={`badge ${getStatusBadgeClass(inq.status)}`} style={{ padding: "0.25rem 0.5rem", fontSize: "0.75rem" }}>
                        {statusLabels[inq.status]}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <div style={{ fontWeight: 600, color: "var(--color-deep-blue)" }}>{inq.name}</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>{inq.email}</div>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-muted)", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {inq.message}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                      {new Date(inq.submittedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="btn btn-secondary"
                          style={{ padding: "0.5rem", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center" }}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(inq._id)}
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
        {selectedInquiry && (
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
                onClick={() => setSelectedInquiry(null)}
                style={{ position: "absolute", top: "1.25rem", right: "1.25rem", background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-muted)" }}
              >
                <X size={20} />
              </button>

              <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", color: "var(--color-deep-blue)", fontWeight: 700, paddingRight: "2rem" }}>
                Inquiry Details
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "1rem", borderBottom: "1px solid var(--color-light-gray)" }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.1rem", color: "var(--color-deep-blue)" }}>{selectedInquiry.name}</h4>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                      <a href={`mailto:${selectedInquiry.email}`} style={{ color: "inherit" }}>{selectedInquiry.email}</a>
                      {selectedInquiry.phone ? <> • <a href={`tel:${selectedInquiry.phone}`} style={{ color: "inherit" }}>{selectedInquiry.phone}</a></> : null}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
                      {new Date(selectedInquiry.submittedAt).toLocaleString()}
                    </div>
                    <select
                      value={selectedInquiry.status}
                      onChange={(e) => handleStatusUpdate(selectedInquiry._id, e.target.value as ContactStatus)}
                      className="form-input"
                      style={{ padding: "0.25rem 0.5rem", fontSize: "0.85rem", height: "auto", minHeight: "0" }}
                    >
                      <option value="new">Status: New</option>
                      <option value="reviewed">Status: Reviewed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Status</h5>
                  <div style={{ fontSize: "1.05rem", color: "var(--color-deep-blue)", fontWeight: 500 }}>
                    {statusLabels[selectedInquiry.status]}
                  </div>
                </div>

                <div>
                  <h5 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", color: "var(--color-text-muted)", fontWeight: 600 }}>Message</h5>
                  <div style={{ background: "var(--color-light-gray)", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.95rem", color: "var(--color-dark-gray)", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                    {selectedInquiry.message}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  {selectedInquiry.status !== "reviewed" && (
                    <button
                      onClick={() => handleStatusUpdate(selectedInquiry._id, "reviewed")}
                      className="btn"
                      style={{ flex: 1, borderRadius: "var(--radius-md)", background: "#dcfce7", color: "#166534", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
                    >
                      <Check size={18} /> Mark as Reviewed
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setReplyInquiry(selectedInquiry);

                      setReplySubject("Re: Your Inquiry to PBVM Purulia");

                      setReplyMessage("");

                      setSelectedInquiry(null); // closes the details modal
                      setShowReplyModal(true);
                    }}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      
      <Dialog open={showReplyModal} onOpenChange={setShowReplyModal}>
      <DialogContent
        className="sm:max-w-2xl"
        style={{
          width: "95vw",
          maxWidth: "760px",
          maxHeight: "85vh",
          padding: 0,
          borderRadius: "18px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
          <DialogHeader
            style={{
              padding: "1.5rem 2rem",
              borderBottom: "1px solid #e5e7eb",
              flexShrink: 0,
            }}
          >
            <DialogTitle
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "var(--color-deep-blue)",
              }}
            >
              Reply to Inquiry
            </DialogTitle>
          </DialogHeader>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1.5rem 2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: ".45rem",
                  fontWeight: 600,
                  color: "#334155",
                  fontSize: ".92rem",
                }}
              >
                To
              </label>

              <Input
                style={{
                  height: "46px",
                  borderRadius: "10px",
                }}
                value={replyInquiry?.email ?? ""}
                disabled
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: ".45rem",
                  fontWeight: 600,
                  color: "#334155",
                  fontSize: ".92rem",
                }}
              >
                Subject
              </label>

              <Input
                style={{
                  height: "46px",
                  borderRadius: "10px",
                }}
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: ".45rem",
                  fontWeight: 600,
                  color: "#334155",
                  fontSize: ".92rem",
                }}
              >
                Message
              </label>

              <Textarea
                rows={8}
                style={{
                  padding: "1rem",
                  borderRadius: "12px",
                  resize: "vertical",
                  lineHeight: 1.7,
                }}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>

          </div>

          <DialogFooter
            style={{
              padding: "1.25rem 2rem",
              borderTop: "1px solid #e5e7eb",
              flexShrink: 0,
            }}
          >

            <button
              className="btn btn-secondary"
              onClick={() => setShowReplyModal(false)}
            >
              Cancel
            </button>

            <button
              className="btn btn-primary"
              onClick={handleSendReply}
              disabled={sendingReply}
            >
              {sendingReply ? "Sending..." : "Send Reply"}
            </button>

          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
