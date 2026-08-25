/**
 * Material Symbols icon ligatures used in the app.
 * When adding a new MaterialIcon name, add it here and run: npm run icons:font
 */
export const MATERIAL_SYMBOL_NAMES = [
  "add_circle",
  "apps",
  "arrow_forward",
  "block",
  "bolt",
  "calendar_month",
  "campaign",
  "card_membership",
  "chat",
  "check_circle",
  "chevron_right",
  "content_copy",
  "dashboard",
  "date_range",
  "download",
  "error_outline",
  "expand_less",
  "expand_more",
  "extension",
  "forum",
  "grid_view",
  "group",
  "groups",
  "install_desktop",
  "inventory_2",
  "language",
  "link",
  "lock",
  "lock_open",
  "logout",
  "menu",
  "open_in_new",
  "payments",
  "person",
  "receipt_long",
  "refresh",
  "rocket_launch",
  "schedule",
  "school",
  "send",
  "settings",
  "storefront",
  "support_agent",
  "timer",
  "trending_up",
  "verified",
] as const;

export type MaterialSymbolName = (typeof MATERIAL_SYMBOL_NAMES)[number];

export function materialSymbolsIconNamesParam(): string {
  return [...MATERIAL_SYMBOL_NAMES].sort().join(",");
}
