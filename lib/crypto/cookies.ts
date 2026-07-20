import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "crypto";

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12;
export const MAX_COOKIE_JSON_BYTES = 256 * 1024;

function getKey(): Buffer {
  const secret = process.env.SESSION_ENCRYPTION_KEY;
  if (!secret || secret.length < 16) {
    throw new Error(
      "SESSION_ENCRYPTION_KEY must be set (min 16 chars). Generate: openssl rand -base64 32"
    );
  }
  return scryptSync(secret, "groupbuy-tools-salt", 32);
}

export function encryptCookieData(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return [
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptCookieData(payload: string): string {
  const key = getKey();
  const [ivB64, tagB64, dataB64] = payload.split(":");
  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Invalid encrypted cookie payload");
  }
  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(dataB64, "base64");
  const decipher = createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf8");
}

export type StoredCookie = {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
};

export function parseCookieJson(raw: string): StoredCookie[] {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Cookie data is empty");
  if (Buffer.byteLength(trimmed, "utf8") > MAX_COOKIE_JSON_BYTES) {
    throw new Error("Cookie JSON exceeds 256KB limit");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error("Cookie data must be valid JSON (browser export format)");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Cookie data must be a non-empty JSON array");
  }
  if (parsed.length > 500) {
    throw new Error("Too many cookies (max 500)");
  }

  return parsed.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Invalid cookie at index ${index}`);
    }
    const c = item as Record<string, unknown>;
    if (typeof c.name !== "string" || typeof c.value !== "string") {
      throw new Error(`Cookie at index ${index} must have name and value`);
    }
    if (!c.name.trim()) {
      throw new Error(`Cookie at index ${index} has an empty name`);
    }
    if (c.name.length > 256 || c.value.length > 8192) {
      throw new Error(`Cookie at index ${index} exceeds size limits`);
    }
    return {
      name: c.name,
      value: c.value,
      domain: typeof c.domain === "string" ? c.domain : undefined,
      path: typeof c.path === "string" ? c.path : undefined,
      secure: typeof c.secure === "boolean" ? c.secure : undefined,
      httpOnly: typeof c.httpOnly === "boolean" ? c.httpOnly : undefined,
      sameSite: typeof c.sameSite === "string" ? c.sameSite : undefined,
    };
  });
}

export function cookiesToHeaderString(cookies: StoredCookie[]): string {
  return cookies.map((c) => `${c.name}=${c.value}`).join("; ");
}

export function encryptCookiesFromJson(raw: string): string {
  const cookies = parseCookieJson(raw);
  const plaintext = JSON.stringify(cookies);
  const encrypted = encryptCookieData(plaintext);
  // Round-trip check catches key/config issues before persisting.
  const roundTrip = parseCookieJson(decryptCookieData(encrypted));
  if (roundTrip.length !== cookies.length) {
    throw new Error("Cookie encryption round-trip validation failed");
  }
  return encrypted;
}

export function decryptCookiesToHeader(payload: string): string {
  const raw = decryptCookieData(payload);
  const cookies = parseCookieJson(raw);
  return cookiesToHeaderString(cookies);
}
