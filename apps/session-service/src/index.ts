import "dotenv/config";
import path from "path";
import { config as loadEnv } from "dotenv";

loadEnv({ path: path.resolve(process.cwd(), "../../.env") });
loadEnv({ path: path.resolve(process.cwd(), ".env") });

import Fastify from "fastify";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import { randomBytes } from "crypto";
import { generateToken, decryptCookiesToHeader } from "./crypto.js";
import {
  prisma,
  pickToolAccount,
  createLaunchToken,
  consumeLaunchToken,
  logLaunch,
  cleanupExpiredTokens,
} from "./db.js";
import {
  createProxySession,
  getProxySession,
  proxyRequest,
} from "./proxy.js";

const PORT = Number(process.env.SESSION_SERVICE_PORT ?? 4000);
const API_KEY = process.env.SESSION_SERVICE_API_KEY ?? "";
const PUBLIC_URL = (
  process.env.SESSION_SERVICE_PUBLIC_URL ?? `http://localhost:${PORT}`
).replace(/\/$/, "");

function requireApiKey(apiKey: string | undefined) {
  if (!API_KEY || apiKey !== API_KEY) {
    throw new Error("Unauthorized");
  }
}

const fastify = Fastify({ logger: true });

async function main() {
  await fastify.register(cookie);
  await fastify.register(cors, { origin: true, credentials: true });

fastify.get("/health", async () => ({ ok: true, service: "session-service" }));

fastify.post<{
  Body: { userId: string; toolSlug: string; userEmail?: string };
}>(
  "/internal/launch",
  async (request, reply) => {
    try {
      requireApiKey(request.headers["x-api-key"] as string | undefined);
    } catch {
      return reply.code(401).send({ error: "Unauthorized" });
    }

    const { userId, toolSlug } = request.body ?? {};
    if (!userId || !toolSlug) {
      return reply.code(400).send({ error: "userId and toolSlug are required" });
    }

    const tool = await prisma.tool.findUnique({ where: { slug: toolSlug } });
    if (!tool?.launchUrl) {
      return reply
        .code(400)
        .send({ error: "Tool launch URL is not configured" });
    }

    const account = await pickToolAccount(tool.id);
    if (!account) {
      return reply
        .code(503)
        .send({ error: "No active tool account available for this tool" });
    }

    let cookieHeader: string;
    try {
      cookieHeader = decryptCookiesToHeader(account.cookieDataEnc);
    } catch {
      return reply.code(503).send({ error: "Tool account cookies are invalid" });
    }

    if (!cookieHeader) {
      return reply.code(503).send({ error: "Tool account has no cookies" });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await createLaunchToken({
      userId,
      toolId: tool.id,
      toolAccountId: account.id,
      token,
      expiresAt,
    });

    await logLaunch({
      userId,
      toolId: tool.id,
      toolAccountId: account.id,
    });

    return {
      launchUrl: `${PUBLIC_URL}/go/${token}`,
      toolAccountId: account.id,
      expiresAt: expiresAt.toISOString(),
    };
  }
);

fastify.get<{ Params: { token: string } }>(
  "/go/:token",
  async (request, reply) => {
    const launch = await consumeLaunchToken(request.params.token);
    if (!launch) {
      return reply
        .code(410)
        .type("text/html")
        .send(
          "<h1>Launch link expired</h1><p>Go back to your dashboard and click Launch again.</p>"
        );
    }

    const [tool, account] = await Promise.all([
      prisma.tool.findUnique({ where: { id: launch.toolId } }),
      prisma.toolAccount.findUnique({ where: { id: launch.toolAccountId } }),
    ]);

    if (!tool?.launchUrl || !account) {
      return reply.code(404).send("Tool session not found");
    }

    let cookieHeader: string;
    try {
      cookieHeader = decryptCookiesToHeader(account.cookieDataEnc);
    } catch {
      return reply.code(503).send("Invalid tool account cookies");
    }

    const sessionId = randomBytes(24).toString("base64url");
    createProxySession({
      id: sessionId,
      toolSlug: tool.slug,
      upstream: tool.launchUrl.replace(/\/$/, ""),
      cookieHeader,
      userId: launch.userId,
    });

    reply.setCookie("gb_proxy", sessionId, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 2 * 60 * 60,
    });

    return reply.redirect(`/proxy/${tool.slug}/`);
  }
);

async function handleProxy(
  request: { params: { slug: string; "*": string }; raw: import("http").IncomingMessage; cookies: { gb_proxy?: string } },
  reply: import("fastify").FastifyReply
) {
  const session = getProxySession(request.cookies.gb_proxy);
  if (!session || session.toolSlug !== request.params.slug) {
    return reply
      .code(401)
      .type("text/html")
      .send(
        "<h1>Session expired</h1><p>Return to your dashboard and launch the tool again.</p>"
      );
  }

  const suffix = request.params["*"] ?? "";
  const targetPath = suffix ? `/${suffix}` : "/";

  return new Promise<void>((resolve) => {
    reply.hijack();
    proxyRequest(request.raw, reply.raw, session, targetPath);
    resolve();
  });
}

fastify.get<{ Params: { slug: string; "*": string } }>(
  "/proxy/:slug/*",
  handleProxy
);

fastify.get<{ Params: { slug: string } }>("/proxy/:slug", async (request, reply) => {
  const session = getProxySession(request.cookies.gb_proxy);
  if (!session || session.toolSlug !== request.params.slug) {
    return reply.code(401).send("Session expired");
  }
  return new Promise<void>((resolve) => {
    reply.hijack();
    proxyRequest(request.raw, reply.raw, session, "/");
    resolve();
  });
});

setInterval(() => {
  cleanupExpiredTokens().catch((err) => fastify.log.error(err));
}, 15 * 60 * 1000);

  try {
    await fastify.listen({ port: PORT, host: "0.0.0.0" });
    fastify.log.info(`Session service listening on ${PUBLIC_URL}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
