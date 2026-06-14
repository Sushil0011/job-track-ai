"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import type { UserData } from "@/utils/apis";

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

export async function updateUserName(
  name: string
): Promise<{ user?: UserData; error?: string }> {
  const trimmed = name.trim();
  if (!trimmed) {
    return { error: "Name is required" };
  }

  const token = await getAuthToken();
  if (!token) {
    return { error: "Not authenticated" };
  }

  const apiUrl = getApiUrl();
  if (!apiUrl) {
    return { error: "API not configured" };
  }

  try {
    const res = await fetch(`${apiUrl}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: trimmed }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      return { error: parseErrorMessage(body, "Failed to update profile") };
    }

    const data = await res.json();
    const user: UserData | undefined = data?.user ?? data?.data;

    updateTag(token);

    if (user) {
      return { user };
    }

    return {
      user: {
        id: data?.id ?? "",
        name: trimmed,
        email: data?.email ?? "",
      },
    };
  } catch {
    return { error: "Failed to update profile" };
  }
}

export async function logout(): Promise<ActionResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const apiUrl = getApiUrl();
  if (apiUrl && token) {
    try {
      await fetch(`${apiUrl}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Cookie cleanup still runs if the API logout call fails.
    }
  }

  if (token) {
    updateTag(token);
  }

  cookieStore.delete("token");
  cookieStore.delete("refresh_token");

  return {};
}
