import dynamic from "next/dynamic";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { isMockMode } from "@/lib/config";

const AuthForm = dynamic(() => import("@/components/auth/AuthFormClient"), {
  ssr: false,
  loading: () => (
    <div className="auth-card animate-pulse p-8 sm:p-10">
      <div className="h-8 w-40 rounded-lg bg-neutral-200" />
      <div className="mt-6 space-y-4">
        <div className="h-10 rounded-lg bg-neutral-100" />
        <div className="h-10 rounded-lg bg-neutral-100" />
        <div className="h-11 rounded-lg bg-neutral-200" />
      </div>
    </div>
  ),
});

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to see your tools and subscription."
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
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
