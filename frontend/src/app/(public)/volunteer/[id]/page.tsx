"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  UserCircle,
  Award,
  MapPin,
  Phone,
  Mail,
  Droplets,
  ShieldCheck,
  Calendar,
  Briefcase,
  Clock,
  AlertCircle,
} from "lucide-react";
import logo from "../../../(public)/../icon.png"
import { publicApi } from "@/lib/api";

interface VolunteerDetails {
  _id: string;
  fullName: string;
  photo?: string;
  address: string;
  district: string;
  state: string;
  phoneNumber: string;
  email: string;
  bloodGroup?: string;
  volunteerId: string;
  badgeLevel?: string;
  areasOfInterest?: string[];
  availability?: string;
  timeContribution?: string;
  skills?: string[];
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  approvedAt?: string;
}

const getBadgeDisplayName = (level?: string) => {
  switch (level) {
    case "Renaissance Leader":
      return "Renaissance Leader";
    case "Knowledge Explorer":
      return "Knowledge Explorer";
    case "Curiosity Seeker":
    default:
      return "Curiosity Seeker";
  }
};

const resolvePhotoUrl = (photo?: string): string => {
  if (!photo) return "";
  if (photo.startsWith("http://") || photo.startsWith("https://") || photo.startsWith("data:")) return photo;
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");
  return `${baseUrl}/${photo.replace(/^\//, "")}`;
};

export default function VolunteerProfilePage() {
  const params = useParams();
  const volunteerId = params.id as string;

  const [volunteer, setVolunteer] = useState<VolunteerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!volunteerId) return;
    const fetchVolunteer = async () => {
      try {
        const res = await publicApi.getVolunteerById(volunteerId);
        if (res.data?.success && res.data.volunteer) {
          setVolunteer(res.data.volunteer);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteer();
  }, [volunteerId]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #e2e8f0",
              borderTop: "4px solid var(--color-deep-blue)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem auto",
            }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>Loading volunteer details...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (error || !volunteer) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div
          className="card"
          style={{
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            padding: "3rem 2rem",
            background: "#ffffff",
          }}
        >
          <AlertCircle size={48} style={{ color: "#ef4444", margin: "0 auto 1rem auto" }} />
          <h2 style={{ fontSize: "1.5rem", color: "var(--color-deep-blue)", fontWeight: 700, marginBottom: "0.5rem" }}>
            Volunteer Not Found
          </h2>
          <p style={{ color: "var(--color-text-muted)", marginBottom: "1.5rem", lineHeight: 1.6 }}>
            The volunteer ID <strong>{volunteerId}</strong> could not be found. This could mean the ID is incorrect or the volunteer&apos;s application has not been approved yet.
          </p>
          <Link
            href="/"
            className="btn btn-primary"
            style={{ borderRadius: "var(--radius-md)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const photoUrl = resolvePhotoUrl(volunteer.photo);
  const badgeName = getBadgeDisplayName(volunteer.badgeLevel);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1rem" }}>
      {/* Verified Banner */}
      <div
        style={{
          background: "var(--gradient-brand)",
          borderRadius: "var(--radius-lg)",
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          marginBottom: "2rem",
          color: "#ffffff",
        }}
      >
        <ShieldCheck size={24} />
        <div>
          <strong style={{ display: "block", fontSize: "1rem" }}>Verified Volunteer</strong>
          <span style={{ fontSize: "0.85rem", opacity: 0.9 }}>
            This volunteer is an approved member of Pashchim Banga Vigyan Mancha, Purulia Branch.
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <div
        className="card"
        style={{
          background: "#ffffff",
          padding: "0",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "var(--gradient-brand)",
            padding: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "16px",
              overflow: "hidden",
              border: "3px solid rgba(255,255,255,0.5)",
              backgroundColor: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={volunteer.fullName}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <UserCircle size={48} style={{ color: "var(--color-text-muted)" }} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#ffffff",
                margin: 0,
                lineHeight: 1.2,
                textAlign: "center"
              }}
            >
              {volunteer.fullName}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginTop: "0.5rem",
                justifyContent: "center",

              }}
            >
              <span
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                }}
              >
                <Award size={14} /> {badgeName}
              </span>
              <span
                style={{
                  background: "rgba(255,255,255,0.15)",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "#ffffff",
                  letterSpacing: "0.5px",
                }}
              >
                {volunteer.volunteerId}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Quick Info Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
            {/* Blood Group */}
            {volunteer.bloodGroup && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem",
                  background: "#fef2f2",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #fecaca",
                }}
              >
                <Droplets size={20} style={{ color: "#ef4444", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Blood Group</div>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#dc2626" }}>{volunteer.bloodGroup}</div>
                </div>
              </div>
            )}

            {/* Availability */}
            {volunteer.availability && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem",
                  background: "#f0fdf4",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #bbf7d0",
                }}
              >
                <Clock size={20} style={{ color: "#16a34a", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Availability</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#15803d" }}>{volunteer.availability}</div>
                </div>
              </div>
            )}

            {/* Time Contribution */}
            {volunteer.timeContribution && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem",
                  background: "#eff6ff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #bfdbfe",
                }}
              >
                <Briefcase size={20} style={{ color: "#2563eb", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Time Contribution</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1d4ed8" }}>{volunteer.timeContribution}</div>
                </div>
              </div>
            )}

            {/* Approved Date */}
            {volunteer.approvedAt && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1rem",
                  background: "#faf5ff",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid #e9d5ff",
                }}
              >
                <Calendar size={20} style={{ color: "#7c3aed", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase" }}>Member Since</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#6d28d9" }}>{new Date(volunteer.approvedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</div>
                </div>
              </div>
            )}
          </div>

          {/* Contact & Address */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Contact Information
              </h4>
              <div style={{ fontSize: "0.9rem", color: "var(--color-dark-gray)", lineHeight: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Mail size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                  <a href={`mailto:${volunteer.email}`} style={{ color: "var(--color-deep-blue)" }}>{volunteer.email}</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Phone size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
                  <a href={`tel:${volunteer.phoneNumber}`} style={{ color: "var(--color-deep-blue)" }}>{volunteer.phoneNumber}</a>
                </div>
              </div>
            </div>
            <div>
              <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Address
              </h4>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.9rem", color: "var(--color-dark-gray)", lineHeight: 1.6 }}>
                <MapPin size={14} style={{ color: "var(--color-text-muted)", flexShrink: 0, marginTop: "3px" }} />
                <span>{volunteer.address}, {volunteer.district}, {volunteer.state}</span>
              </div>
            </div>
          </div>

          {/* Areas of Interest */}
          {volunteer.areasOfInterest && volunteer.areasOfInterest.length > 0 && (
            <div>
              <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Areas of Interest
              </h4>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {volunteer.areasOfInterest.map((area) => (
                  <span
                    key={area}
                    style={{
                      background: "#e3f2fd",
                      color: "#1565c0",
                      padding: "0.25rem 0.7rem",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {volunteer.skills && volunteer.skills.length > 0 && (
            <div>
              <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Skills
              </h4>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {volunteer.skills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: "#fff3e0",
                      color: "#e65100",
                      border: "1px solid #ffe0b2",
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contact */}
          {volunteer.emergencyContact?.name && (
            <div
              style={{
                borderTop: "1px solid var(--color-light-gray)",
                paddingTop: "1.25rem",
              }}
            >
              <h4 style={{ margin: "0 0 0.75rem 0", fontSize: "0.8rem", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Emergency Contact
              </h4>
              <div style={{ fontSize: "0.9rem", color: "var(--color-dark-gray)", lineHeight: 1.8 }}>
                <div>
                  <strong>{volunteer.emergencyContact.name}</strong>
                  {volunteer.emergencyContact.relation && ` (${volunteer.emergencyContact.relation})`}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Phone size={14} style={{ color: "var(--color-text-muted)" }} />
                  <a href={`tel:${volunteer.emergencyContact.phone}`} style={{ color: "var(--color-deep-blue)" }}>
                    {volunteer.emergencyContact.phone}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1.25rem 2rem",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Image src={logo} alt="PBVM Logo" width={28} height={28} />
            <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600 }}>
              Pashchim Banga Vigyan Mancha — Purulia Branch
            </span>
          </div>
          <Link
            href="/"
            style={{
              fontSize: "0.8rem",
              color: "var(--color-deep-blue)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Visit Website →
          </Link>
        </div>
      </div>
    </div>
  );
}
