import { emailLayout } from "../../../utils/emailLayout";

interface ApplicationRejectedData {
  applicantName: string;
  rejectionReason?: string;
}

export function applicationRejectedTemplate({
  applicantName,
  rejectionReason,
}: ApplicationRejectedData) {
  const subject =
    "Update on Your Membership Application | Pashchim Banga Vigyan Mancha";

  const html = emailLayout({
    title: "Membership Application Update",
    content: `
      <p>Dear <strong>${applicantName}</strong>,</p>

      <p>
        Thank you for your interest in becoming a member of
        <strong>Pashchim Banga Vigyan Mancha, Purulia District Branch</strong>.
      </p>

      <p>
        After careful review by the District Executive Committee,
        we regret to inform you that your membership application
        has not been approved at this time.
      </p>

      ${rejectionReason
        ? `
      <div
        style="
          margin:30px 0;
          padding:18px;
          background:#FEF2F2;
          border-left:4px solid #DC2626;
          border-radius:8px;
        "
      >
        <strong>Reason</strong>
        <br><br>
        ${rejectionReason}
      </div>
      `
        : ""
      }

      <p>
        This decision does not permanently prevent you from becoming
        a member of the organisation. We encourage you to apply again
        in the future if you remain interested.
      </p>

      <p>
        If you wish to become a member in the future, you are welcome
        to submit a fresh application. Each application is reviewed
        independently by the District Executive Committee.
      </p>

      <div
        style="
          margin-top:30px;
          padding:16px;
          background:#F8FAFC;
          border:1px solid #E2E8F0;
          border-radius:8px;
        "
      >
        <strong>Need Help?</strong>

        <p style="margin-top:10px;">
          If you believe any important information was missing from your
          application or you require further clarification, please contact
          the Purulia District Office.
        </p>
      </div>

      <p style="margin-top:35px;">
        We sincerely appreciate your interest in promoting scientific
        temper and rational thinking. Thank you for your willingness to
        be associated with our organisation, and we wish you every
        success in your future endeavours.
      </p>

      <p>
        Regards,<br>
        <strong>Pashchim Banga Vigyan Mancha</strong><br>
        Purulia District Branch
      </p>
    `,
  });

  const text = `
Dear ${applicantName},

Thank you for applying to Pashchim Banga Vigyan Mancha, Purulia District Branch.

After careful review, we regret to inform you that your membership application could not be approved at this time.

${rejectionReason
      ? `Reason:\n${rejectionReason}\n`
      : ""
    }

    If you remain interested in joining the organisation, you are
    welcome to submit a fresh application in the future.

    If you have any questions, please contact the Purulia District Office.

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