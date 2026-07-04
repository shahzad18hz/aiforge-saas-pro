import mongoose, { Schema, model, models } from "mongoose";
import { IUser, ISubscription, IHistory, IUsage } from "@/types";

// ─── User Model ────────────────────────────────────────────────────────────
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    image: String,
    role: { type: String, enum: ["user", "admin"], default: "user" },
    plan: { type: String, enum: ["free", "pro"], default: "free" },
    credits: { type: Number, default: 10 },
    totalCreditsUsed: { type: Number, default: 0 },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

// ─── Subscription Model ────────────────────────────────────────────────────
const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: String, required: true, index: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    stripeCustomerId: { type: String, required: true },
    stripePriceId: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "canceled", "past_due", "trialing", "incomplete"],
      default: "active",
    },
    plan: { type: String, enum: ["free", "pro"], default: "pro" },
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── History Model ─────────────────────────────────────────────────────────
const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: String, required: true, index: true },
    toolType: {
      type: String,
      enum: ["blog", "product-description", "social-media", "email", "seo-meta"],
      required: true,
    },
    prompt: { type: String, required: true },
    result: { type: String, required: true },
    creditsUsed: { type: Number, required: true },
    tokensUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Usage Model ───────────────────────────────────────────────────────────
const UsageSchema = new Schema<IUsage>(
  {
    userId: { type: String, required: true, index: true },
    month: { type: String, required: true }, // "2024-01"
    creditsUsed: { type: Number, default: 0 },
    generationsCount: { type: Number, default: 0 },
    toolBreakdown: {
      blog: { type: Number, default: 0 },
      "product-description": { type: Number, default: 0 },
      "social-media": { type: Number, default: 0 },
      email: { type: Number, default: 0 },
      "seo-meta": { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

UsageSchema.index({ userId: 1, month: 1 }, { unique: true });

export const User = models.User || model<IUser>("User", UserSchema);
export const Subscription = models.Subscription || model<ISubscription>("Subscription", SubscriptionSchema);
export const History = models.History || model<IHistory>("History", HistorySchema);
export const Usage = models.Usage || model<IUsage>("Usage", UsageSchema);
