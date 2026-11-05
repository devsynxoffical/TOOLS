/**
 * Rankmora Tool Launcher - Account & Personal Information Shield Engine
 * Deeply masks emails, usernames, avatars, billing details, and phone numbers
 * across all shared tools (ChatGPT, Claude, Canva, Grammarly, QuillBot, Semrush, etc.)
 * while completely locking settings, profile editing, and logout.
 */
(() => {
  // Prevent duplicate execution within the same page context
  if (window.__RANKMORA_SHIELD_INITIALIZED__) return;
  window.__RANKMORA_SHIELD_INITIALIZED__ = true;

  // 0. Immediate URL Gatekeeper: If the page URL contains settings, account, security, or logout,
  // wipe the DOM and bounce immediately to the tool root so no personal data ever renders.
  function isRestrictedUrl(urlStr) {
    const s = urlStr.toLowerCase();
    return (
      s.includes("/settings") ||
      s.includes("/account") ||
      s.includes("/your-account") ||
      s.includes("/login-and-security") ||
      s.includes("/billing") ||
      s.includes("/invoices") ||
      s.includes("/subscription") ||
      s.includes("/logout") ||
      s.includes("/signout") ||
      s.includes("chatgpt.com/#settings") ||
      s.includes("/api/auth/signout") ||
      s.includes("/api/auth/logout")
    );
  }

  if (isRestrictedUrl(window.location.pathname) || isRestrictedUrl(window.location.href)) {
    if (document.documentElement) {
      document.documentElement.innerHTML = `
        <div style="display:flex;height:100vh;align-items:center;justify-content:center;background:#0f172a;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;">
          <div style="text-align:center;padding:24px;">
            <div style="font-size:48px;margin-bottom:12px;">🛡️</div>
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;">Settings Protected</h2>
            <p style="margin:0;color:#94a3b8;font-size:14px;">Personal settings are secured by Rankmora. Redirecting to workspace...</p>
          </div>
        </div>
      `;
    }
    window.location.replace(`${window.location.origin}/`);
    return;
  }

  const SENSITIVE_CLICK_PATTERNS = [
    /\b(log\s*out|sign\s*out|logout|signout)\b/i,
    /\b(change\s*password|reset\s*password|update\s*password)\b/i,
    /\b(delete\s*account|close\s*account)\b/i,
    /\b(log\s*out\s*of\s*all\s*devices|sign\s*out\s*all\s*sessions)\b/i,
    /\b(export\s*data|billing\s*settings|payment\s*methods)\b/i,
    /\b(account\s*settings|your\s*account|account\s*and\s*security|your\s*profile)\b/i,
    /\b(settings)\b/i,
  ];

  const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const PHONE_PATTERN = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;
  const CARD_PATTERN = /\b(?:\d{4}[-\s]?){3}\d{4}\b|\b(?:ending in \d{4}|••••\s*\d{4})\b/gi;
  const KNOWN_USER_PATTERNS = /\b(syehassanali|hassan\s*ali|syed\s*hassan|rank\s*mora)\b/gi;

  const GENERIC_SHIELD_SVG =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z'/></svg>";

  /**
   * 1. Display sleek in-page Toast Notification when restricted action is attempted
   */
  let toastTimer = null;
  function showShieldToast(title, message) {
    let toast = document.getElementById("rankmora-shield-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "rankmora-shield-toast";
      toast.innerHTML = `
        <div class="rankmora-toast-icon">🛡️</div>
        <div class="rankmora-toast-body">
          <strong id="rankmora-toast-title"></strong>
          <p id="rankmora-toast-msg"></p>
        </div>
      `;
      (document.body || document.documentElement).appendChild(toast);
    }

    const titleEl = toast.querySelector("#rankmora-toast-title");
    const msgEl = toast.querySelector("#rankmora-toast-msg");
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;

    toast.classList.remove("rankmora-fade-out");
    toast.style.display = "flex";

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add("rankmora-fade-out");
      setTimeout(() => {
        toast.style.display = "none";
      }, 250);
    }, 3200);
  }

  /**
   * 2. Global Capture-Phase Click Interceptor
   * Intercepts clicks on settings, account profile, logout, or password change
   * BEFORE application event listeners can fire.
   */
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!target || !(target instanceof Element)) return;

      const interactive = target.closest("button, a, [role='menuitem'], [role='button'], li");
      const elementToCheck = interactive || target;

      const text = (elementToCheck.textContent || "").trim();
      const href = elementToCheck instanceof HTMLAnchorElement ? elementToCheck.getAttribute("href") || "" : "";
      const ariaLabel = elementToCheck.getAttribute("aria-label") || "";
      const combined = `${text} ${href} ${ariaLabel}`.toLowerCase();

      // Check for logout triggers
      if (
        combined.includes("logout") ||
        combined.includes("log out") ||
        combined.includes("sign out") ||
        combined.includes("signout") ||
        href.includes("/api/auth/signout") ||
        href.includes("/auth/logout")
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showShieldToast(
          "Logout Disabled",
          "Logging out is restricted to protect your active Rankmora shared tool access."
        );
        return false;
      }

      // Check for settings, profile edit, or account security triggers
      if (
        combined.includes("account settings") ||
        combined.includes("your account") ||
        combined.includes("your profile") ||
        combined.includes("login-and-security") ||
        combined.includes("security") ||
        combined.includes("billing") ||
        combined.includes("subscription") ||
        combined.includes("change password") ||
        combined.includes("reset password") ||
        combined.includes("delete account") ||
        combined.includes("disconnect") ||
        href.includes("/settings") ||
        href.includes("/account") ||
        (combined.includes("settings") && !combined.includes("model"))
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showShieldToast(
          "Settings Locked",
          "Account settings and personal profile details are protected by Rankmora."
        );
        return false;
      }
    },
    true // Capture phase
  );

  /**
   * 3. Deep TreeWalker for Personal Information Sanitization
   * Walks DOM text nodes and replaces any emails, phone numbers, or personal usernames.
   */
  function sanitizeTextNodes(root) {
    if (!root) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let currentNode = walker.nextNode();

    while (currentNode) {
      const parent = currentNode.parentElement;
      if (parent) {
        const tagName = parent.tagName.toLowerCase();
        if (tagName !== "script" && tagName !== "style") {
          let text = currentNode.nodeValue;
          if (text) {
            let modified = false;

            if (EMAIL_PATTERN.test(text)) {
              text = text.replace(EMAIL_PATTERN, "Rankmora Member");
              modified = true;
            }

            if (KNOWN_USER_PATTERNS.test(text)) {
              text = text.replace(KNOWN_USER_PATTERNS, "Rankmora Member");
              modified = true;
            }

            if (CARD_PATTERN.test(text)) {
              text = text.replace(CARD_PATTERN, "[Protected Card]");
              modified = true;
            }

            if (PHONE_PATTERN.test(text) && !text.includes("http")) {
              text = text.replace(PHONE_PATTERN, "[Protected Phone]");
              modified = true;
            }

            if (modified) {
              currentNode.nodeValue = text;
            }
          }
        }
      }
      currentNode = walker.nextNode();
    }
  }

  /**
   * 4. Sanitize Input Elements (Forms displaying emails, billing, etc.)
   */
  function sanitizeInputs(root) {
    if (!root || !root.querySelectorAll) return;

    const inputs = root.querySelectorAll(
      'input[type="email"], input[name*="email"], input[autocomplete="email"], input[value*="@"]'
    );
    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement && !input.getAttribute("data-rankmora-masked")) {
        input.setAttribute("data-rankmora-masked", "true");
        input.value = "protected@rankmora.io";
        input.setAttribute("disabled", "true");
        input.style.setProperty("filter", "blur(4px)", "important");
      }
    });
  }

  /**
   * 5. Sanitize Avatars & Profile Pictures
   */
  function sanitizeAvatars(root) {
    if (!root || !root.querySelectorAll) return;

    const avatars = root.querySelectorAll(
      'img[src*="googleusercontent.com"], img[src*="gravatar.com"], img[src*="auth0.com"], img[alt*="avatar" i], img[alt*="profile" i]'
    );
    avatars.forEach((img) => {
      if (img instanceof HTMLImageElement && !img.getAttribute("data-rankmora-avatar")) {
        img.setAttribute("data-rankmora-avatar", "true");
        img.src = GENERIC_SHIELD_SVG;
      }
    });
  }

  /**
   * 6. Element Hider & Action Sanitizer
   */
  function hideElement(el) {
    if (!el || el.getAttribute("data-rankmora-hidden") === "true") return;
    el.setAttribute("data-rankmora-hidden", "true");
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("pointer-events", "none", "important");
  }

  function sanitizeElement(el) {
    if (!el || !(el instanceof Element)) return;

    // Check links with settings or logout URLs
    if (el instanceof HTMLAnchorElement) {
      const href = (el.getAttribute("href") || "").toLowerCase();
      if (
        href.includes("/settings") ||
        href.includes("/account") ||
        href.includes("/your-account") ||
        href.includes("/billing") ||
        href.includes("/logout") ||
        href.includes("/signout")
      ) {
        hideElement(el);
        return;
      }
    }

    // Check buttons & menu items
    const role = el.getAttribute("role");
    const tagName = el.tagName.toLowerCase();
    const isClickable =
      tagName === "button" ||
      tagName === "a" ||
      role === "menuitem" ||
      role === "button" ||
      el.hasAttribute("data-testid");

    if (isClickable) {
      const rawText = (el.textContent || "").trim();
      for (const pattern of SENSITIVE_CLICK_PATTERNS) {
        if (pattern.test(rawText)) {
          hideElement(el);
          return;
        }
      }
    }

    // Check settings dialogs in modals
    if (role === "dialog") {
      const text = (el.textContent || "").toLowerCase();
      if (text.includes("settings") || text.includes("data controls") || text.includes("security")) {
        hideElement(el);
        showShieldToast("Settings Protected", "Settings are locked to protect shared tool access.");
      }
    }

    // Tool specific sanitizers
    const host = window.location.hostname;
    if (host.includes("chatgpt.com") || host.includes("openai.com")) {
      maskChatGPTProfile(el);
    } else if (host.includes("claude.ai") || host.includes("anthropic.com")) {
      maskClaudeProfile(el);
    } else if (host.includes("canva.com")) {
      maskCanvaProfile(el);
    } else if (host.includes("grammarly.com")) {
      maskGrammarlyProfile(el);
    }
  }

  /**
   * ChatGPT Specific Deep Masking
   */
  function maskChatGPTProfile(root) {
    // 1. Profile button in bottom of sidebar
    const profileBtns = root.querySelectorAll
      ? root.querySelectorAll(
          'nav button, [data-testid="profile-button"], button:has(img[alt*="User"])'
        )
      : [];

    profileBtns.forEach((btn) => {
      const avatarBox = btn.querySelector('[class*="avatar"], div:has(> img)');
      if (avatarBox && !avatarBox.getAttribute("data-rankmora-shield-icon")) {
        avatarBox.setAttribute("data-rankmora-shield-icon", "true");
        avatarBox.innerHTML = `<span style="font-size: 16px; line-height: 1;">🛡️</span>`;
      }

      const textContainers = btn.querySelectorAll("div, span, p");
      textContainers.forEach((tc) => {
        if (tc.children.length === 0 && tc.textContent) {
          const txt = tc.textContent.trim();
          if (
            txt.length > 1 &&
            !txt.includes("ChatGPT") &&
            !txt.includes("New chat") &&
            !txt.includes("Rankmora")
          ) {
            if (EMAIL_PATTERN.test(txt) || KNOWN_USER_PATTERNS.test(txt) || txt.toLowerCase() !== "free") {
              if (!tc.getAttribute("data-rankmora-masked")) {
                tc.setAttribute("data-rankmora-masked", "true");
                tc.textContent = "Rankmora Member";
              }
            } else if (txt.toLowerCase() === "free") {
              tc.textContent = "Pro Access";
            }
          }
        }
      });
    });

    // 2. Hide settings button in sidebar
    const settingsBtns = root.querySelectorAll
      ? root.querySelectorAll('nav a[href*="settings"], nav button:has(svg.lucide-settings)')
      : [];
    settingsBtns.forEach((sb) => hideElement(sb));
  }

  /**
   * Claude Specific Deep Masking
   */
  function maskClaudeProfile(root) {
    const profileLabels = root.querySelectorAll
      ? root.querySelectorAll('[data-testid="user-menu"], nav button, [data-testid="account-menu"]')
      : [];

    profileLabels.forEach((label) => {
      sanitizeTextNodes(label);
      const avatar = label.querySelector('[class*="avatar"], div[class*="rounded-full"]');
      if (avatar && !avatar.getAttribute("data-rankmora-avatar-set")) {
        avatar.setAttribute("data-rankmora-avatar-set", "true");
        avatar.innerHTML = `<span style="font-size: 14px;">🛡️</span>`;
      }
    });
  }

  /**
   * Canva Specific Deep Masking
   */
  function maskCanvaProfile(root) {
    const userContainers = root.querySelectorAll
      ? root.querySelectorAll(
          'header [aria-label*="account" i], header button:has(img), a[href*="/settings"]'
        )
      : [];

    userContainers.forEach((uc) => {
      if (uc instanceof HTMLAnchorElement && uc.getAttribute("href")?.includes("/settings")) {
        hideElement(uc);
      } else {
        sanitizeTextNodes(uc);
      }
    });
  }

  /**
   * Grammarly Specific Deep Masking
   */
  function maskGrammarlyProfile(root) {
    const userContainers = root.querySelectorAll
      ? root.querySelectorAll('nav [data-qa*="user"], nav [data-name*="user"], [class*="user-menu"]')
      : [];

    userContainers.forEach((uc) => {
      sanitizeTextNodes(uc);
    });
  }

  /**
   * 7. Continuous MutationObserver
   * Observes dynamic DOM additions across all tools
   */
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) {
          sanitizeElement(node);
          sanitizeTextNodes(node);
          sanitizeInputs(node);
          sanitizeAvatars(node);

          const descendants = node.querySelectorAll
            ? node.querySelectorAll("a, button, [role='menuitem'], [role='tab'], [role='dialog'], div, span, input")
            : [];
          descendants.forEach((d) => {
            sanitizeElement(d);
          });
        }
      }
    }
  });

  function startObserver() {
    const rootTarget = document.body || document.documentElement;
    if (rootTarget) {
      observer.observe(rootTarget, { childList: true, subtree: true });
      sanitizeElement(rootTarget);
      sanitizeTextNodes(rootTarget);
      sanitizeInputs(rootTarget);
      sanitizeAvatars(rootTarget);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        const target = document.body || document.documentElement;
        if (target) {
          observer.observe(target, { childList: true, subtree: true });
          sanitizeElement(target);
          sanitizeTextNodes(target);
          sanitizeInputs(target);
          sanitizeAvatars(target);
        }
      });
    }
  }

  startObserver();

  /**
   * 8. Navigation Guard
   * Prevents navigating directly to settings, account, or logout URLs.
   */
  function checkCurrentUrl() {
    if (isRestrictedUrl(window.location.pathname) || isRestrictedUrl(window.location.href)) {
      window.location.replace(`${window.location.origin}/`);
    }
  }

  checkCurrentUrl();
  window.addEventListener("popstate", checkCurrentUrl);

  /**
   * 9. Add non-intrusive Session Badge
   */
  function injectSessionBadge() {
    if (document.getElementById("rankmora-session-badge")) return;
    const badge = document.createElement("div");
    badge.id = "rankmora-session-badge";
    badge.innerHTML = `<span class="rankmora-dot"></span> Protected Session`;
    (document.body || document.documentElement).appendChild(badge);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectSessionBadge);
  } else {
    injectSessionBadge();
  }
})();
