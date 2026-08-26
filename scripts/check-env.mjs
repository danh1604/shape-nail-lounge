import { existsSync, readFileSync } from "node:fs";

const requiredKeys = [
  "VITE_EMAILJS_SERVICE_ID",
  "VITE_EMAILJS_TEMPLATE_ID",
  "VITE_EMAILJS_OWNER_TEMPLATE_ID",
  "VITE_EMAILJS_PUBLIC_KEY",
  "VITE_SALON_EMAIL",
];

if (!existsSync(".env")) {
  console.error("Missing .env. Copy .env.example to .env before building.");
  process.exit(1);
}

const envContent = readFileSync(".env", "utf8");
const missingKeys = requiredKeys.filter((key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, "m"));
  return !match || !match[1].trim();
});

if (missingKeys.length > 0) {
  console.error(`Missing EmailJS settings in .env: ${missingKeys.join(", ")}`);
  process.exit(1);
}

console.log("EmailJS environment is ready.");
