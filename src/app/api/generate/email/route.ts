import { NextRequest } from "next/server";
import { withGeneration } from "@/lib/generation-middleware";
import { generateEmail } from "@/lib/openai";
import { EmailGeneratorInput } from "@/types";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["cold-outreach", "follow-up", "newsletter", "promotional", "welcome"]),
  subject: z.string().min(3).max(200),
  recipientName: z.string().optional(),
  senderName: z.string().min(2).max(100),
  keyPoints: z.string().min(10).max(500),
  tone: z.enum(["formal", "casual", "friendly"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const input = schema.parse(body) as EmailGeneratorInput;
  return withGeneration("email", () => generateEmail(input), input.subject);
}
