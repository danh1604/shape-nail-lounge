import { existsSync, readFileSync } from "node:fs";

const requiredKeys = ["SENDER_EMAIL", "SALON_EMAIL", "BREVO_API_KEY"];

if (existsSync(".env")) {
  const envContent = readFileSync(".env", "utf8");

  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const [key, ...rest] = trimmed.split("=");
    const value = rest.join("=").trim();

    if (!process.env[key] && value) {
      process.env[key] = value;
    }
  }
}

const missingKeys = requiredKeys.filter((key) => !process.env[key]?.trim());

if (missingKeys.length > 0) {
  console.error(
    `Missing Brevo settings in environment: ${missingKeys.join(", ")}`
  );
  process.exit(1);
}

const senderEmail = process.env.SENDER_EMAIL || "";
const isPublicEmail = /@(gmail|yahoo|outlook|hotmail|icloud|live|protonmail)\.com$/i.test(
  senderEmail
);

if (isPublicEmail) {
  console.error(
    "SENDER_EMAIL must be a verified business email from your own domain (for example hello@shapenailounge.com). Gmail/Outlook/Yahoo are not valid sender addresses for Brevo production setup."
  );
  process.exit(1);
}

console.log("Brevo environment is ready.");
