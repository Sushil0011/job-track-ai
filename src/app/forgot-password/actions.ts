"use server";

import { post } from "axify-js";

type ActionResult = { error?: string; success?: boolean };

function getApiUrl(): string | null {
  return process.env.NEXT_PUBLIC_API_URL ?? null;
}

function parseErrorMessage(body: unknown, fallback: string): string {
  if (!body || typeof body !== "object") return fallback;
  const record = body as Record<string, unknown>;
  const message = record.message ?? record.error;
  return typeof message === "string" ? message : fallback;
}

export async function requestPasswordReset(
  email: string,
): Promise<ActionResult> {
  const trimmed = email.trim();
  if (!trimmed) {
    return { error: "Email is required" };
  }

  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return { error: "API not configured" };
  }

  try {
    const res = await post(`${apiUrl}/auth/forgot-password`, {
      email: trimmed,
    });

    if (!res) {
      const body = await res.json().catch(() => null);
      return { error: parseErrorMessage(body, "Failed to send reset email") };
    }

    return { success: true };
  } catch {
    return { error: "Failed to send reset email" };
  }
}
