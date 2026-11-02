export type ExtensionToolPreset = {
  slug: string;
  launchUrl: string;
  launchMode: "EXTENSION";
  cookieDomains: string[];
};

const PRESETS: Record<string, ExtensionToolPreset> = {
  canva: {
    slug: "canva",
    launchUrl: "https://www.canva.com/",
    launchMode: "EXTENSION",
    cookieDomains: ["canva.com"],
  },
  "chat-gpt": {
    slug: "chat-gpt",
    launchUrl: "https://chatgpt.com/",
    launchMode: "EXTENSION",
    cookieDomains: ["chatgpt.com", "openai.com"],
  },
  chatgpt: {
    slug: "chatgpt",
    launchUrl: "https://chatgpt.com/",
    launchMode: "EXTENSION",
    cookieDomains: ["chatgpt.com", "openai.com"],
  },
  claude: {
    slug: "claude",
    launchUrl: "https://claude.ai/new",
    launchMode: "EXTENSION",
    cookieDomains: ["claude.ai", "anthropic.com"],
  },
  "claude-ai": {
    slug: "claude-ai",
    launchUrl: "https://claude.ai/new",
    launchMode: "EXTENSION",
    cookieDomains: ["claude.ai", "anthropic.com"],
  },
  grammarly: {
    slug: "grammarly",
    launchUrl: "https://app.grammarly.com/",
    launchMode: "EXTENSION",
    cookieDomains: ["grammarly.com"],
  },
  quillbot: {
    slug: "quillbot",
    launchUrl: "https://quillbot.com/",
    launchMode: "EXTENSION",
    cookieDomains: ["quillbot.com"],
  },
};

export function getExtensionToolPreset(
  slug?: string | null
): ExtensionToolPreset | null {
  if (!slug) return null;
  const key = slug.trim().toLowerCase();
  if (PRESETS[key]) return PRESETS[key];
  if (key.includes("chatgpt") || key.includes("chat-gpt")) {
    return PRESETS["chat-gpt"];
  }
  if (key.startsWith("claude")) {
    return PRESETS.claude;
  }
  if (key.startsWith("grammarly")) {
    return PRESETS.grammarly;
  }
  if (key.startsWith("canva")) {
    return PRESETS.canva;
  }
  if (key.startsWith("quillbot")) {
    return PRESETS.quillbot;
  }
  return null;
}

export function isExtensionRequiredSlug(slug?: string | null): boolean {
  return getExtensionToolPreset(slug) !== null;
}

/**
 * Normalizes a tool's launchUrl and launchMode when it matches a known
 * Cloudflare/extension-only tool (Canva, ChatGPT, Claude, Grammarly, QuillBot).
 */
export function normalizeToolConfig<
  T extends {
    slug: string;
    launchUrl: string | null;
    launchMode?: "PROXY" | "EXTENSION" | "CLOUD" | "DIRECT" | null;
  },
>(tool: T): T & {
  launchUrl: string | null;
  launchMode: "PROXY" | "EXTENSION" | "CLOUD" | "DIRECT";
  needsDbHeal: boolean;
} {
  const preset = getExtensionToolPreset(tool.slug);
  const currentMode = tool.launchMode ?? "PROXY";

  if (!preset) {
    return {
      ...tool,
      launchMode: currentMode === "CLOUD" ? "EXTENSION" : currentMode,
      needsDbHeal: false,
    };
  }

  let normalizedUrl = tool.launchUrl?.trim() || null;

  // Upgrade bare/marketing URLs that don't land on the authenticated app
  if (!normalizedUrl) {
    normalizedUrl = preset.launchUrl;
  } else {
    try {
      const parsed = new URL(normalizedUrl);
      const host = parsed.hostname.toLowerCase();
      if (
        preset.slug === "grammarly" &&
        (host === "grammarly.com" || host === "www.grammarly.com") &&
        (parsed.pathname === "/" || parsed.pathname === "")
      ) {
        normalizedUrl = preset.launchUrl;
      } else if (
        (preset.slug === "chat-gpt" || preset.slug === "chatgpt") &&
        (host === "chat.openai.com" || host === "openai.com" || host === "www.openai.com")
      ) {
        normalizedUrl = preset.launchUrl;
      }
    } catch {
      normalizedUrl = preset.launchUrl;
    }
  }

  const normalizedMode: "EXTENSION" | "DIRECT" =
    currentMode === "DIRECT" ? "DIRECT" : "EXTENSION";

  const needsDbHeal =
    tool.launchUrl !== normalizedUrl || currentMode !== normalizedMode;

  return {
    ...tool,
    launchUrl: normalizedUrl,
    launchMode: normalizedMode,
    needsDbHeal,
  };
}

