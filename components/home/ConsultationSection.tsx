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
    <section className="relative overflow-hidden bg-gradient-to-br from-[#146BA8] to-[#197CC0] py-16 sm:py-24">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-collab-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-collab-yellow/15 blur-2xl" />

      <div className="relative mx-auto grid max-w-container items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        <div className="text-white">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-collab-yellow">
            Need help choosing?
          </span>
          <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
            To help you choose the right tools, book a free consultation
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70 sm:text-base">
            Tell us what you need — we&apos;ll recommend the right tools and
            explain how payment and access work on our platform.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              "Tool recommendations for your niche",
              "Help with bank transfer payments",
              "Agency & team access planning",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-white/80">
                <MaterialIcon name="check_circle" className="text-collab-yellow" filled />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
          {submitted ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-collab-yellow text-white">
                <MaterialIcon name="check_circle" filled className="text-3xl" />
              </div>
              <p className="text-lg font-extrabold text-collab-dark">Message sent!</p>
              <p className="mt-2 text-sm text-neutral-600">
                We&apos;ll reply within 24 hours. You can also{" "}
                <Link href="/contact" className="font-bold text-collab-dark underline">
                  visit the contact page
                </Link>
                .
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-extrabold text-collab-dark">
                Get consultation
              </h3>
              <p className="mt-2 text-sm text-neutral-600">
                Or go to our{" "}
                <Link href="/contact" className="font-bold text-collab-dark underline">
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
                <button type="submit" className="btn-marketing w-full">
                  Get consultation
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
