"use client";

import { useEffect, useState } from "react";

type LaunchToolButtonProps = {
  slug: string;
};

export function LaunchToolButton({ slug }: LaunchToolButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [extensionReady, setExtensionReady] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || data.source !== "rankmora-extension") return;
      if (data.type === "RANKMORA_EXTENSION_READY") {
        setExtensionReady(true);
      }
      if (data.type === "RANKMORA_EXTENSION_RESULT") {
        if (data.ok) {
          const stats =
            typeof data.cookiesSet === "number" &&
            typeof data.cookiesTotal === "number"
              ? ` Applied ${data.cookiesSet}/${data.cookiesTotal} session cookies.`
              : "";
          const warn =
            typeof data.warning === "string" && data.warning.trim()
              ? data.warning
              : "";
          setInfo(
            `Opened in a new tab via the Rankmora extension.${stats}${warn}`
          );
          setError(null);
        } else {
          setError(
            typeof data.error === "string"
              ? data.error
              : "Extension launch failed. Reinstall the Rankmora Tool Launcher."
          );
        }
        setLoading(false);
      }
    };
    window.addEventListener("message", onMessage);
    // Ping in case the content script already loaded.
    window.postMessage(
      { source: "rankmora-dashboard", type: "RANKMORA_EXTENSION_PING" },
      "*"
    );
    if (document.documentElement.dataset.rankmoraExt === "1") {
      setExtensionReady(true);
    }
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const handleLaunch = async () => {
    setLoading(true);
    setError(null);
    setInfo(null);
    const launchPath = `/api/tools/launch/${encodeURIComponent(slug)}`;

    try {
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
        setLoading(false);
        return;
      }

      if (data.mode === "EXTENSION") {
        if (!extensionReady && document.documentElement.dataset.rankmoraExt !== "1") {
          setError(
            "Install the Rankmora Tool Launcher Chrome extension first (Admin can share the install zip), then click Launch again."
          );
          setLoading(false);
          return;
        }

        const claimUrl = `${window.location.origin}/api/tools/extension/claim`;
        window.postMessage(
          {
            source: "rankmora-dashboard",
            type: "RANKMORA_EXTENSION_LAUNCH",
            claimToken: data.claimToken,
            claimUrl,
            openUrl: data.openUrl,
          },
          "*"
        );
        // Result comes back via RANKMORA_EXTENSION_RESULT; keep loading briefly.
        setTimeout(() => setLoading(false), 8000);
        return;
      }

      if (typeof data.launchUrl === "string" && data.launchUrl) {
        window.open(data.launchUrl, "_blank", "noopener,noreferrer");
        setLoading(false);
        return;
      }

      window.open(launchPath, "_blank", "noopener,noreferrer");
      setLoading(false);
    } catch {
      setError("Unable to launch this tool right now.");
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
      {extensionReady && (
        <p className="text-center text-[11px] text-accent-600">Extension connected</p>
      )}
      {info && (
        <p className="text-center text-xs text-accent-600">{info}</p>
      )}
      {error && (
        <p className="text-center text-xs text-danger-500">{error}</p>
      )}
    </div>
  );
}
