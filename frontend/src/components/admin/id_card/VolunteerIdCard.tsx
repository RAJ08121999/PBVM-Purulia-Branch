"use client";

import Image from "next/image";
import { UserCheck } from "lucide-react";
import logo from "../../../../public/logo.png";

export type BadgeLevel = "bronze" | "silver" | "gold";

export interface VolunteerData {
  _id: string;
  membershipType: string;
  volunteerId: string;
  fullName: string;
  email?: string;
  bloodGroup: string;
  badgeLevel: BadgeLevel | string;
  photo?: string;
  photoUrl: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

interface VolunteerIdCardProps {
  volunteer: VolunteerData;
  side: "front" | "back";
  printable?: boolean;
}

/**
 * Normalizes any incoming badge representation — whether it's the short
 * key ("gold" | "silver" | "bronze") or the display label ("Renaissance
 * Leader" | "Knowledge Explorer" | "Curiosity Seeker") that gets persisted
 * to MongoDB — into the canonical BadgeLevel key.
 *
 * This is the single source of truth for badge normalization; every
 * consumer (admin preview, print page, PDF generation) should read the
 * badge through this function instead of trusting the raw stored value.
 */
export const normalizeBadgeLevel = (raw?: string | null): BadgeLevel => {
  if (!raw) return "bronze";
  const v = raw.toLowerCase();

  if (v.includes("gold") || v.includes("renaissance")) return "gold";
  if (v.includes("silver") || v.includes("explorer")) return "silver";
  return "bronze";
};

const getBadgeName = (level: BadgeLevel | string) => {
  switch (normalizeBadgeLevel(level)) {
    case "gold":
      return "Renaissance Leader";
    case "silver":
      return "Knowledge Explorer";
    case "bronze":
    default:
      return "Curiosity Seeker";
  }
};

const getBadgeColors = (level: BadgeLevel | string) => {
  switch (normalizeBadgeLevel(level)) {
    case "gold":
      return {
        bg: "#FFD700",
        text: "#ffffff",
        border: "#D4AF37",
        gradient: "var(--gradient-brand)",
      };

    case "silver":
      return {
        bg: "#E0E0E0",
        text: "#ffffff",
        border: "#A9A9A9",
        gradient: "var(--gradient-brand)",
      };

    case "bronze":
    default:
      return {
        bg: "#CD7F32",
        text: "#ffffff",
        border: "#8B4513",
        gradient: "var(--gradient-brand)",
      };
  }
};

const generateQrCodeUrl = (volunteerId: string) => {
    const baseUrl = "http://pbvm-purulia-branch.vercel.app";
    const profileUrl = `${baseUrl}/volunteer/${volunteerId}`;
  
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
      profileUrl
    )}`;
  };

export default function VolunteerIdCard({
  volunteer,
  side,
  printable = false,
}: VolunteerIdCardProps) {
  const normalizedBadge = normalizeBadgeLevel(volunteer.badgeLevel);
  const colors = getBadgeColors(normalizedBadge);
  const badgeName = getBadgeName(normalizedBadge);

  if (side === "front") {
    return (
        <div
        className="id-card-front"
        style={{
            width: printable ? "54mm" : "300px",
            height: printable ? "86mm" : "475px",
            borderRadius: printable ? "2mm" : "16px",
            overflow: "hidden",
            boxShadow: printable
            ? "none"
            : "0 15px 35px rgba(11, 61, 145, 0.15)",
            border: printable
                ? `1mm solid ${colors.border}`
                : `2px solid ${colors.border}`,
            backgroundColor: "#ffffff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
        }}
        >
        {/* Header */}
        <div
            style={{
            padding: printable ? "2mm" : "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: printable ? "1mm" : "0.5rem",
            background: colors.gradient,
            }}
        >
            <div
            style={{
                width: printable ? "8mm" : "50px",
                height: printable ? "8mm" : "50px",
                backgroundColor: "#fff",
                borderRadius: "50%",
                padding: printable ? "0.3mm" : "1px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                overflow: "hidden",
            }}
            >
            <Image
                src={logo}
                alt="Logo"
                width={printable ? 45 : 48}
                height={printable ? 45 : 48}
                priority
                unoptimized
                style={{
                objectFit: "contain",
                borderRadius: "50%",
                }}
            />
            </div>
    
            <div
            style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                textAlign: "center",
            }}
            >
            <h4
                style={{
                fontSize: printable ? "2.4mm" : "0.85rem",
                color: colors.text,
                fontWeight: 800,
                margin: 0,
                lineHeight: 1.1,
                }}
            >
                PASHCHIM BANGA VIGYAN MANCHA
            </h4>
    
            <span
                style={{
                fontSize: printable ? "1.5mm" : "0.55rem",
                color: colors.text,
                fontWeight: 700,
                textTransform: "uppercase",
                opacity: 0.9,
                }}
            >
                Purulia District Branch
            </span>
            </div>
        </div>
    
        {/* Body */}
        <div
            style={{
            flex: 1,
            padding: printable ? "3mm" : "1.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#ffffff",
            }}
        >
            <div
                style={{
                    position:"relative",
                    width: printable ? "22mm" : "120px",
                    height: printable ? "26mm" : "140px",
                    borderRadius: printable ? "1mm" : "8px",
                    border: printable
                    ? `0.5mm solid ${colors.border}`
                    : `3px solid ${colors.border}`,
                    backgroundColor: "#f5f7fa",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: printable
                    ? "none"
                    : "0 4px 10px rgba(0,0,0,0.1)",
                }}
            >
            {volunteer.photoUrl ? (
                <Image
                src={volunteer.photoUrl}
                alt={volunteer.fullName}
                fill
                style={{ objectFit: "cover" }}
                />
            ) : (
                <div
                style={{
                    color: "var(--color-text-muted)",
                    textAlign: "center",
                }}
                >
                <UserCheck size={printable ? 18 : 40} style={{ opacity: 0.5 }} />
                <span
                    style={{
                    display: "block",
                    fontSize: printable ? "1.6mm" : "0.7rem",
                    }}
                >
                    No Photo
                </span>
                </div>
            )}
            </div>
    
            <div
            style={{
                width: "100%",
                textAlign: "center",
                marginTop: printable ? "2mm" : "1rem",
            }}
            >
            <h3
                style={{
                fontSize: printable ? "3.2mm" : "1.2rem",
                fontWeight: 800,
                color: "var(--color-deep-blue)",
                margin: 0,
                }}
            >
                {volunteer.fullName}
            </h3>
    
            <span
                style={{
                fontSize: printable ? "1.8mm" : "0.75rem",
                color: "var(--color-text-muted)",
                fontWeight: 600,
                display: "block",
                marginTop: printable ? "0.8mm" : "0.25rem",
                letterSpacing: "1px",
                }}
            >
                VOLUNTEER CARD
            </span>
            </div>
    
            <div
            style={{
                width: "100%",
                margin: printable ? "2mm 0" : "1rem 0",
                background: "#f8fafc",
                padding: printable ? "2mm" : "0.75rem",
                borderRadius: printable ? "1mm" : "8px",
                border: printable
                ? "0.3mm solid #e2e8f0"
                : "1px solid #e2e8f0",
            }}
            >
            <div
                style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: printable ? "1.8mm" : "0.8rem",
                marginBottom: "0.25rem",
                }}
            >
                <span
                style={{
                    color: "var(--color-text-muted)",
                    fontWeight: 500,
                }}
                >
                ID No:
                </span>
    
                <strong>{volunteer.volunteerId}</strong>
            </div>
    
            <div
                style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: printable ? "1.8mm" : "0.8rem",
                }}
            >
                <span
                style={{
                    color: "var(--color-text-muted)",
                    fontWeight: 500,
                }}
                >
                Blood Group:
                </span>
    
                <strong style={{ color: "#ef4444" }}>
                {volunteer.bloodGroup}
                </strong>
            </div>
            </div>
    
            <div
            style={{
                width: "100%",
                padding: printable ? "1.5mm" : "0.5rem",
                background: colors.gradient,
                color: colors.text,
                textAlign: "center",
                borderRadius: printable ? "1mm" : "8px",
                fontWeight: 800,
                fontSize: printable ? "2mm" : "0.9rem",
                letterSpacing: "1px",
                textShadow:
                normalizedBadge !== "silver"
                    ? "0 1px 2px rgba(0,0,0,0.2)"
                    : "none",
            }}
            >
            {badgeName}
            </div>
        </div>
    
        {/* Footer */}
        <div
            style={{
            padding: printable ? "1.5mm 2mm" : "0.75rem 1.25rem",
            backgroundColor: "var(--color-deep-blue)",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            fontSize: printable ? "1.4mm" : "0.6rem",
            fontWeight: 500,
            }}
        >
            <span>SCIENCE FOR SOCIETY</span>
            <span style={{ opacity: 0.7 }}>
            PBVM PURULIA BRANCH
            </span>
        </div>
        </div>
    );
    }

      return (
        <div
          className="id-card-back"
          style={{
            width: printable ? "54mm" : "300px",
            height: printable ? "86mm" : "475px",
            borderRadius: printable ? "2mm" : "16px",
            overflow: "hidden",
            boxShadow: printable
              ? "none"
              : "0 15px 35px rgba(11,61,145,.15)",
            border: printable
              ? `1mm solid ${colors.border}`
              : `2px solid ${colors.border}`,
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              padding: printable ? "2mm" : "1.25rem",
              backgroundColor: "var(--color-deep-blue)",
              color: "#fff",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: printable ? "2mm" : "0.9rem",
              letterSpacing: "1px",
            }}
          >
            Terms & Conditions
          </div>
      
          <div
            style={{
              flex: 1,
              padding: printable ? "3mm" : "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: printable ? "2mm" : "1rem",
              fontSize: printable ? "1.6mm" : "0.75rem",
              color: "var(--color-text)",
            }}
          >
            <div
              style={{
                padding: printable ? "1.5mm" : "0.5rem",
                background: "#f8fafc",
                border: printable
                ? "0.3mm solid #e2e8f0"
                : "1px solid #e2e8f0",
                borderRadius: printable ? "1mm" : "8px",
              }}
            >
              <p style={{ margin: "0 0 .25rem 0", lineHeight: printable ? 1.2 : 1.4 }}>
                1. This card is non-transferable.
              </p>
      
              <p style={{ margin: 0, lineHeight: printable ? 1.2 : 1.4 }}>
                2. Loss of card must be reported immediately.
              </p>
            </div>
      
            <div>
              <strong
                style={{
                  display: "block",
                  color: "var(--color-deep-blue)",
                  marginBottom: printable ? ".5mm" : ".25rem",
                  borderBottom: printable
                    ? "0.3mm solid #e2e8f0"
                    : "1px solid #e2e8f0",
                  paddingBottom: printable ? ".5mm" : ".25rem",
                }}
              >
                Address:
              </strong>
      
              <div
                style={{
                  lineHeight: printable ? 1.2 : 1.4,
                  color: "#334155",
                }}
              >
                {volunteer.address}
              </div>
            </div>
      
            <div>
              <strong
                style={{
                  display: "block",
                  color: "var(--color-deep-blue)",
                  marginBottom: printable ? ".5mm" : ".25rem",
                  borderBottom: printable
                    ? "0.3mm solid #e2e8f0"
                    : "1px solid #e2e8f0",
                  paddingBottom: printable ? ".5mm" : ".25rem",
                }}
              >
                Emergency Contact:
              </strong>
      
              <div
                style={{
                    color: "#334155",
                    fontSize: printable ? "1.6mm" : "0.75rem",
                }}
              >
                Name: <strong>{volunteer.emergencyContact.name}</strong> (
                {volunteer.emergencyContact.relation})
              </div>
      
              <div
                style={{
                    color: "#334155",
                    fontSize: printable ? "1.6mm" : "0.75rem",
                }}
              >
                Phone: <strong>{volunteer.emergencyContact.phone}</strong>
              </div>
            </div>
      
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "auto",
                paddingBottom: printable ? "2mm" : ".5rem",
              }}
            >
              <Image
                src={generateQrCodeUrl(volunteer.volunteerId)}
                alt="QR Code"
                width={printable ? 68 : 110}
                height={printable ? 68 : 110}
                priority
                unoptimized
                style={{
                  border: printable
                    ? `0.5mm solid ${colors.border}`
                    : `2px solid ${colors.border}`,
                  padding: printable ? "0.7mm" : "4px",
                  borderRadius: printable ? "1mm" : "8px",
                  boxShadow: printable
                    ? "none"
                    : "0 4px 6px rgba(0,0,0,.05)",
                }}
              />
            </div>
          </div>
      
          <div
            style={{
              padding: printable ? "1.5mm" : ".75rem",
              backgroundColor: printable ? "#f5f7fa" : "#f1f5f9",
              textAlign: "center",
              fontSize: printable ? "1.6mm" : ".6rem",
              color: "var(--color-text-muted)",
              borderTop: printable
                ? "0.3mm solid #cbd5e1"
                : "1px solid #cbd5e1",
            }}
          >
            If found, please return to PBVM Purulia Branch.
          </div>
        </div>
      );
}
