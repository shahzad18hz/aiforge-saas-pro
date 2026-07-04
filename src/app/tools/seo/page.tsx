"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToolWrapper } from "@/components/tools/ToolWrapper";
import { Button } from "@/components/ui/button";
import { Search, Sparkles } from "lucide-react";

const schema = z.object({
  pageTitle: z.string().min(3).max(200),
  pageContent: z.string().min(20).max(1000),
  targetKeyword: z.string().min(2).max(100),
  businessName: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function SeoMetaPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const keyword = watch("targetKeyword", "");
  const title = watch("pageTitle", "");

  return (
    <ToolWrapper
      toolType="seo-meta"
      toolPath="seo-meta"
      title="SEO Meta Generator"
      description="Generate optimized meta titles, descriptions, OG tags, and keywords to rank higher on Google."
      icon={<Search className="w-7 h-7 text-white" />}
      gradient="from-green-500 to-emerald-600"
    >
      {(onSubmit, isLoading) => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Page Title <span className="text-destructive">*</span></label>
            <input {...register("pageTitle")} placeholder="e.g. Best Productivity Apps for Remote Teams in 2024" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            {errors.pageTitle && <p className="text-xs text-destructive mt-1">{errors.pageTitle.message}</p>}
            {title && (
              <div className={`mt-1 text-xs ${title.length > 60 ? "text-amber-500" : "text-muted-foreground"}`}>
                {title.length}/60 chars {title.length > 60 ? "⚠️ Too long for SEO" : "✓ Good length"}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Target Keyword <span className="text-destructive">*</span></label>
            <input {...register("targetKeyword")} placeholder="e.g. productivity apps remote work" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            {errors.targetKeyword && <p className="text-xs text-destructive mt-1">{errors.targetKeyword.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Page Content Summary <span className="text-destructive">*</span></label>
            <textarea {...register("pageContent")} rows={4} placeholder="Brief summary of what this page is about, main topics covered, value proposition..." className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all" />
            {errors.pageContent && <p className="text-xs text-destructive mt-1">{errors.pageContent.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Business/Brand Name <span className="text-muted-foreground text-xs">(optional)</span></label>
            <input {...register("businessName")} placeholder="e.g. AIForge" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
          </div>

          {/* SEO Tips */}
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
            <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1.5">🎯 SEO Best Practices</p>
            <ul className="text-xs text-green-600 dark:text-green-400 space-y-1">
              <li>• Title: 50-60 chars · Description: 150-160 chars</li>
              <li>• Include your keyword naturally in both</li>
              <li>• Make descriptions action-oriented and compelling</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" loading={isLoading} size="lg">
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Generating Meta Tags..." : "Generate SEO Meta Tags"}
          </Button>
        </form>
      )}
    </ToolWrapper>
  );
}
