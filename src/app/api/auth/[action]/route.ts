import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

type RouteContext = { params: Promise<{ action: string }> };
type AuthEnvelope = {
  success?: boolean;
  statusCode?: number;
  data?: { id?: string; email?: string; name?: string; token?: string; refreshToken?: string };
  message?: string;
};

const getBackendBase = () => {
  const configured = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!configured) return null;
  const base = configured.replace(/\/+$/, "");
  return base.endsWith("/v1") ? base : `${base}/v1`;
};

export async function POST(request: NextRequest, context: RouteContext) {
  const { action } = await context.params;
  if (!["login", "signup", "google-login"].includes(action)) {
    return Response.json({ success: false, statusCode: 404, message: "Not found" }, { status: 404 });
  }

  const base = getBackendBase();
  if (!base) {
    return Response.json({ success: false, statusCode: 503, message: "Backend API is not configured" }, { status: 503 });
  }

  let payload: unknown;
  try { payload = await request.json(); }
  catch { return Response.json({ success: false, statusCode: 400, message: "Invalid JSON body" }, { status: 400 }); }

  try {
    const backendResponse = await fetch(`${base}/auth/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const result = (await backendResponse.json().catch(() => null)) as AuthEnvelope | null;
    if (!backendResponse.ok || !result?.data?.token || !result.data.refreshToken) {
      return Response.json(
        { success: false, statusCode: backendResponse.status, message: result?.message ?? "Sign in failed" },
        { status: backendResponse.status || 502 },
      );
    }

    const cookieStore = await cookies();
    const secure = process.env.NODE_ENV === "production";
    cookieStore.set("token", result.data.token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    cookieStore.set("refresh_token", result.data.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return Response.json({
      success: true,
      statusCode: backendResponse.status,
      data: {
        id: result.data.id,
        email: result.data.email,
        name: result.data.name,
      },
      message: result.message,
    }, { status: backendResponse.status, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Auth proxy request failed", error);
    return Response.json({ success: false, statusCode: 502, message: "Could not reach the backend API" }, { status: 502 });
  }
}
