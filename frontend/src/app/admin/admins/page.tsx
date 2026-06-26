"use client"

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { UserCog, Plus, Trash2, ArrowLeft, Shield, ShieldCheck, X } from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/api";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "SuperAdministrator" | "Administrator";
  createdAt: string;
}

export default function AdminManagement() {
  const [user] = useState<{ _id: string; role: string; name: string } | null>(() => {
    if (typeof window === "undefined") return null;

    const adminStr = localStorage.getItem("pbvm_admin");
    if (adminStr) {
      try {
        const adminData = JSON.parse(adminStr);
        return { ...adminData, _id: adminData.id };
      } catch (e) {
        console.error("Failed to parse admin data", e);
      }
    }

    return null;
  });

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"SuperAdministrator" | "Administrator">("Administrator");
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAdmins();
      if (res.data.success) {
        setAdmins(res.data.admins || []);
      }
    } catch (error) {
      console.error("[FETCH ADMINS ERROR]", error);
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(fetchAdmins);
  }, [fetchAdmins]);

  const openCreateModal = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("Administrator");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await adminApi.createAdmin({ name, email, password, role });
      if (res.data.success) {
        toast.success("Admin created successfully!");
        setModalOpen(false);
        fetchAdmins();
      }
    } catch (error: unknown) {
      console.error("[CREATE ADMIN ERROR]", error);
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to create admin";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === user?._id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this admin account? This action cannot be undone.")) return;

    try {
      const res = await adminApi.deleteAdmin(id);
      if (res.data.success) {
        toast.success("Admin deleted successfully");
        setAdmins(prev => prev.filter(a => a._id !== id));
      }
    } catch (error: unknown) {
      console.error("[DELETE ADMIN ERROR]", error);
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Failed to delete admin";
      toast.error(message);
    }
  };

  // Only Super Admins can see the create button
  const canCreate = user?.role === "SuperAdministrator";

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
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Admin Management</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Manage dashboard access and administrator accounts.
            </p>
          </div>
          {canCreate && (
            <button
              onClick={openCreateModal}
              className="btn btn-primary"
              style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Plus size={18} />
              Create Admin
            </button>
          )}
        </div>

        {!canCreate && (
          <div className="card" style={{ padding: "1rem 1.5rem", background: "#f8fafc", borderLeft: "4px solid var(--color-deep-blue)", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
            <Shield size={20} style={{ display: "inline-block", marginRight: "0.5rem", verticalAlign: "middle", color: "var(--color-deep-blue)" }} />
            You are logged in as an <strong>Admin</strong>. Only <strong>Super Admins</strong> can create new administrator accounts.
          </div>
        )}

        {/* Admins List */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: "80px", borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        ) : admins.length === 0 ? (
          <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--color-text-muted)" }}>
            <UserCog size={48} style={{ margin: "0 auto 1rem", opacity: 0.5 }} />
            <p>No admin accounts found.</p>
          </div>
        ) : (
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-light-gray)", textAlign: "left", color: "var(--color-text-muted)", fontSize: "0.85rem", backgroundColor: "#f8fafc" }}>
                  <th style={{ padding: "1rem 1.5rem" }}>Role</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Name</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Email</th>
                  <th style={{ padding: "1rem 1.5rem" }}>Created Date</th>
                  {canCreate && <th style={{ padding: "1rem 1.5rem", textAlign: "right" }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin._id} style={{ borderBottom: "1px solid var(--color-light-gray)", transition: "background-color 0.2s" }} className="hover-bg">
                    <td style={{ padding: "1rem 1.5rem" }}>
                      <span className={`badge ${admin.role === "SuperAdministrator" ? "badge-orange" : "badge-blue"}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        {admin.role === "SuperAdministrator" ? <ShieldCheck size={12} /> : <Shield size={12} />}
                        {admin.role === "SuperAdministrator" ? "Super Admin" : "Admin"}
                      </span>
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontWeight: 600, color: "var(--color-deep-blue)" }}>
                      {admin.name}
                      {admin._id === user?._id && <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 400, marginLeft: "0.5rem" }}>(You)</span>}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", fontFamily: "monospace", color: "var(--color-text-muted)" }}>
                      {admin.email}
                    </td>
                    <td style={{ padding: "1rem 1.5rem", color: "var(--color-text-muted)", fontSize: "0.9rem" }}>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </td>
                    {canCreate && (
                      <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                        <button
                          onClick={() => handleDelete(admin._id)}
                          className="btn"
                          style={{ background: "#fee2e2", color: "#ef4444", padding: "0.5rem", borderRadius: "var(--radius-sm)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                          disabled={admin._id === user?._id}
                          title={admin._id === user?._id ? "Cannot delete yourself" : "Delete Admin"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create Modal Dialog */}
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
                maxWidth: "500px",
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
                Create New Admin
              </h3>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@pbvmpurulia.org"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select
                    className="form-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "SuperAdministrator" | "Administrator")}
                    required
                  >
                    <option value="Administrator">Admin</option>
                    <option value="SuperAdministrator">Super Admin</option>
                  </select>
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                    <strong>Admin:</strong> Can manage content but cannot create/delete other admins.<br />
                    <strong>Super Admin:</strong> Has full access including admin management.
                  </p>
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
                    disabled={submitting}
                  >
                    {submitting ? "Creating..." : "Create Admin"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}
