import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import connectDB from "@/lib/mongodb";
import { User, Subscription } from "@/lib/models";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, sig);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId) break;

        await User.findByIdAndUpdate(userId, {
          plan: "pro",
          credits: 500,
          stripeSubscriptionId: session.subscription,
        });

        if (session.subscription) {
          const { stripe } = await import("@/lib/stripe");
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          await Subscription.create({
            userId,
            stripeSubscriptionId: sub.id,
            stripeCustomerId: sub.customer as string,
            stripePriceId: sub.items.data[0].price.id,
            status: sub.status,
            plan: "pro",
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          });
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          // Refresh credits monthly
          await User.findByIdAndUpdate(user._id, { credits: 500 });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          {
            status: sub.status,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          }
        );
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const subscription = await Subscription.findOne({ stripeSubscriptionId: sub.id });
        if (subscription) {
          await User.findByIdAndUpdate(subscription.userId, {
            plan: "free",
            credits: 10,
            stripeSubscriptionId: undefined,
          });
          await Subscription.findOneAndUpdate({ stripeSubscriptionId: sub.id }, { status: "canceled" });
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

export const config = { api: { bodyParser: false } };
