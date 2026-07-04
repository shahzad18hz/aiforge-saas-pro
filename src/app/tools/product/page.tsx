"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToolWrapper } from "@/components/tools/ToolWrapper";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles } from "lucide-react";

const schema = z.object({
  productName: z.string().min(2).max(100),
  features: z.string().min(10, "Add at least a few features").max(500),
  targetAudience: z.string().min(3).max(200),
  tone: z.enum(["luxury", "casual", "technical", "friendly"]),
});
type FormData = z.infer<typeof schema>;

export default function ProductDescriptionPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tone: "friendly" },
  });

  return (
    <ToolWrapper
      toolType="product-description"
      toolPath="product-description"
      title="Product Description Generator"
      description="Create compelling, conversion-focused product descriptions that drive sales."
      icon={<ShoppingBag className="w-7 h-7 text-white" />}
      gradient="from-blue-500 to-cyan-600"
    >
      {(onSubmit, isLoading) => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Product Name <span className="text-destructive">*</span></label>
            <input {...register("productName")} placeholder="e.g. ProMax Wireless Headphones" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            {errors.productName && <p className="text-xs text-destructive mt-1">{errors.productName.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Key Features <span className="text-destructive">*</span></label>
            <textarea {...register("features")} rows={4} placeholder="e.g. Active noise cancellation, 30-hour battery life, premium sound quality, foldable design, built-in microphone..." className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all" />
            {errors.features && <p className="text-xs text-destructive mt-1">{errors.features.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Target Audience <span className="text-destructive">*</span></label>
            <input {...register("targetAudience")} placeholder="e.g. Music lovers, remote workers, gym enthusiasts" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            {errors.targetAudience && <p className="text-xs text-destructive mt-1">{errors.targetAudience.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Brand Tone</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { v: "luxury", label: "Luxury 💎", desc: "Premium & exclusive" },
                { v: "casual", label: "Casual 😊", desc: "Friendly & approachable" },
                { v: "technical", label: "Technical 🔧", desc: "Specs-focused" },
                { v: "friendly", label: "Friendly 🌟", desc: "Warm & inviting" },
              ].map(({ v, label, desc }) => (
                <label key={v} className="relative cursor-pointer">
                  <input type="radio" {...register("tone")} value={v} className="peer sr-only" />
                  <div className="p-3 border-2 border-border rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                    <p className="text-sm font-medium">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" loading={isLoading} size="lg">
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Creating Description..." : "Generate Description"}
          </Button>
        </form>
      )}
    </ToolWrapper>
  );
}
