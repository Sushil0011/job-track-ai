import { Briefcase } from "lucide-react";
import Link from "next/link";
import GoogleButton from "@/components/auth/google-auth";
import CredentialsForm from "@/components/auth/form";
import { Suspense } from "react";
import GithubLogin from "@/components/auth/github-auth";

type LoginPageProps = {
  searchParams: Promise<{ reset?: string }>;
};

export default async function LoginPage() {
  return (
    <div className="w-full mx-auto max-w-md bg-white rounded-2xl shadow-premium border border-slate-200/60 p-8 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        <Link
          href="/"
          className="p-3 bg-indigo-50 hover:bg-indigo-100 transition-colors rounded-xl text-indigo-600 mb-6 group cursor-pointer"
        >
          <Briefcase className="w-8 h-8 group-hover:scale-105 transition-transform" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Sign in to your JobTrack AI workspace
        </p>
      </div>
      <Suspense>
        <div className="relative z-10">
          <CredentialsForm />
          <GoogleButton />
          <GithubLogin/>
        </div>
      </Suspense>
      <Link
        href="/signup"
        className="mx-auto block text-center text-xs text-indigo-700 mt-4 relative z-10 "
      >
        Don&apos;t have an account? Sign up here
      </Link>

      <p className="text-center text-xs text-slate-500 mt-2 relative z-10">
        By clicking continue, you agree to our{" "}
        <Link
          href="/terms"
          className="underline hover:text-slate-800 transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline hover:text-slate-800 transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
