"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/pricing?q=${encodeURIComponent(q)}` : "/pricing");
  }

  return (
    <form
      onSubmit={handleSearch}
      className="flex w-full flex-col gap-2 sm:flex-row sm:overflow-hidden sm:rounded-full sm:border sm:border-white/35 sm:bg-white/20 sm:shadow-md sm:backdrop-blur-md"
    >
      <div className="flex flex-1 items-center gap-2 rounded-full border border-white/35 bg-white/95 px-4 shadow-sm backdrop-blur-sm sm:border-0 sm:bg-transparent sm:shadow-none">
        <MaterialIcon name="search" className="shrink-0 text-neutral-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What tool do you want to access?"
          className="w-full min-w-0 border-0 bg-transparent py-3.5 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-0"
        />
      </div>
      <button
        type="submit"
        className="btn-glass-solid w-full shrink-0 !rounded-full sm:!w-auto sm:!px-8"
      >
        Search
      </button>
    </form>
  );
}
