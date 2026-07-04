"use client";
import { useAdminStats } from "@/hooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { TrendingUp, Users, CreditCard, Activity } from "lucide-react";

const CHART_STYLE = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  fontSize: "12px",
};

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = useAdminStats();

  const conversionRate = stats ? ((stats.proUsers / stats.totalUsers) * 100).toFixed(1) : "0";
  const avgRevenuePerUser = stats?.proUsers ? (stats.monthlyRevenue / stats.proUsers).toFixed(0) : "0";

  const toolData = Object.entries(stats?.generationsByTool ?? {}).map(([k, v]) => ({
    name: { "blog": "Blog", "product-description": "Product", "social-media": "Social", "email": "Email", "seo-meta": "SEO" }[k] || k,
    count: v,
    fill: { "blog": "#8b5cf6", "product-description": "#3b82f6", "social-media": "#ec4899", "email": "#f97316", "seo-meta": "#22c55e" }[k] || "#8b5cf6",
  }));

  // Simulate user growth data
  const userGrowth = stats?.revenueByMonth?.map((r, i) => ({
    month: r.month,
    users: Math.floor((stats.totalUsers / 6) * (i + 1)),
    revenue: r.revenue,
  })) ?? [];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform performance and usage insights</p>
      </div>

      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Conversion Rate", value: `${conversionRate}%`, sub: "Free → Pro", icon: TrendingUp, color: "text-green-500", bg: "bg-green-100 dark:bg-green-950/30" },
          { label: "ARPU", value: `$${avgRevenuePerUser}`, sub: "Per Pro user", icon: CreditCard, color: "text-violet-500", bg: "bg-violet-100 dark:bg-violet-950/30" },
          { label: "Total Users", value: stats?.totalUsers ?? 0, sub: `${stats?.freeUsers ?? 0} free · ${stats?.proUsers ?? 0} pro`, icon: Users, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-950/30" },
          { label: "Total Revenue", value: `$${(stats?.totalRevenue ?? 0).toLocaleString()}`, sub: "All time (est.)", icon: Activity, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-950/30" },
        ].map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card border border-border rounded-2xl p-6">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-extrabold">{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
            <p className="text-xs text-muted-foreground/70 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue + User Growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Revenue Trend</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="skeleton h-56 rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats?.revenueByMonth}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} contentStyle={CHART_STYLE} />
                  <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#areaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>User Growth</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="skeleton h-56 rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={CHART_STYLE} />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tool Usage */}
      <Card>
        <CardHeader><CardTitle>Generations by Tool</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="skeleton h-64 rounded-xl" /> : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={toolData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" width={80} />
                <Tooltip contentStyle={CHART_STYLE} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {toolData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Plan Distribution */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Plan Distribution</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Free Users", value: stats?.freeUsers ?? 0, total: stats?.totalUsers ?? 1, color: "bg-muted" },
              { label: "Pro Users", value: stats?.proUsers ?? 0, total: stats?.totalUsers ?? 1, color: "bg-gradient-to-r from-violet-600 to-blue-500" },
            ].map(({ label, value, total, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium">{label}</span>
                  <span className="text-muted-foreground">{value} ({total > 0 ? ((value / total) * 100).toFixed(0) : 0}%)</span>
                </div>
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${total > 0 ? (value / total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Quick Metrics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Active Subscriptions", value: stats?.activeSubscriptions ?? 0 },
              { label: "Monthly Revenue", value: `$${(stats?.monthlyRevenue ?? 0).toLocaleString()}` },
              { label: "Est. Annual Revenue", value: `$${((stats?.monthlyRevenue ?? 0) * 12).toLocaleString()}` },
              { label: "Avg Credits/User", value: stats?.totalUsers ? Math.floor((stats.totalGenerations) / stats.totalUsers) : 0 },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-bold text-sm">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
