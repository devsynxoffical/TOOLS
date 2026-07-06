import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignOutButton } from "@/components/auth/SignOutButton";

export default function AccountSuspendedPage() {
  return (
    <AuthLayout
      title="Account suspended"
      subtitle="Your access has been paused. If you believe this is a mistake, our support team can help."
    >
      <div className="glass-card p-8 text-center sm:p-10">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-danger-500/10 text-danger-500">
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-xl font-bold text-neutral-900">Account suspended</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Your account has been suspended. Contact support to restore access or
          discuss your subscription.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/contact" className="btn-primary w-full">
            Contact support
          </Link>
          <SignOutButton className="btn-secondary w-full" label="Sign out" />
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 hover:text-primary-600"
          >
            Back to homepage
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
