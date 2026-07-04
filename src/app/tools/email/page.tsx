"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToolWrapper } from "@/components/tools/ToolWrapper";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";

const schema = z.object({
  type: z.enum(["cold-outreach", "follow-up", "newsletter", "promotional", "welcome"]),
  subject: z.string().min(3).max(200),
  recipientName: z.string().optional(),
  senderName: z.string().min(2).max(100),
  keyPoints: z.string().min(10).max(500),
  tone: z.enum(["formal", "casual", "friendly"]),
});
type FormData = z.infer<typeof schema>;

const EMAIL_TYPES = [
  { v: "cold-outreach", label: "Cold Outreach", emoji: "🤝" },
  { v: "follow-up", label: "Follow-Up", emoji: "🔄" },
  { v: "newsletter", label: "Newsletter", emoji: "📰" },
  { v: "promotional", label: "Promotional", emoji: "📢" },
  { v: "welcome", label: "Welcome", emoji: "👋" },
];

export default function EmailGeneratorPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "cold-outreach", tone: "friendly" },
  });

  return (
    <ToolWrapper
      toolType="email"
      toolPath="email"
      title="Email Generator"
      description="Write high-converting emails for any purpose — cold outreach, newsletters, follow-ups, and more."
      icon={<Mail className="w-7 h-7 text-white" />}
      gradient="from-orange-500 to-amber-600"
    >
      {(onSubmit, isLoading) => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-2 block">Email Type</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {EMAIL_TYPES.map(({ v, label, emoji }) => (
                <label key={v} className="cursor-pointer">
                  <input type="radio" {...register("type")} value={v} className="peer sr-only" />
                  <div className="p-2.5 border-2 border-border rounded-xl peer-checked:border-primary peer-checked:bg-primary/5 transition-all text-center">
                    <p className="text-lg">{emoji}</p>
                    <p className="text-xs font-medium mt-0.5">{label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Email Subject <span className="text-destructive">*</span></label>
            <input {...register("subject")} placeholder="e.g. Quick question about your content strategy" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Your Name <span className="text-destructive">*</span></label>
              <input {...register("senderName")} placeholder="John Doe" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
              {errors.senderName && <p className="text-xs text-destructive mt-1">{errors.senderName.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Recipient Name <span className="text-muted-foreground text-xs">(optional)</span></label>
              <input {...register("recipientName")} placeholder="Jane Smith" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Key Points <span className="text-destructive">*</span></label>
            <textarea {...register("keyPoints")} rows={4} placeholder="e.g. Introduce yourself, mention their recent blog post, offer a free consultation, include a clear CTA..." className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all" />
            {errors.keyPoints && <p className="text-xs text-destructive mt-1">{errors.keyPoints.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Tone</label>
            <select {...register("tone")} className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
            </select>
          </div>

          <Button type="submit" className="w-full" loading={isLoading} size="lg">
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Writing Email..." : "Generate Email"}
          </Button>
        </form>
      )}
    </ToolWrapper>
  );
}
