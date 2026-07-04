/**
 * Environment Variable Validation
 * Called at app startup to ensure all required env vars are set.
 */

const REQUIRED_VARS = [
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "MONGODB_URI",
  "GEMINI_API_KEY",
];

const OPTIONAL_VARS = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRO_MONTHLY_PRICE_ID",
  "EMAIL_HOST",
  "EMAIL_USER",
  "EMAIL_PASS",
  "EMAIL_FROM",
];

export function validateEnv() {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const key of REQUIRED_VARS) {
    if (!process.env[key]) missing.push(key);
  }

  for (const key of OPTIONAL_VARS) {
    if (!process.env[key]) warnings.push(key);
  }

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n${missing
        .map((k) => `  - ${k}`)
        .join("\n")}\n\nPlease copy .env.example to .env.local and fill in the values.`
    );
  }

  if (warnings.length > 0 && process.env.NODE_ENV === "development") {
    console.warn(
      `⚠️ Optional env vars not set (some features may be disabled):\n${warnings
        .map((k) => `  - ${k}`)
        .join("\n")}`
    );
  }
}

// Type-safe env access
export const env = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
  MONGODB_URI: process.env.MONGODB_URI!,
  GROQ_API_KEY: process.env.GROQ_API_KEY!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRO_MONTHLY_PRICE_ID: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  NODE_ENV: process.env.NODE_ENV as
    | "development"
    | "production"
    | "test",
};