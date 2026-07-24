export function isCloudBrowserConfigured(): boolean {
  return (
    process.env.CLOUD_BROWSER_ENABLED === "true" ||
    process.env.CLOUD_BROWSER_ENABLED === "1"
  ) && Boolean(
    process.env.CLOUD_BROWSER_URL &&
      process.env.SESSION_SERVICE_API_KEY &&
      process.env.SESSION_ENCRYPTION_KEY
  );
}

function cloudBase() {
  return (process.env.CLOUD_BROWSER_URL ?? "").replace(/\/$/, "");
}

export type CloudLaunchResponse = {
  mode: "CLOUD";
  streamUrl: string;
  toolAccountId: string;
  expiresAt: string;
};

export async function requestCloudLaunch(params: {
  userId: string;
  toolId?: string;
  toolSlug?: string;
  openUrl?: string;
}): Promise<CloudLaunchResponse> {
  const base = cloudBase();
  const apiKey = process.env.SESSION_SERVICE_API_KEY;
  if (!base || !apiKey) {
    throw new Error("Cloud browser is not configured");
  }

  const res = await fetch(`${base}/internal/cloud-launch`, {
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
      typeof data.error === "string"
        ? data.error
        : "Failed to start cloud browser session"
    );
  }

  return data as CloudLaunchResponse;
}
