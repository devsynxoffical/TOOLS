import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function AccountSuspendedPage() {
  return (
    <AuthLayout
      title="Account suspended"
      subtitle="Your access has been paused. Contact support if you believe this is a mistake."
    >
      <AuthCard className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-danger-500/10 text-danger-500">
          <MaterialIcon name="block" className="text-3xl" />
        </div>
        <h1 className="text-xl font-extrabold text-collab-dark">Account suspended</h1>
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
            className="text-sm font-bold text-neutral-500 hover:text-collab-dark"
          >
            Back to homepage
          </Link>
        </div>
      </AuthCard>
    </AuthLayout>
  );
}
