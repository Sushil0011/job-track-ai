"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { post } from "axify-js";
import { usePathname } from "next/navigation";
import cookie from "js-cookie";
import { userStore } from "@/store/userStore";

export default function CredentialsForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const path = usePathname();
  const login = path === "/login";
  const setUser = userStore((state) => state.setUser);

  type payload = {
    name?: string;
    email: string;
    password: string;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${login ? "login" : "signup"}`;
    const payload: payload = {
      email,
      password,
    };
    if (!login) payload.name = name;

    try {
      const response = await post(apiUrl, payload);
      setUser({
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      });
      cookie.set("token", response.data.token, {
        expires: 1 / 24,
        secure: true,
        sameSite: "strict",
      });

      cookie.set("refresh_token", response.data.refreshToken, {
        expires: 30,
        secure: true,
        sameSite: "strict",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
          {error}
        </div>
      )}
      {!login && (
        <div className={"space-y-1.5"}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Name
          </label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="name"
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow"
            placeholder="John Doe"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Email address
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-3 py-2 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <a
            href="#"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
          >
            Forgot password?
          </a>
        </div>
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
