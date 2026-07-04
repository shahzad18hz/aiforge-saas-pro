import { NextRequest } from "next/server";
import { withGeneration } from "@/lib/generation-middleware";
import { generateSocialMediaPost } from "@/lib/openai";
import { SocialMediaInput } from "@/types";
import { z } from "zod";

const schema = z.object({
  topic: z.string().min(3).max(200),
  platform: z.enum(["twitter", "linkedin", "instagram", "facebook"]),
  tone: z.enum(["professional", "casual", "funny", "inspiring"]),
  includeHashtags: z.boolean(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const input = schema.parse(body) as SocialMediaInput;
  return withGeneration("social-media", () => generateSocialMediaPost(input), input.topic);
}
