import { BrevoClient } from "@getbrevo/brevo";

if (!process.env.BREVO_API_KEY) {
  throw new Error("BREVO_API_KEY is missing from environment variables.");
}

const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export default brevo;