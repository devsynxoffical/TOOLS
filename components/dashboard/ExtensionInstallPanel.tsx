"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { useIsMobileBrowser } from "@/lib/browser";

const CHROME_EXTENSIONS_URL = "chrome://extensions";

export function useRankmoraExtension() {
  const [ready, setReady] = useState(false);

  const ping = useCallback(() => {
    if (document.documentElement.dataset.rankmoraExt === "1") {
      setReady(true);
    }
    window.postMessage(
      { source: "rankmora-dashboard", type: "RANKMORA_EXTENSION_PING" },
      "*"
    );
  }, []);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window) return;
      const data = event.data;
      if (!data || data.source !== "rankmora-extension") return;
      if (data.type === "RANKMORA_EXTENSION_READY") {
        setReady(true);
      }
    };
    window.addEventListener("message", onMessage);
    ping();
    return () => window.removeEventListener("message", onMessage);
  }, [ping]);

  return { extensionReady: ready, pingExtension: ping };
}

type ExtensionInstallPanelProps = {
  compact?: boolean;
};

export function ExtensionInstallPanel({ compact }: ExtensionInstallPanelProps) {
  const { extensionReady, pingExtension } = useRankmoraExtension();
  const isMobile = useIsMobileBrowser();
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const storeUrl = process.env.NEXT_PUBLIC_CHROME_EXTENSION_STORE_URL?.trim();

  const download = () => {
    window.location.href = "/api/tools/extension/download";
  };

  const copyExtensionsLink = async () => {
    try {
      await navigator.clipboard.writeText(CHROME_EXTENSIONS_URL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const copyDashboardLink = async () => {
    try {
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}/dashboard/extension`
          : "https://rankmora.io/dashboard/extension";
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      setLinkCopied(false);
    }
  };

  if (isMobile) {
    return (
      <div className={compact ? "space-y-4" : "mx-auto max-w-2xl space-y-6"}>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5">
          <div className="flex items-start gap-3">
            <MaterialIcon
              name="install_desktop"
              className="text-2xl text-amber-700"
            />
            <div>
              <p className="text-sm font-bold text-neutral-900">
                Desktop Chrome required
              </p>
              <p className="mt-1 text-sm text-neutral-600">
                Phone and tablet browsers cannot install Chrome extensions. Canva,
                Grammarly, Quillbot and similar tools only auto-login on a computer.
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-panel-modern space-y-3 p-5">
          <p className="text-sm font-bold text-neutral-900">How to use on mobile</p>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-neutral-600">
            <li>Open Rankmora on a laptop or desktop (Chrome).</li>
            <li>Install the Rankmora Tool Launcher once.</li>
            <li>Click Launch tool — you stay logged into Canva on that computer.</li>
            <li>
              SEO tools (Semrush, Moz, etc.) still work from this phone via Launch —
              they do not need the extension.
            </li>
          </ol>
          <button
            type="button"
            onClick={() => void copyDashboardLink()}
            className="btn-primary mt-2 flex w-full justify-center !rounded-lg !py-2.5 text-sm"
          >
            {linkCopied ? "Link copied" : "Copy install link for your computer"}
          </button>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex w-full justify-center text-sm font-bold text-collab-dark hover:underline"
        >
          ← Back to tools
        </Link>
      </div>
    );
  }

  const steps = [
    {
      n: 1,
      title: "Download the extension",
      body: "Click the button below. Chrome saves rankmora-tool-launcher.zip to your Downloads folder.",
      action: (
        <button
          type="button"
          onClick={download}
          className="inline-flex items-center gap-2 rounded-lg bg-collab-dark px-4 py-2.5 text-sm font-bold text-white hover:bg-neutral-800"
        >
          <MaterialIcon name="download" />
          Download for Chrome
        </button>
      ),
    },
    {
      n: 2,
      title: "Unzip the file",
      body: 'Double-click the ZIP and open the folder named "rankmora-launcher". Keep this folder — do not delete it after install.',
    },
    {
      n: 3,
      title: "Open Chrome extensions",
      body: "Copy the link below, paste it into Chrome’s address bar, and press Enter. Turn on Developer mode (top-right).",
      action: (
        <button
          type="button"
          onClick={() => void copyExtensionsLink()}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-bold text-neutral-800 hover:bg-neutral-50"
        >
          <MaterialIcon name="content_copy" />
          {copied ? "Copied chrome://extensions" : "Copy chrome://extensions"}
        </button>
      ),
    },
    {
      n: 4,
      title: "Load unpacked",
      body: 'Click "Load unpacked", choose the rankmora-launcher folder from step 2, then pin the extension if you like.',
    },
    {
      n: 5,
      title: "Return here and refresh",
      body: "Reload this page or click Check connection. Then Launch tool on Canva and similar tools will work.",
      action: (
        <button
          type="button"
          onClick={() => {
            pingExtension();
            window.location.reload();
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-collab-yellow px-4 py-2 text-sm font-bold text-collab-dark hover:brightness-95"
        >
          <MaterialIcon name="refresh" />
          Check connection
        </button>
      ),
    },
  ];

  return (
    <div className={compact ? "space-y-4" : "mx-auto max-w-2xl space-y-6"}>
      <div
        className={`rounded-xl border px-4 py-4 ${
          extensionReady
            ? "border-emerald-200 bg-emerald-50"
            : "border-amber-200 bg-amber-50"
        }`}
      >
        <div className="flex items-start gap-3">
          <MaterialIcon
            name={extensionReady ? "check_circle" : "extension"}
            className={`text-2xl ${extensionReady ? "text-emerald-600" : "text-amber-700"}`}
          />
          <div>
            <p className="text-sm font-bold text-neutral-900">
              {extensionReady
                ? "Extension connected"
                : "Extension not detected yet"}
            </p>
            <p className="mt-1 text-xs text-neutral-600">
              {extensionReady
                ? "You can use Launch tool on Canva, Grammarly, Quillbot, and other browser-extension tools."
                : "One-time setup on this computer takes about a minute. Phones are not supported for these tools."}
            </p>
          </div>
        </div>
      </div>

      {storeUrl && (
        <a
          href={storeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-collab-dark px-4 py-3 text-sm font-bold text-white hover:bg-neutral-800"
        >
          <MaterialIcon name="install_desktop" />
          Install from Chrome Web Store
        </a>
      )}

      {!extensionReady && (
        <ol className="space-y-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="dashboard-panel-modern flex gap-4 p-4 sm:p-5"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-collab-dark text-sm font-bold text-collab-yellow">
                {step.n}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-neutral-900">{step.title}</p>
                <p className="mt-1 text-sm text-neutral-600">{step.body}</p>
                {step.action && <div className="mt-3">{step.action}</div>}
              </div>
            </li>
          ))}
        </ol>
      )}

      {extensionReady && !compact && (
        <Link
          href="/dashboard"
          className="btn-primary inline-flex w-full justify-center !py-3 text-sm"
        >
          Back to tools
        </Link>
      )}

      <p className="text-center text-[11px] text-neutral-400">
        Chrome requires a manual load for extensions outside the Web Store.
        Download + Load unpacked is the standard way until Rankmora is listed on
        the store.
      </p>
    </div>
  );
}
