"use client";
import { useSession } from "next-auth/react";
import { useUIStore } from "@/store";
import { Menu, Bell, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HeaderProps { title?: string; }

export function Header({ title }: HeaderProps) {
  const { data: session } = useSession();
  const { toggleSidebar } = useUIStore();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
          <Menu className="w-5 h-5" />
        </button>
        {title && <h1 className="font-semibold text-lg hidden sm:block">{title}</h1>}
      </div>
      <div className="flex items-center gap-3">
        <Link href="/dashboard/billing" className={cn(
          "hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-all",
          session?.user?.plan === "pro"
            ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white"
            : "bg-muted text-muted-foreground hover:bg-accent"
        )}>
          <Zap className="w-3.5 h-3.5" />
          {session?.user?.credits || 0} credits
        </Link>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
          {session?.user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
