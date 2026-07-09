import { isMockMode } from "@/lib/config";
import { isStripeConfigured } from "@/lib/config/site";
import { fulfillStripePlanPurchase } from "@/lib/payments/activate-plan";
import { fulfillStripePaymentOrder } from "@/lib/payments/grant-access";
import { getStripe } from "@/lib/stripe";

export async function verifyStripeCheckoutSession(
  sessionId: string,
  userId: string
): Promise<{ fulfilled: boolean }> {
  if (!isStripeConfigured() || isMockMode()) {
    return { fulfilled: false };
  }

  const stripe = getStripe();
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (checkoutSession.metadata?.userId !== userId) {
    return { fulfilled: false };
  }

  if (checkoutSession.payment_status !== "paid") {
    return { fulfilled: false };
  }

  const type = checkoutSession.metadata?.type ?? "tool";

  if (type === "plan") {
    const planId = checkoutSession.metadata?.planId;
    if (!planId) return { fulfilled: false };
    await fulfillStripePlanPurchase(userId, planId);
    return { fulfilled: true };
  }

  const orderId = checkoutSession.metadata?.orderId;
  if (!orderId) return { fulfilled: false };

  await fulfillStripePaymentOrder(orderId);
  return { fulfilled: true };
}
