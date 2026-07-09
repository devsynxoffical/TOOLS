import { NextResponse } from "next/server";
import Stripe from "stripe";
import { isStripeConfigured } from "@/lib/config/site";
import { fulfillStripePaymentOrder } from "@/lib/payments/grant-access";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function handleCompletedSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  if (session.payment_status !== "paid") return;

  await fulfillStripePaymentOrder(orderId);
}

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook configuration" }, { status: 400 });
  }

  const body = await req.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    await handleCompletedSession(event.data.object as Stripe.Checkout.Session);
  }

  if (event.type === "checkout.session.async_payment_succeeded") {
    await handleCompletedSession(event.data.object as Stripe.Checkout.Session);
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.paymentOrder.updateMany({
        where: { id: orderId, status: "PENDING", paymentMethod: "STRIPE" },
        data: { status: "REJECTED", adminNote: "Stripe checkout expired" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
