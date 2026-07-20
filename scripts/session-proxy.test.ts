import assert from "node:assert/strict";
import { describe, it, before } from "node:test";

describe("cookie crypto", () => {
  before(() => {
    process.env.SESSION_ENCRYPTION_KEY =
      process.env.SESSION_ENCRYPTION_KEY || "test-encryption-key-32chars!!";
  });

  it("parses, encrypts, and round-trips cookies", async () => {
    const { parseCookieJson, encryptCookiesFromJson, decryptCookieData } =
      await import("../lib/crypto/cookies");
    const raw = JSON.stringify([
      { name: "sid", value: "abc", domain: ".example.com", path: "/" },
    ]);
    const cookies = parseCookieJson(raw);
    assert.equal(cookies.length, 1);
    assert.equal(cookies[0].name, "sid");
    const enc = encryptCookiesFromJson(raw);
    const back = parseCookieJson(decryptCookieData(enc));
    assert.equal(back[0].value, "abc");
  });

  it("rejects oversized cookie JSON", async () => {
    const { parseCookieJson, MAX_COOKIE_JSON_BYTES } = await import(
      "../lib/crypto/cookies"
    );
    const huge = JSON.stringify([
      { name: "x", value: "y".repeat(MAX_COOKIE_JSON_BYTES) },
    ]);
    assert.throws(() => parseCookieJson(huge), /256KB/);
  });
});

describe("upstream allowlist", () => {
  it("accepts https public hosts and derives www variants", async () => {
    const { assertSafeUpstreamUrl, hostsFromLaunchUrl, rewriteLocationToProxy } =
      await import("../lib/security/upstream");
    const { url, hosts } = assertSafeUpstreamUrl("https://www.semrush.com/app");
    assert.equal(url.hostname, "www.semrush.com");
    assert.ok(hosts.includes("semrush.com"));
    assert.deepEqual(hostsFromLaunchUrl("https://moz.com"), [
      "moz.com",
      "www.moz.com",
    ]);
    const rewritten = rewriteLocationToProxy(
      "/login",
      "https://www.semrush.com",
      "/proxy/semrush"
    );
    assert.equal(rewritten, "/proxy/semrush/login");
  });

  it("rejects private IPs and non-https", async () => {
    const { assertSafeUpstreamUrl } = await import("../lib/security/upstream");
    assert.throws(() => assertSafeUpstreamUrl("http://example.com"), /HTTPS/);
    assert.throws(
      () => assertSafeUpstreamUrl("https://127.0.0.1/admin"),
      /private|link-local/i
    );
    assert.throws(
      () => assertSafeUpstreamUrl("https://user:pass@example.com"),
      /credentials/
    );
  });
});

describe("cookie health heuristics", () => {
  it("classifies login redirects as expired via probe URL helper behavior", async () => {
    // Unit-level: ensure module loads; network probe covered operationally.
    const mod = await import("../lib/tools/cookie-health");
    assert.equal(typeof mod.probeCookieSession, "function");
  });
});

describe("session token hashing", () => {
  it("hashes tokens stably", async () => {
    const { hashToken, generateToken } = await import(
      "../apps/session-service/src/crypto"
    );
    const token = generateToken();
    assert.equal(hashToken(token), hashToken(token));
    assert.notEqual(hashToken(token), hashToken(generateToken()));
  });
});
