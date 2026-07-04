"use client";
import { useState, useCallback } from "react";
import { useAdminUsers, useUpdateUser } from "@/hooks";
import { Card, Badge, SkeletonTable, Modal } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Search, RefreshCw, ChevronLeft, ChevronRight, Shield, UserX, Zap, Edit, Crown } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { IUser } from "@/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [editUser, setEditUser] = useState<IUser | null>(null);
  const [editCredits, setEditCredits] = useState(0);
  const [editPlan, setEditPlan] = useState<"free" | "pro">("free");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");

  const { data, isLoading, refetch } = useAdminUsers(page, search);
  const updateUser = useUpdateUser();

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const openEdit = (user: IUser) => {
    setEditUser(user);
    setEditCredits(user.credits);
    setEditPlan(user.plan);
    setEditRole(user.role);
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    await updateUser.mutateAsync({ userId: editUser._id, updates: { credits: editCredits, plan: editPlan, role: editRole } });
    setEditUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground text-sm mt-1">{data?.pagination?.total ?? 0} total users</p>
        </div>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <Button onClick={handleSearch} variant="outline">Search</Button>
        {search && <Button variant="ghost" onClick={() => { setSearch(""); setSearchInput(""); }}>Clear</Button>}
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-6"><SkeletonTable rows={10} /></div>
        ) : !data?.users?.length ? (
          <div className="p-12 text-center text-muted-foreground">No users found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/30">
                  <tr>
                    {["User", "Plan", "Credits", "Role", "Joined", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.users.map(user => (
                    <tr key={user._id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {user.name?.[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate max-w-[140px]">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.plan === "pro" ? "pro" : "secondary"}>{user.plan.toUpperCase()}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("font-semibold", user.credits > 0 ? "text-green-600" : "text-red-500")}>
                          {user.credits}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role === "admin" ? <><Shield className="w-3 h-3 mr-1" />Admin</> : "User"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => openEdit(user)} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(data.pagination?.pages ?? 0) > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-sm text-muted-foreground">Page {page} of {data.pagination.pages} · {data.pagination.total} users</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}><ChevronLeft className="w-4 h-4" /></Button>
                  <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page >= data.pagination.pages}><ChevronRight className="w-4 h-4" /></Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Edit User Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title={`Edit: ${editUser?.name}`}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Credits</label>
            <input
              type="number"
              value={editCredits}
              onChange={e => setEditCredits(Number(e.target.value))}
              min="0"
              max="10000"
              className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Plan</label>
            <div className="grid grid-cols-2 gap-2">
              {(["free", "pro"] as const).map(p => (
                <button key={p} type="button" onClick={() => setEditPlan(p)} className={cn("py-2.5 rounded-xl text-sm font-medium border-2 transition-all capitalize", editPlan === p ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground")}>
                  {p === "pro" ? <><Crown className="w-3.5 h-3.5 inline mr-1" />Pro</> : "Free"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Role</label>
            <div className="grid grid-cols-2 gap-2">
              {(["user", "admin"] as const).map(r => (
                <button key={r} type="button" onClick={() => setEditRole(r)} className={cn("py-2.5 rounded-xl text-sm font-medium border-2 transition-all capitalize", editRole === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground")}>
                  {r === "admin" ? <><Shield className="w-3.5 h-3.5 inline mr-1" />Admin</> : "User"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button className="flex-1" loading={updateUser.isPending} onClick={handleUpdate}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
