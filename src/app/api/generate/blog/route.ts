import { NextRequest } from "next/server";
import { withGeneration } from "@/lib/generation-middleware";
import { generateBlog } from "@/lib/openai";
import { BlogGeneratorInput } from "@/types";
import { z } from "zod";

const schema = z.object({
  topic: z.string().min(3).max(200),
  tone: z.enum(["professional", "casual", "informative", "persuasive"]),
  wordCount: z.number().min(300).max(2000),
  keywords: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const input = schema.parse(body) as BlogGeneratorInput;
  return withGeneration("blog", () => generateBlog(input), input.topic);
}
