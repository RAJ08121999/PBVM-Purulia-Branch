"use client"

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Printer, Upload, Trash2, ArrowLeft, RefreshCw, UserCheck } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

type ActivityLevel = "highly" | "moderately" | "emerging";

interface VolunteerData {
  idNumber: string;
  name: string;
  bloodGroup: string;
  level: ActivityLevel;
  photoUrl: string;
}

export default function VolunteerIDCardGenerator() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<VolunteerData>({
    idNumber: "PBVM-PUR-001",
    name: "Subrata Sen",
    bloodGroup: "A+",
    level: "highly",
    photoUrl: "",
  });

  const getBadgeName = (level: ActivityLevel) => {
    switch (level) {
      case "highly":
        return "Renaissance Leader";
      case "moderately":
        return "Knowledge Explorer";
      case "emerging":
        return "Curiosity Seeker";
    }
  };

  const getBadgeColors = (level: ActivityLevel) => {
    switch (level) {
      case "highly":
        return {
          bg: "var(--color-orange)",
          text: "#ffffff",
          gradient: "linear-gradient(135deg, var(--color-deep-blue) 0%, var(--color-orange) 100%)",
          border: "var(--color-orange)",
        };
      case "moderately":
        return {
          bg: "var(--color-teal)",
          text: "#ffffff",
          gradient: "linear-gradient(135deg, var(--color-deep-blue) 0%, var(--color-teal) 100%)",
          border: "var(--color-teal)",
        };
      case "emerging":
        return {
          bg: "var(--color-green)",
          text: "#ffffff",
          gradient: "linear-gradient(135deg, var(--color-deep-blue) 0%, var(--color-green) 100%)",
          border: "var(--color-green)",
        };
    }
  };

  // Resolve background templates provided by user
  const getCardBgImage = (level: ActivityLevel) => {
    switch (level) {
      case "highly":
        return "/images/id-renaissance.png";
      case "moderately":
        return "/images/id-knowledge.png";
      case "emerging":
        return "/images/id-curiosity.png";
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Photo size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const colors = getBadgeColors(formData.level);
  const badgeName = getBadgeName(formData.level);
  const bgImage = getCardBgImage(formData.level);

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }} className="no-print">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Link href="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", textDecoration: "none", fontSize: "0.875rem" }}>
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            </div>
            <h1 style={{ fontSize: "2rem", color: "var(--color-deep-blue)", fontWeight: 800 }}>Volunteer ID Generator</h1>
            <p style={{ color: "var(--color-text-muted)", fontSize: "0.95rem" }}>
              Generate, preview, and print identity cards for branch volunteers.
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="btn btn-primary"
            style={{ borderRadius: "var(--radius-md)", display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <Printer size={18} />
            Print Card
          </button>
        </div>

        {/* Dynamic Panels */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "3rem", alignItems: "flex-start" }}>
          {/* Card Config Form */}
          <div className="card" style={{ padding: "2rem", background: "#ffffff" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-deep-blue)", marginBottom: "1.5rem", fontWeight: 700 }}>
              Volunteer Information
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="idNumber">
                Volunteer ID Number
              </label>
              <input
                id="idNumber"
                type="text"
                className="form-input"
                value={formData.idNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, idNumber: e.target.value }))}
                placeholder="e.g. PBVM-PUR-2026-004"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter volunteer name"
                required
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="bloodGroup">
                  Blood Group
                </label>
                <select
                  id="bloodGroup"
                  className="form-input"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bloodGroup: e.target.value }))}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="level">
                  Activity Level
                </label>
                <select
                  id="level"
                  className="form-input"
                  value={formData.level}
                  onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value as ActivityLevel }))}
                >
                  <option value="highly">Highly Active</option>
                  <option value="moderately">Moderately Active</option>
                  <option value="emerging">Emerging</option>
                </select>
              </div>
            </div>

            {/* Photo Upload */}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <span className="form-label">Volunteer Photo</span>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                {formData.photoUrl ? (
                  <div style={{ position: "relative", width: "70px", height: "70px" }}>
                    <img
                      src={formData.photoUrl}
                      alt="Preview"
                      style={{ width: "70px", height: "70px", objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--color-mid-gray)" }}
                    />
                    <button
                      onClick={removePhoto}
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "-5px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                      title="Remove Photo"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "var(--radius-md)",
                      border: "2px dashed var(--color-mid-gray)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      color: "var(--color-text-muted)",
                    }}
                    className="hover:border-blue-500 hover:text-blue-500"
                  >
                    <Upload size={16} />
                    <span style={{ fontSize: "0.65rem", marginTop: "0.25rem" }}>Upload</span>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ display: "none" }}
                  />
                  <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                    Upload portrait photo. JPG, PNG formats, max 2MB. Centered crop recommended.
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--color-text-muted)",
                backgroundColor: "rgba(11, 61, 145, 0.04)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                borderLeft: "4px solid var(--color-deep-blue)",
                marginTop: "1.5rem",
              }}
            >
              <strong>Badge Mapping:</strong>
              <div style={{ marginTop: "0.25rem" }}>Highly Active &rarr; <strong>Renaissance Leader</strong></div>
              <div>Moderately Active &rarr; <strong>Knowledge Explorer</strong></div>
              <div>Emerging &rarr; <strong>Curiosity Seeker</strong></div>
            </div>
          </div>

          {/* Interactive Card Live Preview */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-deep-blue)", fontWeight: 700, alignSelf: "flex-start" }}>
              Live Print Preview
            </h3>

            {/* Standard ID Card Canvas */}
            <div
              id="volunteer-id-card"
              style={{
                width: "300px",
                height: "475px",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(11, 61, 145, 0.15)",
                border: `1px solid ${colors.border}`,
                backgroundColor: "#ffffff",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                // Load background template image, fallback to brand style gradient
                backgroundImage: bgImage ? `url(${bgImage})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Fallback layout overlay (only rendered/visible if bgImage fails or is skipped) */}
              {!bgImage && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: colors.gradient,
                    opacity: 0.05,
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Card Header */}
              <div
                style={{
                  padding: "1.25rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  borderBottom: `2px solid ${colors.bg}`,
                  backgroundColor: "rgba(255,255,255,0.95)",
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    background: "var(--color-deep-blue)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "0.8rem",
                  }}
                >
                  PB
                </div>
                <div>
                  <h4 style={{ fontSize: "0.85rem", color: "var(--color-deep-blue)", fontWeight: 800, margin: 0, lineHeight: 1 }}>
                    PASCHIM BANGA VIGYAN MANCHA
                  </h4>
                  <span style={{ fontSize: "0.6rem", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Purulia District Branch
                  </span>
                </div>
              </div>

              {/* Card Content Area */}
              <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", zIndex: 10, backgroundColor: "rgba(255,255,255,0.85)", backdropFilter: "blur(2px)" }}>
                {/* Photo Frame */}
                <div
                  style={{
                    width: "120px",
                    height: "140px",
                    borderRadius: "8px",
                    border: `3px solid ${colors.bg}`,
                    backgroundColor: "#f5f7fa",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt={formData.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ textAlign: "center", color: "var(--color-text-muted)" }}>
                      <UserCheck size={40} style={{ opacity: 0.5, margin: "0 auto 0.5rem" }} />
                      <span style={{ fontSize: "0.7rem" }}>No Photo</span>
                    </div>
                  )}
                </div>

                {/* Volunteer Details */}
                <div style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-deep-blue)", margin: 0 }}>
                    {formData.name || "Volunteer Name"}
                  </h3>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600, display: "block", marginTop: "0.25rem" }}>
                    VOLUNTEER CARD
                  </span>
                </div>

                {/* Grid info */}
                <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr", gap: "0.25rem", margin: "1rem 0", background: "rgba(255, 255, 255, 0.9)", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--color-mid-gray)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>ID Number:</span>
                    <strong style={{ color: "var(--color-text)" }}>{formData.idNumber}</strong>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                    <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>Blood Group:</span>
                    <strong style={{ color: "#ef4444" }}>{formData.bloodGroup}</strong>
                  </div>
                </div>

                {/* Designation / Badge Tag */}
                <div
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    backgroundColor: colors.bg,
                    color: colors.text,
                    textAlign: "center",
                    borderRadius: "8px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.02em",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  {badgeName}
                </div>
              </div>

              {/* Card Footer */}
              <div
                style={{
                  padding: "0.75rem 1.25rem",
                  backgroundColor: "var(--color-deep-blue)",
                  color: "#ffffff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "0.6rem",
                  fontWeight: 500,
                }}
              >
                <span>SCIENCE FOR SOCIETY</span>
                <span style={{ opacity: 0.7 }}>PBVM PURULIA BRANCH</span>
              </div>
            </div>

            <button
              onClick={handlePrint}
              style={{
                width: "100%",
                maxWidth: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
              className="btn btn-secondary"
            >
              <Printer size={16} /> Print Single Card
            </button>
          </div>
        </div>
      </div>

      {/* Printable Area - Rendered ONLY in print mode */}
      <div id="print-card-area" className="only-print">
        <div
          style={{
            width: "53.98mm",  // Standard CR-80 card dimensions
            height: "85.6mm",
            boxSizing: "border-box",
            border: `1.5mm solid ${colors.bg}`,
            borderRadius: "4mm",
            overflow: "hidden",
            backgroundColor: "#ffffff",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            backgroundImage: bgImage ? `url(${bgImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            fontFamily: "var(--font-body)",
            pageBreakInside: "avoid",
          }}
        >
          {/* Card Header */}
          <div
            style={{
              padding: "2mm",
              display: "flex",
              alignItems: "center",
              gap: "1.5mm",
              borderBottom: `0.5mm solid ${colors.bg}`,
              backgroundColor: "rgba(255,255,255,0.95)",
            }}
          >
            <div
              style={{
                width: "6mm",
                height: "6mm",
                background: "var(--color-deep-blue)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.5mm",
              }}
            >
              PB
            </div>
            <div style={{ lineHeight: 1.1 }}>
              <div style={{ fontSize: "1.8mm", color: "var(--color-deep-blue)", fontWeight: 800 }}>
                PASCHIM BANGA VIGYAN MANCHA
              </div>
              <div style={{ fontSize: "1.3mm", color: "var(--color-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02mm" }}>
                Purulia District Branch
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div
            style={{
              flex: 1,
              padding: "3mm",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          >
            {/* Photo */}
            <div
              style={{
                width: "22mm",
                height: "26mm",
                borderRadius: "1.5mm",
                border: `0.5mm solid ${colors.bg}`,
                backgroundColor: "#f5f7fa",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {formData.photoUrl ? (
                <img src={formData.photoUrl} alt={formData.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ fontSize: "1.5mm", color: "var(--color-text-muted)", textAlign: "center" }}>
                  No Photo
                </div>
              )}
            </div>

            {/* Name */}
            <div style={{ width: "100%", textAlign: "center" }}>
              <div style={{ fontSize: "2.8mm", fontWeight: 800, color: "var(--color-deep-blue)" }}>
                {formData.name}
              </div>
              <div style={{ fontSize: "1.6mm", color: "var(--color-text-muted)", fontWeight: 600 }}>
                VOLUNTEER
              </div>
            </div>

            {/* Details Box */}
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "0.5mm",
                background: "rgba(255, 255, 255, 0.9)",
                padding: "1.5mm",
                borderRadius: "1.5mm",
                border: "0.2mm solid var(--color-mid-gray)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.8mm" }}>
                <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>ID Number:</span>
                <strong style={{ color: "var(--color-text)" }}>{formData.idNumber}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.8mm" }}>
                <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>Blood Group:</span>
                <strong style={{ color: "#ef4444" }}>{formData.bloodGroup}</strong>
              </div>
            </div>

            {/* Badge Designation */}
            <div
              style={{
                width: "100%",
                padding: "1.2mm",
                backgroundColor: colors.bg,
                color: colors.text,
                textAlign: "center",
                borderRadius: "1.5mm",
                fontWeight: 700,
                fontSize: "2.2mm",
              }}
            >
              {badgeName}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "1.5mm 3mm",
              backgroundColor: "var(--color-deep-blue)",
              color: "#ffffff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "1.4mm",
              fontWeight: 500,
            }}
          >
            <span>SCIENCE FOR SOCIETY</span>
            <span>PBVM PURULIA</span>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        .only-print {
          display: none;
        }
        @media print {
          .no-print {
            display: none !important;
          }
          .only-print {
            display: flex !important;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: none !important;
          }
          body {
            background: none !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </AdminLayout>
  );
}
