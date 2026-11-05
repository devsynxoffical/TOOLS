/**
 * Rankmora Tool Launcher - Account Shield & Protection Engine
 * Runs on tool domains to prevent sub-users from viewing usernames/emails,
 * changing passwords, modifying settings, or logging out.
 */
(() => {
  // Prevent duplicate execution
  if (window.__RANKMORA_SHIELD_INITIALIZED__) return;
  window.__RANKMORA_SHIELD_INITIALIZED__ = true;

  const SENSITIVE_TEXT_PATTERNS = [
    /\b(log\s*out|sign\s*out|logout|signout)\b/i,
    /\b(change\s*password|reset\s*password|update\s*password)\b/i,
    /\b(delete\s*account|close\s*account)\b/i,
    /\b(log\s*out\s*of\s*all\s*devices|sign\s*out\s*all\s*sessions)\b/i,
  ];

  const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

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
      document.body ? document.body.appendChild(toast) : document.documentElement.appendChild(toast);
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
   * Intercepts clicks on any logout, password change, or account deletion trigger
   * BEFORE the application's React/Vue/vanilla event listeners can fire.
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

      // Check for password change / account deletion triggers
      if (
        combined.includes("change password") ||
        combined.includes("reset password") ||
        combined.includes("delete account") ||
        combined.includes("log out of all")
      ) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        showShieldToast(
          "Action Protected",
          "Account security settings and password modifications are managed by Rankmora."
        );
        return false;
      }
    },
    true // Capture phase - guarantees early interception
  );

  /**
   * 3. DOM Sanitizer & Element Hider
   * Recursively scans and hides sensitive elements from rendering.
   */
  function sanitizeElement(el) {
    if (!el || !(el instanceof Element)) return;

    // Check links with logout URLs
    if (el instanceof HTMLAnchorElement) {
      const href = (el.getAttribute("href") || "").toLowerCase();
      if (
        href.includes("/logout") ||
        href.includes("/signout") ||
        href.includes("api/auth/signout") ||
        href.includes("auth/logout")
      ) {
        hideElement(el);
        return;
      }
    }

    // Check menu items & buttons
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
      for (const pattern of SENSITIVE_TEXT_PATTERNS) {
        if (pattern.test(rawText)) {
          hideElement(el);
          return;
        }
      }
    }

    // Sanitize user emails to generic placeholder
    maskEmailsInElement(el);

    // ChatGPT-specific UI masking
    if (window.location.hostname.includes("chatgpt.com")) {
      maskChatGPTProfile(el);
    }

    // Claude-specific UI masking
    if (window.location.hostname.includes("claude.ai")) {
      maskClaudeProfile(el);
    }
  }

  function hideElement(el) {
    if (el.getAttribute("data-rankmora-hidden") === "true") return;
    el.setAttribute("data-rankmora-hidden", "true");
    el.style.setProperty("display", "none", "important");
    el.style.setProperty("visibility", "hidden", "important");
    el.style.setProperty("pointer-events", "none", "important");
  }

  function maskEmailsInElement(el) {
    // Only inspect leaf or shallow text containers to avoid performance overhead
    if (el.children.length === 0 && el.textContent) {
      if (EMAIL_PATTERN.test(el.textContent)) {
        el.textContent = el.textContent.replace(EMAIL_PATTERN, "Rankmora Member");
      }
    }
  }

  /**
   * ChatGPT Specific Profile Sanitizer
   * Masks user handle (e.g. syehassanali) and email at bottom of sidebar
   */
  function maskChatGPTProfile(root) {
    // Find profile button container in sidebar
    const profileBtns = root.querySelectorAll
      ? root.querySelectorAll(
          'nav button, [data-testid="profile-button"], button:has(img[alt*="User"])'
        )
      : [];

    profileBtns.forEach((btn) => {
      // Find text containers inside the button
      const textContainers = btn.querySelectorAll("div, span, p");
      textContainers.forEach((tc) => {
        if (tc.children.length === 0 && tc.textContent) {
          const txt = tc.textContent.trim();
          // If it matches email or user handle (not system labels like "Settings" or "Log out")
          if (
            txt.length > 2 &&
            !txt.includes("ChatGPT") &&
            !txt.includes("New chat") &&
            !txt.includes("Rankmora")
          ) {
            if (EMAIL_PATTERN.test(txt) || txt.toLowerCase() !== "free") {
              // Mask username
              if (!tc.getAttribute("data-rankmora-masked")) {
                tc.setAttribute("data-rankmora-masked", "true");
                tc.textContent = "Rankmora Member";
              }
            }
          }
        }
      });
    });

    // In settings dialog, hide the Security tab
    const tabs = root.querySelectorAll ? root.querySelectorAll('[role="tab"]') : [];
    tabs.forEach((tab) => {
      const text = (tab.textContent || "").trim().toLowerCase();
      if (text.includes("security") || text.includes("data controls")) {
        hideElement(tab);
      }
    });
  }

  /**
   * Claude Specific Profile Sanitizer
   */
  function maskClaudeProfile(root) {
    const profileLabels = root.querySelectorAll
      ? root.querySelectorAll('[data-testid="user-menu"], nav button')
      : [];

    profileLabels.forEach((label) => {
      maskEmailsInElement(label);
    });
  }

  /**
   * 4. Continuous MutationObserver
   * Observes dynamically loaded elements (React portals, Radix UI dropdown menus, popovers)
   */
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node instanceof Element) {
          sanitizeElement(node);
          const descendants = node.querySelectorAll
            ? node.querySelectorAll("a, button, [role='menuitem'], [role='tab'], div, span")
            : [];
          descendants.forEach((d) => sanitizeElement(d));
        }
      }
    }
  });

  function startObserver() {
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
      sanitizeElement(document.body);
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        if (document.body) {
          observer.observe(document.body, { childList: true, subtree: true });
          sanitizeElement(document.body);
        }
      });
    }
  }

  startObserver();

  /**
   * 5. Navigation Guard
   * Prevents navigating directly to logout or password reset endpoints.
   */
  function checkCurrentUrl() {
    const pathname = window.location.pathname.toLowerCase();
    if (
      pathname === "/logout" ||
      pathname.startsWith("/logout/") ||
      pathname === "/signout" ||
      pathname.startsWith("/signout/") ||
      pathname === "/api/auth/signout" ||
      pathname === "/api/auth/logout"
    ) {
      window.location.replace(`${window.location.origin}/`);
    }
  }

  checkCurrentUrl();
  window.addEventListener("popstate", checkCurrentUrl);

  /**
   * 6. Add non-intrusive Session Pill
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
