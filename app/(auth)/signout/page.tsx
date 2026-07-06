"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function SignOutPage() {
  return (
    <div className="mesh-gradient-bg flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="w-full max-w-md rounded-2xl border border-neutral-200/60 bg-white/90 p-8 text-center shadow-[0_20px_40px_-12px_rgba(70,72,212,0.15)] backdrop-blur-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-brand-primary">
          <MaterialIcon name="logout" className="text-3xl" />
        </div>

        <h1 className="text-2xl font-bold text-neutral-800">Sign out</h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Are you sure you want to sign out of your account? You&apos;ll need to
          log in again to access your tools and dashboard.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="btn-secondary w-full sm:w-auto"
          >
            Stay signed in
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="btn-primary w-full sm:w-auto"
          >
            Sign out
          </button>
        </div>
      </div>

      <p className="mt-8 text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} GroupBuy Tools
      </p>
    </div>
  );
}
