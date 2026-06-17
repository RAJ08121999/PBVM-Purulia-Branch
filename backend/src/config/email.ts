import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendAdminNotification = async (subject: string, html: string): Promise<void> => {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"PBVM Purulia" <noreply@pbvmpurulia.org>',
      to: process.env.ADMIN_EMAIL,
      subject,
      html,
    });
  } catch (error) {
    console.error("[EMAIL] Failed to send notification:", error);
  }
};
