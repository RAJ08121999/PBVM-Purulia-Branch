import { emailLayout } from "../../../utils/emailLayout";

interface OnboardingTemplateData {
  applicantName: string;
  memberId: string;
  membershipType: "Member" | "Volunteer";
}

export function onboardingTemplate({
  applicantName,
  memberId,
  membershipType,
}: OnboardingTemplateData) {
  const subject =
    "Welcome to Pashchim Banga Vigyan Mancha, Purulia District Branch";

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
        <strong>Pashchim Banga Vigyan Mancha, Purulia District Branch.</strong>
        Thank you for choosing to be a part of our mission to promote scientific
        temper, rational thinking and social awareness.
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
            <td style="padding:8px 0;"><strong>${membershipType} ID</strong></td>
            <td>${memberId}</td>
          </tr>

          <tr>
            <td style="padding:8px 0;"><strong>Role</strong></td>
            <td>${membershipType}</td>
          </tr>
        </table>
      </div>

      <h3>What happens next?</h3>

      <ul>
        ${
          membershipType === "Volunteer"
            ? `
              <li>Your official PBVM Volunteer Identity Card will be sent to you along with this email.</li>
            `
            : `
              <li>Your membership has been activated successfully. Digital member services will be introduced in future updates.</li>
            `
        }

        <li>
          We will notify you about upcoming events, workshops, awareness programmes
          and volunteer activities.
        </li>

        <li>
          Additional member services, including an online member portal, will be
          introduced in the future. We will inform you once they become available.
        </li>

        <li>
          We encourage you to actively participate in district activities and help
          us promote scientific thinking throughout society.
        </li>
      </ul>

      <p>
        Welcome to the PBVM family!
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

Congratulations!

Your membership has been approved.

Member ID:
${memberId}

Role:
${membershipType}

${
  membershipType === "Volunteer"
    ? "Your PBVM Volunteer Identity Card is attached with this email."
    : "Welcome to the PBVM family. Digital member services will be available in future updates."
}

We will keep you informed about upcoming events, awareness programmes,
workshops and volunteer activities.

Thank you for joining the PBVM family.

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