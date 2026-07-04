import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User } from "@/lib/models";
import { cancelSubscription } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user?.stripeSubscriptionId) return NextResponse.json({ error: "No active subscription" }, { status: 400 });

    await cancelSubscription(user.stripeSubscriptionId);
    return NextResponse.json({ success: true, message: "Subscription will cancel at period end" });
  } catch (error) {
    return NextResponse.json({ error: "Cancellation failed" }, { status: 500 });
  }
}
