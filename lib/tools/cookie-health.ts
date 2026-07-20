export type CookieHealthResult = {
  healthStatus: "ALIVE" | "EXPIRED" | "UNKNOWN";
  message: string;
};

const LOGIN_PATH =
  /\/(login|signin|sign-in|auth|authenticate|session\/new|accounts\/login)(\/|\?|$)/i;
const LOGIN_BODY =
  /(sign\s*in|log\s*in|password|forgot\s*password|create\s*account)/i;

function classifyByUrl(url: string): "EXPIRED" | null {
  try {
    const parsed = new URL(url);
    if (LOGIN_PATH.test(parsed.pathname)) return "EXPIRED";
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Probe a tool launch URL with stored session cookies.
 * Never logs cookie values. Network/ambiguous outcomes stay UNKNOWN.
 */
export async function probeCookieSession(params: {
  launchUrl: string;
  cookieHeader: string;
  timeoutMs?: number;
  maxRedirects?: number;
}): Promise<CookieHealthResult> {
  const timeoutMs = params.timeoutMs ?? 12_000;
  const maxRedirects = params.maxRedirects ?? 3;
  let current = params.launchUrl;

  try {
    for (let hop = 0; hop <= maxRedirects; hop++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      let res: Response;
      try {
        res = await fetch(current, {
          method: "GET",
          redirect: "manual",
          headers: {
            Cookie: params.cookieHeader,
            Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
            "User-Agent":
              "GroupBuySessionHealthCheck/1.0 (+https://rankmora.io)",
          },
          signal: controller.signal,
          cache: "no-store",
        });
      } finally {
        clearTimeout(timer);
      }

      if ([301, 302, 303, 307, 308].includes(res.status)) {
        const location = res.headers.get("location");
        if (!location) {
          return {
            healthStatus: "UNKNOWN",
            message: "Redirect without Location header",
          };
        }
        const next = new URL(location, current).toString();
        if (classifyByUrl(next) === "EXPIRED") {
          return {
            healthStatus: "EXPIRED",
            message: "Redirected to a login page",
          };
        }
        current = next;
        continue;
      }

      if (res.status === 401 || res.status === 403) {
        return {
          healthStatus: "EXPIRED",
          message: `Upstream returned HTTP ${res.status}`,
        };
      }

      if (res.status >= 200 && res.status < 300) {
        if (classifyByUrl(res.url || current) === "EXPIRED") {
          return {
            healthStatus: "EXPIRED",
            message: "Landed on a login URL",
          };
        }
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("text/html")) {
          const text = (await res.text()).slice(0, 50_000);
          const looksLikeLogin =
            LOGIN_BODY.test(text) &&
            (LOGIN_PATH.test(new URL(current).pathname) ||
              /type=["']password["']/i.test(text));
          if (looksLikeLogin) {
            return {
              healthStatus: "EXPIRED",
              message: "Response looks like a login page",
            };
          }
        }
        return {
          healthStatus: "ALIVE",
          message: "Session appears authenticated",
        };
      }

      return {
        healthStatus: "UNKNOWN",
        message: `Unexpected HTTP ${res.status}`,
      };
    }

    return {
      healthStatus: "UNKNOWN",
      message: "Too many redirects while probing session",
    };
  } catch (err) {
    const detail =
      err instanceof Error
        ? err.name === "AbortError"
          ? "Probe timed out"
          : err.message
        : "Network error";
    return { healthStatus: "UNKNOWN", message: detail };
  }
}
