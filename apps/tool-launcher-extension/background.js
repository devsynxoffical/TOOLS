const CLAIM_FALLBACK = "https://rankmora.io/api/tools/extension/claim";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || message.type !== "LAUNCH") return false;

  handleLaunch(message)
    .then((result) => sendResponse(result))
    .catch((err) =>
      sendResponse({
        ok: false,
        error: err instanceof Error ? err.message : "Launch failed",
      })
    );

  return true;
});

async function handleLaunch(message) {
  const claimUrl = message.claimUrl || CLAIM_FALLBACK;
  const res = await fetch(claimUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: message.claimToken }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Could not claim launch"
    );
  }

  const cookies = Array.isArray(data.cookies) ? data.cookies : [];
  const openUrl = pickOpenUrl(data.openUrl || message.openUrl, cookies);
  if (!openUrl) {
    throw new Error("Invalid launch payload");
  }
  if (cookies.length === 0) {
    throw new Error("No session cookies returned. Admin must re-export cookies.");
  }

  await clearMatchingCookies(openUrl, cookies);

  let cookiesSet = 0;
  const failedNames = [];
  for (const cookie of cookies) {
    if (await setCookie(openUrl, cookie)) {
      cookiesSet += 1;
    } else {
      failedNames.push(cookie.name);
    }
  }

  if (cookiesSet === 0) {
    throw new Error(
      "Chrome rejected all session cookies. Update the Rankmora extension, disable other cookie blockers, and try again."
    );
  }

  await chrome.tabs.create({ url: openUrl, active: true });

  const warn =
    failedNames.length > 0
      ? ` (${failedNames.length} cookie(s) could not be set: ${failedNames.slice(0, 3).join(", ")})`
      : "";

  return {
    ok: true,
    cookiesSet,
    cookiesTotal: cookies.length,
    openUrl,
    warning: warn || undefined,
  };
}

function pickOpenUrl(openUrl, cookies) {
  if (!openUrl) return null;
  let open;
  try {
    open = new URL(openUrl);
  } catch {
    return null;
  }

  const counts = new Map();
  for (const c of cookies) {
    if (typeof c.domain === "string" && c.domain.trim()) {
      const host = c.domain.trim().replace(/^\./, "");
      counts.set(host, (counts.get(host) || 0) + 1);
    }
  }
  if (counts.size === 0) return open.href;

  const [bestHost] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const openHost = open.hostname.toLowerCase();
  const best = bestHost.toLowerCase();
  if (openHost === best || openHost.endsWith(`.${best}`) || best.endsWith(`.${openHost}`)) {
    return open.href;
  }
  return `https://${bestHost}/`;
}

function registrableDomain(hostname) {
  const host = hostname.toLowerCase().replace(/^www\./, "");
  const parts = host.split(".").filter(Boolean);
  if (parts.length <= 2) return host;
  return parts.slice(-2).join(".");
}

function mapSameSite(raw, secure) {
  const v = (raw || "").toLowerCase();
  if (v === "no_restriction" || v === "none") return "no_restriction";
  if (v === "strict") return "strict";
  if (v === "lax") return "lax";
  if (v === "unspecified" || !v) {
    return secure ? "no_restriction" : "lax";
  }
  return secure ? "no_restriction" : "lax";
}

function buildSetAttempts(cookie, openUrl, sameSiteOverride) {
  const open = new URL(openUrl);
  const path =
    cookie.path && String(cookie.path).startsWith("/") ? cookie.path : "/";
  let secure = cookie.secure !== false;
  const httpOnly = Boolean(cookie.httpOnly);
  const sameSite = sameSiteOverride ?? mapSameSite(cookie.sameSite, secure);
  const expirationDate =
    typeof cookie.expirationDate === "number" && cookie.expirationDate > 0
      ? cookie.expirationDate
      : undefined;

  const common = {
    name: cookie.name,
    value: cookie.value,
    path,
    secure,
    httpOnly,
    sameSite,
    ...(expirationDate ? { expirationDate } : {}),
  };

  if (cookie.name.startsWith("__Host-")) {
    return [
      {
        ...common,
        url: `${open.origin}/`,
        path: "/",
        secure: true,
      },
    ];
  }

  if (cookie.name.startsWith("__Secure-")) {
    secure = true;
    common.secure = true;
  }

  const attempts = [];
  const seen = new Set();
  const push = (details) => {
    const key = `${details.url}|${details.domain || ""}|${details.name}|${details.path}`;
    if (seen.has(key)) return;
    seen.add(key);
    attempts.push(details);
  };

  if (typeof cookie.domain === "string" && cookie.domain.trim()) {
    const raw = cookie.domain.trim();
    if (raw.startsWith(".")) {
      const apex = raw.slice(1);
      push({ ...common, url: `https://${apex}/`, domain: raw });
      push({ ...common, url: `https://www.${apex}/`, domain: raw });
    } else {
      push({ ...common, url: `https://${raw}/` });
      const parent = registrableDomain(raw);
      if (parent !== raw) {
        push({
          ...common,
          url: `https://${raw}/`,
          domain: `.${parent}`,
        });
      }
    }
  }

  const rd = registrableDomain(open.hostname);
  push({ ...common, url: `${open.origin}/` });
  push({ ...common, url: `https://${rd}/`, domain: `.${rd}` });
  push({ ...common, url: `https://www.${rd}/`, domain: `.${rd}` });

  return attempts;
}

async function setCookie(openUrl, cookie) {
  if (isExpired(cookie)) return false;

  const secure = cookie.secure !== false;
  const sameSiteTry = [
    mapSameSite(cookie.sameSite, secure),
    "lax",
    "no_restriction",
    "strict",
  ];
  const tried = new Set();

  for (const sameSite of sameSiteTry) {
    if (tried.has(sameSite)) continue;
    tried.add(sameSite);

    const attempts = buildSetAttempts(
      { ...cookie, sameSite },
      openUrl,
      sameSite
    );
    for (const details of attempts) {
      const result = await chrome.cookies.set(details);
      if (result) return true;
    }
  }
  return false;
}

function isExpired(cookie) {
  if (typeof cookie.expirationDate !== "number" || cookie.expirationDate <= 0) {
    return false;
  }
  return cookie.expirationDate * 1000 < Date.now();
}

async function clearMatchingCookies(openUrl, cookies) {
  const urls = new Set();
  try {
    urls.add(`${new URL(openUrl).origin}/`);
  } catch {
    return;
  }
  for (const c of cookies) {
    if (typeof c.domain === "string" && c.domain.trim()) {
      const host = c.domain.trim().replace(/^\./, "");
      urls.add(`https://${host}/`);
    }
  }

  const names = new Set(cookies.map((c) => c.name));
  for (const url of urls) {
    const existing = await chrome.cookies.getAll({ url });
    for (const e of existing) {
      if (!names.has(e.name)) continue;
      await chrome.cookies.remove({
        url,
        name: e.name,
        ...(e.storeId ? { storeId: e.storeId } : {}),
      });
    }
  }
}
