"use client";

import { useState } from "react";

type LaunchToolButtonProps = {
  slug: string;
};

export function LaunchToolButton({ slug }: LaunchToolButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLaunch = () => {
    setLoading(true);
    window.open(`/api/tools/launch/${slug}`, "_blank", "noopener,noreferrer");
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <button
      type="button"
      disabled={loading}
      onClick={handleLaunch}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 px-4 py-2.5 text-sm font-semibold text-neutral-0 shadow-sm transition-all hover:bg-primary-600 disabled:opacity-70"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
      {loading ? "Opening..." : "Launch tool"}
    </button>
  );
}
