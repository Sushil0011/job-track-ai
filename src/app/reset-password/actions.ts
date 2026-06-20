"use server";

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

export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<ActionResult> {
  if (!token) {
    return { error: "Invalid or missing reset token" };
  }

  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return { error: "API not configured" };
  }

  try {
    const res = await fetch(`${apiUrl}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { error: parseErrorMessage(body, "Failed to reset password") };
    }

    return { success: true };
  } catch {
    return { error: "Failed to reset password" };
  }
}
