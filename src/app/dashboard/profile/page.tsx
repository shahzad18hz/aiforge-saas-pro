"use client";
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useProfile, useUpdateProfile } from "@/hooks";
import { Card, CardHeader, CardTitle, CardContent, Modal, Toggle } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/index";
import { User, Mail, Camera, Lock, Trash2, Shield, Bell, AlertTriangle, Check } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const router = useRouter();

  const [name, setName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, marketing: false, usage: true });

  // Password form
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  const initName = profile?.name || session?.user?.name || "";

  const handleUpdateName = async () => {
    if (!name.trim() || name === initName) return;
    await updateProfile.mutateAsync({ name });
    await update({ name });
  };

  const handleChangePassword = async () => {
    if (newPass !== confirmPass) { toast.error("Passwords don't match"); return; }
    if (newPass.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setPassLoading(true);
    try {
      await axios.post("/api/users/password", { currentPassword: currentPass, newPassword: newPass });
      toast.success("Password updated!");
      setShowPasswordModal(false);
      setCurrentPass(""); setNewPass(""); setConfirmPass("");
    } catch (e) {
      toast.error(axios.isAxiosError(e) ? e.response?.data?.error : "Failed to update password");
    } finally { setPassLoading(false); }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") { toast.error("Type DELETE to confirm"); return; }
    setDeleting(true);
    try {
      await axios.delete("/api/users/delete");
      await signOut({ redirect: false });
      router.push("/");
    } catch { toast.error("Failed to delete account"); setDeleting(false); }
  };

  if (isLoading) {
    return <div className="max-w-2xl mx-auto space-y-6">
      {[1, 2, 3].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
    </div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account information and preferences</p>
      </div>

      {/* Avatar + Basic Info */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" /> Personal Information</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {(profile?.name || session?.user?.name || "U")[0].toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <p className="font-semibold">{profile?.name}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <p className="text-xs text-violet-500 font-medium mt-1 capitalize">{profile?.plan} Plan · {profile?.credits} credits</p>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue={initName}
                onChange={e => setName(e.target.value)}
                className="flex-1 bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                placeholder="Your full name"
              />
              <Button variant="outline" onClick={handleUpdateName} loading={updateProfile.isPending} disabled={!name || name === initName}>
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email Address</label>
            <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{profile?.email}</span>
              <span className="ml-auto text-xs text-green-600 font-medium">Verified</span>
            </div>
            <p className="text-xs text-muted-foreground">Email cannot be changed for security reasons.</p>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Security</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium text-sm">Password</p>
              <p className="text-xs text-muted-foreground">Last changed: never</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setShowPasswordModal(true)}>
              <Lock className="w-4 h-4" /> Change
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium text-sm">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Add extra security to your account</p>
            </div>
            <span className="text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">Coming Soon</span>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Toggle checked={notifications.email} onChange={v => { setNotifications(n => ({ ...n, email: v })); toast.success("Saved"); }} label="Email Notifications" description="Receive important account emails" />
          <Toggle checked={notifications.usage} onChange={v => { setNotifications(n => ({ ...n, usage: v })); toast.success("Saved"); }} label="Usage Alerts" description="Get notified when credits are running low" />
          <Toggle checked={notifications.marketing} onChange={v => { setNotifications(n => ({ ...n, marketing: v })); toast.success("Saved"); }} label="Marketing Emails" description="Product updates and new features" />
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader><CardTitle className="text-destructive flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Danger Zone</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
            <div>
              <p className="font-medium text-sm">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Modal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} title="Change Password">
        <div className="space-y-4">
          {["Current Password", "New Password", "Confirm Password"].map((label, i) => (
            <div key={label}>
              <label className="text-sm font-medium mb-1.5 block">{label}</label>
              <input
                type="password"
                value={i === 0 ? currentPass : i === 1 ? newPass : confirmPass}
                onChange={e => { if (i === 0) setCurrentPass(e.target.value); else if (i === 1) setNewPass(e.target.value); else setConfirmPass(e.target.value); }}
                placeholder="••••••••"
                className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          ))}
          <Button className="w-full" loading={passLoading} onClick={handleChangePassword}>Update Password</Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Account">
        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
            <p className="text-sm font-medium text-destructive">This action is irreversible!</p>
            <p className="text-xs text-muted-foreground mt-1">All your data, history, and subscription will be permanently deleted.</p>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Type <strong>DELETE</strong> to confirm</label>
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)} className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-destructive/30 border-destructive/30" placeholder="DELETE" />
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" loading={deleting} disabled={deleteConfirm !== "DELETE"} onClick={handleDeleteAccount}>
              <Trash2 className="w-4 h-4" /> Delete Forever
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
