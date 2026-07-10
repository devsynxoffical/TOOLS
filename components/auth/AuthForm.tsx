"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  signupSchema,
  type LoginInput,
  type SignupInput,
} from "@/lib/validations/auth";
import { PasswordField } from "./PasswordField";
import { FormError } from "./FormError";
import { AuthCard } from "./AuthCard";
import { useEffect, useState } from "react";
import { startNavigationProgress } from "@/lib/navigation-progress";

const SUSPENDED_MESSAGE =
  "Your account has been suspended. Please contact support for help.";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const isSignup = mode === "signup";

  useEffect(() => {
    if (searchParams.get("error") === "suspended") {
      setServerError(SUSPENDED_MESSAGE);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput | LoginInput>({
    resolver: zodResolver(isSignup ? signupSchema : loginSchema),
  });

  const isBusy = isSubmitting || isRedirecting;

  const onSubmit = async (data: SignupInput | LoginInput) => {
    setServerError(null);

    if (isSignup) {
      const signupData = data as SignupInput;
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setServerError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password."
          : result.error === "SUSPENDED_ACCOUNT"
            ? SUSPENDED_MESSAGE
            : result.error
      );
      return;
    }

    const callbackUrl = searchParams.get("callbackUrl");
    const sessionRes = await fetch("/api/auth/session");
    const sessionData = await sessionRes.json();
    const isAdmin = sessionData?.user?.role === "ADMIN";

    if (!isSignup && isAdmin) {
      await signOut({ redirect: false });
      setServerError(
        "Administrator accounts must sign in through the admin portal."
      );
      return;
    }

    setIsRedirecting(true);
    startNavigationProgress();

    if (callbackUrl) {
      router.push(callbackUrl);
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  };

  return (
    <AuthCard>
      <h1 className="text-2xl font-extrabold text-collab-dark">
        {isSignup ? "Create account" : "Login"}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        {isSignup
          ? "Sign up to browse tools on the platform."
          : "Sign in to view your tools and subscription."}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        {isSignup && (
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-neutral-800"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Ahmad Safdar"
              className={`input-field ${
                "name" in errors && errors.name ? "input-field-error" : ""
              }`}
              {...register("name" as keyof SignupInput)}
            />
            {"name" in errors && errors.name && (
              <p className="mt-1.5 text-xs text-danger-500">
                {errors.name.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-neutral-800"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@company.com"
            className={`input-field ${errors.email ? "input-field-error" : ""}`}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-danger-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <PasswordField
          id="password"
          label="Password"
          registration={register("password")}
          error={errors.password?.message}
        />

        {isSignup && (
          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            registration={register("confirmPassword" as keyof SignupInput)}
            error={
              "confirmPassword" in errors
                ? errors.confirmPassword?.message
                : undefined
            }
          />
        )}

        <FormError message={serverError ?? undefined} />
        {serverError === SUSPENDED_MESSAGE && (
          <p className="text-center text-sm text-neutral-600">
            <Link
              href="/contact"
              className="font-bold text-collab-dark underline hover:text-collab-dark/70"
            >
              Contact support
            </Link>
          </p>
        )}

        <button
          type="submit"
          disabled={isBusy}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isRedirecting
            ? "Redirecting..."
            : isSubmitting
              ? isSignup
                ? "Creating account..."
                : "Signing in..."
              : isSignup
                ? "Create account"
                : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-600">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-collab-dark transition-colors hover:text-collab-dark/70"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-collab-dark transition-colors hover:text-collab-dark/70"
            >
              Create account
            </Link>
          </>
        )}
      </p>
    </AuthCard>
  );
}
