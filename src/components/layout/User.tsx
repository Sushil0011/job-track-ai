'use client';
import { userStore } from '@/store/userStore';
import Link from 'next/link';

const User = () => {
  const user = userStore((state) => state.user);
  console.log(user)
if (!user) return (
  <Link
    href="/login"
    className="text-sm font-medium text-white bg-[#5E43F3] hover:bg-[#5e43f3] px-5 py-2.5 rounded-lg transition-all duration-200 shadow-premium hover:shadow-premium-hover"
  >
    Sign In
  </Link>
);

  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-semibold text-xs text-slate-700">
        {user?.name.charAt(0)}
      </div>
    </div>
  );
}

export default User