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

            const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api") .replace("/api", "");

            const v = res.data.volunteer;
            
            const photoUrl =
            !v.photo
                ? ""
                : v.photo.startsWith("http")
                ? v.photo
                : `${baseUrl}/${v.photo.replace(/^\//, "")}`;

                console.log(v.photo);
                console.log(photoUrl);
                
            setVolunteer({
            ...v,
            photoUrl,
            });

      } catch (err) {
        console.error(err);
      }
    };

    fetchVolunteer();
  }, [volunteerId]);

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