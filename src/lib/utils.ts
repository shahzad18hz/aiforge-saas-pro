import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM dd, yyyy");
}

export function formatDateTime(date: Date | string) {
  return format(new Date(date), "MMM dd, yyyy HH:mm");
}

export function getMonthKey(date = new Date()) {
  return format(date, "yyyy-MM");
}

export function truncate(str: string, length: number) {
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, limit = 20, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (record.count >= limit) return { success: false, remaining: 0 };
  record.count++;
  return { success: true, remaining: limit - record.count };
}

export function getClientIp(req: Request) {
  return req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const { default: nodemailer } = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Reset your password — AIForge",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;border-radius:10px 10px 0 0">
        <h1 style="color:white;margin:0">🤖 AIForge</h1>
      </div>
      <div style="padding:30px;background:#f9f9f9">
        <h2>Reset Your Password</h2>
        <p>Click below to reset your password. Link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:12px 30px;border-radius:6px;text-decoration:none;margin:20px 0">Reset Password</a>
      </div>
    </div>`,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const { default: nodemailer } = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Welcome to AIForge! 🎉",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:30px;border-radius:10px 10px 0 0">
        <h1 style="color:white;margin:0">🤖 AIForge</h1>
      </div>
      <div style="padding:30px;background:#f9f9f9">
        <h2>Welcome, ${name}! 👋</h2>
        <p>You now have <strong>10 free credits</strong> to get started.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:12px 30px;border-radius:6px;text-decoration:none;margin:20px 0">Go to Dashboard</a>
      </div>
    </div>`,
  });
}
