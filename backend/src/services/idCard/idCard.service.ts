import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

const chromiumArgs = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--disable-extensions",
  "--disable-background-networking",
  "--disable-default-apps",
  "--disable-sync",
  "--metrics-recording-only",
  "--disable-features=Translate,BackForwardCache",
];

const getChromeExecutablePath = (): string | undefined => {
  const candidates = [
    process.env.CHROME_PATH,
    process.env.CHROMIUM_PATH,
    process.env.PUPPETEER_EXECUTABLE_PATH,
    path.join(process.env.PROGRAMFILES || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(process.env["PROGRAMFILES(X86)"] || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
    path.join(process.env.PROGRAMFILES || "", "Microsoft", "Edge", "Application", "msedge.exe"),
    path.join(process.env["PROGRAMFILES(X86)"] || "", "Microsoft", "Edge", "Application", "msedge.exe"),
    path.join(process.env.LOCALAPPDATA || "", "Microsoft", "Edge", "Application", "msedge.exe"),
  ];

  return candidates.find((candidate): candidate is string => {
    return Boolean(candidate) && fs.existsSync(candidate as string);
  });
};

export interface VolunteerCardData {
  volunteerId: string;
}

const resolveExecutablePath = async (): Promise<string | undefined> => {
  const explicitExecutable = getChromeExecutablePath();
  if (explicitExecutable) {
    return explicitExecutable;
  }

  try {
    const executable = await chromium.executablePath();
    if (executable && fs.existsSync(executable)) {
      return executable;
    }
  } catch (error: any) {
    console.warn("⚠️ chromium.executablePath() failed:", error?.message || error);
  }

  return undefined;
};

export const generateVolunteerIdCard = async (
  volunteer: VolunteerCardData
): Promise<Buffer> => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const printUrl = `${frontendUrl}/print/volunteer/${volunteer.volunteerId}`;
  const executablePath = await resolveExecutablePath();

  const launchOptions: any = {
    headless: true,
    args: chromiumArgs,
  };

  if (executablePath) {
    launchOptions.executablePath = executablePath;
    console.log("🚀 Using browser executable:", executablePath);
  } else {
    console.warn(
      "⚠️ No Chromium/Chrome executable found. Puppeteer may fail if no browser is available."
    );
  }

  const browser = await puppeteer.launch(launchOptions);

  try {
    const page = await browser.newPage();

    await page.goto(printUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Optional: emulate print CSS
    await page.emulateMediaType("print");

    // Optional: wait until the card is actually rendered
    await page.waitForSelector(".id-card-front",{
      visible:true,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const pdf = await page.pdf({
      width: "128mm", // Front + gap + Back
      height: "86mm",
      printBackground: true,
      margin: {
        top: "0mm",
        right: "0mm",
        bottom: "0mm",
        left: "0mm",
      },
    });

    return Buffer.isBuffer(pdf) ? pdf : Buffer.from(pdf);
  } finally {
    await browser.close();
  }
};