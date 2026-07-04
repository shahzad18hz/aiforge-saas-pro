import { NextRequest } from "next/server";
import { withGeneration } from "@/lib/generation-middleware";
import { generateProductDescription } from "@/lib/openai";
import { ProductDescriptionInput } from "@/types";
import { z } from "zod";

const schema = z.object({
  productName: z.string().min(2).max(100),
  features: z.string().min(10).max(500),
  targetAudience: z.string().min(3).max(200),
  tone: z.enum(["luxury", "casual", "technical", "friendly"]),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const input = schema.parse(body) as ProductDescriptionInput;
  return withGeneration("product-description", () => generateProductDescription(input), input.productName);
}
