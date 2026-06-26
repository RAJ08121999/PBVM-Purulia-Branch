"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Bell,
  Activity,
  Calendar,
  BookOpen,
  Mail,
  Users,
  CreditCard,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import { adminApi, publicApi } from "@/lib/api";

interface Stats {
  notifications: number;
  activities: number;
  events: number;
  publications: number;
  pendingMemberships: number;
  newInquiries: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    notifications: 0,
    activities: 0,
    events: 0,
    publications: 0,
    pendingMemberships: 0,
    newInquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          notifRes,
          actRes,
          evtRes,
          pubRes,
          memRes,
          conRes,
        ] = await Promise.all([
          publicApi.getNotifications(),
          publicApi.getActivities(),
          publicApi.getEvents({ limit: 1 }),
          publicApi.getPublications({ limit: 1 }),
          adminApi.getMemberships({ status: "pending", limit: 1 }),
          adminApi.getContactInquiries({ status: "new", limit: 1 }),
        ]);

        setStats({
          notifications: notifRes.data.notifications?.length || 0,
          activities: actRes.data.activities?.length || 0,
          events: evtRes.data.total || 0,
          publications: pubRes.data.total || 0,
          pendingMemberships: memRes.data.total || 0,
          newInquiries: conRes.data.total || 0,
        });
      } catch (error) {
        console.error("[FETCH STATS ERROR]", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Pending Memberships",
      value: stats.pendingMemberships,
      icon: Users,
      color: "var(--color-orange)",
      bgColor: "rgba(255, 152, 0, 0.1)",
      link: "/admin/memberships",
      badgeText: stats.pendingMemberships > 0 ? "Action Required" : "Up to date",
    },
    {
      title: "New Inquiries",
      value: stats.newInquiries,
      icon: Mail,
      color: "var(--color-teal)",
      bgColor: "rgba(0, 137, 123, 0.1)",
      link: "/admin/contact-inquiries",
      badgeText: stats.newInquiries > 0 ? "Unread" : "All read",
    },
    {
      title: "Active Notices",
      value: stats.notifications,
      icon: Bell,
      color: "var(--color-deep-blue)",
      bgColor: "rgba(11, 61, 145, 0.1)",
      link: "/admin/notifications",
      badgeText: "Homepage feed",
    },
    {
      title: "Total Events",
      value: stats.events,
      icon: Calendar,
      color: "var(--color-green)",
      bgColor: "rgba(67, 160, 71, 0.1)",
      link: "/admin/events",
      badgeText: "Campaigns & Camps",
    },
    {
      title: "Publications",
      value: stats.publications,
      icon: BookOpen,
      color: "#9c27b0",
      bgColor: "rgba(156, 39, 176, 0.1)",
      link: "/admin/publications",
      badgeText: "Magazines & PDF files",
    },
    {
      title: "Core Activities",
      value: stats.activities,
      icon: Activity,
      color: "#e91e63",
      bgColor: "rgba(233, 30, 99, 0.1)",
      link: "/admin/activities",
      badgeText: "Configured sections",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* Header Block */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Dashboard Overview</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Manage website content, review public applications, and generate volunteer ID badges.
            </p>
          </div>
          <Link href="/admin/volunteer-id" className="btn btn-primary" style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CreditCard size={18} />
            Generate ID Card
          </Link>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="skeleton" style={{ height: "140px" }} />
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {statCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link
                  key={index}
                  href={card.link}
                  className="card"
                  style={{
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "140px",
                    textDecoration: "none",
                    borderLeft: `5px solid ${card.color}`,
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
                        {card.title}
                      </span>
                      <h3 style={{ fontSize: "2.25rem", fontWeight: 800, color: "var(--color-text)", margin: "0.25rem 0 0" }}>
                        {card.value}
                      </h3>
                    </div>
                    <div
                      style={{
                        padding: "0.75rem",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: card.bgColor,
                        color: card.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: card.bgColor,
                        color: card.color,
                        fontSize: "0.7rem",
                        padding: "0.2rem 0.6rem",
                      }}
                    >
                      {card.badgeText}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-deep-blue)", fontWeight: 600 }}>
                      Manage &rarr;
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Quick Actions Panel */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
          {/* Shortcuts */}
          <div className="card" style={{ padding: "2rem", background: "#ffffff" }}>
            <h3 style={{ fontSize: "1.25rem", color: "var(--color-deep-blue)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={20} />
              Quick Content Publisher
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link
                href="/admin/notifications"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-mid-gray)",
                  textDecoration: "none",
                  color: "var(--color-text)",
                  transition: "background 0.2s",
                }}
                className="hover:bg-slate-50"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Bell size={18} style={{ color: "var(--color-orange)" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Post Notice</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Publish notices to home sidebar</div>
                  </div>
                </div>
                <PlusCircle size={18} style={{ color: "var(--color-text-muted)" }} />
              </Link>

              <Link
                href="/admin/events"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-mid-gray)",
                  textDecoration: "none",
                  color: "var(--color-text)",
                  transition: "background 0.2s",
                }}
                className="hover:bg-slate-50"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Calendar size={18} style={{ color: "var(--color-green)" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Schedule Event</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Add upcoming seminars or camps</div>
                  </div>
                </div>
                <PlusCircle size={18} style={{ color: "var(--color-text-muted)" }} />
              </Link>

              <Link
                href="/admin/publications"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-mid-gray)",
                  textDecoration: "none",
                  color: "var(--color-text)",
                  transition: "background 0.2s",
                }}
                className="hover:bg-slate-50"
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <BookOpen size={18} style={{ color: "purple" }} />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>Upload Publication</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>Share a new booklet or newsletter PDF</div>
                  </div>
                </div>
                <PlusCircle size={18} style={{ color: "var(--color-text-muted)" }} />
              </Link>
            </div>
          </div>

          {/* Guidelines */}
          <div className="card" style={{ padding: "2rem", background: "#ffffff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ fontSize: "1.25rem", color: "var(--color-deep-blue)", marginBottom: "1rem" }}>
                CMS Usage Policy
              </h3>
              <ul style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <li>All text inputs support both English and Bengali languages. Provide translations wherever possible.</li>
                <li>Compress and format images (.webp, .jpg) before uploading to maintain fast page loads for rural visitors.</li>
                <li>PDF publications and result spreadsheets should have clear titles and correct publication dates.</li>
                <li>Regularly check and export new membership applications and contact inquiries.</li>
              </ul>
            </div>
            <div style={{ marginTop: "1.5rem", background: "rgba(11, 61, 145, 0.05)", padding: "1rem", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--color-deep-blue)" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--color-deep-blue)", textTransform: "uppercase" }}>
                Need Help?
              </span>
              <p style={{ fontSize: "0.85rem", color: "var(--color-text)", margin: "0.25rem 0 0" }}>
                Contact the development team at tech@pbvmpurulia.org for technical assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}
