import { emailLayout } from "../../../utils/emailLayout";

interface ContactReplyTemplateProps {
  recipientName: string;
  message: string;
}

export function contactReplyTemplate({
  recipientName,
  message,
}: ContactReplyTemplateProps): string {
  return emailLayout({
    title: "Response to your inquiry",
    preheader:
      "Pashchim Banga Vigyan Mancha has replied to your inquiry.",

    content: `
      <p style="margin:0 0 18px;font-size:16px;color:#374151;">
        Dear <strong>${recipientName}</strong>,
      </p>

      <div
        style="
          background:#f8fafc;
          border-left:4px solid #1e40af;
          padding:20px;
          border-radius:8px;
          margin:20px 0;
          color:#374151;
          line-height:1.8;
          white-space:pre-wrap;
          font-size:15px;
        "
      >
${message}
      </div>

      <p style="margin-top:30px;font-size:15px;color:#4b5563;">
        If you have any further queries, simply reply to this email and we'll be happy to assist you.
      </p>
    `,
  });
}