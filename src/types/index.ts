import { DefaultSession, DefaultUser } from "next-auth";
import { Document, Types } from "mongoose";

// ─── NextAuth Extensions ───────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      plan: "free" | "pro";
      credits: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "user" | "admin";
    plan: "free" | "pro";
    credits: number;
  }
}

// ─── User ──────────────────────────────────────────────────────────────────
export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  plan: "free" | "pro";
  credits: number;
  totalCreditsUsed: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Subscription ──────────────────────────────────────────────────────────
export interface ISubscription extends Document {
  _id: Types.ObjectId;
  userId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  stripePriceId: string;
  status:
    | "active"
    | "canceled"
    | "past_due"
    | "trialing"
    | "incomplete";
  plan: "free" | "pro";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── AI History ────────────────────────────────────────────────────────────
export type ToolType =
  | "blog"
  | "product-description"
  | "social-media"
  | "email"
  | "seo-meta";

export interface IHistory extends Document {
  _id: Types.ObjectId;
  userId: string;
  toolType: ToolType;
  prompt: string;
  result: string;
  creditsUsed: number;
  tokensUsed: number;
  createdAt: Date;
}

// ─── Usage ─────────────────────────────────────────────────────────────────
export interface IUsage extends Document {
  _id: Types.ObjectId;
  userId: string;
  month: string;
  creditsUsed: number;
  generationsCount: number;
  toolBreakdown: Record<ToolType, number>;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Response ──────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalCredits: number;
  creditsUsed: number;
  creditsRemaining: number;
  totalGenerations: number;
  thisMonthGenerations: number;
  plan: "free" | "pro";
  toolBreakdown: Record<ToolType, number>;
}

// ─── Tool Configs ──────────────────────────────────────────────────────────
export interface BlogGeneratorInput {
  topic: string;
  tone: "professional" | "casual" | "informative" | "persuasive";
  wordCount: number;
  keywords?: string;
}

export interface ProductDescriptionInput {
  productName: string;
  features: string;
  targetAudience: string;
  tone: "luxury" | "casual" | "technical" | "friendly";
}

export interface SocialMediaInput {
  topic: string;
  platform: "twitter" | "linkedin" | "instagram" | "facebook";
  tone: "professional" | "casual" | "funny" | "inspiring";
  includeHashtags: boolean;
}

export interface EmailGeneratorInput {
  type:
    | "cold-outreach"
    | "follow-up"
    | "newsletter"
    | "promotional"
    | "welcome";
  subject: string;
  recipientName?: string;
  senderName: string;
  keyPoints: string;
  tone: "formal" | "casual" | "friendly";
}

export interface SeoMetaInput {
  pageTitle: string;
  pageContent: string;
  targetKeyword: string;
  businessName?: string;
}

// ─── Plans ─────────────────────────────────────────────────────────────────
export interface PlanConfig {
  name: string;
  price: number;
  credits: number;
  features: string[];
  priceId?: string;
}

export const PLANS: Record<"free" | "pro", PlanConfig> = {
  free: {
    name: "Free",
    price: 0,
    credits: 10,
    features: [
      "10 credits/month",
      "All 5 AI tools",
      "Basic support",
      "History (30 days)",
    ],
  },
  pro: {
    name: "Pro",
    price: 29,
    credits: 500,
    features: [
      "500 credits/month",
      "All 5 AI tools",
      "Priority support",
      "Unlimited history",
      "Advanced analytics",
      "API access",
    ],
  },
};

export const TOOL_CREDITS: Record<ToolType, number> = {
  blog: 3,
  "product-description": 1,
  "social-media": 1,
  email: 2,
  "seo-meta": 1,
};

export interface AdminStats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalGenerations: number;
  activeSubscriptions: number;
  recentUsers: IUser[];
  revenueByMonth: {
    month: string;
    revenue: number;
  }[];
  generationsByTool: Record<ToolType, number>;
}