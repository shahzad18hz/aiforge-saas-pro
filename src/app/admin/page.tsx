"use client";
import { useAdminStats } from "@/hooks";
import { StatCard, Card, CardHeader, CardTitle, CardContent, Badge, SkeletonCard, SkeletonTable } from "@/components/ui";
import { Users, CreditCard, TrendingUp, Zap, UserCheck, Activity, PenTool, ShoppingBag, Share2, Mail, Search } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { formatDate } from "@/lib/utils";

const TOOL_COLORS: Record<string, string> = {
  "blog": "#8b5cf6",
  "product-description": "#3b82f6",
  "social-media": "#ec4899",
  "email": "#f97316",
  "seo-meta": "#22c55e",
};
const TOOL_LABELS: Record<string, string> = {
  "blog": "Blog", "product-description": "Product", "social-media": "Social", "email": "Email", "seo-meta": "SEO"
};

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Platform overview and analytics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />) : (
          <>
            <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<Users className="w-6 h-6 text-blue-500" />} color="bg-blue-100 dark:bg-blue-950/30" change={`+${stats?.freeUsers ?? 0} free`} trend="up" />
            <StatCard title="Pro Subscribers" value={stats?.proUsers ?? 0} icon={<UserCheck className="w-6 h-6 text-violet-500" />} color="bg-violet-100 dark:bg-violet-950/30" change={`${stats?.activeSubscriptions ?? 0} active`} trend="up" />
            <StatCard title="Monthly Revenue" value={`$${(stats?.monthlyRevenue ?? 0).toLocaleString()}`} icon={<CreditCard className="w-6 h-6 text-green-500" />} color="bg-green-100 dark:bg-green-950/30" change="+12% MoM" trend="up" />
            <StatCard title="Total Generations" value={(stats?.totalGenerations ?? 0).toLocaleString()} icon={<Activity className="w-6 h-6 text-orange-500" />} color="bg-orange-100 dark:bg-orange-950/30" />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Monthly Revenue</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="skeleton h-64 rounded-xl" /> : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stats?.revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  <Bar dataKey="revenue" fill="url(#revGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Tool Usage Pie */}
        <Card>
          <CardHeader><CardTitle>Tool Usage</CardTitle></CardHeader>
          <CardContent>
            {isLoading ? <div className="skeleton h-64 rounded-xl" /> : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={Object.entries(stats?.generationsByTool ?? {}).map(([k, v]) => ({ name: TOOL_LABELS[k], value: v, key: k }))} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                      {Object.entries(stats?.generationsByTool ?? {}).map(([k]) => (
                        <Cell key={k} fill={TOOL_COLORS[k]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {Object.entries(stats?.generationsByTool ?? {}).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: TOOL_COLORS[k] }} />
                        <span className="text-muted-foreground">{TOOL_LABELS[k]}</span>
                      </div>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Users */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Users</CardTitle>
          <a href="/admin/users" className="text-sm text-primary hover:underline">View all →</a>
        </CardHeader>
        <CardContent>
          {isLoading ? <SkeletonTable rows={5} /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-muted-foreground font-medium">User</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Plan</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Credits</th>
                    <th className="text-left py-3 text-muted-foreground font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentUsers?.map(user => (
                    <tr key={user._id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3"><Badge variant={user.plan === "pro" ? "pro" : "secondary"}>{user.plan.toUpperCase()}</Badge></td>
                      <td className="py-3"><span className="font-medium text-violet-500">{user.credits}</span></td>
                      <td className="py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
