import { getUser } from "@/utils/apis";
import Link from "next/link";

const User = async () => {
  const user = await getUser();
console.log(user,'user')
  if (!user) {
    return (
      <Link
        href="/login"
        className="text-sm font-medium text-white bg-[#5E43F3] hover:bg-[#5e43f3] px-5 py-2 rounded-lg transition-all duration-200 shadow-premium hover:shadow-premium-hover"
      >
        Sign In
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      className="flex items-center gap-4 hover:opacity-80 transition-opacity"
    >
      <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-semibold text-xs text-slate-700">
        {user.name.charAt(0)}
      </div>
    </Link>
  );
};

export default User;
