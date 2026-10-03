"use server";

import { cookies } from "next/headers";

type ActionResult = { error?: string };

function getApiUrl(): string | null {
  const configured = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!configured) return null;
  const base = configured.replace(/\/+$/, "");
  return base.endsWith("/v1") ? base : `${base}/v1`;
}

function parseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const record = body as Record<string, unknown>;
  return typeof record.message === "string" ? record.message : fallback;
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return { error: "Not authenticated" };

  const apiUrl = getApiUrl();
  if (!apiUrl) return { error: "API not configured" };

  try {
    const response = await fetch(`${apiUrl}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
      cache: "no-store",
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      return { error: parseErrorMessage(body, "Failed to update password") };
    }

    // Changing a password revokes the backend refresh-token session.
    cookieStore.delete("token");
    cookieStore.delete("refresh_token");
    return {};
  } catch {
    return { error: "Could not reach the backend API" };
  }
}
