"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/home/PageHero";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="bg-white pb-20">
      <PageHero
        eyebrow="Contact"
        title="We're here to help"
        description="Questions about plans, billing, or tool access? Send us a message and we'll respond within 24 hours."
      />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-10">
        <div className="rounded-[1.75rem] border border-neutral-200/80 bg-white p-6 shadow-card sm:p-8">
          {submitted ? (
            <div className="py-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/10 text-accent-500">
                <MaterialIcon name="check_circle" filled className="text-3xl" />
              </div>
              <p className="text-lg font-bold text-neutral-900">
                Thanks for reaching out!
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                We&apos;ll get back to you within 24 hours.
              </p>
              <Link href="/" className="btn-secondary mt-6 inline-flex">
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-neutral-800">
                  Name
                </label>
                <input id="name" name="name" required className="input-field" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-neutral-800">
                  Email
                </label>
                <input id="email" name="email" type="email" required className="input-field" />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-neutral-800">
                  Message
                </label>
                <textarea id="message" name="message" rows={5} required className="input-field resize-none" />
              </div>
              <button type="submit" className="btn-primary w-full">
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
