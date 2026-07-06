import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User, History, Usage } from "@/lib/models";
import { getMonthKey } from "@/lib/utils";
import { PLANS } from "@/types";

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

    const [user, monthUsage, totalHistoryCount] = await Promise.all([
      User.findById(session.user.id),
      Usage.findOne({
        userId: session.user.id,
        month: getMonthKey(),
      }),
      History.countDocuments({
        userId: session.user.id,
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Fix TypeScript Error
    const plan = (user.plan as keyof typeof PLANS) || "free";
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
        toolBreakdown: monthUsage?.toolBreakdown ?? {},
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
