"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VolunteerIdCard, {
  VolunteerData,
} from "@/components/admin/id_card/VolunteerIdCard";
import { publicApi } from "@/lib/api";

export default function PrintableVolunteerCardPage() {
  const params = useParams();
  const volunteerId = params.volunteerId as string;
  const [volunteer, setVolunteer] = useState<VolunteerData | null>(null);

  useEffect(() => {
    if (!volunteerId) return;
    const fetchVolunteer = async () => {
      try {
        const res = await publicApi.getVolunteerById(volunteerId);
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace("/api", "");
        const v = res.data.volunteer;

        const photoUrl =
          !v.photo
            ? ""
            : v.photo.startsWith("http")
            ? v.photo
            : `${baseUrl}/${v.photo.replace(/^\//, "")}`;

        setVolunteer({
          ...v,
          photoUrl,
        });
      } catch (err) {
        console.error(err);
        // Even on failure, mark ready so Puppeteer doesn't hang for 60s
        // waiting on a selector that will never appear. The PDF generation
        // will then fail fast on a missing element instead of timing out.
        document.body.setAttribute("data-ready", "true");
      }
    };
    fetchVolunteer();
  }, [volunteerId]);

  // Signal to Puppeteer that the card has actually painted, AFTER the
  // volunteer state (and therefore the card DOM + images) has rendered.
  // This runs on the render triggered by setVolunteer, one tick after
  // the DOM for the cards exists.
  useEffect(() => {
    if (volunteer) {
      // Wait a frame to let images (photo, logo, QR code) start painting
      // before flagging ready. Puppeteer's page.pdf() still captures
      // network-loaded images fine since printBackground/media emulation
      // is handled in idCard.service.ts; this just prevents a race where
      // the attribute is set before the card is in the DOM at all.
      requestAnimationFrame(() => {
        document.body.setAttribute("data-ready", "true");
      });
    }
  }, [volunteer]);

  if (!volunteer) {
    return (
      <div
        style={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Loading ID Card...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20mm",
        width: "100vw",
        height: "100vh",
        background: "#fff",
      }}
    >
      <VolunteerIdCard
        volunteer={volunteer}
        side="front"
        printable
      />
      <VolunteerIdCard
        volunteer={volunteer}
        side="back"
        printable
      />
    </div>
  );
}