import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import { History } from "@/lib/models";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const toolType = searchParams.get("toolType");
    const skip = (page - 1) * limit;

    await connectDB();

    const query: Record<string, unknown> = { userId: session.user.id };
    if (toolType) query.toolType = toolType;

    const [history, total] = await Promise.all([
      History.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      History.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      history,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await connectDB();
    await History.findOneAndDelete({ _id: id, userId: session.user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete history error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
