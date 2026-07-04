"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useUIStore } from "@/store";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, PenTool, ShoppingBag, Share2, Mail, Search,
  History, CreditCard, User, Settings, LogOut, Zap, ChevronLeft,
  Shield, X
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
  { href: "/dashboard/profile", icon: User, label: "Profile" },
];

const tools = [
  { href: "/tools/blog", icon: PenTool, label: "Blog Generator", color: "text-violet-500" },
  { href: "/tools/product", icon: ShoppingBag, label: "Product Description", color: "text-blue-500" },
  { href: "/tools/social", icon: Share2, label: "Social Media", color: "text-pink-500" },
  { href: "/tools/email", icon: Mail, label: "Email Generator", color: "text-orange-500" },
  { href: "/tools/seo", icon: Search, label: "SEO Meta Tags", color: "text-green-500" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-full z-40 bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-16",
      )}>
        {/* Logo */}
        <div className="p-4 flex items-center justify-between h-16 border-b border-border">
          <Link href="/dashboard" className={cn("flex items-center gap-2 overflow-hidden", !sidebarOpen && "lg:justify-center")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg gradient-text whitespace-nowrap">AIForge</span>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent transition-colors lg:flex hidden">
            <ChevronLeft className={cn("w-4 h-4 transition-transform duration-300", !sidebarOpen && "rotate-180")} />
          </button>
          <button onClick={() => setSidebarOpen(false)} className="text-muted-foreground hover:text-foreground p-1 lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Main nav */}
          <div>
            {sidebarOpen && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Navigation</p>}
            <nav className="space-y-1">
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} className={cn("sidebar-item", pathname === href && "active")}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Tools */}
          <div>
            {sidebarOpen && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">AI Tools</p>}
            <nav className="space-y-1">
              {tools.map(({ href, icon: Icon, label, color }) => (
                <Link key={href} href={href} className={cn("sidebar-item", pathname === href && "active")}>
                  <Icon className={cn("w-5 h-5 flex-shrink-0", pathname !== href && color)} />
                  {sidebarOpen && <span>{label}</span>}
                </Link>
              ))}
            </nav>
          </div>

          {/* Admin */}
          {session?.user?.role === "admin" && (
            <div>
              {sidebarOpen && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Admin</p>}
              <Link href="/admin" className={cn("sidebar-item", pathname.startsWith("/admin") && "active")}>
                <Shield className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>Admin Panel</span>}
              </Link>
            </div>
          )}
        </div>

        {/* User & credits */}
        <div className="p-3 border-t border-border space-y-2">
          {sidebarOpen && session?.user && (
            <div className="bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-950/30 dark:to-blue-950/30 rounded-xl p-3 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">Credits</span>
                <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", session.user.plan === "pro" ? "bg-violet-100 text-violet-700" : "bg-muted text-muted-foreground")}>
                  {session.user.plan === "pro" ? "PRO" : "FREE"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-500" />
                <span className="text-sm font-bold">{session.user.credits} credits left</span>
              </div>
              {session.user.plan === "free" && (
                <Link href="/dashboard/billing" className="block mt-2 text-xs text-center bg-gradient-to-r from-violet-600 to-blue-500 text-white rounded-lg py-1.5 hover:opacity-90 transition-opacity">
                  Upgrade to Pro
                </Link>
              )}
            </div>
          )}
          <button onClick={() => signOut({ callbackUrl: "/" })} className={cn("sidebar-item w-full text-destructive hover:bg-destructive/10")}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
