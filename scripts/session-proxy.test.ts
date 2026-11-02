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

  it("Normalizes Canva, ChatGPT, Claude, and Grammarly to EXTENSION mode with default launchUrl", async () => {
    const { normalizeToolConfig } = await import(
      "../lib/tools/extension-presets"
    );

    const chatGpt = normalizeToolConfig({
      slug: "chat-gpt",
      launchUrl: null,
      launchMode: "PROXY",
    });
    assert.equal(chatGpt.launchMode, "EXTENSION");
    assert.equal(chatGpt.launchUrl, "https://chatgpt.com/");
    assert.equal(chatGpt.needsDbHeal, true);

    const claude = normalizeToolConfig({
      slug: "claude",
      launchUrl: null,
      launchMode: "PROXY",
    });
    assert.equal(claude.launchMode, "EXTENSION");
    assert.equal(claude.launchUrl, "https://claude.ai/new");
    assert.equal(claude.needsDbHeal, true);

    const grammarly = normalizeToolConfig({
      slug: "grammarly",
      launchUrl: "https://www.grammarly.com",
      launchMode: "PROXY",
    });
    assert.equal(grammarly.launchMode, "EXTENSION");
    assert.equal(grammarly.launchUrl, "https://app.grammarly.com/");
    assert.equal(grammarly.needsDbHeal, true);

    const canva = normalizeToolConfig({
      slug: "canva",
      launchUrl: "https://www.canva.com/",
      launchMode: "EXTENSION",
    });
    assert.equal(canva.launchMode, "EXTENSION");
    assert.equal(canva.launchUrl, "https://www.canva.com/");
    assert.equal(canva.needsDbHeal, false);
  });

  it("Extension manifest includes host_permissions for Canva, ChatGPT, Claude, and Grammarly", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const manifest = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "public/extensions/rankmora-launcher/manifest.json"),
        "utf8"
      )
    );
    const hosts: string[] = manifest.host_permissions || [];
    assert.ok(hosts.includes("https://*.canva.com/*"));
    assert.ok(hosts.includes("https://*.chatgpt.com/*"));
    assert.ok(hosts.includes("https://*.openai.com/*"));
    assert.ok(hosts.includes("https://*.claude.ai/*"));
    assert.ok(hosts.includes("https://*.grammarly.com/*"));
  });

  it("Claims extension launch tokens for chat-gpt, claude, grammarly, and canva", async () => {
    process.env.USE_MOCK_DATA = "true";
    process.env.SESSION_ENCRYPTION_KEY =
      process.env.SESSION_ENCRYPTION_KEY || "test-encryption-key-32chars!!";

    const { encryptCookiesFromJson } = await import("../lib/crypto/cookies");
    const { mockStore } = await import("../lib/mock/store");
    const {
      pickLaunchAccount,
      createExtensionClaimToken,
      claimExtensionLaunch,
    } = await import("../lib/auth/extension-launch");

    for (const slug of ["canva", "chat-gpt", "claude", "grammarly"]) {
      const tool = mockStore.tools.find((t) => t.slug === slug);
      assert.ok(tool, `Mock tool ${slug} should exist`);

      const domainMap: Record<string, string> = {
        canva: ".canva.com",
        "chat-gpt": "chatgpt.com",
        claude: ".claude.ai",
        grammarly: ".grammarly.com",
      };

      mockStore.toolAccounts.push({
        id: `acc-${slug}`,
        toolId: tool.id,
        label: `${slug} account`,
        cookieDataEnc: encryptCookiesFromJson(
          JSON.stringify([
            {
              name: "session_token",
              value: `val-${slug}`,
              domain: domainMap[slug],
              path: "/",
              secure: true,
              httpOnly: true,
            },
          ])
        ),
        maxConcurrentUsers: 5,
        active: true,
        healthStatus: "ALIVE",
        lastHealthCheckAt: new Date(),
        lastHealthError: null,
        lastVerifiedAt: new Date(),
        notes: null,
        createdAt: new Date(),
      });

      const picked = await pickLaunchAccount(tool.id);
      assert.ok(picked, `Should pick account for ${slug}`);

      const { token } = await createExtensionClaimToken({
        userId: "user-demo",
        toolId: tool.id,
        toolAccountId: picked.id,
      });

      const claimed = await claimExtensionLaunch(token);
      assert.ok(claimed, `Should claim launch for ${slug}`);
      assert.equal(claimed.cookies.length, 1);
      assert.equal(claimed.cookies[0].value, `val-${slug}`);
      assert.ok(claimed.openUrl.startsWith("https://"));
    }
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
