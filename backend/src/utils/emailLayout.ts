interface EmailLayoutOptions {
  title: string;
  content: string;
}

export function emailLayout({
  title,
  content,
}: EmailLayoutOptions): string {
  const year = new Date().getFullYear();

  const logo =
    process.env.LOGO_URL ||
    "https://pbvmpurulia.org/logo.png";

  const website =
    process.env.FRONTEND_URL ||
    "https://pbvmpurulia.org";

  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <title>${title}</title>
  </head>
  
  <body
  style="
  margin:0;
  padding:0;
  background:#F3F4F6;
  font-family:Arial,Helvetica,sans-serif;
  color:#111827;
  ">
  
  <table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="padding:40px 0;"
  >
  
  <tr>
  <td align="center">
  
  <table
  width="640"
  cellpadding="0"
  cellspacing="0"
  style="
  background:#ffffff;
  border-radius:14px;
  overflow:hidden;
  box-shadow:0 8px 30px rgba(0,0,0,.08);
  "
  >
  
  <!-- Header -->
  
  <tr>
  
  <td
  align="center"
  style="
  background:linear-gradient(135deg,#0B1F4A,#0B3D91,#0A3D32);
  padding:40px;
  "
  >
  
  <img
  src="${logo}"
  alt="PBVM"
  width="90"
  style="
  display:block;
  margin-bottom:18px;
  "
  />
  
  <h1
  style="
  margin:0;
  color:#ffffff;
  font-size:28px;
  font-weight:bold;
  "
  >
  Pashchim Banga Vigyan Mancha
  </h1>
  
  <p
  style="
  margin-top:10px;
  color:#D1FAE5;
  font-size:15px;
  "
  >
  Purulia District Branch
  </p>
  
  </td>
  
  </tr>
  
  <!-- Title -->
  
  <tr>
  
  <td
  style="
  padding:35px 40px 0 40px;
  "
  >
  
  <h2
  style="
  margin:0;
  font-size:26px;
  color:#0B1F4A;
  "
  >
  ${title}
  </h2>
  
  </td>
  
  </tr>
  
  <!-- Body -->
  
  <tr>
  
  <td
  style="
  padding:30px 40px;
  font-size:15px;
  line-height:1.8;
  color:#374151;
  "
  >
  
  ${content}
  
  </td>
  
  </tr>
  
  <!-- Divider -->
  
  <tr>
  
  <td
  style="
  padding:0 40px;
  "
  >
  
  <hr
  style="
  border:none;
  border-top:1px solid #E5E7EB;
  "
  />
  
  </td>
  
  </tr>
  
  <!-- Footer -->
  
  <tr>
  
  <td
  style="
  padding:30px 40px;
  font-size:13px;
  line-height:1.7;
  color:#6B7280;
  "
  >
  
  <p style="margin:0 0 12px 0;">
  This email was sent automatically by the
  <strong>Pashchim Banga Vigyan Mancha, Purulia District Branch</strong>.
  </p>
  
  <p style="margin:0 0 12px 0;">
  If you have any questions, please contact the district administration.
  </p>
  
  <p style="margin:0 0 20px 0;">
  🌐
  <a
  href="${website}"
  style="
  color:#2563EB;
  text-decoration:none;
  "
  >
  ${website}
  </a>
  </p>
  
  <p
  style="
  margin:0;
  font-size:12px;
  color:#9CA3AF;
  "
  >
  © ${year} Pashchim Banga Vigyan Mancha, Purulia District Branch.
  <br>
  All Rights Reserved.
  </p>
  
  </td>
  
  </tr>
  
  </table>
  
  </td>
  </tr>
  
  </table>
  
  </body>
  </html>
  `;
}