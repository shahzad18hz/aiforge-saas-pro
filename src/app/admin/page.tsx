"use client";
import { useState } from "react";
import { useAdminUsers, useUpdateUser } from "@/hooks";
import { Card, CardHeader, CardTitle, CardContent, Badge, SkeletonTable, Input } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Search, Edit2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [editCredits, setEditCredits] = useState<number>(0);
  const [editPlan, setEditPlan] = useState<"free" | "pro">("free");
  const [editRole, setEditRole] = useState<"user" | "admin">("user");

  const { data: usersData, isLoading, refetch } = useAdminUsers(page, search);
  const updateUser = useUpdateUser();

  const handleEditClick = (user: any) => {
    setEditUser(user);
    setEditCredits(user.credits);
    setEditPlan(user.plan as "free" | "pro");
    setEditRole((user.role || "user") as "user" | "admin");
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    
    // FIXED: Type assertion to forcefully convert ObjectId to string safely
    const customUserId = (editUser._id as unknown as string).toString();

    await updateUser.mutateAsync({ 
      userId: customUserId, 
      updates: { credits: editCredits, plan: editPlan, role: editRole } 
    });
    toast.success("User updated successfully");
    setEditUser(null);
    refetch();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage platform users, roles, and credits</p>
      </div>

      <div className="flex gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            value={search} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)} 
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Users Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <SkeletonTable rows={8} /> : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">User</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Plan/Role</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Credits</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.users?.map((user: any) => (
                      // FIXED: Double type cast applied here too for seamless build
                      <tr key={(user._id as unknown as string).toString()} className="border-b border-border last:border-0 hover:bg-muted/20">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2 space-y-1">
                          <div className="flex gap-1.5 flex-wrap">
                            <Badge variant={user.plan === "pro" ? "pro" : "secondary"}>
                              {user.plan?.toUpperCase()}
                            </Badge>
                            {user.role === "admin" && (
                              <Badge variant="secondary" className="border border-amber-500 text-amber-500">
                                ADMIN
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 font-semibold text-violet-500">{user.credits}</td>
                        <td className="py-3 px-2">
                          <Button size="sm" variant="ghost" onClick={() => handleEditClick(user)}>
                            <Edit2 className="w-3.5 h-3.5 mr-1" /> Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Sidebar Panel */}
        {editUser && (
          <Card className="animate-in fade-in slide-in-from-right-4 duration-200">
            <CardHeader>
              <CardTitle className="text-lg">Edit User Settings</CardTitle>
              <p className="text-xs text-muted-foreground break-all">{editUser.email}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Credits</label>
                <Input 
                  type="number" 
                  value={editCredits} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditCredits(Number(e.target.value))} 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Subscription Plan</label>
                <select 
                  value={editPlan} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditPlan(e.target.value as "free" | "pro")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">User Role</label>
                <select 
                  value={editRole} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditRole(e.target.value as "user" | "admin")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={handleUpdate}>
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditUser(null)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}