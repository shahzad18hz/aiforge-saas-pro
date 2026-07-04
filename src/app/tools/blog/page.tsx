"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ToolWrapper } from "@/components/tools/ToolWrapper";
import { Button } from "@/components/ui/button";
import { PenTool, Sparkles } from "lucide-react";

const schema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters").max(200),
  tone: z.enum(["professional", "casual", "informative", "persuasive"]),
  wordCount: z.coerce.number().min(300).max(2000),
  keywords: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function BlogGeneratorPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { tone: "professional", wordCount: 800 },
  });

  return (
    <ToolWrapper
      toolType="blog"
      toolPath="blog"
      title="Blog Generator"
      description="Generate SEO-optimized blog posts with a compelling structure, headings, and engaging content."
      icon={<PenTool className="w-7 h-7 text-white" />}
      gradient="from-violet-500 to-purple-600"
    >
      {(onSubmit, isLoading) => (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Blog Topic <span className="text-destructive">*</span></label>
            <input {...register("topic")} placeholder="e.g. 10 Best Productivity Tips for Remote Workers" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            {errors.topic && <p className="text-xs text-destructive mt-1">{errors.topic.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Tone</label>
              <select {...register("tone")} className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="informative">Informative</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Word Count</label>
              <select {...register("wordCount")} className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer">
                <option value="300">~300 words</option>
                <option value="500">~500 words</option>
                <option value="800">~800 words</option>
                <option value="1200">~1200 words</option>
                <option value="1500">~1500 words</option>
                <option value="2000">~2000 words</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Target Keywords <span className="text-muted-foreground text-xs">(optional)</span></label>
            <input {...register("keywords")} placeholder="e.g. productivity, remote work, time management" className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            <p className="text-xs text-muted-foreground mt-1">Separate with commas for better SEO targeting</p>
          </div>

          {/* Tips */}
          <div className="p-3 bg-violet-50 dark:bg-violet-950/20 border border-violet-200 dark:border-violet-800 rounded-xl">
            <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-1.5">💡 Pro Tips</p>
            <ul className="text-xs text-violet-600 dark:text-violet-400 space-y-1">
              <li>• Be specific with your topic for better results</li>
              <li>• Add keywords to improve SEO optimization</li>
              <li>• Use "persuasive" tone for marketing content</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" loading={isLoading} size="lg">
            <Sparkles className="w-4 h-4" />
            {isLoading ? "Generating Blog Post..." : "Generate Blog Post"}
          </Button>
        </form>
      )}
    </ToolWrapper>
  );
}
