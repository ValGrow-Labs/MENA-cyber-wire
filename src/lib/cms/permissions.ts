import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME, SessionPayload } from "./auth";
import { AdminRole } from "@/types/cms";

export function getAdminSessionFromCookies(): SessionPayload | null {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function canManageUsers(role: AdminRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canPublishArticles(role: AdminRole): boolean {
  return role === "SUPER_ADMIN" || role === "EDITOR";
}

export function canEditArticles(role: AdminRole): boolean {
  return role === "SUPER_ADMIN" || role === "EDITOR" || role === "AUTHOR";
}

export function canManageSettings(role: AdminRole): boolean {
  return role === "SUPER_ADMIN";
}

export function canModerateCommunity(role: AdminRole): boolean {
  return role === "SUPER_ADMIN" || role === "EDITOR" || role === "MODERATOR";
}
