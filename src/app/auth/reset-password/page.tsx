"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Lock,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";

const schema = z
  .object({
    password: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/reset-password", {
        token,
        password: data.password,
      });

      setDone(true);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } catch (e) {
      toast.error(
        axios.isAxiosError(e)
          ? e.response?.data?.error
          : "Reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl text-center">
          <p className="text-destructive font-medium">
            Invalid or missing reset token.
          </p>

          <Link
            href="/auth/forgot-password"
            className="text-primary text-sm hover:underline mt-4 block"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
        {done ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold mb-2">
              Password Reset!
            </h1>

            <p className="text-muted-foreground text-sm">
              Redirecting you to sign in...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">
                Set New Password
              </h1>

              <p className="text-muted-foreground text-sm">
                Must be at least 8 characters
              </p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
            >
              {(["password", "confirmPassword"] as const).map(
                (field, i) => (
                  <div key={field}>
                    <label className="text-sm font-medium mb-1.5 block">
                      {i === 0
                        ? "New Password"
                        : "Confirm Password"}
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                      <input
                        {...register(field)}
                        type={showPass ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                      />

                      {i === 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowPass(!showPass)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPass ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {errors[field] && (
                      <p className="text-destructive text-xs mt-1">
                        {errors[field]?.message}
                      </p>
                    )}
                  </div>
                )
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {loading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Reset Password
              </button>
            </form>

            <Link
              href="/auth/login"
              className="block text-center text-sm text-muted-foreground hover:text-foreground mt-6 transition-colors"
            >
              Back to sign in
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-xl text-center">
            <p className="text-muted-foreground">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}