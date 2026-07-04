"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useProfile, useCheckout, useBillingPortal, useCancelSubscription } from "@/hooks";
import { Card, CardHeader, CardTitle, CardContent, Badge, Modal } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Zap, CheckCircle, Crown, CreditCard, XCircle, RefreshCw, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { PLANS } from "@/types";

export default function BillingPage() {
  const { data: session } = useSession();
  const { data: profile } = useProfile();
  const searchParams = useSearchParams();
  const checkout = useCheckout();
  const portal = useBillingPortal();
  const cancel = useCancelSubscription();
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("🎉 Welcome to Pro! Your credits have been added.");
    }
    if (searchParams.get("canceled") === "true") {
      toast.info("Checkout canceled.");
    }
  }, [searchParams]);

  const isPro = session?.user?.plan === "pro";

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Billing & Subscription</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your plan and payment details</p>
      </div>

      {/* Current Plan */}
      <Card className="overflow-hidden">
        <div className={`h-2 ${isPro ? "bg-gradient-to-r from-violet-600 to-blue-500" : "bg-muted"}`} />
        <CardContent className="pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPro ? "bg-gradient-to-br from-violet-600 to-blue-500" : "bg-muted"}`}>
                {isPro ? <Crown className="w-6 h-6 text-white" /> : <Zap className="w-6 h-6 text-muted-foreground" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-lg">{isPro ? "Pro Plan" : "Free Plan"}</h2>
                  <Badge variant={isPro ? "pro" : "secondary"}>{isPro ? "ACTIVE" : "FREE"}</Badge>
                </div>
                <p className="text-muted-foreground text-sm">{isPro ? "$29/month · 500 credits" : "Free · 10 credits/month"}</p>
                {profile?.stripeSubscriptionId && (
                  <p className="text-xs text-muted-foreground mt-1">Renews {formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}</p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {isPro ? (
                <>
                  <Button variant="outline" size="sm" loading={portal.isPending} onClick={() => portal.mutate()}>
                    <CreditCard className="w-4 h-4" /> Manage Billing
                  </Button>
                  <button onClick={() => setShowCancelModal(true)} className="text-xs text-destructive hover:underline text-center">Cancel Plan</button>
                </>
              ) : (
                <Button size="sm" loading={checkout.isPending} onClick={() => checkout.mutate()}>
                  <Crown className="w-4 h-4" /> Upgrade to Pro
                </Button>
              )}
            </div>
          </div>

          {/* Credits Bar */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Credits This Month</span>
              <span className="text-muted-foreground">{session?.user?.credits ?? 0} remaining</span>
            </div>
            <div className="w-full bg-background rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-500"
                style={{ width: `${((session?.user?.credits ?? 0) / (isPro ? 500 : 10)) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Credits refresh automatically on the 1st of each month.</p>
          </div>
        </CardContent>
      </Card>

      {/* Plans Comparison */}
      <div className="grid md:grid-cols-2 gap-4">
        {(["free", "pro"] as const).map((planKey) => {
          const plan = PLANS[planKey];
          const isCurrentPlan = session?.user?.plan === planKey;
          return (
            <Card key={planKey} className={`overflow-hidden transition-all ${isCurrentPlan ? "ring-2 ring-primary" : ""}`}>
              {isCurrentPlan && <div className="h-1 bg-gradient-to-r from-violet-600 to-blue-500" />}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrentPlan && <Badge variant="pro">Current</Badge>}
                </div>
                <p className="text-3xl font-extrabold mt-2">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                  {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${isCurrentPlan ? "text-primary" : "text-green-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                {!isCurrentPlan && planKey === "pro" && (
                  <Button className="w-full mt-6" loading={checkout.isPending} onClick={() => checkout.mutate()}>
                    <Crown className="w-4 h-4" /> Upgrade Now
                  </Button>
                )}
                {!isCurrentPlan && planKey === "free" && (
                  <button onClick={() => setShowCancelModal(true)} className="w-full mt-6 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Downgrade to Free
                  </button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader><CardTitle>Billing FAQ</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { q: "When do my credits refresh?", a: "Credits refresh on the 1st of every month automatically." },
              { q: "Can I cancel anytime?", a: "Yes, you can cancel anytime. You'll keep Pro access until the end of your billing period." },
              { q: "What payment methods are accepted?", a: "We accept all major credit cards via Stripe (Visa, Mastercard, Amex)." },
              { q: "Do unused credits roll over?", a: "Credits do not roll over — they reset each billing cycle." },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-border last:border-0 pb-4 last:pb-0">
                <p className="font-medium text-sm mb-1">{q}</p>
                <p className="text-sm text-muted-foreground">{a}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cancel Modal */}
      <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)} title="Cancel Subscription">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm text-amber-800 dark:text-amber-300">Are you sure?</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">You'll lose access to Pro features and 500 credits/month. Your plan will revert to Free at the end of your billing period.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowCancelModal(false)}>Keep Pro</Button>
            <Button variant="destructive" className="flex-1" loading={cancel.isPending}
              onClick={() => { cancel.mutate(); setShowCancelModal(false); }}>
              <XCircle className="w-4 h-4" /> Cancel Plan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
