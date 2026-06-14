"use client";

import { useState } from "react";
import { Loader2, Mail, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { UserData } from "@/utils/apis";
import { updateUserName } from "@/app/profile/actions";
import { userStore } from "@/store/userStore";

export default function ProfileForm({ user }: { user: UserData }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const setUser = userStore((state) => state.setUser);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    if (name.trim() === user.name) {
      setIsSavingProfile(false);
      setProfileSuccess("No changes to save.");
      return;
    }

    const result = await updateUserName(name);

    if (result.error) {
      setProfileError(result.error);
      setIsSavingProfile(false);
      return;
    }

    if (result.user) {
      setUser(result.user);
      setName(result.user.name);
    }

    setProfileSuccess("Profile updated successfully.");
    setIsSavingProfile(false);
    router.refresh();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Account information
        </h1>
        <p className="text-sm text-slate-500 mt-1.5 font-medium">
          Update your name and view your email address
        </p>
      </div>

      <form onSubmit={handleProfileSubmit} className="space-y-5 max-w-lg">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
          >
            <UserIcon className="w-3.5 h-3.5" />
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2.5 text-slate-800 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-shadow"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700"
          >
            <Mail className="w-3.5 h-3.5" />
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={user.email}
            readOnly
            className="w-full px-3 py-2.5 text-slate-500 bg-slate-50 border border-slate-200 rounded-lg text-sm cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 pt-0.5">
            Email cannot be changed here.
          </p>
        </div>

        <div className="pt-1 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSavingProfile}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
          >
            {isSavingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSavingProfile ? "Saving..." : "Save changes"}
          </button>
          {profileError && (
            <p className="text-sm text-red-600 font-medium">{profileError}</p>
          )}
          {profileSuccess && !profileError && (
            <p className="text-sm text-emerald-700 font-medium">
              {profileSuccess}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
