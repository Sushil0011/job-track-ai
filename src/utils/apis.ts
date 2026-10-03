import { cache } from "react";
import { cookies } from "next/headers";
import { cacheLife, cacheTag } from "next/cache";

export type UserData = {
  id: string;
  name: string;
  email: string;
};

type UserEnvelope = {
  success?: boolean;
  data?: { user?: UserData };
};

const USER_CACHE_SECONDS = 50 * 60;

const getBackendBase = () => {
  const configured = process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!configured) return null;
  const base = configured.replace(/\/+$/, "");
  return base.endsWith("/v1") ? base : `${base}/v1`;
};

export const getUser = cache(async (): Promise<UserData | null> => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  return getCachedUser(token);
});

async function getCachedUser(token: string): Promise<UserData | null> {
  "use cache";
  cacheLife({ stale: USER_CACHE_SECONDS, revalidate: USER_CACHE_SECONDS, expire: USER_CACHE_SECONDS + 600 });
  cacheTag("user", token);

  const apiBase = getBackendBase();
  if (!apiBase) return null;
  try {
    const response = await fetch(`${apiBase}/user`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!response.ok) return null;
    const envelope = await response.json() as UserEnvelope;
    return envelope.data?.user ?? null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
