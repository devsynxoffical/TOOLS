"use client";

import Link from "next/link";
import { useRankmoraExtension } from "@/components/dashboard/ExtensionInstallPanel";
import { useIsMobileBrowser } from "@/lib/browser";

export function ExtensionSetupBanner() {
  const { extensionReady } = useRankmoraExtension();
  const isMobile = useIsMobileBrowser();

  if (extensionReady) return null;

  if (isMobile) {
    return (
      <div className="dashboard-panel-modern mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-collab-yellow/20 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-neutral-900">
              Canva &amp; similar tools: use desktop Chrome
            </p>
            <p className="mt-0.5 text-xs text-neutral-600">
              Phone browsers cannot install the Rankmora launcher. SEO tools
              (Semrush, Moz, …) still launch from this phone. For Canva, open
              Rankmora on a computer.
            </p>
          </div>
          <Link
            href="/dashboard/extension"
            className="btn-primary shrink-0 text-center !px-5 !py-2.5 text-sm"
          >
            How it works
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-panel-modern mb-6 border-amber-200 bg-gradient-to-r from-amber-50 to-collab-yellow/20 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-neutral-900">
            Install the Rankmora launcher (one-time)
          </p>
          <p className="mt-0.5 text-xs text-neutral-600">
            Required for Canva and other extension-based tools. Download ZIP →
            load in Chrome → launch from your dashboard.
          </p>
        </div>
        <Link
          href="/dashboard/extension"
          className="btn-primary shrink-0 text-center !px-5 !py-2.5 text-sm"
        >
          Download &amp; install
        </Link>
      </div>
    </div>
  );
}
