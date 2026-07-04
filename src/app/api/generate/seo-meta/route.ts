import { NextRequest } from "next/server";
import { withGeneration } from "@/lib/generation-middleware";
import { generateSeoMeta } from "@/lib/openai";
import { SeoMetaInput } from "@/types";
import { z } from "zod";

const schema = z.object({
  pageTitle: z.string().min(3).max(200),
  pageContent: z.string().min(20).max(1000),
  targetKeyword: z.string().min(2).max(100),
  businessName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const input = schema.parse(body) as SeoMetaInput;
  return withGeneration("seo-meta", () => generateSeoMeta(input), input.targetKeyword);
}
