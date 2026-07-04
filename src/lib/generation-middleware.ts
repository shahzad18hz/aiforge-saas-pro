import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { User, History, Usage } from "@/lib/models";
import { ToolType, TOOL_CREDITS } from "@/types";
import { getMonthKey } from "@/lib/utils";

export async function withGeneration(
  toolType: ToolType,
  handler: (userId: string) => Promise<{ content: string; tokensUsed: number }>,
  prompt: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const creditsRequired = TOOL_CREDITS[toolType];
  if (user.credits < creditsRequired) {
    return NextResponse.json(
      { error: "Insufficient credits. Please upgrade to Pro.", creditsRequired, creditsAvailable: user.credits },
      { status: 402 }
    );
  }

  try {
    const { content, tokensUsed } = await handler(user._id.toString());

    // Save to history
    await History.create({
      userId: user._id.toString(),
      toolType,
      prompt,
      result: content,
      creditsUsed: creditsRequired,
      tokensUsed,
    });

    // Update user credits
    await User.findByIdAndUpdate(user._id, {
      $inc: { credits: -creditsRequired, totalCreditsUsed: creditsRequired },
    });

    // Update usage tracking
    const monthKey = getMonthKey();
    await Usage.findOneAndUpdate(
      { userId: user._id.toString(), month: monthKey },
      {
        $inc: {
          creditsUsed: creditsRequired,
          generationsCount: 1,
          [`toolBreakdown.${toolType}`]: 1,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      content,
      creditsUsed: creditsRequired,
      creditsRemaining: user.credits - creditsRequired,
    });
  } catch (error) {
    console.error(`Generation error [${toolType}]:`, error);
    return NextResponse.json({ error: "Generation failed. Please try again." }, { status: 500 });
  }
}
