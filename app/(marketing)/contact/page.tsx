"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-semibold text-neutral-800">Contact us</h1>
      <p className="mt-4 text-neutral-600">
        Have a question about plans, billing, or tool access? We&apos;re here to
        help.
      </p>

      {submitted ? (
        <div className="mt-10 rounded-xl border border-accent-500/20 bg-accent-500/10 p-6">
          <p className="font-medium text-accent-600">
            Thanks for reaching out! We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-neutral-800"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-lg border border-neutral-200 bg-neutral-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-neutral-800"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-neutral-200 bg-neutral-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1.5 block text-sm font-medium text-neutral-800"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full rounded-lg border border-neutral-200 bg-neutral-0 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-primary-500 px-6 py-2.5 text-sm font-medium text-neutral-0 hover:bg-primary-600"
          >
            Send message
          </button>
        </form>
      )}
    </div>
  );
}
