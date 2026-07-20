/**
 * Material Symbols icon ligatures used in the app.
 * When adding a new MaterialIcon name, add it here and run: npm run icons:font
 */
export const MATERIAL_SYMBOL_NAMES = [
  "add_circle",
  "apps",
  "block",
  "card_membership",
  "chat",
  "check_circle",
  "chevron_right",
  "content_copy",
  "dashboard",
  "download",
  "error_outline",
  "extension",
  "forum",
  "grid_view",
  "group",
  "install_desktop",
  "inventory_2",
  "lock",
  "lock_open",
  "logout",
  "menu",
  "open_in_new",
  "payments",
  "receipt_long",
  "refresh",
  "send",
  "settings",
  "support_agent",
  "verified",
] as const;

export type MaterialSymbolName = (typeof MATERIAL_SYMBOL_NAMES)[number];

export function materialSymbolsIconNamesParam(): string {
  return [...MATERIAL_SYMBOL_NAMES].sort().join(",");
}
