import { emailLayout } from "../../../utils/emailLayout";

interface PasswordResetTemplateData {
  applicantName: string;
  resetLink: string;
  expiresIn?: string;
}

export function passwordResetTemplate({
  applicantName,
  resetLink,
  expiresIn = "30 minutes",
}: PasswordResetTemplateData) {
  const subject =
    "Reset Your PBVM Account Password";

  const html = emailLayout({
    title: "Password Reset Request",
    content: `
      <p>Dear <strong>${applicantName}</strong>,</p>

      <p>
        We received a request to reset the password for your
        <strong>Pashchim Banga Vigyan Mancha</strong> account.
      </p>

      <p>
        If you requested this change, click the button below to create a new password.
      </p>

      <div style="margin:35px 0;text-align:center;">
        <a
          href="${resetLink}"
          style="
            display:inline-block;
            background:#2563EB;
            color:#ffffff;
            text-decoration:none;
            padding:14px 28px;
            border-radius:8px;
            font-weight:bold;
            font-size:15px;
          "
        >
          Reset Password
        </a>
      </div>

      <p>
        Or copy and paste this link into your browser:
      </p>

      <p
        style="
          word-break:break-all;
          background:#F8FAFC;
          padding:12px;
          border-radius:8px;
          font-size:13px;
        "
      >
        ${resetLink}
      </p>

      <div
        style="
          margin:30px 0;
          padding:18px;
          background:#FEFCE8;
          border-left:4px solid #EAB308;
          border-radius:8px;
        "
      >
        <strong>Security Notice</strong>

        <ul style="margin-top:12px;">
          <li>This reset link expires in <strong>${expiresIn}</strong>.</li>
          <li>The link can only be used once.</li>
          <li>If you didn't request a password reset, simply ignore this email.</li>
          <li>Your password will remain unchanged until you create a new one.</li>
        </ul>
      </div>

      <p>
        If you're experiencing problems accessing your account,
        please contact the PBVM Purulia District Administrator.
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

We received a request to reset your PBVM account password.

Use the following link to create a new password:

${resetLink}

This link expires in ${expiresIn}.

If you did not request this password reset, simply ignore this email.

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