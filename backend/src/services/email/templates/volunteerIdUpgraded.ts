import { emailLayout } from "../../../utils/emailLayout";

interface VolunteerIdUpgradedTemplateData {
  volunteerName: string;
  volunteerId: string;
}

export function volunteerIdUpgradedTemplate({
  volunteerName,
  volunteerId,
}: VolunteerIdUpgradedTemplateData) {
  const subject = "Congratulations! Your PBVM Volunteer ID Card is Upgraded";

  const html = emailLayout({
    title: "Your Volunteer ID Card Has Been Upgraded",
    preheader: "Congratulations! Your volunteer ID card is upgraded.",
    content: `
      <p>Dear <strong>${volunteerName}</strong>,</p>

      <p>
        Congratulations! Your PBVM Volunteer ID Card has been successfully upgraded.
        Your official Volunteer ID is <strong>${volunteerId}</strong>.
      </p>

      <div
        style="
          margin: 24px 0;
          padding: 20px;
          background: #EFF6FF;
          border: 1px solid #BFDBFE;
          border-radius: 12px;
          font-size: 15px;
        "
      >
        <p style="margin: 0 0 8px 0; font-weight: 700; color: #1E40AF;">
          Volunteer ID Card Details
        </p>
        <p style="margin: 0;">
          <strong>ID Number:</strong> ${volunteerId}
        </p>
      </div>

      <p>
        Your upgraded ID card is attached to this email as a PDF file.
        Please download it and keep it safe.
      </p>

      <p>
        Thank you for your dedication and service. We look forward to seeing you at upcoming events and volunteer activities.
      </p>

      <p>
        Regards,<br />
        <strong>Pashchim Banga Vigyan Mancha</strong><br />
        Purulia District Branch
      </p>
    `,
  });

  const text = `Dear ${volunteerName},

Congratulations! Your PBVM Volunteer ID Card has been successfully upgraded.
Your official Volunteer ID is ${volunteerId}.

Your upgraded ID card is attached to this email as a PDF file. Please download it and keep it safe.

Thank you for your dedication and service. We look forward to seeing you at upcoming events and volunteer activities.

Regards,
Pashchim Banga Vigyan Mancha
Purulia District Branch
`;

  return {
    subject,
    html,
    text,
  };
}
