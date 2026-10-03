import { NextRequest, NextResponse } from "next/server";

type AuthEnvelope = {
  success?: boolean;
  data?: {
    token: string;
    refreshToken: string;
  };
};

const backendBaseUrl = (
  process.env.BACKEND_API_URL ?? "http://localhost:4000/v1"
).replace(/\/+$/, "");

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=github_exchange_failed", request.url),
    );
  }

  try {
    const response = await fetch(`${backendBaseUrl}/auth/github/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });
    const payload = (await response.json().catch(() => null)) as AuthEnvelope | null;

    if (
      !response.ok ||
      !payload?.success ||
      !payload.data?.token ||
      !payload.data.refreshToken
    ) {
      return NextResponse.redirect(
        new URL("/login?error=github_exchange_failed", request.url),
      );
    }

    const secure =
      process.env.NODE_ENV === "production" || request.nextUrl.protocol === "https:";
    const destination = NextResponse.redirect(new URL("/dashboard", request.url));
    destination.cookies.set("token", payload.data.token, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60,
    });
    destination.cookies.set("refresh_token", payload.data.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return destination;
  } catch {
    return NextResponse.redirect(
      new URL("/login?error=github_exchange_failed", request.url),
    );
  }
}
