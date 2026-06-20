"use server";

import { post } from "axify-js";
import { cookies } from "next/headers";

type ActionResult = { error?: string };

async function getAuthToken(): Promise<string | null> {
  return (await cookies()).get("token")?.value ?? null;
}

function getApiUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_URL ?? null;
}

function parseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const record = body as Record<string, unknown>;
  const message = record.message ?? record.error;
  return typeof message === "string" ? message : fallback;
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  const token = await getAuthToken();
  if (!token) {
    return { error: "Not authenticated" };
  }

  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return { error: "API not configured" };
  }

  try {
    const res = await post(
      `${apiUrl}/auth/change-password`,
      { oldPassword:currentPassword, newPassword },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!res) {
      const body = await res.json().catch(() => null);
      return { error: parseErrorMessage(body, "Failed to update password") };
    }
    return {};
  } catch {
    return { error: "Failed to update password" };
  }
}
