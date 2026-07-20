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

  const openUrl = data.openUrl || message.openUrl;
  if (!openUrl || !Array.isArray(data.cookies)) {
    throw new Error("Invalid launch payload");
  }

  for (const cookie of data.cookies) {
    await setCookie(openUrl, cookie);
  }

  await chrome.tabs.create({ url: openUrl, active: true });
  return { ok: true };
}

async function setCookie(openUrl, cookie) {
  const base = new URL(openUrl);
  const path = cookie.path || "/";
  const sameSite =
    cookie.sameSite && cookie.sameSite !== "unspecified"
      ? cookie.sameSite
      : undefined;

  const attempts = [];

  if (cookie.domain) {
    const host = cookie.domain.replace(/^\./, "");
    attempts.push({
      url: `https://${host}/`,
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain.startsWith(".") ? cookie.domain : `.${host}`,
      path,
      secure: cookie.secure !== false,
      httpOnly: Boolean(cookie.httpOnly),
      ...(sameSite ? { sameSite } : {}),
    });
  }

  attempts.push({
    url: `${base.origin}/`,
    name: cookie.name,
    value: cookie.value,
    path,
    secure: cookie.secure !== false,
    httpOnly: Boolean(cookie.httpOnly),
    ...(sameSite ? { sameSite } : {}),
  });

  let lastError = null;
  for (const details of attempts) {
    try {
      await chrome.cookies.set(details);
      return;
    } catch (err) {
      lastError = err;
    }
  }
  if (lastError) throw lastError;
}
