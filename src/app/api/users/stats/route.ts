import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User, History, Usage } from "@/lib/models";
import { getMonthKey } from "@/lib/utils";
import { PLANS, IUser, IUsage } from "@/types";
import mongoose from "mongoose"; // 1. Yeh import add karein

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // 2. String ID ko Mongoose ObjectId mein convert karein
    const objectId = new mongoose.Types.ObjectId(session.user.id);

    const [dbUser, dbUsage, totalHistoryCount] = await Promise.all([
      User.findById(objectId).lean(), // session.user.id ki jagah objectId use karein
      Usage.findOne({
        userId: objectId, // session.user.id ki jagah objectId use karein
        month: getMonthKey(),
      }).lean(),
      History.countDocuments({
        userId: objectId, // session.user.id ki jagah objectId use karein
      }),
    ]);

    const user = dbUser as IUser | null;
    const monthUsage = dbUsage as IUsage | null;

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const plan = (user.plan === "pro" ? "pro" : "free") as keyof typeof PLANS;
    const planCredits = PLANS[plan].credits;

    return NextResponse.json({
      success: true,
      stats: {
        totalCredits: planCredits,
        creditsUsed: user.totalCreditsUsed,
        creditsRemaining: user.credits,
        totalGenerations: totalHistoryCount,
        thisMonthGenerations: monthUsage?.generationsCount ?? 0,
        plan,
        toolBreakdown:
          monthUsage?.toolBreakdown ?? {
            blog: 0,
            "product-description": 0,
            "social-media": 0,
            email: 0,
            "seo-meta": 0,
          },
      },
    });
  } catch (error) {
    console.error("Stats error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
