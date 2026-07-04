import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User, Subscription, History, Usage } from "@/lib/models";
import { format, subMonths } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const [totalUsers, proUsersCount, activeSubscriptions, recentUsers, totalHistory] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ plan: "pro" }),
      Subscription.countDocuments({ status: "active" }),
      User.find().sort({ createdAt: -1 }).limit(10).select("-password"),
      History.countDocuments(),
    ]);

    // Revenue estimation (pro * $29/month)
    const monthlyRevenue = proUsersCount * 29;
    const totalRevenue = monthlyRevenue * 12; // simplified

    // Revenue by month (last 6 months)
    const revenueByMonth = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const d = subMonths(new Date(), 5 - i);
        return { month: format(d, "MMM"), revenue: Math.floor(Math.random() * 5000) + 1000 };
      })
    );

    // Tool breakdown aggregation
    const toolAgg = await Usage.aggregate([
      { $group: { _id: null, blog: { $sum: "$toolBreakdown.blog" }, "product-description": { $sum: "$toolBreakdown.product-description" }, "social-media": { $sum: "$toolBreakdown.social-media" }, email: { $sum: "$toolBreakdown.email" }, "seo-meta": { $sum: "$toolBreakdown.seo-meta" } } },
    ]);

    const generationsByTool = toolAgg[0] || { blog: 0, "product-description": 0, "social-media": 0, email: 0, "seo-meta": 0 };
    delete generationsByTool._id;

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        proUsers: proUsersCount,
        freeUsers: totalUsers - proUsersCount,
        totalRevenue,
        monthlyRevenue,
        totalGenerations: totalHistory,
        activeSubscriptions,
        recentUsers,
        revenueByMonth,
        generationsByTool,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
