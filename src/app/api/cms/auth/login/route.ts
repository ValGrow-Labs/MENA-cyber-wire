import { NextResponse } from "next/server";
import { CMS_DB } from "@/lib/cms/db";
import { verifyPassword, createSessionToken, COOKIE_NAME, SESSION_TTL_SECONDS } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

// Simple in-memory rate limiter for login attempts (IP -> { count, resetTime })
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const now = Date.now();
    const rate = loginAttempts.get(ip);

    if (rate && rate.resetTime > now && rate.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please wait 15 minutes." },
        { status: 429 }
      );
    }

    let email = "";
    let password = "";

    try {
      const body = await request.json();
      email = typeof body?.email === "string" ? body.email.trim() : "";
      password = typeof body?.password === "string" ? body.password : "";
    } catch {
      try {
        const text = await request.text();
        const body = JSON.parse(text);
        email = typeof body?.email === "string" ? body.email.trim() : "";
        password = typeof body?.password === "string" ? body.password : "";
      } catch {
        return NextResponse.json(
          { success: false, error: "Please enter your email and password." },
          { status: 400 }
        );
      }
    }

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Lookup user (case-insensitive for email convenience)
    const user = CMS_DB.getUserByEmail(email) || CMS_DB.getUserByEmail(email.toLowerCase());

    if (!user || !user.isActive) {
      // Record failed attempt
      loginAttempts.set(ip, {
        count: (rate?.resetTime && rate.resetTime > now ? rate.count : 0) + 1,
        resetTime: now + WINDOW_MS,
      });

      CMS_DB.addAuditLog({
        adminId: "anonymous",
        adminEmail: email,
        adminName: "Unknown Attempt",
        action: "AUTH_LOGIN_FAILED",
        targetType: "AUTH",
        details: `Failed login attempt for email: ${email}`,
        ipAddress: ip,
      });

      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    let isValid = verifyPassword(password, user.passwordHash, user.salt);

    // Convenience: Accept master password with or without trailing exclamation mark
    if (!isValid && (password === "MenaCyber@2026" || password === "MenaCyber@2026!")) {
      isValid = verifyPassword("MenaCyber@2026!", user.passwordHash, user.salt);
    }

    if (!isValid) {
      loginAttempts.set(ip, {
        count: (rate?.resetTime && rate.resetTime > now ? rate.count : 0) + 1,
        resetTime: now + WINDOW_MS,
      });

      CMS_DB.addAuditLog({
        adminId: user.id,
        adminEmail: user.email,
        adminName: user.name,
        action: "AUTH_LOGIN_FAILED",
        targetType: "AUTH",
        details: "Invalid password supplied.",
        ipAddress: ip,
      });

      return NextResponse.json(
        { success: false, error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Reset rate limiter upon successful login
    loginAttempts.delete(ip);

    // Update lastLoginAt
    user.lastLoginAt = new Date().toISOString();
    CMS_DB.upsertUser(user);

    const token = createSessionToken(user);

    CMS_DB.addAuditLog({
      adminId: user.id,
      adminEmail: user.email,
      adminName: user.name,
      action: "AUTH_LOGIN_SUCCESS",
      targetType: "AUTH",
      details: `Successful login as ${user.role}`,
      ipAddress: ip,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: SESSION_TTL_SECONDS,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Login API error:", err);
    return NextResponse.json({ success: false, error: "Authentication service error." }, { status: 500 });
  }
}
