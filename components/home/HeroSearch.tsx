"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const quickTags = [
  "Semrush",
  "Moz Pro",
  "SpyFu",
  "Majestic",
  "KWFinder",
  "QuillBot",
];

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/pricing?q=${encodeURIComponent(q)}` : "/pricing");
  }

  return (
    <div className="w-full max-w-xl">
      <form
        onSubmit={handleSearch}
        className="flex overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-card"
      >
        <div className="flex flex-1 items-center gap-2 px-4">
          <MaterialIcon name="search" className="text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search SEO tools..."
            className="w-full border-0 bg-transparent py-4 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
          />
        </div>
        <button type="submit" className="btn-primary !rounded-none !rounded-r-2xl !px-6">
          Search
        </button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => router.push(`/pricing?q=${encodeURIComponent(tag)}`)}
            className="rounded-full border border-neutral-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-brand-primary"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
