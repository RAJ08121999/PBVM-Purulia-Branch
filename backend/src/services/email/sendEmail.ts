import brevo from "../../config/brevo";

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface Attachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
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

  const payload: any = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: recipients,
    subject,
    htmlContent: html,
    textContent: text,
  };

  // Attach files if provided
  if (attachments.length > 0) {
    payload.attachment = attachments.map((file) => ({
      name: file.filename,
      content: Buffer.isBuffer(file.content)
        ? file.content.toString("base64")
        : file.content,
      contentType: file.contentType,
    }));
  }

  try {
    console.log("\n======================================");
    console.log("📧 Preparing Email");
    console.log("======================================");

    console.log("👤 Sender:");
    console.log({
      name: senderName,
      email: senderEmail,
    });

    console.log("\n📨 Recipients:");
    console.log(recipients);

    console.log("\n📝 Subject:");
    console.log(subject);

    console.log("\n📎 Attachments:");
    console.log(`Count: ${attachments.length}`);

    if (attachments.length > 0) {
      attachments.forEach((file, index) => {
        console.log(`Attachment ${index + 1}:`);
        console.log({
          filename: file.filename,
          contentType: file.contentType,
          size: Buffer.isBuffer(file.content)
            ? `${file.content.length} bytes`
            : `${file.content.length} characters`,
        });
      });
    }

    console.log("\n🚀 Sending email via Brevo...");
    console.time("Brevo Send Time");

    const response = await brevo.transactionalEmails.sendTransacEmail(payload);

    console.timeEnd("Brevo Send Time");

    console.log("\n✅ Brevo Response:");
    console.dir(response, { depth: null });

    console.log(
      `\n✅ Email successfully sent to ${recipients
        .map((r) => r.email)
        .join(", ")}`
    );

    console.log("======================================\n");
  } catch (error: any) {
    console.log("\n======================================");
    console.error("❌ BREVO EMAIL FAILED");
    console.log("======================================");

    console.error("\n📛 Error Object:");
    console.dir(error, { depth: null });

    if (error?.response) {
      console.error("\n📥 Response:");
      console.dir(error.response, { depth: null });
    }

    if (error?.response?.body) {
      console.error("\n📄 Response Body:");
      console.dir(error.response.body, { depth: null });
    }

    if (error?.message) {
      console.error("\n📝 Message:");
      console.error(error.message);
    }

    if (error?.stack) {
      console.error("\n📚 Stack:");
      console.error(error.stack);
    }

    console.log("======================================\n");

    throw error;
  }
}