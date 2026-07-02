import dotenv from "dotenv";
import { sendEmail } from "../services/email";

dotenv.config();

export const sendAdminNotification = async (subject: string, html: string): Promise<void> => {
  const recipients = (process.env.ADMIN_EMAIL || process.env.BREVO_SENDER_EMAIL || "")
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.warn("[EMAIL] No admin recipient configured; skipping admin notification.");
    return;
  }

  try {
    await sendEmail({
      to: recipients.map((email) => ({ email })),
      subject,
      html,
      text: html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
    });
  } catch (error) {
    console.error("[EMAIL] Failed to send notification:", error);
    throw error;
  }
};
