"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { X, Lock, Mail, User as UserIcon } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { adminApi } from "@/lib/api";

interface Admin {
  name: string;
  email: string;
  role: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  // Profile update modal states
  const [profileOpen, setProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get("pbvm_token");
      if (!token) {
        toast.error("Please log in to access the administrator panel");
        router.push("/admin/login");
        return;
      }

      try {
        const res = await adminApi.getMe();
        if (res.data.success) {
          const fetchedAdmin = res.data.admin;
          setAdmin(fetchedAdmin);
          setName(fetchedAdmin.name);
          setEmail(fetchedAdmin.email);
          localStorage.setItem("pbvm_admin", JSON.stringify(fetchedAdmin));
          setAuthenticated(true);
        } else {
          throw new Error("Invalid session");
        }
      } catch (error) {
        console.error("[AUTH ERROR]", error);
        Cookies.remove("pbvm_token");
        localStorage.removeItem("pbvm_admin");
        toast.error("Session expired. Please log in again.");
        router.push("/admin/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setUpdating(true);
    try {
      const res = await adminApi.updateProfile({ name, email, password: password || undefined });
      if (res.data.success) {
        const updated = res.data.admin;
        setAdmin(updated);
        localStorage.setItem("pbvm_admin", JSON.stringify(updated));
        toast.success("Profile updated successfully!");
        setProfileOpen(false);
        setPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.data.message || "Failed to update profile");
      }
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to update profile";
      toast.error(errMsg);
    } finally {
      setUpdating(false);
    }
  };

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-light-gray)",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div
          style={{
            border: "4px solid var(--color-mid-gray)",
            borderTop: "4px solid var(--color-deep-blue)",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Verifying administrator session...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-light-gray)" }}>
      {/* Sidebar Navigation */}
      <AdminSidebar admin={admin} onOpenProfile={() => setProfileOpen(true)} />

      {/* Main Administrative Canvas */}
      <main style={{ marginLeft: "260px", minHeight: "100vh", padding: "2.5rem" }} className="admin-main">
        {children}
      </main>

      {/* Edit Profile Modal */}
      {profileOpen && (
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
              maxWidth: "460px",
              background: "#ffffff",
              padding: "2rem",
              position: "relative",
            }}
          >
            <button
              onClick={() => setProfileOpen(false)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--color-text-muted)",
              }}
            >
              <X size={20} />
            </button>

            <h3 style={{ fontSize: "1.35rem", marginBottom: "1.5rem", color: "var(--color-deep-blue)" }}>
              Update Admin Profile
            </h3>

            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: "2.5rem" }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <UserIcon
                    size={16}
                    style={{ position: "absolute", left: "10px", top: "12px", color: "var(--color-text-muted)" }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Login User ID)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="email"
                    className="form-input"
                    style={{ paddingLeft: "2.5rem" }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail
                    size={16}
                    style={{ position: "absolute", left: "10px", top: "12px", color: "var(--color-text-muted)" }}
                  />
                </div>
              </div>

              <hr style={{ margin: "1.5rem 0", borderColor: "var(--color-mid-gray)" }} />

              <div className="form-group">
                <label className="form-label">New Password (Leave blank to keep current)</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: "2.5rem" }}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock
                    size={16}
                    style={{ position: "absolute", left: "10px", top: "12px", color: "var(--color-text-muted)" }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "2rem" }}>
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    className="form-input"
                    style={{ paddingLeft: "2.5rem" }}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Lock
                    size={16}
                    style={{ position: "absolute", left: "10px", top: "12px", color: "var(--color-text-muted)" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setProfileOpen(false)}
                  className="btn btn-secondary"
                  style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "0.6rem 0" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1, borderRadius: "var(--radius-md)", padding: "0.6rem 0" }}
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
