"use client";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useGenerate } from "@/hooks";
import { Card, CardContent, Badge, Progress } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Zap, Check, Download, Share2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { TOOL_CREDITS, ToolType } from "@/types";

interface ToolWrapperProps {
  toolType: ToolType;
  toolPath: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  children: (onSubmit: (data: Record<string, unknown>) => void, isLoading: boolean) => React.ReactNode;
}

export function ToolWrapper({ toolType, toolPath, title, description, icon, gradient, children }: ToolWrapperProps) {
  const { data: session } = useSession();
  const generate = useGenerate(toolPath);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [lastInput, setLastInput] = useState<Record<string, unknown> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const credits = TOOL_CREDITS[toolType];
  const hasCredits = (session?.user?.credits ?? 0) >= credits;

  const handleSubmit = async (data: Record<string, unknown>) => {
    setLastInput(data);
    const res = await generate.mutateAsync(data);
    setResult(res.content);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleRegenerate = () => {
    if (lastInput) handleSubmit(lastInput);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${toolPath}-${Date.now()}.txt`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold">{title}</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-violet-500" /> {credits} credit{credits > 1 ? "s" : ""}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* Credit warning */}
      {!hasCredits && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between gap-4">
          <p className="text-sm text-amber-800 dark:text-amber-300">
            <strong>Not enough credits.</strong> You need {credits} credits. You have {session?.user?.credits ?? 0}.
          </p>
          <Link href="/dashboard/billing">
            <Button size="sm" className="flex-shrink-0">Upgrade to Pro</Button>
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="h-fit">
          <CardContent className="pt-6">
            {children(handleSubmit, generate.isPending)}
          </CardContent>
        </Card>

        {/* Output */}
        <div className="space-y-4" ref={resultRef}>
          <Card className={cn("transition-all duration-300", generate.isPending && "opacity-60")}>
            <div className={`h-1 bg-gradient-to-r ${gradient} rounded-t-2xl`} />
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" /> Generated Content
                </p>
                {result && (
                  <div className="flex items-center gap-1.5">
                    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Copy">
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button onClick={handleDownload} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={handleRegenerate} disabled={generate.isPending} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50" title="Regenerate">
                      <RefreshCw className={cn("w-4 h-4", generate.isPending && "animate-spin")} />
                    </button>
                  </div>
                )}
              </div>

              {generate.isPending ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center animate-pulse`}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm text-muted-foreground animate-pulse">AI is generating your content...</p>
                  </div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton h-4 rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
                  ))}
                </div>
              ) : result ? (
                <div>
                  <div className="bg-muted/50 rounded-xl p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button onClick={handleCopy} variant="outline" className="flex-1" size="sm">
                      {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                    </Button>
                    <Button onClick={handleRegenerate} variant="outline" size="sm" loading={generate.isPending}>
                      <RefreshCw className="w-4 h-4" /> Regenerate
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 flex items-center justify-center mb-4`}>
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <p className="text-muted-foreground text-sm">Fill in the form and click generate to see your AI-powered content here.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credit usage indicator */}
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>Credits remaining: <strong className="text-foreground">{session?.user?.credits ?? 0}</strong></span>
            <Link href="/dashboard/history" className="text-primary hover:underline">View history →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
