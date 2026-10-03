"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { userStore } from "@/store/userStore";

type AuthResult = {
  success: boolean;
  data?: { id: string; name: string; email: string };
  message?: string;
};

type Payload = { name?: string; email: string; password: string };

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
  const searchParams = useSearchParams();
  const passwordResetSuccess = searchParams.get("reset") === "success";
  const passwordUpdated = searchParams.get("password") === "updated";
  const authError = searchParams.get("error");
  const authErrorMessages: Record<string, string> = {
    access_denied: "GitHub sign-in was cancelled.",
    session_expired: "GitHub sign-in expired. Please try again.",
    csrf_detected: "Could not verify GitHub sign-in. Please try again.",
    server_error: "GitHub sign-in failed. Please try again.",
    github_exchange_failed: "Could not complete GitHub sign-in. Please try again.",
  };
  const authErrorMessage = authError ? authErrorMessages[authError] : undefined;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    const payload: Payload = { email: email.trim(), password };
    if (!login) payload.name = name.trim();

    try {
      const response = await fetch(`/api/auth/${login ? "login" : "signup"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as AuthResult | null;
      if (!response.ok || !result?.data) throw new Error(result?.message ?? "Unable to sign in");
      setUser(result.data);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {passwordResetSuccess && <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">Your password has been reset. Sign in with your new password.</div>}
      {passwordUpdated && <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">Your password has been updated. Sign in with your new password.</div>}
      {authErrorMessage && <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">{authErrorMessage}</div>}
      {error && <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {!login && <div className="space-y-1.5"><label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label><input onChange={(event) => setName(event.target.value)} value={name} id="name" type="text" name="name" required minLength={2} autoComplete="name" className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Your name" /></div>}
      <div className="space-y-1.5"><label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label><input onChange={(event) => setEmail(event.target.value)} value={email} id="email" name="email" type="email" autoComplete="email" required className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" /></div>
      <div className="space-y-1.5"><div className="flex items-center justify-between"><label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>{login && <Link href="/forgot-password" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</Link>}</div><input onChange={(event) => setPassword(event.target.value)} value={password} id="password" name="password" type="password" autoComplete={login ? "current-password" : "new-password"} required minLength={6} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 transition-shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="At least 6 characters" /></div>
      <button type="submit" disabled={isLoading} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:cursor-not-allowed disabled:opacity-70">
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {isLoading ? (login ? "Signing in…" : "Creating account…") : (login ? "Sign in" : "Create account")}
      </button>
    </form>
  );
}
