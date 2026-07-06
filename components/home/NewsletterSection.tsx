"use client";

import { useState } from "react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setDone(true);
  }

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-10">
        <div className="rounded-[2rem] bg-gradient-brand px-6 py-10 text-center text-white shadow-glow sm:px-12 sm:py-12">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Stay updated on new tools &amp; deals
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-primary-100 sm:text-base">
            Get notified when we add new SEO tools or run special group-buy
            pricing.
          </p>

          {done ? (
            <p className="mt-6 font-semibold text-white">
              Thanks — you&apos;re on the list!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-xl border-0 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <button
                type="submit"
                className="rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
