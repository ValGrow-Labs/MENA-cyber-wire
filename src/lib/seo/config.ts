export const PRODUCTION_DOMAIN = "https://mena-cyber-wire.vercel.app";

/**
 * Returns a normalized canonical base URL without trailing slash.
 * Fallbacks cleanly to the verified production Vercel domain if undefined, empty, or pointing to old domain.
 */
export function getBaseUrl(configuredUrl?: string): string {
  if (
    configuredUrl &&
    typeof configuredUrl === "string" &&
    configuredUrl.trim() !== "" &&
    !configuredUrl.includes("menacyberwire.com")
  ) {
    return configuredUrl.trim().replace(/\/$/, "");
  }
  return PRODUCTION_DOMAIN;
}
