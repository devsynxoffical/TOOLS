import { LegalPage } from "@/components/legal/LegalPage";
import { LegalSection } from "@/components/legal/LegalSection";

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      description="Clear refund terms for GroupBuy Tools subscriptions so you know exactly what to expect."
    >
      <LegalSection title="Overview" index={0}>
        <p>
          We want you to be satisfied with GroupBuy Tools. This policy outlines
          our refund terms for new and renewing subscription plans.
        </p>
      </LegalSection>

      <LegalSection title="7-day money-back guarantee" index={1}>
        <p>
          New subscribers may request a full refund within 7 days of their first
          payment if they have not extensively used the tools. &ldquo;Extensive
          use&rdquo; includes launching tools more than a reasonable trial
          amount as determined by our team.
        </p>
      </LegalSection>

      <LegalSection title="Renewals" index={2}>
        <p>
          Subscription renewals are non-refundable. You may cancel at any time to
          prevent future charges; access continues until the end of the current
          billing period.
        </p>
      </LegalSection>

      <LegalSection title="How to request a refund" index={3}>
        <p>
          Contact our support team with your account email and reason for the
          request. Approved refunds are processed to your original payment method
          within 5–10 business days.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
