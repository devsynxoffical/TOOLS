"use client";

import { useState } from "react";

type LaunchToolButtonProps = {
  slug: string;
};

export function LaunchToolButton({ slug }: LaunchToolButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);
    const launchPath = `/api/tools/launch/${encodeURIComponent(slug)}`;

    try {
      // Ask the API for JSON so we can show real errors. On success it returns
      // { launchUrl } instead of a redirect (browsers hide cross-origin Location).
      const res = await fetch(`${launchPath}?format=json`, {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Unable to launch this tool right now."
        );
        return;
      }

      if (typeof data.launchUrl === "string" && data.launchUrl) {
        window.open(data.launchUrl, "_blank", "noopener,noreferrer");
        return;
      }

      // Fallback: let the browser follow the normal redirect flow.
      window.open(launchPath, "_blank", "noopener,noreferrer");
    } catch {
      setError("Unable to launch this tool right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        disabled={loading}
        onClick={handleLaunch}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-collab-dark px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-neutral-800 disabled:opacity-70"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
        {loading ? "Opening..." : "Launch tool"}
      </button>
      {error && (
        <p className="text-center text-xs text-danger-500">{error}</p>
      )}
    </div>
  );
}
