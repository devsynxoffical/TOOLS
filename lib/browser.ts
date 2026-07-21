"use client";

import { useEffect, useState } from "react";

/** True for phones/tablets where Chrome extensions cannot be installed. */
export function detectMobileBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (/Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    return true;
  }
  // iPadOS 13+ reports as Mac; treat touch + no hover as mobile.
  if (
    navigator.platform === "MacIntel" &&
    typeof navigator.maxTouchPoints === "number" &&
    navigator.maxTouchPoints > 1
  ) {
    return true;
  }
  return false;
}

export function useIsMobileBrowser() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(detectMobileBrowser());
  }, []);

  return isMobile;
}

/** Prefer same-tab navigation on mobile — window.open is often blocked. */
export function openToolUrl(url: string) {
  const mobile = detectMobileBrowser();
  if (mobile) {
    window.location.assign(url);
    return;
  }
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) {
    window.location.assign(url);
  }
}
