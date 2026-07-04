"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useStats, useHistory } from "@/hooks";
import { StatCard, Card, CardHeader, CardTitle, CardContent, Badge, SkeletonCard, EmptyState, Progress } from "@/components/ui";
import { Zap, PenTool, ShoppingBag, Share2, Mail, Search, ArrowRight, Sparkles, TrendingUp, Clock, BarChart3 } from "lucide-react";
import { formatDateTime, truncate } from "@/lib/utils";
import { TOOL_CREDITS, ToolType } from "@/types";

const TOOL_META: Record<ToolType, { label: string; icon: React.ElementType; color: string; href: string }> = {
  "blog": { label: "Blog", icon: PenTool, color: "text-violet-500", href: "/tools/blog" },
  "product-description": { label: "Product", icon: ShoppingBag, color: "text-blue-500", href: "/tools/product" },
  "social-media": { label: "Social", icon: Share2, color: "text-pink-500", href: "/tools/social" },
  "email": { label: "Email", icon: Mail, color: "text-orange-500", href: "/tools/email" },
  "seo-meta": { label: "SEO", icon: Search, color: "text-green-500", href: "/tools/seo" },
};

const QUICK_TOOLS = [
  { href: "/tools/blog", icon: PenTool, label: "Blog Post", desc: "SEO blog articles", credits: 3, gradient: "from-violet-500 to-purple-600" },
  { href: "/tools/product", icon: ShoppingBag, label: "Product Desc", desc: "Convert visitors", credits: 1, gradient: "from-blue-500 to-cyan-600" },
  { href: "/tools/social", icon: Share2, label: "Social Post", desc: "Engage audience", credits: 1, gradient: "from-pink-500 to-rose-600" },
  { href: "/tools/email", icon: Mail, label: "Email Copy", desc: "High-converting", credits: 2, gradient: "from-orange-500 to-amber-600" },
  { href: "/tools/seo", icon: Search, label: "SEO Meta", desc: "Rank higher", credits: 1, gradient: "from-green-500 to-emerald-600" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { data: stats, isLoading: statsLoading } = useStats();
  const { data: historyData, isLoading: historyLoading } = useHistory(1);

  const creditsUsedPct = stats ? ((stats.totalCredits - stats.creditsRemaining) / stats.totalCredits) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"},{" "}
            <span className="gradient-text">{session?.user?.name?.split(" ")[0]} 👋</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening with your content today.</p>
        </div>
        {session?.user?.plan === "free" && (
          <Link href="/dashboard/billing" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:opacity-90 transition-all shadow-lg hover:-translate-y-0.5 duration-200">
            <Zap className="w-4 h-4" />
            Upgrade to Pro
          </Link>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard title="Credits Remaining" value={stats?.creditsRemaining ?? 0} icon={<Zap className="w-6 h-6 text-violet-500" />} color="bg-violet-100 dark:bg-violet-950/30" change={session?.user?.plan === "pro" ? "PRO" : "FREE"} trend="neutral" />
            <StatCard title="Total Generations" value={stats?.totalGenerations ?? 0} icon={<Sparkles className="w-6 h-6 text-blue-500" />} color="bg-blue-100 dark:bg-blue-950/30" change="+∞" trend="up" />
            <StatCard title="This Month" value={stats?.thisMonthGenerations ?? 0} icon={<TrendingUp className="w-6 h-6 text-green-500" />} color="bg-green-100 dark:bg-green-950/30" />
            <StatCard title="Credits Used" value={stats?.creditsUsed ?? 0} icon={<BarChart3 className="w-6 h-6 text-orange-500" />} color="bg-orange-100 dark:bg-orange-950/30" />
          </>
        )}
      </div>

      {/* Credit Progress */}
      {!statsLoading && stats && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Credit Usage</h2>
              <p className="text-sm text-muted-foreground">{stats.creditsRemaining} of {stats.totalCredits} credits remaining</p>
            </div>
            <Badge variant={session?.user?.plan === "pro" ? "pro" : "secondary"}>
              {session?.user?.plan === "pro" ? "PRO" : "FREE"}
            </Badge>
          </div>
          <Progress value={stats.totalCredits - stats.creditsRemaining} max={stats.totalCredits} showLabel color={creditsUsedPct > 80 ? "bg-red-500" : "bg-gradient-to-r from-violet-600 to-blue-500"} />
          {creditsUsedPct > 80 && (
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">⚠️ Running low on credits!{" "}
                <Link href="/dashboard/billing" className="underline">Upgrade to Pro</Link> for 500 credits/month.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Quick Tools */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Quick Generate</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {QUICK_TOOLS.map(({ href, icon: Icon, label, desc, credits, gradient }) => (
            <Link key={href} href={href} className="group bg-card border border-border rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-sm mb-1">{label}</p>
              <p className="text-xs text-muted-foreground mb-3">{desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-violet-600 font-medium">{credits}cr</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tool Breakdown + Recent History */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tool Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Usage by Tool</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-8 rounded-lg" />)}</div>
            ) : Object.entries(TOOL_META).map(([key, meta]) => {
              const Icon = meta.icon;
              const count = stats?.toolBreakdown?.[key as ToolType] ?? 0;
              const max = Math.max(...Object.values(stats?.toolBreakdown ?? {}), 1);
              return (
                <div key={key} className="flex items-center gap-3 mb-4 last:mb-0">
                  <Icon className={`w-4 h-4 flex-shrink-0 ${meta.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{meta.label}</span>
                      <span className="text-muted-foreground">{count}</span>
                    </div>
                    <Progress value={count} max={max} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Recent History */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Generations</CardTitle>
            <Link href="/dashboard/history" className="text-sm text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
            ) : !historyData?.history?.length ? (
              <EmptyState icon={<Clock className="w-6 h-6" />} title="No generations yet" description="Start creating content with our AI tools." action={<Link href="/tools/blog" className="text-sm text-primary hover:underline">Try Blog Generator →</Link>} />
            ) : (
              <div className="space-y-3">
                {historyData.history.slice(0, 5).map((item) => {
                  const meta = TOOL_META[item.toolType];
                  const Icon = meta.icon;
                  return (
                    <div key={item._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Icon className={`w-4 h-4 ${meta.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{truncate(item.prompt, 40)}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">{meta.label}</Badge>
                          <span className="text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</span>
                        </div>
                      </div>
                      <span className="text-xs text-violet-500 font-medium">{TOOL_CREDITS[item.toolType]}cr</span>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
