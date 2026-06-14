"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  KeyRound,
  Loader2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import cookie from "js-cookie";
import type { UserData } from "@/utils/apis";
import { logout } from "@/app/profile/actions";
import { userStore } from "@/store/userStore";
import { useState } from "react";

const navItems = [
  {
    href: "/profile",
    label: "Account information",
    icon: UserIcon,
    exact: true,
  },
  {
    href: "/profile/reset-password",
    label: "Reset password",
    icon: KeyRound,
    exact: false,
  },
];

export default function ProfileSidebar({ user }: { user: UserData }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const clearUser = userStore((state) => state.clearUser);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    cookie.remove("token");
    cookie.remove("refresh_token");
    clearUser();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside className="lg:sticky lg:top-[calc(72px+2.5rem)] lg:self-start space-y-4">
      <div className="bg-white rounded-2xl shadow-premium border border-slate-200/60 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-lg text-indigo-600 shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      <nav
        className="bg-white rounded-2xl shadow-premium border border-slate-200/60 p-2"
        aria-label="Profile navigation"
      >
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="bg-white rounded-2xl shadow-premium border border-slate-200/60 p-2 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Back to dashboard
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4 shrink-0" />
          )}
          {isLoggingOut ? "Signing out..." : "Log out"}
        </button>
      </div>
    </aside>
  );
}
