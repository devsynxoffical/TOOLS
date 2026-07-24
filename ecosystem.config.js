const path = require("path");
const fs = require("fs");

// Load .env from project root so PM2 picks up DATABASE_URL, secrets, etc.
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  require("dotenv").config({ path: envPath });
}

const sharedEnv = {
  NODE_ENV: "production",
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  SESSION_ENCRYPTION_KEY: process.env.SESSION_ENCRYPTION_KEY,
  SESSION_SERVICE_API_KEY: process.env.SESSION_SERVICE_API_KEY,
  SESSION_SERVICE_URL: process.env.SESSION_SERVICE_URL || "http://127.0.0.1:4000",
  SESSION_SERVICE_PUBLIC_URL: process.env.SESSION_SERVICE_PUBLIC_URL,
  SESSION_SERVICE_PORT: process.env.SESSION_SERVICE_PORT || "4000",
  SESSION_TOOLS_BASE_DOMAIN: process.env.SESSION_TOOLS_BASE_DOMAIN,
  SESSION_COOKIE_DOMAIN: process.env.SESSION_COOKIE_DOMAIN,
  CLOUD_BROWSER_ENABLED: process.env.CLOUD_BROWSER_ENABLED || "false",
  CLOUD_BROWSER_URL: process.env.CLOUD_BROWSER_URL || "http://127.0.0.1:4100",
  CLOUD_BROWSER_PUBLIC_URL: process.env.CLOUD_BROWSER_PUBLIC_URL,
  CLOUD_BROWSER_PORT: process.env.CLOUD_BROWSER_PORT || "4100",
  CLOUD_BROWSER_BIND_HOST: process.env.CLOUD_BROWSER_BIND_HOST || "127.0.0.1",
  CLOUD_BROWSER_MAX_SESSIONS: process.env.CLOUD_BROWSER_MAX_SESSIONS || "3",
  CLOUD_BROWSER_IDLE_MS: process.env.CLOUD_BROWSER_IDLE_MS || "600000",
  CLOUD_BROWSER_TTL_MS: process.env.CLOUD_BROWSER_TTL_MS || "1800000",
};

module.exports = {
  apps: [
    {
      name: "groupbuy-web",
      cwd: __dirname,
      script: "node_modules/.bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "600M",
      env: {
        ...sharedEnv,
        PORT: process.env.PORT || "3000",
      },
    },
    {
      name: "groupbuy-session",
      cwd: path.join(__dirname, "apps/session-service"),
      script: "npx",
      args: "tsx src/index.ts",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "400M",
      env: sharedEnv,
    },
    {
      name: "groupbuy-cloud",
      cwd: path.join(__dirname, "apps/cloud-browser"),
      script: "npx",
      args: "tsx src/index.ts",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "1200M",
      env: sharedEnv,
    },
  ],
};
