import brevo from "../../config/brevo";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface Attachment {
  name: string;
  content: string; // Base64 encoded
}

export interface SendEmailOptions {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  html: string;
  text?: string;
  attachments?: Attachment[];
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments = [],
}: SendEmailOptions): Promise<void> {
  const senderName = process.env.BREVO_SENDER_NAME;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  if (!senderName || !senderEmail) {
    throw new Error(
      "BREVO_SENDER_NAME or BREVO_SENDER_EMAIL is missing from environment variables."
    );
  }

  const recipients = Array.isArray(to) ? to : [to];

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      sender: {
        name: senderName,
        email: senderEmail,
      },

      to: recipients,

      subject,

      htmlContent: html,

      textContent: text,

      attachment: attachments.map((file) => ({
        name: file.name,
        content: file.content,
      })),
    });

    console.log(`✅ Email sent successfully to ${recipients.map((r) => r.email).join(", ")}`);
  } catch (error) {
    console.error("❌ Brevo Email Error:", error);
    throw error;
  }
}