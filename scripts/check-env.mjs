import { existsSync, readFileSync } from "node:fs";

const requiredKeys = ["SALON_EMAIL", "BREVO_API_KEY"];

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
  console.error(`Missing Brevo settings in .env: ${missingKeys.join(", ")}`);
  process.exit(1);
}

console.log("Brevo environment is ready.");
