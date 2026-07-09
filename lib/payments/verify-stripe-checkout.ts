import { isMockMode } from "@/lib/config";
import { isStripeConfigured } from "@/lib/config/site";
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
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.metadata?.userId !== userId) {
    return { fulfilled: false };
  }

  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return { fulfilled: false };
  }

  if (session.payment_status !== "paid") {
    return { fulfilled: false };
  }

  await fulfillStripePaymentOrder(orderId);
  return { fulfilled: true };
}
