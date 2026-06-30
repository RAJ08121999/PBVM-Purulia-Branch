import { emailLayout } from "../../../utils/emailLayout";

interface ApplicationReceivedData {
  applicantName: string;
}

export function applicationReceivedTemplate({
  applicantName,
}: ApplicationReceivedData) {
  const subject =
    "Application Received | Pashchim Banga Vigyan Mancha, Purulia";

  const html = emailLayout({
    title: "Application Received",
    content: `
      <p>Dear <strong>${applicantName}</strong>,</p>

      <p>
        Thank you for applying to become a member of
        <strong>Pashchim Banga Vigyan Mancha, Purulia District Branch</strong>.
      </p>

      <p>
        We have successfully received your membership application.
      </p>

      <p>
        Your application will now be reviewed by the District Executive Committee.
        You will receive another email once your application has been approved or rejected.
      </p>

      <div style="margin:30px 0;padding:16px;background:#F3F4F6;border-left:4px solid #0B3D91;border-radius:6px;">
        <strong>Application Status:</strong> Under Review
      </div>

      <p>
        No further action is required from your side at this moment.
      </p>

      <p>
        Thank you for your interest in promoting scientific thinking and
        building a rational society.
      </p>

      <p>
        Regards,<br/>
        <strong>Pashchim Banga Vigyan Mancha</strong><br/>
        Purulia District Branch
      </p>
    `,
  });

  const text = `
Dear ${applicantName},

Thank you for applying to become a member of Pashchim Banga Vigyan Mancha, Purulia District Branch.

Your application has been received successfully.

It will now be reviewed by the District Executive Committee.

You will receive another email after the review process is complete.

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