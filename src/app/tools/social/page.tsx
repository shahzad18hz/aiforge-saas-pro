"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToolWrapper } from "@/components/tools/ToolWrapper";
import { Button } from "@/components/ui/button";
import { Share2, Sparkles, Twitter, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

const schema = z.object({
  topic: z.string().min(3).max(200),
  platform: z.enum(["twitter", "linkedin", "instagram", "facebook"]),
  tone: z.enum(["professional", "casual", "funny", "inspiring"]),
  includeHashtags: z.boolean(),
});
type FormData = z.infer<typeof schema>;

const PLATFORMS = [
  { v: "twitter", label: "Twitter/X", color: "bg-black text-white", icon: "𝕏" },
  { v: "linkedin", label: "LinkedIn", color: "bg-blue-700 text-white", icon: "in" },
  { v: "instagram", label: "Instagram", color: "bg-gradient-to-br from-purple-500 to-pink-500 text-white", icon: "📸" },
  { v: "facebook", label: "Facebook", color: "bg-blue-600 text-white", icon: "f" },
];

export default function SocialMediaPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { platform: "linkedin", tone: "professional", includeHashtags: true },
  });
  const platform = watch("platform");

  return (
    <ToolWrapper
      toolType="social-media"
      toolPath="social-media"
      title="Social Media Post Generator"
      description="Create engaging, platform-optimized social media posts that grow your audience."
      icon={<Share2 className="w-7 h-7 text-white" />}
      gradient="from-pink-500 to-rose-600"
    >
      {(onSubmit, isLoading) => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Topic or Message <span className="text-destructive">*</span></label>
            <textarea {...register("topic")} rows={3} placeholder="e.g. Launching our new AI product that helps teams save 10 hours per week..." className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all" />
            {errors.topic && <p className="text-xs text-destructive mt-1">{errors.topic.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-3 block">Platform</label>
            <div className="grid grid-cols-2 gap-2">
              {PLATFORMS.map(({ v, label, color, icon }) => (
                <label key={v} className="relative cursor-pointer">
                  <input type="radio" {...register("platform")} value={v} className="peer sr-only" />
                  <div className={cn("flex items-center gap-2 p-3 border-2 border-border rounded-xl peer-checked:border-primary transition-all", platform === v && "border-primary bg-primary/5")}>
                    <span className={cn("w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center", color)}>{icon}</span>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Tone</label>
            <select {...register("tone")} className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="funny">Funny / Witty</option>
              <option value="inspiring">Inspiring</option>
            </select>
          </div>

          <label className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl cursor-pointer group">
            <input type="checkbox" {...register("includeHashtags")} className="w-4 h-4 accent-violet-600" />
            <div>
              <p className="text-sm font-medium">Include Hashtags</p>
              <p className="text-xs text-muted-foreground">Add relevant hashtags to increase reach</p>
            </div>
          </label>

          <Button type="submit" className="w-full" loading={isLoading} size="lg">
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Creating Post..." : "Generate Post"}
          </Button>
        </form>
      )}
    </ToolWrapper>
  );
}
