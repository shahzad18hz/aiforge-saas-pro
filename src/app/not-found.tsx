import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mb-6 animate-float">
        <Zap className="w-10 h-10 text-white" />
      </div>
      <h1 className="text-7xl font-extrabold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Link href="/" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all shadow-lg">
          Go Home
        </Link>
        <Link href="/dashboard" className="border-2 border-border text-foreground font-semibold px-6 py-3 rounded-xl hover:border-primary hover:text-primary transition-all">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
