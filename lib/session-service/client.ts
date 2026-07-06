export function isSessionServiceConfigured(): boolean {
  return Boolean(
    process.env.SESSION_SERVICE_URL &&
      process.env.SESSION_SERVICE_API_KEY &&
      process.env.SESSION_ENCRYPTION_KEY
  );
}

export function getSessionServiceUrl(): string {
  return (process.env.SESSION_SERVICE_URL ?? "").replace(/\/$/, "");
}

export type LaunchResponse = {
  launchUrl: string;
  toolAccountId: string;
  expiresAt: string;
};

export async function requestToolLaunch(params: {
  userId: string;
  toolSlug: string;
  userEmail?: string;
}): Promise<LaunchResponse> {
  const baseUrl = getSessionServiceUrl();
  const apiKey = process.env.SESSION_SERVICE_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new Error("Session service is not configured");
  }

  const res = await fetch(`${baseUrl}/internal/launch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(params),
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Failed to start tool session"
    );
  }

  return data as LaunchResponse;
}
