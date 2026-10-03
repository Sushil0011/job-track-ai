"use server";

type ActionResult = { error?: string; success?: boolean };

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

export async function resetPasswordWithToken(token: string, newPassword: string): Promise<ActionResult> {
  if (!token) return { error: "Invalid or missing reset token" };
  const apiUrl = getApiUrl();
  if (!apiUrl) return { error: "API not configured" };

  try {
    const response = await fetch(`${apiUrl}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
      cache: "no-store",
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) return { error: parseErrorMessage(body, "Failed to reset password") };
    return { success: true };
  } catch {
    return { error: "Could not reach the backend API" };
  }
}
