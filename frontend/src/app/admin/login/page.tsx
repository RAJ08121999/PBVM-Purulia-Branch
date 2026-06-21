"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { adminApi } from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If token already exists, redirect to dashboard
    const token = Cookies.get("pbvm_token");
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.login(email, password);
      if (res.data.success) {
        const { token, admin } = res.data;
        
        // Save token in cookie
        Cookies.set("pbvm_token", token, { expires: 7, secure: true, sameSite: "strict" });
        
        // Save admin details in localStorage for quick display
        localStorage.setItem("pbvm_admin", JSON.stringify(admin));
        
        toast.success(`Welcome back, ${admin.name}!`);
        router.push("/admin/dashboard");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("[LOGIN ERROR]", error);
      const errMsg = error.response?.data?.message || "Invalid email or password";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, var(--color-deep-blue) 0%, var(--color-teal) 100%)",
        padding: "1rem",
      }}
    >
      <div
        className="card animate-fade-in"
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "2.5rem",
          background: "#ffffff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {/* Logo Placeholder */}
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "0 auto 1rem",
              background: "var(--color-teal)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            PB
          </div>
          <h2 style={{ fontSize: "1.75rem", color: "var(--color-deep-blue)" }}>Admin Portal</h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Paschim Banga Vigyan Mancha, Purulia
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="admin@pbvmpurulia.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ marginBottom: "2rem" }}>
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              padding: "0.85rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "center",
              fontSize: "1rem",
            }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Logging in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
