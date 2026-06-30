"use client"

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Printer, Upload, Trash2, ArrowLeft, UserCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../../public/logo.png";
import { adminApi } from "@/lib/api";

type BadgeLevel = "bronze" | "silver" | "gold";

interface VolunteerData {
  _id: string;
  volunteerId: string;
  fullName: string;
  bloodGroup: string;
  badgeLevel: BadgeLevel;
  photoUrl: string;
  address: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export default function VolunteerIDCardGenerator() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>("");
  const [isFlipped, setIsFlipped] = useState(false);

  const [formData, setFormData] = useState<VolunteerData>({
    _id: "",
    volunteerId: "PBVM-PUR-YYYYMMDD-01",
    fullName: "Volunteer Name",
    bloodGroup: "O+",
    badgeLevel: "bronze",
    photoUrl: "",
    address: "Purulia, West Bengal",
    emergencyContact: {
      name: "Emergency Contact",
      relation: "Parent",
      phone: "9876543210"
    }
  });

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const res = await adminApi.getMemberships({ status: "approved" });
      const approvedVolunteers = (res.data?.memberships || []).filter((m: any) => m.membershipType === "volunteer");
      setVolunteers(approvedVolunteers);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch volunteers");
    }
  };

  const getFullImageUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");
    return `${baseUrl}/${path.replace(/^\//, '')}`;
  };

  const handleSelectVolunteer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedVolunteerId(id);
    if (!id) return;
    const vol = volunteers.find(v => v._id === id);
    if (vol) {
      setFormData({
        _id: vol._id,
        volunteerId: vol.volunteerId || "Pending",
        fullName: vol.fullName,
        bloodGroup: vol.bloodGroup || "N/A",
        badgeLevel: vol.badgeLevel || "bronze",
        photoUrl: getFullImageUrl((vol as any).photo || vol.photoUrl || ""),
        address: vol.address || "",
        emergencyContact: vol.emergencyContact || { name: "N/A", relation: "N/A", phone: "N/A" }
      });
    }
  };

  const getBadgeName = (level: BadgeLevel) => {
    switch (level) {
      case "gold": return "Renaissance Leader";
      case "silver": return "Knowledge Explorer";
      case "bronze": return "Curiosity Seeker";
      default: return "Curiosity Seeker";
    }
  };

  const getBadgeColors = (level: BadgeLevel) => {
    switch (level) {
      case "gold":
        return { bg: "#FFD700", text: "#ffffff", border: "#D4AF37", gradient: "var(--gradient-brand)" };
      case "silver":
        return { bg: "#E0E0E0", text: "#ffffff", border: "#A9A9A9", gradient: "var(--gradient-brand)" };
      case "bronze":
      default:
        return { bg: "#CD7F32", text: "#ffffff", border: "#8B4513", gradient: "var(--gradient-brand)" };
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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePrint = () => {
    window.print();
  };

  const colors = getBadgeColors(formData.badgeLevel);
  const badgeName = getBadgeName(formData.badgeLevel);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=http://pbvm-purulia-branch.vercel.app/volunteer/${formData.volunteerId}`;

  return (
    <>
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
              Select a volunteer to generate their two-sided ID card.
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "3rem", alignItems: "flex-start", width: "100%" }}>
          {/* Card Config Form */}
          <div className="card" style={{ padding: "2rem", background: "#ffffff" }}>
            <h3 style={{ fontSize: "1.2rem", color: "var(--color-deep-blue)", marginBottom: "1.5rem", fontWeight: 700 }}>
              Volunteer Selection
            </h3>

            <div className="form-group">
              <label className="form-label" htmlFor="volunteerSelect">
                Select Approved Volunteer
              </label>
              <select
                id="volunteerSelect"
                className="form-input"
                value={selectedVolunteerId}
                onChange={handleSelectVolunteer}
              >
                <option value="">-- Custom / Manual Entry --</option>
                {volunteers.map(v => (
                  <option key={v._id} value={v._id}>{v.fullName} ({v.volunteerId})</option>
                ))}
              </select>
            </div>

            <h3 style={{ fontSize: "1rem", color: "var(--color-deep-blue)", marginTop: "1.5rem", marginBottom: "1rem", fontWeight: 700 }}>
              Edit Details (For Preview)
            </h3>

            <div className="form-group">
              <label className="form-label">Volunteer ID Number</label>
              <input type="text" className="form-input" value={formData.volunteerId} onChange={(e) => setFormData(p => ({ ...p, volunteerId: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={formData.fullName} onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))} />
            </div>

            <div className="form-group">
              <label className="form-label">Address (Back Side)</label>
              <textarea className="form-input" rows={2} value={formData.address} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <input type="text" className="form-input" value={formData.bloodGroup} onChange={(e) => setFormData(p => ({ ...p, bloodGroup: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label">Badge Level</label>
                <select className="form-input" value={formData.badgeLevel} onChange={(e) => setFormData(p => ({ ...p, badgeLevel: e.target.value as BadgeLevel }))}>
                  <option value="gold">Renaissance Leader (Gold)</option>
                  <option value="silver">Knowledge Explorer (Silver)</option>
                  <option value="bronze">Curiosity Seeker (Bronze)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact (Name - Relation - Phone)</label>
              <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
                <input type="text" className="form-input" placeholder="Name" value={formData.emergencyContact.name} onChange={(e) => setFormData(p => ({ ...p, emergencyContact: { ...p.emergencyContact, name: e.target.value } }))} />
                <input type="text" className="form-input" placeholder="Relation" value={formData.emergencyContact.relation} onChange={(e) => setFormData(p => ({ ...p, emergencyContact: { ...p.emergencyContact, relation: e.target.value } }))} />
                <input type="text" className="form-input" placeholder="Phone" value={formData.emergencyContact.phone} onChange={(e) => setFormData(p => ({ ...p, emergencyContact: { ...p.emergencyContact, phone: e.target.value } }))} />
              </div>
            </div>

            {/* Photo Upload */}
            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <span className="form-label">Volunteer Photo</span>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "0.5rem" }}>
                {formData.photoUrl ? (
                  <div style={{ position: "relative", width: "70px", height: "70px" }}>
                    <img src={formData.photoUrl} alt="Preview" width={70} height={70} style={{ objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--color-mid-gray)" }} />
                    <button onClick={removePhoto} style={{ position: "absolute", top: "-5px", right: "-5px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={12} /></button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()} style={{ width: "70px", height: "70px", borderRadius: "var(--radius-md)", border: "2px dashed var(--color-mid-gray)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--color-text-muted)" }}>
                    <Upload size={16} />
                    <span style={{ fontSize: "0.65rem", marginTop: "0.25rem" }}>Upload</span>
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Card Live Preview */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ display: "flex", width: "100%", maxWidth: "300px", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.2rem", color: "var(--color-deep-blue)", fontWeight: 700, margin: 0 }}>Print Preview</h3>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.75rem", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "4px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-deep-blue)" }}
              >
                <RefreshCw size={14} /> Flip Card
              </button>
            </div>

            {/* Render ONLY Front or Back depending on state */}
            {!isFlipped ? (
              /* Front Card */
              <div
                className="id-card-front"
                style={{
                  width: "300px", height: "475px", borderRadius: "16px", overflow: "hidden",
                  boxShadow: "0 15px 35px rgba(11, 61, 145, 0.15)", border: `2px solid ${colors.border}`,
                  backgroundColor: "#ffffff", position: "relative", display: "flex", flexDirection: "column"
                }}
              >
                {/* Header decorated with gradient */}
                <div style={{ padding: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", background: colors.gradient }}>
                  <div style={{ width: "50px", height: "50px", backgroundColor: "#fff", borderRadius: "50%", padding: "1px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}><Image src={logo} alt="Logo" width={48} height={48} style={{ objectFit: "contain", borderRadius: "50%" }} /></div>
                  <div style={{ display: "flex", flexDirection: "column", flex: 1, textAlign: "center" }}>
                    <h4 style={{ fontSize: "0.85rem", color: colors.text, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>PASHCHIM BANGA VIGYAN MANCHA</h4>
                    <span style={{ fontSize: "0.55rem", color: colors.text, fontWeight: 700, textTransform: "uppercase", opacity: 0.9 }}>Purulia District Branch</span>
                  </div>
                </div>

                <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", backgroundColor: "#ffffff" }}>
                  <div style={{ width: "120px", height: "140px", borderRadius: "8px", border: `3px solid ${colors.border}`, backgroundColor: "#f5f7fa", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                    {formData.photoUrl ? <img src={formData.photoUrl} alt={formData.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ color: "var(--color-text-muted)", textAlign: "center" }}><UserCheck size={40} style={{ opacity: 0.5 }} /><span style={{ display: "block", fontSize: "0.7rem" }}>No Photo</span></div>}
                  </div>

                  <div style={{ width: "100%", textAlign: "center", marginTop: "1rem" }}>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--color-deep-blue)", margin: 0 }}>{formData.fullName}</h3>
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontWeight: 600, display: "block", marginTop: "0.25rem", letterSpacing: "1px" }}>VOLUNTEER CARD</span>
                  </div>

                  <div style={{ width: "100%", margin: "1rem 0", background: "#f8fafc", padding: "0.75rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "0.25rem" }}>
                      <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>ID No:</span>
                      <strong style={{ color: "var(--color-text)" }}>{formData.volunteerId}</strong>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                      <span style={{ color: "var(--color-text-muted)", fontWeight: 500 }}>Blood Group:</span>
                      <strong style={{ color: "#ef4444" }}>{formData.bloodGroup}</strong>
                    </div>
                  </div>

                  <div style={{ width: "100%", padding: "0.5rem", background: colors.gradient, color: colors.text, textAlign: "center", borderRadius: "8px", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "1px", textShadow: formData.badgeLevel !== 'silver' ? "0 1px 2px rgba(0,0,0,0.2)" : "none" }}>{badgeName}</div>
                </div>

                <div style={{ padding: "0.75rem 1.25rem", backgroundColor: "var(--color-deep-blue)", color: "#ffffff", display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: 500 }}>
                  <span>SCIENCE FOR SOCIETY</span><span style={{ opacity: 0.7 }}>PBVM PURULIA BRANCH</span>
                </div>
              </div>
            ) : (
              /* Back Card */
              <div
                className="id-card-back"
                style={{
                  width: "300px", height: "475px", borderRadius: "16px", overflow: "hidden",
                  boxShadow: "0 15px 35px rgba(11, 61, 145, 0.15)", border: `2px solid ${colors.border}`,
                  backgroundColor: "#ffffff", display: "flex", flexDirection: "column",
                  position: "relative"
                }}
              >
                <div style={{ padding: "1.25rem", backgroundColor: "var(--color-deep-blue)", color: "white", textAlign: "center", fontWeight: "bold", fontSize: "0.9rem", letterSpacing: "1px" }}>
                  Terms & Conditions
                </div>

                <div style={{ flex: 1, padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", fontSize: "0.75rem", color: "var(--color-text)" }}>
                  <div style={{ padding: "0.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                    <p style={{ margin: "0 0 0.25rem 0", lineHeight: 1.4 }}>1. This card is non-transferable.</p>
                    <p style={{ margin: 0, lineHeight: 1.4 }}>2. Loss of card must be reported immediately.</p>
                  </div>

                  <div>
                    <strong style={{ display: "block", color: "var(--color-deep-blue)", marginBottom: "0.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.25rem" }}>Address:</strong>
                    <div style={{ lineHeight: 1.4, color: "#334155" }}>{formData.address}</div>
                  </div>

                  <div>
                    <strong style={{ display: "block", color: "var(--color-deep-blue)", marginBottom: "0.25rem", borderBottom: "1px solid #e2e8f0", paddingBottom: "0.25rem" }}>Emergency Contact:</strong>
                    <div style={{ color: "#334155" }}>Name: <strong>{formData.emergencyContact.name}</strong> ({formData.emergencyContact.relation})</div>
                    <div style={{ color: "#334155" }}>Phone: <strong>{formData.emergencyContact.phone}</strong></div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "auto", paddingBottom: "0.5rem" }}>
                    <img src={qrCodeUrl} alt="QR Code" width={110} height={110} style={{ border: `2px solid ${colors.border}`, padding: "4px", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }} />
                  </div>
                </div>

                <div style={{ padding: "0.75rem", backgroundColor: "#f1f5f9", textAlign: "center", fontSize: "0.6rem", color: "var(--color-text-muted)", borderTop: "1px solid #cbd5e1" }}>
                  If found, please return to PBVM Purulia Branch.
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Printable Area (both front and back shown for printing) */}
      <div id="print-card-area" className="only-print" style={{ display: "none" }}>
        <div style={{ display: "flex", gap: "20mm" }}>
          {/* Print Front */}
          <div style={{ width: "54mm", height: "86mm", boxSizing: "border-box", border: `1mm solid ${colors.border}`, borderRadius: "3mm", position: "relative", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
            <div style={{ padding: "2mm", display: "flex", alignItems: "center", gap: "1mm", background: colors.gradient }}>
              <div style={{ width: "8mm", height: "8mm", backgroundColor: "#fff", borderRadius: "50%", padding: "0.3mm", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}><img src="https://pbvm-purulia-branch.vercel.app/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "50%" }} /></div>
              <div style={{ display: "flex", flexDirection: "column", flex: 1, textAlign: "center" }}>
                <h4 style={{ fontSize: "1.6mm", color: colors.text, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>PASHCHIM BANGA VIGYAN MANCHA</h4>
                <span style={{ fontSize: "1.2mm", color: colors.text, fontWeight: 600, textTransform: "uppercase" }}>Purulia District Branch</span>
              </div>
            </div>

            <div style={{ flex: 1, padding: "3mm", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ width: "22mm", height: "26mm", borderRadius: "1.5mm", border: `0.5mm solid ${colors.border}`, backgroundColor: "#f5f7fa", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {formData.photoUrl ? <img src={formData.photoUrl} alt={formData.fullName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "1.5mm" }}>No Photo</span>}
              </div>
              <div style={{ width: "100%", textAlign: "center" }}>
                <div style={{ fontSize: "2.8mm", fontWeight: 800, color: "var(--color-deep-blue)" }}>{formData.fullName}</div>
                <div style={{ fontSize: "1.6mm", color: "var(--color-text-muted)", fontWeight: 600 }}>VOLUNTEER</div>
              </div>
              <div style={{ width: "100%", margin: "2mm 0", background: "#f8fafc", padding: "1.5mm", borderRadius: "1.5mm", border: "0.2mm solid #e5e7eb" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.8mm" }}><span>ID No:</span><strong>{formData.volunteerId}</strong></div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.8mm" }}><span>Blood:</span><strong style={{ color: "#ef4444" }}>{formData.bloodGroup}</strong></div>
              </div>
              <div style={{ width: "100%", padding: "1.2mm", background: colors.gradient, color: colors.text, textAlign: "center", borderRadius: "1.5mm", fontWeight: 700, fontSize: "2.2mm" }}>{badgeName}</div>
            </div>

            <div style={{ padding: "1.5mm 3mm", backgroundColor: "var(--color-deep-blue)", color: "#ffffff", display: "flex", justifyContent: "space-between", fontSize: "1.4mm", fontWeight: 500 }}>
              <span>SCIENCE FOR SOCIETY</span><span>PBVM PURULIA</span>
            </div>
          </div>

          {/* Print Back */}
          <div style={{ width: "54mm", height: "86mm", boxSizing: "border-box", border: `1mm solid ${colors.border}`, borderRadius: "3mm", position: "relative", display: "flex", flexDirection: "column", backgroundColor: "#ffffff" }}>
            <div style={{ padding: "2mm", backgroundColor: "var(--color-deep-blue)", color: "white", textAlign: "center", fontWeight: "bold", fontSize: "2mm" }}>
              Terms & Conditions
            </div>

            <div style={{ flex: 1, padding: "3mm", display: "flex", flexDirection: "column", gap: "2mm", fontSize: "1.6mm", color: "#333" }}>
              <p style={{ margin: 0, lineHeight: 1.4 }}>1. Non-transferable. Present on request.</p>
              <p style={{ margin: 0, lineHeight: 1.4 }}>2. Loss must be reported immediately.</p>

              <div style={{ marginTop: "1mm" }}>
                <strong style={{ display: "block", color: "var(--color-deep-blue)", marginBottom: "0.5mm" }}>Address:</strong>
                <div style={{ lineHeight: 1.3, fontSize: "1.5mm" }}>{formData.address}</div>
              </div>

              <div style={{ marginTop: "1mm" }}>
                <strong style={{ display: "block", color: "var(--color-deep-blue)", marginBottom: "0.5mm" }}>Emergency Contact:</strong>
                <div>{formData.emergencyContact.name} ({formData.emergencyContact.relation})</div>
                <div>{formData.emergencyContact.phone}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "auto", paddingBottom: "2mm" }}>
                <img src={qrCodeUrl} alt="QR Code" style={{ width: "18mm", height: "18mm", border: `0.5mm solid ${colors.border}`, padding: "1mm", borderRadius: "1.5mm" }} />
              </div>
            </div>

            <div style={{ padding: "1.5mm", backgroundColor: "#f5f7fa", textAlign: "center", fontSize: "1.4mm", color: "#666", borderTop: "0.2mm solid #e5e7eb" }}>
              If found, please return to PBVM Purulia Branch.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .only-print { display: none; }
        @media print {
          .no-print { display: none !important; }
          .only-print { display: flex !important; justify-content: center; align-items: center; min-height: 100vh; background: none !important; }
          body { background: none !important; margin: 0; padding: 0; }
        }
      `}</style>
    </>
  );
}
