import { emailLayout } from "../../../utils/emailLayout";

interface ApplicationReceivedData {
  applicantName: string;
}

export function applicationReceivedTemplate({
  applicantName,
}: ApplicationReceivedData) {
  const subject =
    "Membership Application Received | Paschim Banga Vigyan Mancha";

  const html = emailLayout({
    title: "Application Received",
    content: `
      <p>Dear <strong>${applicantName}</strong>,</p>

      <p>
        Thank you for your interest in becoming a member of 
        <strong>Pashchim Banga Vigyan Mancha</strong>,Purulia District Branch. We appreciate the time you took to submit your application and your willingness to contribute towards promoting scientific awareness and rational thinking.
      </p>

      <p>
      Your application has been successfully submitted and is now under review by the District Executive Committee. During this process, we verify the information provided and evaluate each application carefully.
      </p>

      <p>
      Once the review is complete, you will receive another email informing you whether your application has been approved or declined.
      </p>

      <div style="margin:30px 0;padding:16px;background:#F3F4F6;border-left:4px solid #0B3D91;border-radius:6px;">
        <strong>Application Status:</strong> Review Process Started
      </div>

      <p>
        At this stage, no further action is required from your side. If we need any additional information, we will contact you using this email address.
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

    Thank you for your interest in becoming a member of Pashchim Banga Vigyan Mancha, Purulia District Branch.

    We have successfully received your membership application.

    Your application is now under review by the District Executive Committee.

    Once the review process is complete, you will receive another email informing you whether your application has been approved or declined.

    No further action is required from your side at this time.

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