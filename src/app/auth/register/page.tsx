"use client";
import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import axios from "axios";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await axios.post("/api/auth/register", { name: data.name, email: data.email, password: data.password });
      toast.success("Account created! Signing you in...");
      await signIn("credentials", { email: data.email, password: data.password, redirect: false });
      router.push("/dashboard");
    } catch (error: unknown) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.error : "Registration failed";
      toast.error(msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground text-sm">Get 10 free credits to start generating</p>
        </div>

        <button
          onClick={() => { setGoogleLoading(true); signIn("google", { callbackUrl: "/dashboard" }); }}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 border-2 border-border rounded-xl py-3 text-sm font-medium hover:border-primary hover:bg-accent transition-all duration-200 mb-6 disabled:opacity-50"
        >
          {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">or with email</span></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            { name: "name" as const, label: "Full Name", icon: User, type: "text", placeholder: "John Doe" },
            { name: "email" as const, label: "Email", icon: Mail, type: "email", placeholder: "you@example.com" },
          ].map(({ name, label, icon: Icon, type, placeholder }) => (
            <div key={name}>
              <label className="text-sm font-medium mb-1.5 block">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input {...register(name)} type={type} placeholder={placeholder} className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
              </div>
              {errors[name] && <p className="text-destructive text-xs mt-1">{errors[name]?.message}</p>}
            </div>
          ))}
          {["password", "confirmPassword"].map((fieldName) => (
            <div key={fieldName}>
              <label className="text-sm font-medium mb-1.5 block">{fieldName === "password" ? "Password" : "Confirm Password"}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input {...register(fieldName as "password" | "confirmPassword")} type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 bg-background border border-input rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                {fieldName === "confirmPassword" && (
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {errors[fieldName as "password" | "confirmPassword"] && (
                <p className="text-destructive text-xs mt-1">{errors[fieldName as "password" | "confirmPassword"]?.message}</p>
              )}
            </div>
          ))}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-blue-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Account — Free
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
