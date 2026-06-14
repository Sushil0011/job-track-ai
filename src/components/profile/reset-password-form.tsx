"use client";

import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { updatePassword } from "@/app/profile/reset-password/actions";

export default function ResetPasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setIsSaving(true);

    const result = await updatePassword(currentPassword, newPassword);

    if (result.error) {
      setError(result.error);
      setIsSaving(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Password updated successfully.");
    setIsSaving(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          Enter your current password and choose a new one
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg">
            {success}
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="currentPassword"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
          >
            <Lock className="w-3.5 h-3.5" />
            Current password
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="newPassword"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
          >
            <Lock className="w-3.5 h-3.5" />
            New password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
          >
            <Lock className="w-3.5 h-3.5" />
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={8}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-1">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}
