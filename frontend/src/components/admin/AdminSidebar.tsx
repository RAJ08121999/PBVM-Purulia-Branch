"use client"

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Bell,
  Activity,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Download,
  Mail,
  Users,
  UserCog,
  LogOut,
  CreditCard,
  User,
} from "lucide-react";

interface AdminSidebarProps {
  admin: { name: string; email: string; role: string } | null;
  onOpenProfile: () => void;
}

export default function AdminSidebar({ admin, onOpenProfile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("pbvm_token");
    localStorage.removeItem("pbvm_admin");
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard, role: "all" },
    { name: "Notifications", href: "/admin/notifications", icon: Bell, role: "all" },
    { name: "Activities", href: "/admin/activities", icon: Activity, role: "all" },
    { name: "Events", href: "/admin/events", icon: Calendar, role: "all" },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon, role: "all" },
    { name: "Publications", href: "/admin/publications", icon: BookOpen, role: "all" },
    { name: "Downloads & Results", href: "/admin/downloads", icon: Download, role: "all" },
    { name: "Contact Inquiries", href: "/admin/contact-inquiries", icon: Mail, role: "all" },
    { name: "Membership Apps", href: "/admin/memberships", icon: Users, role: "all" },
    { name: "Volunteer ID Cards", href: "/admin/volunteer-id", icon: CreditCard, role: "all" },
    { name: "Admin Accounts", href: "/admin/admins", icon: UserCog, role: "SuperAdministrator" },
  ];

  return (
    <div
      style={{
        width: "260px",
        background: "var(--gradient-brand)",
        color: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 50,
      }}
      className="no-print"
    >
      {/* Sidebar Header */}
      <div
        style={{
          padding: "1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <div
          style={{
            width: "35px",
            height: "35px",
            background: "var(--color-orange)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          PB
        </div>
        <div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, lineHeight: 1 }}>PBVM Purulia</h2>
          <span style={{ fontSize: "0.7rem", opacity: 0.8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{ flex: 1, padding: "1.5rem 1rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {navItems.map((item) => {
          // If item is restricted to Super Admin, hide it for standard Admin
          if (item.role === "SuperAdministrator" && admin?.role !== "SuperAdministrator") {
            return null;
          }

          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.85)",
                background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                fontWeight: isActive ? 600 : 500,
                fontSize: "0.925rem",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              className="hover:bg-white/10"
            >
              <Icon size={18} style={{ opacity: isActive ? 1 : 0.8 }} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer / User Profile */}
      {admin && (
        <div
          style={{
            padding: "1.25rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(0, 0, 0, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={18} />
            </div>
            <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap" }}>{admin.name}</div>
              <div style={{ fontSize: "0.725rem", opacity: 0.8, whiteSpace: "nowrap" }}>
                {admin.role === "SuperAdministrator" ? "Super Admin" : "Admin"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={onOpenProfile}
              style={{
                flex: 1,
                padding: "0.4rem 0",
                fontSize: "0.75rem",
                border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: "var(--radius-sm)",
                color: "#ffffff",
                background: "transparent",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              className="hover:bg-white/10"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: "0.4rem 0.6rem",
                fontSize: "0.75rem",
                borderRadius: "var(--radius-sm)",
                color: "#ffffff",
                background: "rgba(239, 68, 68, 0.8)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              className="hover:bg-red-600"
              title="Log Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
