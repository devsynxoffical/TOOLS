"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  openToolUrl,
  useIsMobileBrowser,
} from "@/lib/browser";
import { useRankmoraExtension } from "@/components/dashboard/ExtensionInstallPanel";

type LaunchToolButtonProps = {
  slug: string;
  launchMode?: "PROXY" | "EXTENSION" | "DIRECT";
};

export function LaunchToolButton({ slug, launchMode }: LaunchToolButtonProps) {
  const { extensionReady } = useRankmoraExtension();
  const isMobile = useIsMobileBrowser();
  const [domExtFlag, setDomExtFlag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const extensionConnected = extensionReady || domExtFlag;
  const needsExtension = launchMode === "EXTENSION";

  useEffect(() => {
    if (document.documentElement.dataset.rankmoraExt === "1") {
      setDomExtFlag(true);
    }
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || data.source !== "rankmora-extension") return;
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
        if (isMobile) {
          setError(
            "This tool needs desktop Chrome with the Rankmora launcher. Phone browsers cannot install extensions."
          );
          setLoading(false);
          return;
        }

        if (!extensionConnected) {
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
        setTimeout(() => setLoading(false), 8000);
        return;
      }

      if (typeof data.launchUrl === "string" && data.launchUrl) {
        openToolUrl(data.launchUrl);
        setLoading(false);
        return;
      }

      openToolUrl(launchPath);
      setLoading(false);
    } catch {
      setError("Unable to launch this tool right now.");
      setLoading(false);
    }
  };

  if (needsExtension && isMobile) {
    return (
      <div className="w-full space-y-2">
        <a
          href="/dashboard/extension"
          className="btn-primary flex w-full justify-center !rounded-lg !py-2.5 text-sm"
        >
          Use on desktop Chrome
        </a>
        <p className="text-center text-[11px] leading-snug text-neutral-500">
          Canva and similar tools need the Rankmora Chrome extension. Open this
          site on a computer, install the launcher once, then Launch.
        </p>
      </div>
    );
  }

  if (needsExtension && !extensionConnected) {
    return (
      <div className="w-full space-y-2">
        <Link
          href="/dashboard/extension"
          className="btn-primary flex w-full justify-center !rounded-lg !py-2.5 text-sm"
        >
          Install launcher extension
        </Link>
        <p className="text-center text-[11px] text-neutral-500">
          One-time download on desktop Chrome · then Launch tool works
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <button
        type="button"
        disabled={loading}
        onClick={handleLaunch}
        className="btn-primary flex w-full items-center justify-center gap-2 !rounded-lg !py-2.5 text-sm shadow-sm disabled:opacity-70"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
        {loading ? "Opening..." : "Launch tool"}
      </button>
      {extensionConnected && needsExtension && (
        <p className="text-center text-[11px] text-accent-600">
          Extension connected
        </p>
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
