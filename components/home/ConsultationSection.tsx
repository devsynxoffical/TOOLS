"use client";

import Link from "next/link";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function ConsultationSection() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="bg-neutral-900 py-16 sm:py-20">
      <div className="mx-auto grid max-w-container items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="text-white">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-300">
            Need help choosing?
          </span>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            Get a free consultation about tools &amp; pricing
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-300 sm:text-base">
            Tell us what you need — we&apos;ll recommend the right tools and
            explain how payment and access work on our platform.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Tool recommendations for your niche",
              "Help with bank transfer payments",
              "Agency & team access planning",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-neutral-200">
                <MaterialIcon name="check_circle" className="text-accent-400" filled />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.75rem] bg-white p-6 shadow-2xl sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-500/10 text-accent-500">
                <MaterialIcon name="check_circle" filled className="text-3xl" />
              </div>
              <p className="text-lg font-bold text-neutral-900">Message sent!</p>
              <p className="mt-2 text-sm text-neutral-600">
                We&apos;ll reply within 24 hours. You can also{" "}
                <Link href="/contact" className="font-semibold text-brand-primary">
                  visit the contact page
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold text-neutral-900">
                Send us a message
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Or go to our{" "}
                <Link href="/contact" className="font-semibold text-brand-primary">
                  full contact form
                </Link>
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  className="input-field"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email address"
                  className="input-field"
                />
                <textarea
                  required
                  name="message"
                  rows={4}
                  placeholder="What tools are you looking for?"
                  className="input-field resize-none"
                />
                <button type="submit" className="btn-primary w-full !bg-neutral-900 hover:!bg-brand-primary">
                  Send message
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
