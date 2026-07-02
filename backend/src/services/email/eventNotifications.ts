import fs from "fs";
import path from "path";
import Event from "../../models/Event.model";
import Membership from "../../models/Membership.model";
import { sendEmail } from "./sendEmail";

const scheduledTimers = new Map<string, NodeJS.Timeout>();

const getRecipientList = async () => {
  const memberships = await Membership.find({ status: "approved" }).select("email fullName");
  return memberships
    .filter((membership) => Boolean(membership.email))
    .map((membership) => ({
      email: membership.email,
      name: membership.fullName,
    }));
};

const buildEventEmailHtml = (event: any, kind: "announcement" | "reminder") => {
  const title = event.title?.en || event.title?.bn || "Upcoming Event";
  const description = event.description?.en || event.description?.bn || "";
  const eventDate = new Date(event.date).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  });
  const intro =
    kind === "announcement"
      ? "A new upcoming event has been published for the PBVM community."
      : "This is a reminder for an upcoming PBVM event scheduled for tomorrow.";

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
      <h2 style="margin-bottom: 0.5rem;">${title}</h2>
      <p>${intro}</p>
      <p><strong>Date:</strong> ${eventDate}</p>
      <p><strong>Venue:</strong> ${event.venue || "To be announced"}</p>
      <p><strong>Details:</strong></p>
      <p style="white-space: pre-wrap;">${description}</p>
      ${event.registrationLink ? `<p><strong>Registration:</strong> <a href="${event.registrationLink}">${event.registrationLink}</a></p>` : ""}
      <p>Thank you,<br/>PBVM Purulia</p>
    </div>
  `;
};

const getAttachmentFromUrl = async (fileUrl: string) => {
  if (!fileUrl) return null;

  try {
    const normalizedUrl = fileUrl.startsWith("http") ? fileUrl : `${process.env.FRONTEND_URL || "http://localhost:3000"}${fileUrl.startsWith("/") ? "" : "/"}${fileUrl}`;
    const parsedUrl = new URL(normalizedUrl);

    if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
      const response = await fetch(parsedUrl.toString());
      if (!response.ok) {
        return null;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      const filename = path.basename(parsedUrl.pathname) || "event-attachment";
      return {
        filename,
        content: buffer,
        contentType: response.headers.get("content-type") || "application/octet-stream",
      };
    }
  } catch {
    // Ignore invalid remote URLs and fall back to local file resolution below.
  }

  try {
    const localPath = fileUrl.startsWith("http") ? undefined : fileUrl.replace(/^\//, "");
    if (!localPath) return null;

    const resolvedPath = path.resolve(process.cwd(), localPath);
    if (!fs.existsSync(resolvedPath)) return null;
    const fileBuffer = fs.readFileSync(resolvedPath);
    return {
      filename: path.basename(resolvedPath),
      content: fileBuffer,
      contentType: "application/octet-stream",
    };
  } catch {
    return null;
  }
};

const sendEventEmail = async (event: any, kind: "announcement" | "reminder") => {
  const recipients = await getRecipientList();
  if (!recipients.length) {
    console.log(`[EVENT EMAIL] No approved members found for ${event._id}`);
    return;
  }

  const subject =
    kind === "announcement"
      ? `New Event: ${event.title?.en || event.title?.bn || "PBVM Event"}`
      : `Reminder: ${event.title?.en || event.title?.bn || "PBVM Event"}`;

  const attachments = [] as Array<{ filename: string; content: Buffer | string; contentType?: string }>;
  for (const fileUrl of event.gallery || []) {
    const attachment = await getAttachmentFromUrl(fileUrl);
    if (attachment) {
      attachments.push(attachment);
    }
  }

  await sendEmail({
    to: recipients,
    subject,
    html: buildEventEmailHtml(event, kind),
    text: `${subject}\n\n${event.description?.en || event.description?.bn || ""}`,
    attachments,
  });
};

export const scheduleEventNotifications = async (event: any) => {
  if (!event || event.status !== "upcoming") {
    return;
  }

  const eventId = event._id?.toString();
  if (!eventId) {
    return;
  }

  const existingTimer = scheduledTimers.get(eventId);
  if (existingTimer) {
    clearTimeout(existingTimer);
    scheduledTimers.delete(eventId);
  }

  if (!event.announcementEmailSent) {
    try {
      await sendEventEmail(event, "announcement");
      await Event.findByIdAndUpdate(eventId, { announcementEmailSent: true });
      console.log(`[EVENT EMAIL] Announcement email sent for event ${eventId}`);
    } catch (error) {
      console.error(`[EVENT EMAIL] Announcement email failed for event ${eventId}`, error);
    }
  }

  if (event.reminderEmailSent) {
    return;
  }

  const reminderTime = new Date(event.date);
  reminderTime.setDate(reminderTime.getDate() - 1);

  if (reminderTime <= new Date()) {
    return;
  }

  const delay = reminderTime.getTime() - Date.now();
  const timer = setTimeout(async () => {
    try {
      await sendEventEmail(event, "reminder");
      await Event.findByIdAndUpdate(eventId, { reminderEmailSent: true });
      console.log(`[EVENT EMAIL] Reminder email sent for event ${eventId}`);
    } catch (error) {
      console.error(`[EVENT EMAIL] Reminder email failed for event ${eventId}`, error);
    } finally {
      scheduledTimers.delete(eventId);
    }
  }, delay);

  scheduledTimers.set(eventId, timer);
};

export const initializeEventNotifications = async () => {
  const events = await Event.find({ status: "upcoming", $or: [{ announcementEmailSent: false }, { reminderEmailSent: false }] }).sort({ date: 1 });

  for (const event of events) {
    await scheduleEventNotifications(event);
  }
};
