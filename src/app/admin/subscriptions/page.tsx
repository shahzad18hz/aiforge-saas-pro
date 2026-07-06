"use client";
import { useAdminStats, useAdminUsers, useUpdateUser } from "@/hooks";
import { Card, CardHeader, CardTitle, CardContent, Badge, StatCard, SkeletonTable } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { CreditCard, Crown, Users, DollarSign, RefreshCw } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminSubscriptionsPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: usersData, isLoading: usersLoading } = useAdminUsers(1, "");
  const updateUser = useUpdateUser();

  const proUsers = usersData?.users?.filter(u => u.plan === "pro") || [];

  const handleRefreshCredits = async (userId: string) => {
    await updateUser.mutateAsync({ userId, updates: { credits: 500 } });
    toast.success("Credits refreshed!");
  };

  const handleRevokePro = async (userId: string) => {
    await updateUser.mutateAsync({ userId, updates: { plan: "free", credits: 10 } });
    toast.success("Reverted to free plan");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Subscription Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage Pro subscriptions and billing</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsLoading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />) : (
          <>
            <StatCard title="Active Subscriptions" value={stats?.activeSubscriptions ?? 0} icon={<CreditCard className="w-6 h-6 text-violet-500" />} color="bg-violet-100 dark:bg-violet-950/30" />
            <StatCard title="Pro Users" value={stats?.proUsers ?? 0} icon={<Crown className="w-6 h-6 text-amber-500" />} color="bg-amber-100 dark:bg-amber-950/30" />
            <StatCard title="Monthly Revenue" value={`$${(stats?.monthlyRevenue ?? 0).toLocaleString()}`} icon={<DollarSign className="w-6 h-6 text-green-500" />} color="bg-green-100 dark:bg-green-950/30" change="+MRR" trend="up" />
            <StatCard title="Free Users" value={stats?.freeUsers ?? 0} icon={<Users className="w-6 h-6 text-blue-500" />} color="bg-blue-100 dark:bg-blue-950/30" />
          </>
        )}
      </div>

      {/* Revenue Breakdown */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: "MRR", value: `$${(stats?.monthlyRevenue ?? 0).toLocaleString()}` },
          { label: "ARR (Estimated)", value: `$${((stats?.monthlyRevenue ?? 0) * 12).toLocaleString()}` },
          { label: "ARPU", value: `$${stats?.proUsers ? Math.round((stats.monthlyRevenue ?? 0) / stats.proUsers) : 0}` },
        ].map(({ label, value }) => (
          <Card key={label} className="p-5 text-center">
            <p className="text-3xl font-extrabold gradient-text">{value}</p>
            <p className="text-sm text-muted-foreground mt-1">{label}</p>
          </Card>
        ))}
      </div>

      {/* Pro Users Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pro Subscribers ({proUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {usersLoading ? <SkeletonTable rows={5} /> : proUsers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No Pro subscribers yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    {["User", "Plan", "Credits", "Total Used", "Actions"].map(h => (
                      <th key={h} className="text-left py-3 px-2 text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {proUsers.map(user => (
                    <tr key={user._id.toString()} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2"><Badge variant="pro">PRO</Badge></td>
                      <td className="py-3 px-2"><span className="font-semibold text-violet-500">{user.credits}</span></td>
                      <td className="py-3 px-2 text-muted-foreground">{user.totalCreditsUsed}</td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" loading={updateUser.isPending} onClick={() => handleRefreshCredits(user._id.toString())}>
                            <RefreshCw className="w-3.5 h-3.5" /> Refresh
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRevokePro(user._id.toString())}>
                            Revoke
                          </Button>
                        </div>
                      </td>
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