"use client"

import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Printer, Upload, Trash2, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import VolunteerIdCard, {
  type VolunteerData,
  type BadgeLevel,
  normalizeBadgeLevel,
} from "@/components/admin/id_card/VolunteerIdCard";

// Maps the short badge key used in the UI <select> to the display label
// that gets persisted to MongoDB.
const badgeMap: Record<string, string> = {
  gold: "Renaissance Leader",
  silver: "Knowledge Explorer",
  bronze: "Curiosity Seeker",
};

export default function VolunteerIDCardGenerator() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [volunteers, setVolunteers] = useState<VolunteerData[]>([]);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string>("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [formData, setFormData] = useState<VolunteerData>({
    _id: "",
    membershipType: "Volunteer",
    volunteerId: "PBVM-PUR-YYYYMMDD-01",
    fullName: "Volunteer Name",
    email: "",
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
    const fetchVolunteers = async () => {
      try {
        const res = await adminApi.getMemberships({ status: "approved" });
  
        const approvedVolunteers =
          (res.data?.memberships || []).filter(
            (m: VolunteerData) => m.membershipType === "volunteer"
          );
  
        setVolunteers(approvedVolunteers);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch volunteers");
      }
    };
  
    void fetchVolunteers();
  }, []);


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
        membershipType: vol.membershipType || "Volunteer",
        volunteerId: vol.volunteerId || "Pending",
        fullName: vol.fullName,
        email: vol.email || "",
        bloodGroup: vol.bloodGroup || "N/A",
        badgeLevel: normalizeBadgeLevel(vol.badgeLevel),
        photoUrl: getFullImageUrl(vol.photo || vol.photoUrl || ""),
        address: vol.address || "",
        emergencyContact: vol.emergencyContact || { name: "N/A", relation: "N/A", phone: "N/A" }
      });
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

  const handleSendEmail = async () => {
    if (!selectedVolunteerId) {
      toast.error("Please select a volunteer before sending the email.");
      return;
    }

    const toastId = toast.loading("Sending ID upgradation email...");

    try {
      setIsSending(true);

      await adminApi.updateMembership(selectedVolunteerId, {
        volunteerId: formData.volunteerId,
        fullName: formData.fullName,
        address: formData.address,
        bloodGroup: formData.bloodGroup,
        badgeLevel: badgeMap[formData.badgeLevel] || formData.badgeLevel,
        photo: formData.photoUrl,
        emergencyContact: formData.emergencyContact,
      });

      const res = await adminApi.sendVolunteerIdCard(selectedVolunteerId);

      if (res.data?.pdfAttached === false) {
        toast.warning("Email sent, but the ID card PDF failed to attach. Check server logs.", { id: toastId });
      } else {
        toast.success("Upgradation email sent successfully.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send upgradation email.", { id: toastId });
    } finally {
      setIsSending(false);
    }
  };

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
                    <Image src={formData.photoUrl} alt="Preview" width={70} height={70} style={{ objectFit: "cover", borderRadius: "var(--radius-md)", border: "1px solid var(--color-mid-gray)" }} />
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", width: "100%" }}>
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

              <VolunteerIdCard
              volunteer={formData}
              side="front"
              />
            ) : (
              /* Back Card */
            
              <VolunteerIdCard
              volunteer={formData}
              side="back"
              />
            )}

            {/* Action Buttons — centered below the card preview, wraps safely on narrow screens */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                justifyContent: "center",
                alignItems: "stretch",
                width: "100%",
                maxWidth: "300px",
                boxSizing: "border-box",
              }}
            >
              <button
                onClick={handlePrint}
                className="btn btn-primary"
                style={{
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  minHeight: "44px",
                  flex: "1 1 130px",
                  minWidth: 0,
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                }}
              >
                <Printer size={18} />
                Print Card
              </button>
              <button
                onClick={handleSendEmail}
                disabled={!selectedVolunteerId || !formData.email || isSending}
                className="btn btn-primary"
                style={{
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  minHeight: "44px",
                  flex: "1 1 130px",
                  minWidth: 0,
                  maxWidth: "100%",
                  whiteSpace: "nowrap",
                  opacity: !selectedVolunteerId || !formData.email || isSending ? 0.55 : 1,
                  cursor: !selectedVolunteerId || !formData.email || isSending ? "not-allowed" : "pointer",
                }}
              >
                Send Upgradation Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Printable Area (both front and back shown for printing) */}
      <div id="print-card-area" className="only-print">
        <div
          style={{
            display: "flex",
            gap: "20mm",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <VolunteerIdCard
            volunteer={formData}
            side="front"
            printable
          />

          <VolunteerIdCard
            volunteer={formData}
            side="back"
            printable
          />
        </div>
      </div>

      <style>{`
        .only-print { display: none; }
        @media print {
          .no-print { display: none !important; }
          .only-print {
            display: flex !important;
            justify-content: center;
            align-items: flex-start;
            padding: 10mm;
          }
          body { background: none !important; margin: 0; padding: 0; }
        }
        @media (max-width: 380px) {
          #print-card-area,
          .no-print button {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </>
  );
}