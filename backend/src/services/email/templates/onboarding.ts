import { emailLayout } from "../../../utils/emailLayout";

interface OnboardingTemplateData {
  applicantName: string;
  memberId: string;
  membershipType: "Member" | "Volunteer";
  username: string;
  temporaryPassword: string;
  loginUrl: string;
}

export function onboardingTemplate({
  applicantName,
  memberId,
  membershipType,
  username,
  temporaryPassword,
  loginUrl,
}: OnboardingTemplateData) {
  const subject =
    "Welcome to Paschim Banga Vigyan Mancha | Your Membership is Active";

  const html = emailLayout({
    title: "Welcome to the PBVM Family!",
    content: `
      <p>Dear <strong>${applicantName}</strong>,</p>

      <p>
        Congratulations!
      </p>

      <p>
        We are delighted to welcome you as a
        <strong>${membershipType}</strong> of
        <strong>Paschim Banga Vigyan Mancha, Purulia District Branch.</strong>
      </p>

      <p>
        Your membership application has been approved by the District Executive Committee.
      </p>

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#F0FDF4;
          border:1px solid #BBF7D0;
          border-radius:10px;
        "
      >
        <h3 style="margin-top:0;color:#166534;">
          Membership Details
        </h3>

        <table style="width:100%;font-size:15px;">
          <tr>
            <td style="padding:8px 0;"><strong>Name</strong></td>
            <td>${applicantName}</td>
          </tr>

          <tr>
            <td style="padding:8px 0;"><strong>Member ID</strong></td>
            <td>${memberId}</td>
          </tr>

          <tr>
            <td style="padding:8px 0;"><strong>Role</strong></td>
            <td>${membershipType}</td>
          </tr>
        </table>
      </div>

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#EFF6FF;
          border:1px solid #BFDBFE;
          border-radius:10px;
        "
      >
        <h3 style="margin-top:0;color:#1D4ED8;">
          Login Credentials
        </h3>

        <table style="width:100%;font-size:15px;">
          <tr>
            <td style="padding:8px 0;"><strong>Username</strong></td>
            <td>${username}</td>
          </tr>

          <tr>
            <td style="padding:8px 0;"><strong>Temporary Password</strong></td>
            <td>${temporaryPassword}</td>
          </tr>
        </table>

        <p style="margin-top:18px;">
          <a
            href="${loginUrl}"
            style="
              background:#2563EB;
              color:#ffffff;
              text-decoration:none;
              padding:12px 24px;
              border-radius:8px;
              display:inline-block;
              font-weight:bold;
            "
          >
            Login to Your Account
          </a>
        </p>
      </div>

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#FEFCE8;
          border-left:4px solid #EAB308;
          border-radius:8px;
        "
      >
        <strong>Important Security Notice</strong>

        <ul style="margin-top:12px;">
          <li>Change your password after your first login.</li>
          <li>Do not share your login credentials.</li>
          <li>Keep your Member ID safe for future reference.</li>
        </ul>
      </div>

      <div
        style="
          margin:30px 0;
          padding:20px;
          background:#F8FAFC;
          border-radius:10px;
          border:1px solid #E2E8F0;
        "
      >
        <h3 style="margin-top:0;">
          Your Digital Membership ID Card
        </h3>

        <p>
          Your official PBVM Digital Membership ID Card is attached with this email.
        </p>

        <p>
          As a newly approved member, your activity level is currently:
        </p>

        <p style="font-size:18px;font-weight:bold;color:#0F766E;">
          🌱 Rarely Active Member
        </p>

        <p>
          Your activity badge will automatically improve as you participate in
          events, awareness campaigns, workshops, science exhibitions,
          volunteer activities, publications and other PBVM programs.
        </p>
      </div>

      <h3>What happens next?</h3>

      <ul>
        <li>Login using the credentials above.</li>
        <li>Complete your profile.</li>
        <li>Join upcoming events.</li>
        <li>Participate in scientific awareness programmes.</li>
        <li>Stay connected through your dashboard.</li>
      </ul>

      <p>
        We sincerely thank you for joining our mission to build a rational,
        scientific and superstition-free society.
      </p>

      <p>
        Welcome to the PBVM family!
      </p>

      <p>
        Regards,<br>
        <strong>Paschim Banga Vigyan Mancha</strong><br>
        Purulia District Branch
      </p>
    `,
  });

  const text = `
Dear ${applicantName},

Congratulations!

Your membership has been approved.

Member ID:
${memberId}

Role:
${membershipType}

Username:
${username}

Temporary Password:
${temporaryPassword}

Login:
${loginUrl}

Your PBVM Membership ID Card has been attached with this email.

Please change your password after your first login.

Welcome to Paschim Banga Vigyan Mancha!

Regards,
Paschim Banga Vigyan Mancha
Purulia District Branch
`;

  return {
    subject,
    html,
    text,
  };
}