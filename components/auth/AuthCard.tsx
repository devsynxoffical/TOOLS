"use client";

import { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
  className?: string;
};

/** Shared white card used on login, signup, signout, and account screens. */
export function AuthCard({ children, className = "" }: AuthCardProps) {
  return (
    <div className={`auth-card p-8 sm:p-10 ${className}`}>{children}</div>
  );
}
