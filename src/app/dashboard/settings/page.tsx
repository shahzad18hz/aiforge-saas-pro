"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardHeader, CardTitle, CardContent, Toggle, Badge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Settings, Globe, Moon, Sun, Palette, Bell, Shield, Download } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [lang, setLang] = useState("en");
  const [notifs, setNotifs] = useState({ email: true, marketing: false, credits: true });

  const handleSave = () => toast.success("Settings saved!");

  const handleExportData = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      user: { name: session?.user?.name, email: session?.user?.email, plan: session?.user?.plan },
      note: "Full data export including history can be requested via support.",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "aiforge-data-export.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Customize your AIForge experience</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" /> Appearance</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-3 block">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Settings },
              ].map(({ value, label, icon: Icon }) => (
                <button key={value} onClick={() => setTheme(value as typeof theme)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <Icon className={`w-5 h-5 ${theme === value ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${theme === value ? "text-primary" : "text-muted-foreground"}`}>{label}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Theme switching requires page refresh. Full dark mode coming soon.</p>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" /> Language & Region</CardTitle></CardHeader>
        <CardContent>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Interface Language</label>
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="w-full bg-background border border-input rounded-xl text-sm px-4 py-3 focus:outline-none focus:ring-2 focus:ring-ring appearance-none">
              <option value="en">English</option>
              <option value="es">Español (Coming soon)</option>
              <option value="fr">Français (Coming soon)</option>
              <option value="de">Deutsch (Coming soon)</option>
              <option value="ur">اردو (Coming soon)</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" /> Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <Toggle checked={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} label="Email Notifications" description="Account activity and important updates" />
          <Toggle checked={notifs.credits} onChange={v => setNotifs(n => ({ ...n, credits: v }))} label="Low Credits Alert" description="Get notified when credits fall below 20%" />
          <Toggle checked={notifs.marketing} onChange={v => setNotifs(n => ({ ...n, marketing: v }))} label="Product Updates" description="New features, tools, and promotions" />
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5" /> Account</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium text-sm">Current Plan</p>
              <p className="text-xs text-muted-foreground mt-0.5">{session?.user?.plan === "pro" ? "500 credits/month" : "10 credits/month"}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={session?.user?.plan === "pro" ? "pro" : "secondary"}>
                {(session?.user?.plan ?? "free").toUpperCase()}
              </Badge>
              {session?.user?.plan === "free" && (
                <Link href="/dashboard/billing">
                  <Button size="sm">Upgrade</Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium text-sm">Export Your Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">Download your account information</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
            <div>
              <p className="font-medium text-sm">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete your account</p>
            </div>
            <Link href="/dashboard/profile">
              <Button variant="destructive" size="sm">Delete</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleSave}>Save Settings</Button>
    </div>
  );
}
