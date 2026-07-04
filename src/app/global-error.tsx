"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
          <p className="text-muted-foreground mb-6 text-sm">
            An unexpected error occurred. Our team has been notified.
            {error.digest && <span className="block mt-1 font-mono text-xs opacity-60">Error ID: {error.digest}</span>}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all">
              <RefreshCw className="w-4 h-4" /> Try Again
            </button>
            <Link href="/" className="flex items-center gap-2 border-2 border-border text-foreground font-semibold px-5 py-2.5 rounded-xl hover:border-primary transition-all">
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
