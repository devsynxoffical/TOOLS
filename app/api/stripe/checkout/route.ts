import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isMockMode } from "@/lib/config";
import { getAppBaseUrl, isStripeConfigured } from "@/lib/config/site";
import { mockId, mockStore } from "@/lib/mock/store";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const toolId = body?.toolId as string | undefined;
  if (!toolId) {
    return NextResponse.json({ error: "toolId is required" }, { status: 400 });
  }

  let tool: {
    id: string;
    name: string;
    slug: string;
    pricePkr: number;
    accessDurationDays: number;
    active: boolean;
  };

  if (isMockMode()) {
    const found = mockStore.tools.find((t) => t.id === toolId);
    if (!found || !found.active) {
      return NextResponse.json({ error: "Tool not available" }, { status: 404 });
    }
    tool = found;
  } else {
    const found = await prisma.tool.findUnique({ where: { id: toolId } });
    if (!found || !found.active) {
      return NextResponse.json({ error: "Tool not available" }, { status: 404 });
    }
    tool = found;
  }

  const pendingFilter = {
    userId: session.user.id,
    toolId,
    status: "PENDING" as const,
  };

  if (isMockMode()) {
    const pending = mockStore.paymentOrders.find(
      (o) =>
        o.userId === session.user.id &&
        o.toolId === toolId &&
        o.status === "PENDING"
    );
    if (pending) {
      return NextResponse.json(
        { error: "You already have a pending payment for this tool" },
        { status: 409 }
      );
    }
  } else {
    const pending = await prisma.paymentOrder.findFirst({ where: pendingFilter });
    if (pending) {
      return NextResponse.json(
        { error: "You already have a pending payment for this tool" },
        { status: 409 }
      );
    }
  }

  const orderId = isMockMode()
    ? mockId("order")
    : (
        await prisma.paymentOrder.create({
          data: {
            userId: session.user.id,
            toolId,
            amountPkr: tool.pricePkr,
            paymentMethod: "STRIPE",
            status: "PENDING",
          },
        })
      ).id;

  if (isMockMode()) {
    mockStore.paymentOrders.push({
      id: orderId,
      userId: session.user.id,
      toolId,
      amountPkr: tool.pricePkr,
      paymentMethod: "STRIPE",
      bankAccountId: null,
      screenshotUrl: null,
      status: "PENDING",
      userNote: null,
      adminNote: null,
      reviewedAt: null,
      reviewedById: null,
      createdAt: new Date(),
    });
    return NextResponse.json({
      url: `${getAppBaseUrl()}/dashboard/orders?paid=1&mock=1`,
    });
  }

  const stripe = getStripe();
  const baseUrl = getAppBaseUrl();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: session.user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "pkr",
          unit_amount: tool.pricePkr,
          product_data: {
            name: tool.name,
            description: `${tool.accessDurationDays} days access`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId,
      userId: session.user.id,
      toolId,
    },
    success_url: `${baseUrl}/dashboard/orders?paid=1&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/buy/${tool.slug}?canceled=1`,
  });

  await prisma.paymentOrder.update({
    where: { id: orderId },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
