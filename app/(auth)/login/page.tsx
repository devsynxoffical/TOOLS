import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { isMockMode } from "@/lib/config";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Your SEO toolkit awaits"
      subtitle="Sign in to access Ahrefs, Semrush, Moz, and dozens more — all from one beautiful dashboard."
    >
      {isMockMode() && (
        <div className="mb-6 rounded-xl border border-primary-200/60 bg-primary-50/80 px-4 py-3.5 text-sm text-primary-700 backdrop-blur-sm">
          <p className="font-semibold">Demo accounts (no DB required)</p>
          <p className="mt-1.5 text-primary-600">
            User: <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs">user@demo.com</code> / <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs">demo1234</code>
          </p>
          <p className="text-primary-600">
            Admin: <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs">admin@demo.com</code> / <code className="rounded bg-primary-100 px-1.5 py-0.5 text-xs">demo1234</code>
          </p>
        </div>
      )}
      <Suspense fallback={null}>
        <AuthForm mode="login" />
      </Suspense>
    </AuthLayout>
  );
}
