import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User, History, Usage, Subscription } from "@/lib/models";
import { cancelSubscription } from "@/lib/stripe";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Cancel Stripe subscription
    if (user.stripeSubscriptionId) {
      try { await cancelSubscription(user.stripeSubscriptionId); } catch {}
    }

    // Delete all user data
    await Promise.all([
      History.deleteMany({ userId: session.user.id }),
      Usage.deleteMany({ userId: session.user.id }),
      Subscription.deleteMany({ userId: session.user.id }),
      User.findByIdAndDelete(session.user.id),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
