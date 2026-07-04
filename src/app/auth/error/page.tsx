"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

const ERRORS: Record<string, string> = {
  Configuration: "Server configuration error. Please contact support.",
  AccessDenied: "Access denied. You don't have permission to sign in.",
  Verification: "Verification link expired or already used.",
  OAuthSignin: "Error signing in with OAuth provider.",
  OAuthCallback: "Error in OAuth callback.",
  OAuthCreateAccount: "Could not create OAuth account.",
  EmailCreateAccount: "Could not create email account.",
  Callback: "Error in callback handler.",
  OAuthAccountNotLinked: "Email already used with different sign-in method.",
  EmailSignin: "Error sending sign-in email.",
  CredentialsSignin: "Invalid email or password.",
  SessionRequired: "Please sign in to access this page.",
  Default: "An authentication error occurred.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const message = ERRORS[error] || ERRORS.Default;

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl text-center">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Authentication Error</h1>
        <p className="text-muted-foreground text-sm mb-6">{message}</p>
        <div className="flex flex-col gap-3">
          <Link href="/auth/login" className="bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-sm">
            Try Again
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
