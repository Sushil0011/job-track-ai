import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

type RouteContext = { params: Promise<{ path: string[] }> };

type ApiEnvelope = {
  success?: boolean;
  statusCode?: number;
  data?: { token?: string };
};

const jsonError = (status: number, message: string) =>
  Response.json(
    { success: false, statusCode: status, message },
    { status, headers: { "Cache-Control": "no-store" } },
  );

const backendBaseUrl = () => {
  const configured = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!configured) return null;
  const base = configured.replace(/\/+$/, "");
  return base.endsWith("/v1") ? base : `${base}/v1`;
};

const forward = async (
  request: NextRequest,
  url: string,
  accessToken: string,
  body: Uint8Array | undefined,
) => {
  const headers = new Headers({
    Accept: "application/json",
    Authorization: `Bearer ${accessToken}`,
  });
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  return fetch(url, {
    method: request.method,
    headers,
    body: body as BodyInit | undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(60_000),
  });
};

async function handle(request: NextRequest, context: RouteContext) {
  const base = backendBaseUrl();
  if (!base) return jsonError(503, "Backend API is not configured");

  const { path } = await context.params;
  if (!path.length || path.some((segment) => segment === ".." || segment === ".")) {
    return jsonError(404, "Not found");
  }
  const allowedRoots = new Set([
    "jobs",
    "job",
    "notes",
    "reminders",
    "analytics",
    "ai",
    "auth",
    "user",
  ]);
  if (!allowedRoots.has(path[0] ?? "")) return jsonError(404, "Not found");

  const backendUrl = new URL(
    `${base}/${path.map((segment) => encodeURIComponent(segment)).join("/")}`,
  );
  backendUrl.search = request.nextUrl.search;

  const cookieStore = await cookies();
  let accessToken = cookieStore.get("token")?.value;
  if (!accessToken) return jsonError(401, "Please sign in to continue");
  const body = ["GET", "HEAD"].includes(request.method)
    ? undefined
    : new Uint8Array(await request.arrayBuffer());

  let backendResponse: Response;
  try {
    backendResponse = await forward(request, backendUrl.toString(), accessToken, body);

    // Refresh the short-lived API access token once, using the server-only cookie.
    if (backendResponse.status === 401) {
      const refreshToken = cookieStore.get("refresh_token")?.value;
      if (refreshToken) {
        const refreshResponse = await fetch(`${base}/auth/refresh-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ refreshToken }),
          cache: "no-store",
        });
        const refreshBody = (await refreshResponse.json().catch(() => null)) as ApiEnvelope | null;
        const refreshedToken = refreshBody?.data?.token;
        if (refreshResponse.ok && refreshedToken) {
          accessToken = refreshedToken;
          cookieStore.set("token", refreshedToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60,
          });
          backendResponse = await forward(request, backendUrl.toString(), accessToken, body);
        } else {
          cookieStore.delete("token");
          cookieStore.delete("refresh_token");
          return jsonError(401, "Your session expired. Please sign in again.");
        }
      }
    }

    const responseBody = await backendResponse.arrayBuffer();
    const headers = new Headers({ "Cache-Control": "no-store" });
    const responseContentType = backendResponse.headers.get("content-type");
    if (responseContentType) headers.set("Content-Type", responseContentType);
    return new Response(responseBody, {
      status: backendResponse.status,
      headers,
    });
  } catch (error) {
    console.error("Backend proxy request failed", error);
    return jsonError(502, "Could not reach the backend API");
  }
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const DELETE = handle;
