"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordContent() {
  const token = useSearchParams().get("token") ?? "";

  if (!token) {
    return (
      <div className="space-y-4">
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
          This reset link is invalid or has expired. Please request a new one.
        </div>
        <Link
          href="/forgot-password"
          className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return <ResetPasswordForm token={token} />;
}
