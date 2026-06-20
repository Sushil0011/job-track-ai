import { Briefcase } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ResetPasswordContent from "@/components/auth/reset-password-content";

export default function ResetPasswordPage() {
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
          Reset your password
        </h1>
        <p className="text-sm text-slate-500 mt-2 font-medium">
          Choose a new password for your account
        </p>
      </div>

      <Suspense>
        <div className="relative z-10">
          <ResetPasswordContent />
        </div>
      </Suspense>
    </div>
  );
}
