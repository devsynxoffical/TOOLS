import { MaterialIcon } from "@/components/ui/MaterialIcon";

const benefits = [
  {
    icon: "rocket_launch",
    title: "Quick access",
    description: "Sign up, pay via bank transfer, and get tools after admin verification.",
  },
  {
    icon: "dashboard",
    title: "One dashboard",
    description: "Launch every tool from a single workspace — no password sharing.",
  },
  {
    icon: "verified",
    title: "Trusted platform",
    description: "Encrypted sessions, secure proxy launch, and transparent order history.",
  },
  {
    icon: "support_agent",
    title: "Real support",
    description: "Contact us for billing, tool requests, and access help anytime.",
  },
];

export function BenefitsStrip() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div key={item.title} className="text-center sm:text-left">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-100 text-brand-primary sm:mx-0">
                <MaterialIcon name={item.icon} className="text-2xl" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
