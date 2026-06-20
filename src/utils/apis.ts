import { cookies } from "next/headers";
import { cacheLife, cacheTag } from "next/cache";
import { get } from "axify-js";

export type UserData = {
  id: string;
  name: string;
  email: string;
};

const USER_CACHE_SECONDS = 50 * 60;

export async function getUser(): Promise<UserData | null> {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  return getCachedUser(token);
}

async function getCachedUser(token: string): Promise<UserData | null> {
  "use cache";
  cacheLife({
    stale: USER_CACHE_SECONDS,
    revalidate: USER_CACHE_SECONDS,
    expire: USER_CACHE_SECONDS + 600,
  });
  cacheTag("user", token);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    const {data} = await get(`${apiUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data,'res')
    if (!data) return null;
    return data.user ?? null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}
