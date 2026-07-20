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
    try {
      const res = await fetch(`/api/tools/launch/${slug}`, {
        method: "GET",
        redirect: "manual",
        credentials: "same-origin",
      });

      // Successful launch redirects to the session service /go URL.
      if (res.status >= 300 && res.status < 400) {
        const location = res.headers.get("location");
        if (location) {
          window.open(location, "_blank", "noopener,noreferrer");
          return;
        }
      }

      if (res.ok) {
        // Some environments may follow redirects; open final URL.
        window.open(res.url || `/api/tools/launch/${slug}`, "_blank", "noopener,noreferrer");
        return;
      }

      const data = await res.json().catch(() => ({}));
      setError(
        typeof data.error === "string"
          ? data.error
          : "Unable to launch this tool right now."
      );
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
